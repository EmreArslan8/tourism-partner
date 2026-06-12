import type { Business, GroupKey } from "./types";
import { BUSINESSES as SEED } from "./data";
import { createClient } from "./supabase/server";

/* Firma veri erişim katmanı (server). Supabase'den okur; env yoksa veya
   sorgu hata verirse statik seed'e (lib/data.ts) düşer — site her durumda çalışır. */

type Row = {
  id: number;
  group: GroupKey;
  type: string;
  name: string;
  country: string;
  city: string;
  district: string;
  lat: number | null;
  lng: number | null;
  description: string | null;
  rating: number | string;
  reviews: number;
  tag: string | null;
  verified: boolean;
  sponsored: boolean;
  image: string | null;
  attributes: string[] | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
  canonical_path?: string | null;
  og_image?: string | null;
};

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

export async function getBusinesses(): Promise<Business[]> {
  if (!hasEnv()) return SEED;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("businesses")
      .select(
        "id,group,type,name,country,city,district,lat,lng,description,rating,reviews,tag,verified,sponsored,image,attributes,seo_title,seo_description,seo_keywords,canonical_path,og_image"
      )
      .eq("status", "approved")
      .order("id");
    if (error || !data) return SEED;
    return (data as Row[]).map(rowToBusiness);
  } catch {
    return SEED;
  }
}

export async function getBusinessById(id: number | string): Promise<Business | null> {
  if (!hasEnv()) return SEED.find((b) => b.id === Number(id)) ?? null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("businesses")
      .select(
        "id,group,type,name,country,city,district,lat,lng,description,rating,reviews,tag,verified,sponsored,image,attributes,seo_title,seo_description,seo_keywords,canonical_path,og_image"
      )
      .eq("id", Number(id))
      .maybeSingle();
    if (error || !data) return SEED.find((b) => b.id === Number(id)) ?? null;
    return rowToBusiness(data as Row);
  } catch {
    return SEED.find((b) => b.id === Number(id)) ?? null;
  }
}

export async function getSponsored(): Promise<Business[]> {
  return (await getBusinesses()).filter((b) => b.sponsored);
}
