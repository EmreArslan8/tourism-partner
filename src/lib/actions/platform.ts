"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_GROUPS } from "@/lib/categories";
import type { GroupKey } from "@/lib/types";
import { clean, cleanHttpUrl, cleanImageUrl } from "./validate";

/* Admin yetki kontrolü — admin'in KENDİ oturumuyla yazar; erişim DB'de RLS
   (admin manage … policy'leri) ile zorlanır. */
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Giriş gerekli.");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") throw new Error("Admin yetkisi gerekli.");
  return supabase;
}

const loc = (formData: FormData) => clean(formData.get("locale"), 8) ?? "tr";

/* ---------------- Banner oluştur (Reklam) ---------------- */
export async function createAdBanner(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const title = clean(formData.get("title"), 180);
  const target = cleanHttpUrl(formData.get("target_url"), 400);
  const image = cleanImageUrl(formData.get("image_url"), 400);
  if (!title || !target || !image) throw new Error("Başlık, görsel yolu ve yönlendirme URL zorunlu.");

  const { error } = await supabase.from("ad_banners").insert({
    title,
    target_url: target,
    image_url: image,
    placement: "home",
    status: "active",
    starts_at: clean(formData.get("starts_at"), 40) || null,
    ends_at: clean(formData.get("ends_at"), 40) || null,
  });
  if (error) throw new Error(error.message);

  revalidateTag("ad-banners", "max");
  revalidatePath(`/${loc(formData)}/admin/reklam`);
}

/* ---------------- Banner sil (Reklam) ---------------- */
export async function deleteAdBanner(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Geçersiz banner.");
  const { error } = await supabase.from("ad_banners").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag("ad-banners", "max");
  revalidatePath(`/${loc(formData)}/admin/reklam`);
}

/* ---------------- Kategori ekle (Kategoriler) ----------------
   categories tablosu self-referencing: parent_id null = grup kökü, dolu = alt kategori.
   Grup kökü yoksa otomatik oluşturup altına ekler. */
export async function createCategory(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const groupRaw = String(formData.get("group") ?? "");
  const group = CATEGORY_GROUPS.find((g) => g.key === groupRaw)?.key as GroupKey | undefined;
  const label = clean(formData.get("label"), 80);
  const slug = clean(formData.get("slug"), 80)?.toLowerCase().replace(/\s+/g, "-");
  if (!group || !label || !slug) throw new Error("Grup, ad ve slug zorunlu.");

  // Grup kökünü bul ya da oluştur.
  let { data: root } = await supabase
    .from("categories")
    .select("id")
    .eq("group_key", group)
    .is("parent_id", null)
    .maybeSingle();

  if (!root) {
    const rootLabel = CATEGORY_GROUPS.find((g) => g.key === group)?.label ?? group;
    const { data: created, error: rootErr } = await supabase
      .from("categories")
      .insert({ group_key: group, label: rootLabel, slug: `kok-${group}`, parent_id: null })
      .select("id")
      .single();
    if (rootErr) throw new Error(rootErr.message);
    root = created;
  }

  const { error } = await supabase
    .from("categories")
    .insert({ group_key: group, parent_id: root!.id, label, slug });
  if (error) throw new Error(error.message);

  revalidatePath(`/${loc(formData)}/admin/kategoriler`);
}

/* ---------------- Kategori sil ---------------- */
export async function deleteCategory(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Geçersiz kategori.");
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/${loc(formData)}/admin/kategoriler`);
}

/* ---------------- Kategori yeniden adlandır ---------------- */
export async function renameCategory(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const id = Number(formData.get("id"));
  const label = clean(formData.get("label"), 80);
  if (!Number.isInteger(id) || !label) throw new Error("Ad zorunlu.");
  const { error } = await supabase.from("categories").update({ label }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/${loc(formData)}/admin/kategoriler`);
}

/* ---------------- B2B Talep moderasyonu (İlan Denetimi) ---------------- */
export async function moderateB2bRequest(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const id = Number(formData.get("id"));
  const raw = String(formData.get("status") ?? "");
  const allowed = ["pending", "published", "archived", "rejected"] as const;
  const status = (allowed as readonly string[]).includes(raw) ? (raw as (typeof allowed)[number]) : "pending";
  const note = clean(formData.get("note"), 500);

  const { error } = await supabase
    .from("b2b_requests")
    .update({ status, ...(note ? { moderation_note: note } : {}), updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/${loc(formData)}/admin/talepler`);
}

/* ---------------- Destek talebi durum güncelle ---------------- */
export async function updateTicketStatus(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const id = Number(formData.get("id"));
  const raw = String(formData.get("status") ?? "");
  const allowed = ["new", "in_progress", "resolved", "archived"] as const;
  const status = (allowed as readonly string[]).includes(raw) ? (raw as (typeof allowed)[number]) : "new";

  const { error } = await supabase
    .from("support_tickets")
    .update({ status, ...(status === "resolved" ? { resolved_at: new Date().toISOString() } : {}) })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/${loc(formData)}/admin/destek`);
}
