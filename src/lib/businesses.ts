import { cacheLife, cacheTag } from "next/cache";
import type { Business, GroupKey } from "./types";
import { createPublicClient } from "./supabase/public";
import type { BusinessRow } from "./supabase/database.types";
import { businessSlug } from "./business-slug";
import { profileScore } from "./listing";
import { PUBLIC_BUSINESS_STATUSES } from "./business-visibility";
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

/* Public listede çekilen kolonlar — hassas işletme detayları çekilmez.
   `details` JSON'u vergi no/TCKN gibi private alanlar taşıyabildiği için yalnızca
   rehber aramasında gereken `work_regions` JSON path olarak alınır. */
const SELECT_COLUMNS =
  "id,group,type,name,country,city,district,lat,lng,description,rating,reviews,tag,verified,sponsored,founder_partner_number,doping_until,phone,website,image,images,attributes,work_regions:details->>work_regions,seo_title,seo_description,seo_keywords,canonical_path,og_image" as const;
const LEGACY_SELECT_COLUMNS =
  "id,group,type,name,country,city,district,lat,lng,description,rating,reviews,tag,verified,sponsored,doping_until,phone,website,image,images,attributes,work_regions:details->>work_regions,seo_title,seo_description,seo_keywords,canonical_path,og_image" as const;

type Row = Pick<
  BusinessRow,
  | "id" | "group" | "type" | "name" | "country" | "city" | "district"
  | "lat" | "lng" | "description" | "rating" | "reviews" | "tag"
  | "verified" | "sponsored" | "doping_until" | "phone" | "website" | "image" | "images" | "attributes"
  | "seo_title" | "seo_description" | "seo_keywords" | "canonical_path" | "og_image"
> & { founder_partner_number?: number | null; work_regions?: string | null };

/* details->>work_regions değerini güvenle şehir dizisine çevirir (virgülle ayrık string). */
function parseWorkRegions(raw: Row["work_regions"]): string[] | undefined {
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
    founderPartnerNumber: r.founder_partner_number ?? undefined,
    dopingUntil: r.doping_until ?? undefined,
    phone: r.phone ?? undefined,
    website: r.website ?? undefined,
    image: r.image ?? undefined,
    images: r.images ?? [],
    attributes: r.attributes ?? [],
    workRegions: parseWorkRegions(r.work_regions),
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

function isMissingFounderColumn(error: { message?: string } | null) {
  return Boolean(error?.message?.includes("founder_partner"));
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
  const primary = await supabase
    .from("businesses")
    .select(SELECT_COLUMNS)
    .in("status", [...PUBLIC_BUSINESS_STATUSES])
    .order("id");
  let data: Row[] | null = primary.data as Row[] | null;
  let error = primary.error;
  if (isMissingFounderColumn(error)) {
    const legacy = await supabase
      .from("businesses")
      .select(LEGACY_SELECT_COLUMNS)
      .in("status", [...PUBLIC_BUSINESS_STATUSES])
      .order("id");
    data = legacy.data as Row[] | null;
    error = legacy.error;
  }
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
  const primary = await supabase
    .from("businesses")
    .select(SELECT_COLUMNS)
    .eq("id", Number(id))
    .in("status", [...PUBLIC_BUSINESS_STATUSES])
    .maybeSingle();
  let data: Row | null = primary.data as Row | null;
  let error = primary.error;
  if (isMissingFounderColumn(error)) {
    const legacy = await supabase
      .from("businesses")
      .select(LEGACY_SELECT_COLUMNS)
      .eq("id", Number(id))
      .in("status", [...PUBLIC_BUSINESS_STATUSES])
      .maybeSingle();
    data = legacy.data as Row | null;
    error = legacy.error;
  }
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
