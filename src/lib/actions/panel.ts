"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_GROUPS, serviceLabel } from "@/lib/categories";
import { replaceBusinessServices } from "@/lib/business-services";
import { ALL_FACET_SLUGS } from "@/lib/facets";
import { ALL_DETAIL_KEYS, docsForGroup } from "@/lib/business-fields";
import { BUSINESS_DOCUMENTS_BUCKET, persistableDocuments } from "@/lib/business-document-shape";
import { BUSINESS_IMAGES_BUCKET, storagePathFromBusinessImage } from "@/lib/business-images";
import { isValidRegion } from "@/lib/geo-server";
import { isValidTCKN, isValidVKN } from "@/lib/validators";
import { businessSlug } from "@/lib/business-slug";
import { SOCIAL_PLATFORMS, type GroupKey, type ActionState, type BusinessDocument, type BusinessSocials } from "@/lib/types";
import { clean, cleanHttpUrl, isEmail } from "./validate";

type ContactInput = { full_name: string; title: string | null; phone: string | null; email: string | null };

/** Panelden gelen contacts JSON'ını güvenli parse eder (max 10, alan temizliği). */
function parseContacts(raw: unknown): ContactInput[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(String(raw ?? "[]"));
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  const out: ContactInput[] = [];
  for (const item of parsed) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const full_name = clean(rec.full_name as string, 160);
    if (!full_name) continue;
    const email = clean(rec.email as string, 200);
    out.push({
      full_name,
      title: clean(rec.title as string, 120),
      phone: clean(rec.phone as string, 40),
      email: email && isEmail(email) ? email : null,
    });
    if (out.length >= 10) break;
  }
  return out;
}

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

function allowedDocumentKinds(group: GroupKey, type: string) {
  return new Set(docsForGroup(group, type).map((document) => document.kind));
}

function filterAllowedDocuments(documents: BusinessDocument[], group: GroupKey, type: string) {
  const allowed = allowedDocumentKinds(group, type);
  if (allowed.size === 0) return [];
  return documents.filter((document) => allowed.has(document.kind));
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

async function cleanupRemovedDocuments(
  supabase: Awaited<ReturnType<typeof createClient>>,
  previousDocuments: unknown,
  nextDocuments: BusinessDocument[],
  userId: string,
) {
  if (!Array.isArray(previousDocuments)) return;

  const nextPaths = new Set(nextDocuments.map((document) => document.path).filter((path): path is string => Boolean(path)));
  const removePaths = previousDocuments
    .map((document) => {
      if (!document || typeof document !== "object") return null;
      const path = (document as Record<string, unknown>).path;
      return cleanStoragePath(path, userId);
    })
    .filter((path): path is string => Boolean(path && !nextPaths.has(path)));

  if (removePaths.length === 0) return;
  await supabase.storage.from(BUSINESS_DOCUMENTS_BUCKET).remove(removePaths);
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
  if (!country || !city || !district || !(await isValidRegion(country, city, district))) {
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

  // TCKN / Vergi No — doluysa biçimsel + algoritmik doğrulama.
  if (details.tckn && !isValidTCKN(details.tckn)) return { ok: false, error: "invalidTckn" };
  if (details.tax_no && !isValidVKN(details.tax_no)) return { ok: false, error: "invalidTaxNo" };

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

  // Çoklu hizmet seçimi (business_services). İlk seçilen birincil → type.
  const rawServices = formData.getAll("services").map((value) => String(value));
  const payloadType = rawServices.length > 0 ? serviceLabel(rawServices[0]) : clean(formData.get("type"), 80) ?? "";
  const meta = user.user_metadata ?? {};
  const requestedGroup = groupFromMetadata(meta.biz_group);
  let savedGroup: GroupKey = requestedGroup;

  const payload = {
    name,
    type: payloadType,
    country,
    city,
    district,
    description: clean(formData.get("description"), 2000),
    phone: clean(formData.get("phone"), 40),
    website: cleanHttpUrl(formData.get("website"), 200),
    socials: SOCIAL_PLATFORMS.reduce<BusinessSocials>((acc, key) => {
      const url = cleanHttpUrl(formData.get(`social_${key}`), 300);
      if (url) acc[key] = url;
      return acc;
    }, {}),
    image: cleanStoragePath(storagePathFromBusinessImage(String(formData.get("image") ?? "")), user.id),
    images,
    attributes,
    details,
    documents: filterAllowedDocuments(documents, requestedGroup, payloadType || (meta.biz_type as string) || ""),
  };

  const contacts = parseContacts(formData.get("contacts"));

  const idRaw = String(formData.get("id") ?? "").trim();
  const draftKey = clean(formData.get("draft_key"), 120) ?? "";

  try {
    let savedBusinessId: number | null = null;
    if (idRaw && /^\d+$/.test(idRaw)) {
      const businessId = Number(idRaw);
      savedBusinessId = businessId;
      const { data: currentBusiness, error: currentError } = await supabase
        .from("businesses")
        .select("group,type,documents")
        .eq("id", businessId)
        .eq("owner_id", user.id)
        .single();
      if (currentError) return { ok: false, error: currentError.message };
      if (!currentBusiness) return { ok: false, error: "notFound" };

      const effectiveGroup = groupFromMetadata(currentBusiness.group);
      savedGroup = effectiveGroup;
      const effectiveType = payload.type || currentBusiness.type || "";
      payload.documents = filterAllowedDocuments(payload.documents, effectiveGroup, effectiveType);

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
      await cleanupRemovedDocuments(supabase, currentBusiness.documents, media.documents, user.id);
    } else {
      const group = requestedGroup;
      payload.documents = filterAllowedDocuments(payload.documents, group, payload.type || (meta.biz_type as string) || "");
      const { data, error } = await supabase.from("businesses").insert({
        owner_id: user.id,
        group,
        status: "pending",
        ...payload,
        type: payload.type || (meta.biz_type as string) || "—",
      }).select("id").single();
      if (error) return { ok: false, error: error.message };
      if (!data?.id) return { ok: false, error: "missingBusinessId" };
      savedBusinessId = data.id;

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

    // Yetkili kişiler: basit replace stratejisi (delete + insert). RLS owner policy'leriyle korunur.
    if (savedBusinessId) {
      await supabase.from("business_contacts").delete().eq("business_id", savedBusinessId);
      if (contacts.length > 0) {
        const { error: contactsError } = await supabase.from("business_contacts").insert(
          contacts.map((c) => ({ business_id: savedBusinessId as number, ...c })),
        );
        if (contactsError) return { ok: false, error: contactsError.message };
      }

    }

    // Çoklu hizmetleri senkronize et (form açıkça hizmet gönderdiyse).
    if (savedBusinessId && rawServices.length > 0) {
      await replaceBusinessServices(supabase, savedBusinessId, savedGroup, rawServices);
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
    revalidateTag("business-partners", "max");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  }
}

async function currentOwnedBusiness() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, business: null, error: "auth" };

  const { data: business, error } = await supabase
    .from("businesses")
    .select("id,status")
    .eq("owner_id", user.id)
    .order("id")
    .limit(1)
    .maybeSingle();

  if (error) return { supabase, business: null, error: error.message };
  if (!business) return { supabase, business: null, error: "notFound" };
  return { supabase, business, error: null };
}

function revalidatePartnerRequests() {
  revalidatePath("/[locale]/dashboard", "page");
  revalidatePath("/[locale]/dashboard/listings", "page");
  revalidateTag("business-partners", "max");
  revalidateTag("businesses", "max");
}

export type PartnerRequestActionState = {
  status: "idle" | "success" | "error";
  partnerBusinessId: number | null;
  reason?: "invalid" | "notAllowed" | "exists" | "failed";
};

export async function sendPartnerRequest(
  _previousState: PartnerRequestActionState,
  formData: FormData,
): Promise<PartnerRequestActionState> {
  const receiverBusinessId = Number(formData.get("partnerBusinessId"));
  const failure = (reason: PartnerRequestActionState["reason"]): PartnerRequestActionState => ({
    status: "error",
    partnerBusinessId: Number.isInteger(receiverBusinessId) ? receiverBusinessId : null,
    reason,
  });
  if (!Number.isInteger(receiverBusinessId) || receiverBusinessId <= 0) return failure("invalid");

  const { supabase, business, error } = await currentOwnedBusiness();
  if (error || !business || receiverBusinessId === Number(business.id)) return failure("notAllowed");
  if (business.status !== "approved" && business.status !== "active") return failure("notAllowed");

  const myBusinessId = Number(business.id);
  const { data: existing, error: existingError } = await supabase
    .from("business_partner_requests")
    .select("id")
    .or(
      `and(requester_business_id.eq.${myBusinessId},receiver_business_id.eq.${receiverBusinessId}),and(requester_business_id.eq.${receiverBusinessId},receiver_business_id.eq.${myBusinessId})`,
    )
    .limit(1)
    .maybeSingle();
  if (existingError) return failure("failed");
  if (existing) return failure("exists");

  const { error: insertError } = await supabase.from("business_partner_requests").insert({
    requester_business_id: myBusinessId,
    receiver_business_id: receiverBusinessId,
    status: "pending",
    responded_at: null,
  });
  if (insertError) return failure("failed");
  revalidatePartnerRequests();
  return { status: "success", partnerBusinessId: receiverBusinessId };
}

export async function respondPartnerRequest(
  requestId: number,
  decision: "accepted" | "rejected",
  _formData: FormData,
): Promise<void> {
  void _formData;
  if (!Number.isInteger(requestId) || requestId <= 0) return;

  const { supabase, business, error } = await currentOwnedBusiness();
  if (error || !business) return;

  const { error: updateError } = await supabase
    .from("business_partner_requests")
    .update({ status: decision, responded_at: new Date().toISOString() })
    .eq("id", requestId)
    .eq("receiver_business_id", Number(business.id))
    .eq("status", "pending");
  if (updateError) throw new Error(updateError.message);
  revalidatePartnerRequests();
}

export async function cancelPartnerRequest(requestId: number, _formData: FormData): Promise<void> {
  void _formData;
  if (!Number.isInteger(requestId) || requestId <= 0) return;

  const { supabase, business, error } = await currentOwnedBusiness();
  if (error || !business) return;

  const { error: deleteError } = await supabase
    .from("business_partner_requests")
    .delete()
    .eq("id", requestId)
    .eq("requester_business_id", Number(business.id))
    .eq("status", "pending");
  if (deleteError) throw new Error(deleteError.message);
  revalidatePartnerRequests();
}
