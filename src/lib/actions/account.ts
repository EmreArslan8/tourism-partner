"use server";

import { requireAdminContext, writeAdminAudit } from "@/lib/admin-audit";
import { revalidatePath } from "next/cache";

/* Admin hesap güvenliği: TOTP tabanlı iki faktörlü doğrulama (Supabase MFA) ve
   şifre değiştirme. Tüm işlemler admin'in KENDİ oturumuyla yapılır; kritik
   aksiyonlar audit_logs'a yazılır. */

export type EnrollResult =
  | { ok: true; factorId: string; qrCode: string; secret: string }
  | { ok: false; error: string };

export type ActionResult = { ok: true } | { ok: false; error: string };

/* Yeni bir TOTP faktörü kaydeder (henüz doğrulanmamış). QR kodu ve secret
   client'a döner; kullanıcı authenticator uygulamasına ekleyip kodu girer. */
export async function enrollTotp(): Promise<EnrollResult> {
  const { supabase } = await requireAdminContext();

  // Önce yarım kalmış (doğrulanmamış) faktörleri temizle ki birikme olmasın.
  const { data: factors } = await supabase.auth.mfa.listFactors();
  for (const factor of factors?.all ?? []) {
    if (factor.factor_type === "totp" && factor.status === "unverified") {
      await supabase.auth.mfa.unenroll({ factorId: factor.id });
    }
  }

  const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
  if (error || !data) return { ok: false, error: error?.message ?? "enroll_failed" };

  return {
    ok: true,
    factorId: data.id,
    qrCode: data.totp.qr_code,
    secret: data.totp.secret,
  };
}

/* Kayıtlı faktörü, kullanıcının girdiği 6 haneli kodla doğrular ve aktifleştirir. */
export async function verifyTotp(formData: FormData): Promise<ActionResult> {
  const context = await requireAdminContext();
  const { supabase } = context;
  const factorId = String(formData.get("factorId") ?? "").trim();
  const code = String(formData.get("code") ?? "").replace(/\s/g, "");
  if (!factorId || !/^\d{6}$/.test(code)) return { ok: false, error: "invalid_code" };

  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
  if (error) return { ok: false, error: error.message };

  await writeAdminAudit(context, "account.mfa.enable", "account", context.userId, { factorId });
  revalidatePath("/[locale]/admin/guvenlik", "page");
  return { ok: true };
}

/* Aktif TOTP faktörünü kaldırır (2FA'yı kapatır). */
export async function disableTotp(formData: FormData): Promise<ActionResult> {
  const context = await requireAdminContext();
  const { supabase } = context;
  const factorId = String(formData.get("factorId") ?? "").trim();
  if (!factorId) return { ok: false, error: "missing_factor" };

  const { error } = await supabase.auth.mfa.unenroll({ factorId });
  if (error) return { ok: false, error: error.message };

  await writeAdminAudit(context, "account.mfa.disable", "account", context.userId, { factorId });
  revalidatePath("/[locale]/admin/guvenlik", "page");
  return { ok: true };
}

/* Admin kendi şifresini günceller. */
export async function changePassword(formData: FormData): Promise<ActionResult> {
  const context = await requireAdminContext();
  const { supabase } = context;
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 8) return { ok: false, error: "too_short" };
  if (password !== confirm) return { ok: false, error: "mismatch" };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, error: error.message };

  await writeAdminAudit(context, "account.password.change", "account", context.userId, {});
  return { ok: true };
}
