"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { requireAdminContext, writeAdminAudit } from "@/lib/admin-audit";
import { sanitizePublicHtml } from "@/lib/sanitize-public-html";
import type { GroupKey } from "@/lib/types";
import type { AdBannerStatus, ContentPageStatus, PopupFrequency } from "@/lib/supabase/database.types";
import { clean, cleanHttpUrl, cleanImageUrl } from "./validate";

/* Admin yetki kontrolü — admin'in KENDİ oturumuyla yazar; erişim DB'de RLS
   (admin manage … policy'leri) ile zorlanır. */
async function requireAdmin() {
  return requireAdminContext();
}

const loc = (formData: FormData) => clean(formData.get("locale"), 8) ?? "tr";

/* ---------------- Banner oluştur (Reklam) ---------------- */
export async function createAdBanner(formData: FormData): Promise<void> {
  const context = await requireAdmin();
  const { supabase } = context;
  const title = clean(formData.get("title"), 180);
  const target = cleanHttpUrl(formData.get("target_url"), 400);
  const image = cleanImageUrl(formData.get("image_url"), 400);
  if (!title || !target || !image) throw new Error("Başlık, görsel yolu ve yönlendirme URL zorunlu.");

  const payload = {
    title,
    target_url: target,
    image_url: image,
    placement: "home" as const,
    status: "active" as const,
    starts_at: clean(formData.get("starts_at"), 40) || null,
    ends_at: clean(formData.get("ends_at"), 40) || null,
  };
  const { error, data } = await supabase.from("ad_banners").insert(payload).select("id").single();
  if (error) throw new Error(error.message);
  await writeAdminAudit(context, "ad_banner.create", "ad_banner", data?.id ?? null, payload);

  revalidateTag("ad-banners", "max");
  revalidatePath(`/${loc(formData)}/admin/reklam`);
}

/* ---------------- Banner sil (Reklam) ---------------- */
export async function deleteAdBanner(formData: FormData): Promise<void> {
  const context = await requireAdmin();
  const { supabase } = context;
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Geçersiz banner.");
  const { data: oldValue } = await supabase
    .from("ad_banners")
    .select("id,title,placement,status,starts_at,ends_at")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase.from("ad_banners").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await writeAdminAudit(context, "ad_banner.delete", "ad_banner", id, undefined, oldValue ?? null);
  revalidateTag("ad-banners", "max");
  revalidatePath(`/${loc(formData)}/admin/reklam`);
}

/* ---------------- Kategori ekle (Kategoriler) ----------------
   categories tablosu self-referencing: parent_id null = grup kökü, dolu = alt kategori.
   Grup kökü yoksa otomatik oluşturup altına ekler. */
export async function createCategory(formData: FormData): Promise<void> {
  const context = await requireAdmin();
  const { supabase } = context;
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

  const payload = { group_key: group, parent_id: root!.id, label, slug };
  const { error, data } = await supabase
    .from("categories")
    .insert(payload)
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  await writeAdminAudit(context, "category.create", "category", data?.id ?? null, payload);

  revalidateTag("categories", "max");
  revalidatePath(`/${loc(formData)}/admin/kategoriler`);
}

/* ---------------- Kategori sil ---------------- */
export async function deleteCategory(formData: FormData): Promise<void> {
  const context = await requireAdmin();
  const { supabase } = context;
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Geçersiz kategori.");
  const { data: oldValue } = await supabase
    .from("categories")
    .select("id,group_key,parent_id,label,slug")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await writeAdminAudit(context, "category.delete", "category", id, undefined, oldValue ?? null);
  revalidateTag("categories", "max");
  revalidatePath(`/${loc(formData)}/admin/kategoriler`);
}

/* ---------------- Kategori yeniden adlandır ---------------- */
export async function renameCategory(formData: FormData): Promise<void> {
  const context = await requireAdmin();
  const { supabase } = context;
  const id = Number(formData.get("id"));
  const label = clean(formData.get("label"), 80);
  if (!Number.isInteger(id) || !label) throw new Error("Ad zorunlu.");
  const { data: oldValue } = await supabase
    .from("categories")
    .select("id,label")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase.from("categories").update({ label }).eq("id", id);
  if (error) throw new Error(error.message);
  await writeAdminAudit(context, "category.rename", "category", id, { label }, oldValue ?? null);
  revalidateTag("categories", "max");
  revalidatePath(`/${loc(formData)}/admin/kategoriler`);
}

/* ---------------- Pop-up kaydet (İçerik → Pop-up Yönetimi) ----------------
   id boşsa yeni kayıt açar, doluysa günceller. body zengin metin — sanitize edilir,
   cta_url public tarafta href'e basıldığı için http(s) şemasına zorlanır. */
const POPUP_FREQUENCIES: PopupFrequency[] = ["always", "daily", "session"];
const POPUP_STATUSES: AdBannerStatus[] = ["draft", "active", "paused", "archived"];
const POPUP_ROLES = ["all", "supplier", "buyer"] as const;

export async function savePopup(formData: FormData): Promise<void> {
  const context = await requireAdmin();
  const { supabase } = context;
  const id = String(formData.get("id") ?? "").trim();
  const title = clean(formData.get("title"), 180);
  if (!title) throw new Error("Pop-up başlığı zorunlu.");

  const roleRaw = String(formData.get("target_role") ?? "all");
  const freqRaw = String(formData.get("frequency") ?? "daily");
  const statusRaw = String(formData.get("status") ?? "draft");

  const payload = {
    title,
    body: sanitizePublicHtml(clean(formData.get("body"), 4000)),
    image_url: cleanImageUrl(formData.get("image_url"), 400),
    cta_label: clean(formData.get("cta_label"), 80),
    cta_url: cleanHttpUrl(formData.get("cta_url"), 400),
    target_role: (POPUP_ROLES as readonly string[]).includes(roleRaw) ? roleRaw : "all",
    frequency: POPUP_FREQUENCIES.includes(freqRaw as PopupFrequency) ? (freqRaw as PopupFrequency) : "daily",
    status: POPUP_STATUSES.includes(statusRaw as AdBannerStatus) ? (statusRaw as AdBannerStatus) : "draft",
    starts_at: clean(formData.get("starts_at"), 40) || null,
    ends_at: clean(formData.get("ends_at"), 40) || null,
    updated_at: new Date().toISOString(),
  };

  const result = id
    ? await supabase.from("admin_popups").update(payload).eq("id", Number(id)).select("id").single()
    : await supabase.from("admin_popups").insert(payload).select("id").single();
  if (result.error) throw new Error(result.error.message);
  await writeAdminAudit(context, id ? "popup.update" : "popup.create", "admin_popup", result.data?.id ?? null, payload);

  revalidateTag("popups", "max");
  revalidatePath(`/${loc(formData)}/admin/icerik`);
}

/* ---------------- Pop-up sil ---------------- */
export async function deletePopup(formData: FormData): Promise<void> {
  const context = await requireAdmin();
  const { supabase } = context;
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Geçersiz pop-up.");
  const { data: oldValue } = await supabase
    .from("admin_popups")
    .select("id,title,target_role,status")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase.from("admin_popups").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await writeAdminAudit(context, "popup.delete", "admin_popup", id, undefined, oldValue ?? null);

  revalidateTag("popups", "max");
  revalidatePath(`/${loc(formData)}/admin/icerik`);
}

/* ---------------- Blog yazısı kaydet (İçerik → Blog) ----------------
   id boşsa yeni kayıt açar, doluysa günceller. body zengin metin — sanitize edilir.
   Yayına alınırken published_at boşsa şimdiki zaman yazılır. */
const BLOG_STATUSES: ContentPageStatus[] = ["draft", "published", "archived"];

export async function saveBlogPost(formData: FormData): Promise<void> {
  const context = await requireAdmin();
  const { supabase } = context;
  const id = String(formData.get("id") ?? "").trim();
  const title = clean(formData.get("title"), 180);
  const slug = clean(formData.get("slug"), 160);
  if (!title || !slug) throw new Error("Başlık ve slug zorunlu.");

  const statusRaw = String(formData.get("status") ?? "draft");
  const status = BLOG_STATUSES.includes(statusRaw as ContentPageStatus)
    ? (statusRaw as ContentPageStatus)
    : "draft";
  const existingPublishedAt = clean(formData.get("published_at"), 40);

  const payload = {
    slug,
    title,
    locale: loc(formData),
    excerpt: clean(formData.get("excerpt"), 320),
    body: sanitizePublicHtml(clean(formData.get("body"), 20000)),
    category: clean(formData.get("category"), 80),
    cover_image: cleanImageUrl(formData.get("cover_image"), 400),
    seo_title: clean(formData.get("seo_title"), 90),
    seo_description: clean(formData.get("seo_description"), 180),
    status,
    published_at:
      status === "published" ? (existingPublishedAt ?? new Date().toISOString()) : existingPublishedAt,
    updated_at: new Date().toISOString(),
  };

  const result = id
    ? await supabase.from("blog_posts").update(payload).eq("id", Number(id)).select("id").single()
    : await supabase.from("blog_posts").insert(payload).select("id").single();
  if (result.error) throw new Error(result.error.message);
  await writeAdminAudit(context, id ? "blog_post.update" : "blog_post.create", "blog_post", result.data?.id ?? null, payload);

  revalidateTag("blog", "max");
  revalidatePath(`/${loc(formData)}/admin/icerik`);
}

/* ---------------- Blog yazısı sil ---------------- */
export async function deleteBlogPost(formData: FormData): Promise<void> {
  const context = await requireAdmin();
  const { supabase } = context;
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Geçersiz blog yazısı.");
  const { data: oldValue } = await supabase
    .from("blog_posts")
    .select("id,title,slug,status")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await writeAdminAudit(context, "blog_post.delete", "blog_post", id, undefined, oldValue ?? null);

  revalidateTag("blog", "max");
  revalidatePath(`/${loc(formData)}/admin/icerik`);
}

/* ---------------- B2B Talep moderasyonu (İlan Denetimi) ---------------- */
export async function moderateB2bRequest(formData: FormData): Promise<void> {
  const context = await requireAdmin();
  const { supabase } = context;
  const id = Number(formData.get("id"));
  const raw = String(formData.get("status") ?? "");
  const allowed = ["pending", "published", "archived", "rejected"] as const;
  const status = (allowed as readonly string[]).includes(raw) ? (raw as (typeof allowed)[number]) : "pending";
  const note = clean(formData.get("note"), 500);

  const payload = { status, ...(note ? { moderation_note: note } : {}), updated_at: new Date().toISOString() };
  const { data: oldValue } = await supabase
    .from("b2b_requests")
    .select("id,status,moderation_note")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase
    .from("b2b_requests")
    .update(payload)
    .eq("id", id);
  if (error) throw new Error(error.message);
  await writeAdminAudit(context, "b2b_request.moderate", "b2b_request", id, payload, oldValue ?? null);

  revalidatePath(`/${loc(formData)}/admin/talepler`);
}

/* ---------------- Destek talebi durum güncelle ---------------- */
export async function updateTicketStatus(formData: FormData): Promise<void> {
  const context = await requireAdmin();
  const { supabase } = context;
  const id = Number(formData.get("id"));
  const raw = String(formData.get("status") ?? "");
  const allowed = ["new", "in_progress", "resolved", "archived"] as const;
  const status = (allowed as readonly string[]).includes(raw) ? (raw as (typeof allowed)[number]) : "new";

  const payload = { status, ...(status === "resolved" ? { resolved_at: new Date().toISOString() } : {}) };
  const { data: oldValue } = await supabase
    .from("support_tickets")
    .select("id,status,resolved_at")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase
    .from("support_tickets")
    .update(payload)
    .eq("id", id);
  if (error) throw new Error(error.message);
  await writeAdminAudit(context, "support_ticket.status.update", "support_ticket", id, payload, oldValue ?? null);

  revalidatePath(`/${loc(formData)}/admin/destek`);
}
