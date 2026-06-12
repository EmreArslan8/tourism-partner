import { cacheLife, cacheTag } from "next/cache";
import type { Business } from "./types";
import { BUSINESSES as SEED } from "./data";
import { createPublicClient } from "./supabase/public";
import type { BusinessRow } from "./supabase/database.types";
import { businessSlug } from "./business-slug";
export { businessSlug } from "./business-slug";

/* Firma veri erişim katmanı (server). Supabase'den okur; env yoksa veya
   sorgu hata verirse statik seed'e (lib/data.ts) düşer — site her durumda çalışır. */

/* Public listede çekilen kolonlar — Row tipi şemadan türer (drift = derleme hatası). */
const SELECT_COLUMNS =
  "id,group,type,name,country,city,district,lat,lng,description,rating,reviews,tag,verified,sponsored,image,attributes,seo_title,seo_description,seo_keywords,canonical_path,og_image" as const;

type Row = Pick<
  BusinessRow,
  | "id" | "group" | "type" | "name" | "country" | "city" | "district"
  | "lat" | "lng" | "description" | "rating" | "reviews" | "tag"
  | "verified" | "sponsored" | "image" | "attributes"
  | "seo_title" | "seo_description" | "seo_keywords" | "canonical_path" | "og_image"
>;

function rowToBusiness(r: Row): Business {
  return {
    id: r.id,
    group: r.group,
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
    image: r.image ?? undefined,
    attributes: r.attributes ?? [],
    seoTitle: r.seo_title ?? undefined,
    seoDescription: r.seo_description ?? undefined,
    seoKeywords: r.seo_keywords ?? undefined,
    canonicalPath: r.canonical_path ?? undefined,
    ogImage: r.og_image ?? undefined,
  };
}

const hasEnv = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/* Seed'e düşüş sessiz kalmasın — prod'da DB sorunu görünür olsun.
   (İleride Sentry/log servisine bağlanabilir.) */
function reportFallback(where: string, detail: unknown) {
  console.error(`[businesses] DB okuma başarısız, SEED'e düşülüyor (${where}):`, detail);
}

/* Çerezsiz public client + 'use cache': oturumdan bağımsız, herkese açık liste.
   Veri Next Data Cache'e yazılır; 'businesses' tag'i admin mutasyonlarında
   revalidateTag ile tazelenir. Böylece her geçişte DB vurulmaz. */
export async function getBusinesses(): Promise<Business[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("businesses");
  if (!hasEnv()) return SEED;
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("businesses")
      .select(SELECT_COLUMNS)
      .eq("status", "approved")
      .order("id");
    if (error || !data) {
      reportFallback("getBusinesses", error ?? "veri yok");
      return SEED;
    }
    return (data as Row[]).map(rowToBusiness);
  } catch (e) {
    reportFallback("getBusinesses", e);
    return SEED;
  }
}

export async function getBusinessById(id: number | string): Promise<Business | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("businesses");
  if (!hasEnv()) return SEED.find((b) => b.id === Number(id)) ?? null;
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("businesses")
      .select(SELECT_COLUMNS)
      .eq("id", Number(id))
      .maybeSingle();
    if (error) {
      reportFallback("getBusinessById", error);
      return SEED.find((b) => b.id === Number(id)) ?? null;
    }
    if (!data) return null;
    return rowToBusiness(data as Row);
  } catch (e) {
    reportFallback("getBusinessById", e);
    return SEED.find((b) => b.id === Number(id)) ?? null;
  }
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const businesses = await getBusinesses();
  return businesses.find((business) => businessSlug(business) === slug) ?? null;
}
