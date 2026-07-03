"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_GROUPS } from "@/lib/categories";
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
    const payload = {
      group: groupValue(formData),
      type: clean(formData.get("type"), 120) ?? "",
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
      attributes: listValue(formData, "attributes"),
      status: statusValue(formData),
      seo_title: clean(formData.get("seoTitle"), 90),
      seo_description: clean(formData.get("seoDescription"), 180),
      seo_keywords: listValue(formData, "seoKeywords"),
      canonical_path: cleanHttpUrl(formData.get("canonicalPath"), 180),
      og_image: cleanImageUrl(formData.get("ogImage"), 260),
    };

    if (!payload.name || !payload.type || !payload.country || !payload.city || !payload.district) {
      throw new Error("Zorunlu alanlar eksik.");
    }

    const result = id
      ? await supabase.from("businesses").update(payload).eq("id", Number(id))
      : await supabase.from("businesses").insert(payload);

    if (result.error) throw new Error(result.error.message);
    await logAdminAction(context, id ? "business.update" : "business.create", "business", id || null, payload);
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

export async function renewBusinessMembership(formData: FormData): Promise<void> {
  const context = await requireAdmin();
  const { supabase } = context;
  const businessId = Number(formData.get("businessId"));
  const locale = clean(formData.get("locale"), 8);
  const days = Math.max(1, Math.min(730, numberValue(formData, "days", 365)));
  const startsAt = new Date();
  const endsAt = new Date(startsAt.getTime() + days * 86_400_000);

  const payload = {
    business_id: businessId,
    plan: clean(formData.get("plan"), 40) ?? "standard",
    status: "active",
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString(),
    renewed_by_admin_id: context.userId,
  } as const;

  const { error } = await supabase.from("business_memberships").insert(payload);

  if (error) throw new Error(error.message);
  await logAdminAction(context, "membership.renew", "business", businessId, {
    plan: payload.plan,
    starts_at: payload.starts_at,
    ends_at: payload.ends_at,
  });
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
      body: clean(formData.get("body"), 12000),
      seo_title: clean(formData.get("seoTitle"), 90),
      seo_description: clean(formData.get("seoDescription"), 180),
      seo_keywords: listValue(formData, "seoKeywords"),
      canonical_path: cleanHttpUrl(formData.get("canonicalPath"), 180),
      og_image: cleanImageUrl(formData.get("ogImage"), 260),
      status: pageStatusValue(formData),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("content_pages").upsert(payload, {
      onConflict: "slug",
    });

    if (error) throw new Error(error.message);
    await logAdminAction(context, "content_page.upsert", "content_page", slug, payload);
    revalidateAdmin(locale);
  } catch (error) {
    throw error;
  }
}
