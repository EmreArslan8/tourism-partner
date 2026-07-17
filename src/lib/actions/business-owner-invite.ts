"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "@/i18n/navigation";
import { requireAdminContext, writeAdminAudit } from "@/lib/admin-audit";
import {
  getPublicBusinessInvite,
  hashBusinessInviteToken,
  normalizeInviteEmail,
} from "@/lib/business-owner-invites";
import { businessOwnerInviteEmail } from "@/lib/email-templates/business-owner-invite";
import { sendEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { SITE_URL } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isEmail } from "./validate";

export type BusinessInviteActionState = {
  ok: boolean;
  error?: string;
  notice?: string;
};

function adminDb() {
  const client = createAdminClient();
  // Migration tablosu generated types yenilenene kadar güvenli sunucu sınırında tutulur.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return client ? (client as any) : null;
}

function adminServiceError(): BusinessInviteActionState {
  const supabaseUrlConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim());
  const serviceRoleConfigured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
  console.error("[business-owner-invite] sunucu yapılandırması eksik", {
    supabaseUrlConfigured,
    serviceRoleConfigured,
  });
  if (!supabaseUrlConfigured) return { ok: false, error: "supabase_url_missing" };
  if (!serviceRoleConfigured) return { ok: false, error: "service_role_missing" };
  return { ok: false, error: "service_unavailable" };
}

function localeValue(value: FormDataEntryValue | null) {
  const locale = String(value ?? "tr");
  return ["tr", "en", "ru", "ar"].includes(locale) ? locale : "tr";
}

function invitePath(locale: string, token: string) {
  const segment = locale === "tr" ? "isletme-daveti" : "business-invite";
  return `/${locale}/${segment}?token=${encodeURIComponent(token)}`;
}

function revalidateBusinessOwnership(locale: string, businessId: number) {
  const segment = locale === "tr" ? "tedarikciler" : "suppliers";
  revalidatePath(`/${locale}/admin/${segment}/${businessId}`);
}

export async function sendBusinessOwnerInvite(
  _previous: BusinessInviteActionState,
  formData: FormData,
): Promise<BusinessInviteActionState> {
  const context = await requireAdminContext();
  const admin = adminDb();
  if (!admin) return adminServiceError();

  const businessId = Number(formData.get("businessId"));
  const email = normalizeInviteEmail(String(formData.get("email") ?? ""));
  const locale = localeValue(formData.get("locale"));
  if (!Number.isInteger(businessId) || businessId <= 0) return { ok: false, error: "invalid_business" };
  if (!isEmail(email)) return { ok: false, error: "invalid_email" };

  const allowed = await checkRateLimit({
    scope: "admin-business-owner-invite",
    limit: 10,
    windowSeconds: 60 * 60,
    identity: [context.userId, String(businessId)],
  });
  if (!allowed) return { ok: false, error: "rate" };

  const { data: business } = await admin
    .from("businesses")
    .select("id,name,owner_id")
    .eq("id", businessId)
    .maybeSingle();
  if (!business) return { ok: false, error: "invalid_business" };
  if (business.owner_id) return { ok: false, error: "already_claimed" };

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString();
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashBusinessInviteToken(token);

  // Yeniden gönderimde eski bağlantı anında kullanılamaz olur.
  await admin
    .from("business_owner_invites")
    .update({ status: "revoked", revoked_at: now.toISOString(), updated_at: now.toISOString() })
    .eq("business_id", businessId)
    .eq("status", "pending");

  const { data: created, error: insertError } = await admin
    .from("business_owner_invites")
    .insert({
      business_id: businessId,
      email,
      token_hash: tokenHash,
      status: "pending",
      invited_by: context.userId,
      expires_at: expiresAt,
      last_sent_at: now.toISOString(),
      delivery_status: "pending",
    })
    .select("id")
    .single();
  if (insertError || !created) {
    console.error("[business-owner-invite] davet kaydı oluşturulamadı", insertError?.message);
    return { ok: false, error: "create_failed" };
  }

  const url = `${SITE_URL}${invitePath(locale, token)}`;
  const message = businessOwnerInviteEmail({
    businessName: String(business.name),
    inviteUrl: url,
    expiresAt,
    locale,
  });
  const delivery = await sendEmail({ to: email, ...message });
  await admin
    .from("business_owner_invites")
    .update({
      delivery_status: delivery.ok ? "sent" : "failed",
      delivery_error: delivery.ok ? null : String(delivery.error ?? "email_failed").slice(0, 1000),
      updated_at: new Date().toISOString(),
    })
    .eq("id", created.id);

  await writeAdminAudit(context, "business.owner_invite.send", "business", businessId, {
    inviteId: created.id,
    email,
    expiresAt,
    deliveryStatus: delivery.ok ? "sent" : "failed",
  });
  revalidateBusinessOwnership(locale, businessId);

  if (!delivery.ok) return { ok: false, error: "email_failed" };
  return { ok: true, notice: "invite_sent" };
}

export async function cancelBusinessOwnerInvite(
  _previous: BusinessInviteActionState,
  formData: FormData,
): Promise<BusinessInviteActionState> {
  const context = await requireAdminContext();
  const admin = adminDb();
  if (!admin) return adminServiceError();

  const businessId = Number(formData.get("businessId"));
  const inviteId = Number(formData.get("inviteId"));
  const locale = localeValue(formData.get("locale"));
  if (!Number.isInteger(businessId) || !Number.isInteger(inviteId)) return { ok: false, error: "invalid_invite" };

  const now = new Date().toISOString();
  const { data, error } = await admin
    .from("business_owner_invites")
    .update({ status: "revoked", revoked_at: now, updated_at: now })
    .eq("id", inviteId)
    .eq("business_id", businessId)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();
  if (error || !data) return { ok: false, error: "cancel_failed" };

  await writeAdminAudit(context, "business.owner_invite.cancel", "business", businessId, { inviteId });
  revalidateBusinessOwnership(locale, businessId);
  return { ok: true, notice: "invite_cancelled" };
}

async function acceptForSession(token: string): Promise<BusinessInviteActionState> {
  if (!token || token.length < 30 || token.length > 160) return { ok: false, error: "invalid" };
  const supabase = await createClient();
  // RPC migration ile geliyor; gen:types sonrasında cast kaldırılabilir.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc("accept_business_owner_invite", {
    p_token_hash: hashBusinessInviteToken(token),
  });
  if (error) {
    console.error("[business-owner-invite] kabul RPC hatası", error.message);
    return { ok: false, error: "accept_failed" };
  }
  const result = String(data ?? "accept_failed");
  if (result === "accepted" || result === "already_accepted") return { ok: true, notice: "accepted" };
  return { ok: false, error: result };
}

export async function acceptBusinessOwnerInvite(
  _previous: BusinessInviteActionState,
  formData: FormData,
): Promise<BusinessInviteActionState> {
  const token = String(formData.get("token") ?? "");
  const locale = localeValue(formData.get("locale"));
  const result = await acceptForSession(token);
  if (!result.ok) return result;
  redirect({ href: "/dashboard", locale });
  return result;
}

export async function signInAndAcceptBusinessInvite(
  _previous: BusinessInviteActionState,
  formData: FormData,
): Promise<BusinessInviteActionState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const locale = localeValue(formData.get("locale"));
  const invite = await getPublicBusinessInvite(token);
  if (!invite || invite.status !== "pending") return { ok: false, error: invite?.status ?? "invalid" };
  if (!password) return { ok: false, error: "password_required" };

  const allowed = await checkRateLimit({
    scope: "business-owner-invite-signin",
    limit: 8,
    windowSeconds: 10 * 60,
    identity: [invite.email],
  });
  if (!allowed) return { ok: false, error: "rate" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: invite.email, password });
  if (error) return { ok: false, error: "credentials" };

  const result = await acceptForSession(token);
  if (!result.ok) return result;
  redirect({ href: "/dashboard", locale });
  return result;
}

export async function signUpAndAcceptBusinessInvite(
  _previous: BusinessInviteActionState,
  formData: FormData,
): Promise<BusinessInviteActionState> {
  const token = String(formData.get("token") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim().slice(0, 120);
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const locale = localeValue(formData.get("locale"));
  const invite = await getPublicBusinessInvite(token);
  if (!invite || invite.status !== "pending") return { ok: false, error: invite?.status ?? "invalid" };
  if (fullName.length < 2) return { ok: false, error: "name_required" };
  if (password.length < 8) return { ok: false, error: "password_short" };
  if (password !== confirm) return { ok: false, error: "password_mismatch" };

  const allowed = await checkRateLimit({
    scope: "business-owner-invite-signup",
    limit: 5,
    windowSeconds: 60 * 60,
    identity: [invite.email],
  });
  if (!allowed) return { ok: false, error: "rate" };

  const supabase = await createClient();
  const callback = `${SITE_URL}/api/auth/callback?locale=${encodeURIComponent(locale)}&invite=${encodeURIComponent(token)}`;
  const { data, error } = await supabase.auth.signUp({
    email: invite.email,
    password,
    options: {
      emailRedirectTo: callback,
      data: {
        locale,
        full_name: fullName,
        firm_name: invite.businessName,
        account_type: "supplier",
        business_invite: true,
      },
    },
  });
  if (error) return { ok: false, error: error.message.toLowerCase().includes("already") ? "account_exists" : "signup_failed" };
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return { ok: false, error: "account_exists" };
  }

  if (!data.session) return { ok: true, notice: "verify_email" };

  const result = await acceptForSession(token);
  if (!result.ok) return result;
  redirect({ href: "/dashboard", locale });
  return result;
}

export async function switchBusinessInviteAccount(formData: FormData): Promise<void> {
  const token = String(formData.get("token") ?? "");
  const locale = localeValue(formData.get("locale"));
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect({ href: { pathname: "/business-invite", query: { token } }, locale });
}
