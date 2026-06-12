"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_GROUPS } from "@/lib/categories";
import type { GroupKey } from "@/lib/types";
import { clean } from "./validate";

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
  return supabase;
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

function pageStatusValue(formData: FormData): "draft" | "published" | "archived" {
  const value = String(formData.get("status") ?? "");
  if (value === "published" || value === "archived") return value;
  return "draft";
}

function revalidateAdmin(locale: string | null) {
  revalidatePath(`/${locale || "tr"}/admin`);
  revalidatePath("/", "layout");
}

export async function saveBusiness(formData: FormData): Promise<void> {
  try {
    const supabase = await requireAdmin();
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
      image: clean(formData.get("image"), 260),
      attributes: listValue(formData, "attributes"),
      status: statusValue(formData),
      seo_title: clean(formData.get("seoTitle"), 90),
      seo_description: clean(formData.get("seoDescription"), 180),
      seo_keywords: listValue(formData, "seoKeywords"),
      canonical_path: clean(formData.get("canonicalPath"), 180),
      og_image: clean(formData.get("ogImage"), 260),
    };

    if (!payload.name || !payload.type || !payload.country || !payload.city || !payload.district) {
      throw new Error("Zorunlu alanlar eksik.");
    }

    const result = id
      ? await supabase.from("businesses").update(payload).eq("id", Number(id))
      : await supabase.from("businesses").insert(payload);

    if (result.error) throw new Error(result.error.message);
    revalidateAdmin(locale);
  } catch (error) {
    throw error;
  }
}

export async function updateApplicationStatus(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const id = Number(formData.get("id"));
  const locale = clean(formData.get("locale"), 8);
  const status = statusValue(formData);
  await supabase.from("applications").update({ status }).eq("id", id);
  revalidateAdmin(locale);
}

export async function updateQuoteStatus(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const id = Number(formData.get("id"));
  const locale = clean(formData.get("locale"), 8);
  await supabase
    .from("quotes")
    .update({
      status: clean(formData.get("status"), 40) ?? "new",
      internal_note: clean(formData.get("internalNote"), 1000),
    })
    .eq("id", id);
  revalidateAdmin(locale);
}

export async function saveContentPage(formData: FormData): Promise<void> {
  try {
    const supabase = await requireAdmin();
    const locale = clean(formData.get("locale"), 8) ?? "tr";
    const slug = clean(formData.get("slug"), 120);
    const payload = {
      slug,
      locale,
      title: clean(formData.get("title"), 180) ?? "",
      excerpt: clean(formData.get("excerpt"), 320),
      body: clean(formData.get("body"), 12000),
      seo_title: clean(formData.get("seoTitle"), 90),
      seo_description: clean(formData.get("seoDescription"), 180),
      seo_keywords: listValue(formData, "seoKeywords"),
      canonical_path: clean(formData.get("canonicalPath"), 180),
      og_image: clean(formData.get("ogImage"), 260),
      status: pageStatusValue(formData),
      updated_at: new Date().toISOString(),
    };

    if (!payload.slug || !payload.title) throw new Error("Slug ve başlık gerekli.");

    const { error } = await supabase.from("content_pages").upsert(payload, {
      onConflict: "slug",
    });

    if (error) throw new Error(error.message);
    revalidateAdmin(locale);
  } catch (error) {
    throw error;
  }
}
