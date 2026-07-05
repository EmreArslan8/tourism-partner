import { cacheLife, cacheTag } from "next/cache";
import type { Business, GroupKey } from "./types";
import { createPublicClient } from "./supabase/public";
import type { BusinessRow } from "./supabase/database.types";
import { businessSlug } from "./business-slug";
import { profileScore } from "./listing";
export { businessSlug } from "./business-slug";

/* Liste/istemci payload'ı için iletişim alanlarını çıkarır (Brief §6A: telefon/website
   yalnızca detay sayfasında). UI'da gizlemek yetmez — alan JSON'da inerse DevTools'tan
   toplu kazınabilir. Profil doluluk skoru sıralama için sunucuda önceden hesaplanır. */
export function toListingBusiness(b: Business): Business {
  const rest = Object.fromEntries(
    Object.entries(b).filter(([key]) => key !== "phone" && key !== "website")
  ) as Business;
  return { ...rest, completeness: profileScore(b) };
}

/* Firma veri erişim katmanı (server). Supabase'den okur.
   Seed fallback kapalı: local/dev/prod aynı gerçek DB davranışını görür. */

/* Public listede çekilen kolonlar — Row tipi şemadan türer (drift = derleme hatası).
   details YALNIZCA work_regions (rehber çalışma bölgeleri) için çekilir; hassas alanlar
   (TCKN, vergi no…) rowToBusiness'ta ATILIR, asla public Business'a girmez. */
const SELECT_COLUMNS =
  "id,group,type,name,country,city,district,lat,lng,description,rating,reviews,tag,verified,sponsored,doping_until,phone,website,image,images,attributes,details,seo_title,seo_description,seo_keywords,canonical_path,og_image" as const;

type Row = Pick<
  BusinessRow,
  | "id" | "group" | "type" | "name" | "country" | "city" | "district"
  | "lat" | "lng" | "description" | "rating" | "reviews" | "tag"
  | "verified" | "sponsored" | "doping_until" | "phone" | "website" | "image" | "images" | "attributes"
  | "details" | "seo_title" | "seo_description" | "seo_keywords" | "canonical_path" | "og_image"
>;

/* details.work_regions'ı güvenle şehir dizisine çevirir (virgülle ayrık string). */
function parseWorkRegions(details: Row["details"]): string[] | undefined {
  if (!details || typeof details !== "object") return undefined;
  const raw = (details as Record<string, unknown>).work_regions;
  if (typeof raw !== "string" || !raw.trim()) return undefined;
  const list = raw.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 40);
  return list.length ? list : undefined;
}

function rowToBusiness(r: Row): Business {
  return {
    id: r.id,
    group: normalizeBusinessGroup(r.group),
    type: r.type,
    name: r.name,
    country: r.country,
    city: r.city,
    district: r.district,
    coords: [Number(r.lat ?? 0), Number(r.lng ?? 0)],
    desc: r.description ?? "",
    rating: Number(r.rating),
    reviews: r.reviews,
    tag: r.tag ?? "",
    verified: r.verified,
    sponsored: r.sponsored,
    dopingUntil: r.doping_until ?? undefined,
    phone: r.phone ?? undefined,
    website: r.website ?? undefined,
    image: r.image ?? undefined,
    images: r.images ?? [],
    attributes: r.attributes ?? [],
    // Yalnızca work_regions taşınır; details'in geri kalanı (TCKN vb.) burada bırakılır.
    workRegions: parseWorkRegions(r.details),
    seoTitle: r.seo_title ?? undefined,
    seoDescription: r.seo_description ?? undefined,
    seoKeywords: r.seo_keywords ?? undefined,
    canonicalPath: r.canonical_path ?? undefined,
    ogImage: r.og_image ?? undefined,
  };
}

function normalizeBusinessGroup(group: string): GroupKey {
  if (group === "eglence") return "aktivite";
  if (group === "ulasim") return "ulasim";
  if (group === "acente" || group === "rehber" || group === "aktivite" || group === "saglik" || group === "gastronomi") return group;
  return "konaklama";
}

const hasEnv = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function reportMissingEnv(where: string) {
  console.error(`[businesses] Supabase env eksik (${where}); seed fallback kapalı, boş sonuç dönülüyor.`);
}

/* Çerezsiz public client + 'use cache': oturumdan bağımsız, herkese açık liste.
   Veri Next Data Cache'e yazılır; 'businesses' tag'i admin mutasyonlarında
   revalidateTag ile tazelenir. Böylece her geçişte DB vurulmaz. */
export async function getBusinesses(): Promise<Business[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("businesses");
  if (!hasEnv()) {
    reportMissingEnv("getBusinesses");
    return [];
  }
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("businesses")
    .select(SELECT_COLUMNS)
    .eq("status", "approved")
    .order("id");
  if (error) {
    console.error(`[businesses] getBusinesses DB hatası; seed fallback kapalı, boş sonuç dönülüyor: ${error.message}`);
    return [];
  }
  return ((data ?? []) as Row[]).map(rowToBusiness);
}

export async function getBusinessById(id: number | string): Promise<Business | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("businesses");
  if (!hasEnv()) {
    reportMissingEnv("getBusinessById");
    return null;
  }
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("businesses")
    .select(SELECT_COLUMNS)
    .eq("id", Number(id))
    .maybeSingle();
  if (error) {
    console.error(`[businesses] getBusinessById DB hatası; seed fallback kapalı, null dönülüyor: ${error.message}`);
    return null;
  }
  if (!data) return null;
  return rowToBusiness(data as Row);
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const businesses = await getBusinesses();
  return businesses.find((business) => businessSlug(business) === slug) ?? null;
}
