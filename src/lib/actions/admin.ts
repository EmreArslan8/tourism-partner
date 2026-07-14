"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_GROUPS, isServiceOfGroup, serviceLabel } from "@/lib/categories";
import { replaceBusinessServices } from "@/lib/business-services";
import { sanitizePublicHtml } from "@/lib/sanitize-public-html";
import type { BusinessLifecycleStatus, GroupKey } from "@/lib/types";
import { clean, cleanHttpUrl, cleanImageUrl } from "./validate";

const hasEnv = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/* Yalnızca giriş yapmış, profiles.role='admin' kullanıcı.
   Yazma işlemleri admin'in KENDİ oturumuyla yapılır; erişim DB'de RLS
   admin policy'leriyle (is_admin()) zorlanır — service_role kullanılmaz. */
async function requireAdmin() {
  if (!hasEnv()) throw new Error("Supabase bağlantısı yok.");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Giriş gerekli.");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || profile?.role !== "admin") throw new Error("Admin yetkisi gerekli.");
  return { supabase, userId: user.id };
}

type AdminContext = Awaited<ReturnType<typeof requireAdmin>>;

async function requestAuditMeta() {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for")?.split(",")[0]?.trim();
  return {
    ip_address: forwardedFor || headerList.get("x-real-ip"),
    user_agent: headerList.get("user-agent"),
  };
}

async function logAdminAction(
  context: AdminContext,
  action: string,
  entityType: string,
  entityId: string | number | null,
  newValue?: Record<string, unknown>,
  oldValue?: Record<string, unknown> | null,
) {
  const meta = await requestAuditMeta();
  const { error } = await context.supabase.from("audit_logs").insert({
    admin_id: context.userId,
    action,
    entity_type: entityType,
    entity_id: entityId === null ? null : String(entityId),
    old_value: oldValue ?? null,
    new_value: newValue ?? null,
    ...meta,
  });

  if (error) {
    console.error("Audit log yazılamadı:", error.message);
  }
}

function boolValue(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

function numberValue(formData: FormData, key: string, fallback: number): number {
  const raw = String(formData.get(key) ?? "").trim().replace(",", ".");
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function listValue(formData: FormData, key: string): string[] {
  return String(formData.get(key) ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 40);
}

function isRecord(value: unknown): value is Record<string, string> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function groupValue(formData: FormData): GroupKey {
  const value = String(formData.get("group") ?? "");
  if (CATEGORY_GROUPS.some((group) => group.key === value)) return value as GroupKey;
  return "konaklama";
}

function statusValue(formData: FormData): "pending" | "approved" | "rejected" {
  const value = String(formData.get("status") ?? "");
  if (value === "approved" || value === "rejected") return value;
  return "pending";
}

function lifecycleStatusValue(formData: FormData): BusinessLifecycleStatus {
  const value = String(formData.get("status") ?? "");
  if (
    value === "pending" ||
    value === "approved" ||
    value === "rejected" ||
    value === "active" ||
    value === "expired" ||
    value === "blacklisted" ||
    value === "suspended"
  ) {
    return value;
  }
  return "pending";
}

function pageStatusValue(formData: FormData): "draft" | "published" | "archived" {
  const value = String(formData.get("status") ?? "");
  if (value === "published" || value === "archived") return value;
  return "draft";
}

function revalidateAdmin(locale: string | null) {
  revalidatePath(`/${locale || "tr"}/admin`);
  revalidatePath("/", "layout");
  revalidateTag("businesses", "max");
}

export async function saveBusiness(formData: FormData): Promise<void> {
  try {
    const context = await requireAdmin();
    const { supabase } = context;
    const id = String(formData.get("id") ?? "").trim();
    const locale = clean(formData.get("locale"), 8);
    const group = groupValue(formData);
    // Çoklu hizmet seçimi (business_services). İlk seçilen birincil → type.
    const serviceSlugs = formData
      .getAll("services")
      .map((value) => String(value))
      .filter((slug) => isServiceOfGroup(slug, group));
    const primaryType = serviceSlugs.length > 0 ? serviceLabel(serviceSlugs[0]) : clean(formData.get("type"), 120) ?? "";
    const address = clean(formData.get("address"), 260);
    let details: Record<string, string> = {};
    if (id) {
      const { data } = await supabase.from("businesses").select("details").eq("id", Number(id)).maybeSingle();
      details = isRecord(data?.details) ? data.details : {};
    }
    if (address) details.address = address;
    else delete details.address;
    const payload = {
      group,
      type: primaryType,
      name: clean(formData.get("name"), 160) ?? "",
      country: clean(formData.get("country"), 80) ?? "",
      city: clean(formData.get("city"), 80) ?? "",
      district: clean(formData.get("district"), 80) ?? "",
      lat: numberValue(formData, "lat", 0),
      lng: numberValue(formData, "lng", 0),
      description: clean(formData.get("description"), 1400),
      rating: Math.max(0, Math.min(5, numberValue(formData, "rating", 0))),
      reviews: Math.max(0, Math.round(numberValue(formData, "reviews", 0))),
      tag: clean(formData.get("tag"), 80),
      verified: boolValue(formData, "verified"),
      sponsored: boolValue(formData, "sponsored"),
      founder_partner: boolValue(formData, "founderPartner"),
      attributes: listValue(formData, "attributes"),
      details,
      status: lifecycleStatusValue(formData),
      seo_title: clean(formData.get("seoTitle"), 90),
      seo_description: clean(formData.get("seoDescription"), 180),
      seo_keywords: listValue(formData, "seoKeywords"),
      canonical_path: cleanHttpUrl(formData.get("canonicalPath"), 180),
      og_image: cleanImageUrl(formData.get("ogImage"), 260),
    };

    if (!payload.name || !payload.type || !payload.country || !payload.city || !payload.district) {
      throw new Error("Zorunlu alanlar eksik.");
    }

    let businessId = id ? Number(id) : null;
    if (id) {
      const { error } = await supabase.from("businesses").update(payload).eq("id", Number(id));
      if (error) throw new Error(error.message);
    } else {
      const { data, error } = await supabase.from("businesses").insert(payload).select("id").single();
      if (error) throw new Error(error.message);
      businessId = data?.id ?? null;
    }

    // Çoklu hizmetleri senkronize et (yalnızca form açıkça hizmet gönderdiyse).
    if (businessId != null && serviceSlugs.length > 0) {
      await replaceBusinessServices(supabase, businessId, group, serviceSlugs);
    }

    await logAdminAction(context, id ? "business.update" : "business.create", "business", id || null, { ...payload, services: serviceSlugs });
    revalidateAdmin(locale);
  } catch (error) {
    throw error;
  }
}

export async function updateApplicationStatus(formData: FormData): Promise<void> {
  const context = await requireAdmin();
  const { supabase } = context;
  const id = Number(formData.get("id"));
  const locale = clean(formData.get("locale"), 8);
  const status = statusValue(formData);
  // Reddetme gerekçesi (opsiyonel) — yalnızca reddedildiğinde kaydedilir.
  const reason = clean(formData.get("reason"), 500);
  const payload: { status: typeof status; reject_reason?: string | null } = { status };
  if (status === "rejected") payload.reject_reason = reason ?? null;

  const { error } = await supabase.from("applications").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
  await logAdminAction(context, "application.status.update", "application", id, payload);
  revalidateAdmin(locale);
}

export async function updateQuoteStatus(formData: FormData): Promise<void> {
  const context = await requireAdmin();
  const { supabase } = context;
  const id = Number(formData.get("id"));
  const locale = clean(formData.get("locale"), 8);
  const payload = {
    status: clean(formData.get("status"), 40) ?? "new",
    internal_note: clean(formData.get("internalNote"), 1000),
  };
  const { error } = await supabase
    .from("quotes")
    .update(payload)
    .eq("id", id);
  if (error) throw new Error(error.message);
  await logAdminAction(context, "quote.status.update", "quote", id, payload);
  revalidateAdmin(locale);
}

export async function moderatePartnerRequest(formData: FormData): Promise<void> {
  const context = await requireAdmin();
  const { supabase } = context;
  const id = Number(formData.get("id"));
  const operation = String(formData.get("operation") ?? "");

  if (!Number.isInteger(id) || id <= 0) throw new Error("Geçersiz partnerlik isteği.");
  if (!["approve", "reject", "cancel", "remove", "reset"].includes(operation)) {
    throw new Error("Geçersiz moderasyon işlemi.");
  }

  const { data: current, error: readError } = await supabase
    .from("business_partner_requests")
    .select("id,requester_business_id,receiver_business_id,status,created_at,responded_at")
    .eq("id", id)
    .maybeSingle();
  if (readError) throw new Error(readError.message);
  if (!current) throw new Error("Partnerlik isteği bulunamadı.");

  if (operation === "approve" || operation === "reject") {
    if (current.status !== "pending") throw new Error("Yalnızca bekleyen istekler yanıtlanabilir.");
    const status = operation === "approve" ? "accepted" : "rejected";
    const payload = { status, responded_at: new Date().toISOString() } as const;
    const { error } = await supabase
      .from("business_partner_requests")
      .update(payload)
      .eq("id", id)
      .eq("status", "pending");
    if (error) throw new Error(error.message);
    await logAdminAction(context, `partner_request.${operation}`, "business_partner_request", id, payload, current);
  } else if (operation === "reset") {
    if (current.status !== "rejected") throw new Error("Yalnızca reddedilmiş istek yeniden beklemeye alınabilir.");
    const payload = { status: "pending" as const, responded_at: null };
    const { error } = await supabase.from("business_partner_requests").update(payload).eq("id", id).eq("status", "rejected");
    if (error) throw new Error(error.message);
    await logAdminAction(context, "partner_request.reset", "business_partner_request", id, payload, current);
  } else {
    if (operation === "cancel" && current.status !== "pending") throw new Error("Yalnızca bekleyen istek iptal edilebilir.");
    if (operation === "remove" && current.status !== "accepted") throw new Error("Yalnızca kabul edilmiş bağlantı kaldırılabilir.");
    const { error } = await supabase.from("business_partner_requests").delete().eq("id", id);
    if (error) throw new Error(error.message);
    await logAdminAction(context, `partner_request.${operation}`, "business_partner_request", id, { deleted: true }, current);
  }

  revalidatePath("/[locale]/admin/partnerlik", "page");
  revalidatePath("/[locale]/dashboard", "page");
  revalidateTag("business-partners", "max");
}

export async function updateBusinessStatus(formData: FormData): Promise<void> {
  const context = await requireAdmin();
  const { supabase } = context;
  const id = Number(formData.get("id"));
  const locale = clean(formData.get("locale"), 8);
  const status = lifecycleStatusValue(formData);
  // Reddetme gerekçesi (opsiyonel) — yalnızca reddedildiğinde kaydedilir.
  const reason = clean(formData.get("reason"), 500);
  const payload: { status: typeof status; reject_reason?: string | null } = { status };
  if (status === "rejected") payload.reject_reason = reason ?? null;

  const { error } = await supabase.from("businesses").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
  await logAdminAction(context, "business.status.update", "business", id, payload);
  // Onay/red public liste cache'ini de etkiler.
  revalidateTag("businesses", "max");
  revalidateAdmin(locale);
}

export async function saveContentPage(formData: FormData): Promise<void> {
  try {
    const context = await requireAdmin();
    const { supabase } = context;
    const locale = clean(formData.get("locale"), 8) ?? "tr";
    const slug = clean(formData.get("slug"), 120);
    const title = clean(formData.get("title"), 180);

    if (!slug || !title) throw new Error("Slug ve başlık gerekli.");

    const payload = {
      slug,
      locale,
      title,
      excerpt: clean(formData.get("excerpt"), 320),
      body: sanitizePublicHtml(clean(formData.get("body"), 12000)),
      seo_title: clean(formData.get("seoTitle"), 90),
      seo_description: clean(formData.get("seoDescription"), 180),
      seo_keywords: listValue(formData, "seoKeywords"),
      canonical_path: cleanHttpUrl(formData.get("canonicalPath"), 180),
      og_image: cleanImageUrl(formData.get("ogImage"), 260),
      status: pageStatusValue(formData),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("content_pages").upsert(payload, {
      onConflict: "locale,slug",
    });

    if (error) throw new Error(error.message);
    await logAdminAction(context, "content_page.upsert", "content_page", slug, payload);
    revalidateTag("content_pages", "max");
    revalidateAdmin(locale);
  } catch (error) {
    throw error;
  }
}
