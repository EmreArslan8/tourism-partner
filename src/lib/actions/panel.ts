"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { ALL_FACET_SLUGS } from "@/lib/facets";
import { ALL_DETAIL_KEYS } from "@/lib/business-fields";
import { BUSINESS_DOCUMENTS_BUCKET, persistableDocuments } from "@/lib/business-document-shape";
import { BUSINESS_IMAGES_BUCKET, storagePathFromBusinessImage } from "@/lib/business-images";
import { isValidRegion } from "@/lib/regions";
import { businessSlug } from "@/lib/business-slug";
import type { GroupKey, ActionState, BusinessDocument } from "@/lib/types";
import { clean, cleanHttpUrl } from "./validate";

function groupFromMetadata(value: unknown): GroupKey {
  return typeof value === "string" && CATEGORY_GROUPS.some((group) => group.key === value)
    ? (value as GroupKey)
    : "konaklama";
}

function fileExt(path: string) {
  const cleanPath = path.split("?")[0] ?? path;
  const last = cleanPath.split("/").pop() ?? "";
  const ext = last.includes(".") ? last.split(".").pop() : "";
  return ext && /^[a-z0-9]{1,8}$/i.test(ext) ? ext.toLowerCase() : "jpg";
}

function cleanStoragePath(value: unknown, userId: string): string | null {
  if (typeof value !== "string") return null;
  const path = value.trim();
  if (!path || path.includes("..") || path.startsWith("/") || path.includes("\\")) return null;
  return path.startsWith(`${userId}/`) ? path : null;
}

function businessMediaFolder(businessId: number, businessName: string) {
  const slug = businessSlug({ name: businessName }) || `business-${businessId}`;
  return `${businessId}-${slug}`;
}

async function moveBusinessImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  source: string | null | undefined,
  userId: string,
  businessId: number,
  businessName: string,
  folder: "cover" | "gallery" | `documents/${string}`,
) {
  if (!source) return "";
  const sourcePath = storagePathFromBusinessImage(source);
  if (!sourcePath || !sourcePath.startsWith(`${userId}/`)) return "";

  const finalPrefix = `${userId}/businesses/${businessMediaFolder(businessId, businessName)}/`;
  if (sourcePath.startsWith(finalPrefix)) return sourcePath;

  const destinationPath = `${finalPrefix}${folder}/${crypto.randomUUID()}.${fileExt(sourcePath)}`;
  const { error } = await supabase
    .storage
    .from(BUSINESS_IMAGES_BUCKET)
    .move(sourcePath, destinationPath);
  if (error) throw new Error(error.message);
  return destinationPath;
}

async function moveBusinessDocument(
  supabase: Awaited<ReturnType<typeof createClient>>,
  document: BusinessDocument,
  userId: string,
  businessId: number,
) {
  if (!document.path) return document.url ? { kind: document.kind, name: document.name, url: document.url } : null;

  const finalPrefix = `${userId}/businesses/${businessId}/documents/${document.kind}/`;
  if (document.path.startsWith(finalPrefix)) {
    return { kind: document.kind, name: document.name, path: document.path };
  }

  const destinationPath = `${finalPrefix}${crypto.randomUUID()}.${fileExt(document.path)}`;
  const { error } = await supabase
    .storage
    .from(BUSINESS_DOCUMENTS_BUCKET)
    .move(document.path, destinationPath);
  if (error) throw new Error(error.message);
  return { kind: document.kind, name: document.name, path: destinationPath };
}

async function finalizeBusinessMedia(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  businessId: number,
  businessName: string,
  cover: string | null,
  gallery: string[],
  documents: BusinessDocument[],
) {
  const finalCover = await moveBusinessImage(supabase, cover, userId, businessId, businessName, "cover");
  const finalGallery: string[] = [];
  for (const url of gallery) {
    const next = await moveBusinessImage(supabase, url, userId, businessId, businessName, "gallery");
    if (next) finalGallery.push(next);
  }

  const finalDocuments: BusinessDocument[] = [];
  for (const document of documents) {
    const next = await moveBusinessDocument(supabase, document, userId, businessId);
    if (next) finalDocuments.push(next);
  }

  return {
    image: finalCover || null,
    images: finalGallery,
    documents: persistableDocuments(finalDocuments),
  };
}

/* Firma panelinde ilan düzenleme — sahibi kendi businesses kaydını günceller.
   Kayıt yoksa (ör. e-posta onayı sonrası ilk giriş) oluşturur.
   Foto URL'leri client tarafında Storage'a yüklenip gizli alanlarla gelir. */
export async function saveMyBusiness(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "auth" };

  const name = clean(formData.get("name"), 160);
  if (!name) return { ok: false, error: "missing" };
  const country = clean(formData.get("country"), 80) ?? "";
  const city = clean(formData.get("city"), 80) ?? "";
  const district = clean(formData.get("district"), 80) ?? "";
  if (!country || !city || !district || !isValidRegion(country, city, district)) {
    return { ok: false, error: "invalidRegion" };
  }

  // Seçili hizmet/özellik facet'leri — yalnızca bilinen slug'lar.
  const attributes = formData
    .getAll("attr")
    .map((v) => String(v))
    .filter((s) => ALL_FACET_SLUGS.has(s));

  // Galeri: gizli "images" alanı JSON dizi olarak gelir.
  let images: string[] = [];
  try {
    const raw = String(formData.get("images") ?? "[]");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      images = parsed
        .map((s) => storagePathFromBusinessImage(typeof s === "string" ? s : null))
        .filter((s): s is string => Boolean(s?.startsWith(`${user.id}/`)))
        .slice(0, 12);
    }
  } catch {
    images = [];
  }

  // Kategori-bazlı dinamik alanlar: detail_<key> alanlarını topla (yalnız bilinen anahtarlar).
  const details: Record<string, string> = {};
  for (const [k, v] of formData.entries()) {
    if (!k.startsWith("detail_")) continue;
    const key = k.slice("detail_".length);
    if (!ALL_DETAIL_KEYS.has(key)) continue;
    const val = String(v).trim().slice(0, 300);
    if (val) details[key] = val;
  }

  // Evraklar: gizli "documents" alanı JSON dizi { kind, path, name } olarak gelir.
  let documents: BusinessDocument[] = [];
  try {
    const raw = String(formData.get("documents") ?? "[]");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      documents = parsed
        .map((d): BusinessDocument | null => {
          if (!d || typeof d.kind !== "string" || typeof d.name !== "string") return null;
          const path = cleanStoragePath(d.path, user.id);
          if (path) return { kind: d.kind, path, name: d.name };
          const url = cleanHttpUrl(d.url, 500);
          return url ? { kind: d.kind, url, name: d.name } : null;
        })
        .filter((d): d is BusinessDocument => Boolean(d))
        .slice(0, 20);
    }
  } catch {
    documents = [];
  }

  const payload = {
    name,
    type: clean(formData.get("type"), 80) ?? "",
    country,
    city,
    district,
    description: clean(formData.get("description"), 2000),
    phone: clean(formData.get("phone"), 40),
    website: cleanHttpUrl(formData.get("website"), 200),
    image: cleanStoragePath(storagePathFromBusinessImage(String(formData.get("image") ?? "")), user.id),
    images,
    attributes,
    details,
    documents,
  };

  const idRaw = String(formData.get("id") ?? "").trim();
  const draftKey = clean(formData.get("draft_key"), 120) ?? "";

  try {
    if (idRaw && /^\d+$/.test(idRaw)) {
      const businessId = Number(idRaw);
      const media = await finalizeBusinessMedia(
        supabase,
        user.id,
        businessId,
        payload.name,
        payload.image,
        payload.images,
        payload.documents,
      );
      const { error } = await supabase
        .from("businesses")
        .update({ ...payload, ...media })
        .eq("id", businessId)
        .eq("owner_id", user.id);
      if (error) return { ok: false, error: error.message };
    } else {
      const meta = user.user_metadata ?? {};
      const group = groupFromMetadata(meta.biz_group);
      const { data, error } = await supabase.from("businesses").insert({
        owner_id: user.id,
        group,
        status: "pending",
        ...payload,
        type: payload.type || (meta.biz_type as string) || "—",
      }).select("id").single();
      if (error) return { ok: false, error: error.message };
      if (!data?.id) return { ok: false, error: "missingBusinessId" };

      const media = await finalizeBusinessMedia(
        supabase,
        user.id,
        data.id,
        payload.name,
        payload.image,
        payload.images,
        payload.documents,
      );
      const { error: mediaError } = await supabase
        .from("businesses")
        .update(media)
        .eq("id", data.id)
        .eq("owner_id", user.id);
      if (mediaError) return { ok: false, error: mediaError.message };
    }
    if (draftKey) {
      await supabase
        .from("business_drafts")
        .delete()
        .eq("user_id", user.id)
        .eq("draft_key", draftKey);
    }
    revalidatePath("/[locale]/dashboard", "page");
    // Sahip onaylı ilanını düzenlediyse public liste cache'i (businesses tag) tazelensin.
    revalidateTag("businesses", "max");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  }
}
