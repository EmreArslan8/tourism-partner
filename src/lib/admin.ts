import { createClient } from "@/lib/supabase/server";
import type { Business, GroupKey } from "@/lib/types";

type AdminBusinessRow = {
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
  status: "pending" | "approved" | "rejected";
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[] | null;
  canonical_path: string | null;
  og_image: string | null;
  created_at: string | null;
};

export type AdminBusiness = Business & {
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
};

export type AdminApplication = {
  id: number;
  name: string;
  email: string;
  group: GroupKey | null;
  categoryLabel: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export type AdminQuote = {
  id: number;
  businessId: number | null;
  name: string;
  company: string | null;
  email: string;
  service: string | null;
  dateRange: string | null;
  people: number | null;
  message: string | null;
  status: string;
  internalNote: string | null;
  createdAt: string;
};

export type ContentPage = {
  id: number;
  slug: string;
  locale: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[];
  canonicalPath: string | null;
  ogImage: string | null;
  status: "draft" | "published" | "archived";
  updatedAt: string;
};

export type AdminData = {
  mode: "supabase" | "demo";
  userEmail?: string;
  isAdmin: boolean;
  businesses: AdminBusiness[];
  applications: AdminApplication[];
  quotes: AdminQuote[];
  pages: ContentPage[];
};

const hasEnv = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function rowToAdminBusiness(r: AdminBusinessRow): AdminBusiness {
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
    status: r.status,
    seoTitle: r.seo_title ?? undefined,
    seoDescription: r.seo_description ?? undefined,
    seoKeywords: r.seo_keywords ?? [],
    canonicalPath: r.canonical_path ?? undefined,
    ogImage: r.og_image ?? undefined,
    createdAt: r.created_at ?? undefined,
  };
}

const EMPTY = {
  businesses: [] as AdminBusiness[],
  applications: [] as AdminApplication[],
  quotes: [] as AdminQuote[],
  pages: [] as ContentPage[],
};

export async function getAdminData(): Promise<AdminData> {
  if (!hasEnv()) {
    return { mode: "demo", isAdmin: false, ...EMPTY };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { mode: "supabase", isAdmin: false, ...EMPTY };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return { mode: "supabase", userEmail: user.email ?? undefined, isAdmin: false, ...EMPTY };
  }

  // Admin kendi oturumuyla okur; RLS admin policy'leri tüm satırlara erişim verir.
  return getSupabaseAdminData(user.email ?? undefined, supabase);
}

async function getSupabaseAdminData(
  userEmail: string | undefined,
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<AdminData> {
  const [businessesRes, applicationsRes, quotesRes, pagesRes] = await Promise.all([
    supabase
      .from("businesses")
      .select(
        "id,group,type,name,country,city,district,lat,lng,description,rating,reviews,tag,verified,sponsored,image,attributes,status,seo_title,seo_description,seo_keywords,canonical_path,og_image,created_at"
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("applications")
      .select("id,name,email,group,category_label,status,created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("quotes")
      .select("id,business_id,name,company,email,service,date_range,people,message,status,internal_note,created_at")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("content_pages")
      .select(
        "id,slug,locale,title,excerpt,body,seo_title,seo_description,seo_keywords,canonical_path,og_image,status,updated_at"
      )
      .order("updated_at", { ascending: false }),
  ]);

  return {
    mode: "supabase",
    userEmail,
    isAdmin: true,
    businesses: ((businessesRes.data ?? []) as AdminBusinessRow[]).map(rowToAdminBusiness),
    applications: (applicationsRes.data ?? []).map((row) => ({
      id: Number(row.id),
      name: String(row.name),
      email: String(row.email),
      group: row.group as GroupKey | null,
      categoryLabel: row.category_label,
      status: row.status,
      createdAt: row.created_at,
    })),
    quotes: (quotesRes.data ?? []).map((row) => ({
      id: Number(row.id),
      businessId: row.business_id,
      name: String(row.name),
      company: row.company,
      email: String(row.email),
      service: row.service,
      dateRange: row.date_range,
      people: row.people,
      message: row.message,
      status: row.status ?? "new",
      internalNote: row.internal_note,
      createdAt: row.created_at,
    })),
    pages: (pagesRes.data ?? []).map((row) => ({
      id: Number(row.id),
      slug: String(row.slug),
      locale: String(row.locale),
      title: String(row.title),
      excerpt: row.excerpt,
      body: row.body,
      seoTitle: row.seo_title,
      seoDescription: row.seo_description,
      seoKeywords: row.seo_keywords ?? [],
      canonicalPath: row.canonical_path,
      ogImage: row.og_image,
      status: row.status,
      updatedAt: row.updated_at,
    })),
  };
}
