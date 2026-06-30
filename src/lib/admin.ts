import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BUSINESSES as SEED } from "@/lib/data";
import type {
  GroupKey,
  AdminBusiness,
  AdminApplication,
  AdminQuote,
  ContentPage,
  AdminData,
  BusinessLifecycleStatus,
} from "@/lib/types";
import { cache } from "react";

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
  phone: string | null;
  website: string | null;
  documents: { kind: string; url: string; name: string }[] | null;
  details: Record<string, string> | null;
  status: BusinessLifecycleStatus;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[] | null;
  canonical_path: string | null;
  og_image: string | null;
  created_at: string | null;
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
    phone: r.phone ?? undefined,
    website: r.website ?? undefined,
    documents: Array.isArray(r.documents) ? r.documents : [],
    details: r.details ?? {},
    status: r.status,
    seoTitle: r.seo_title ?? undefined,
    seoDescription: r.seo_description ?? undefined,
    seoKeywords: r.seo_keywords ?? [],
    canonicalPath: r.canonical_path ?? undefined,
    ogImage: r.og_image ?? undefined,
    createdAt: r.created_at ?? undefined,
  };
}

function applicationStatus(value: unknown): "pending" | "approved" | "rejected" {
  return value === "approved" || value === "rejected" ? value : "pending";
}

const EMPTY = {
  businesses: [] as AdminBusiness[],
  applications: [] as AdminApplication[],
  quotes: [] as AdminQuote[],
  pages: [] as ContentPage[],
  memberships: [],
  pageViews: [],
  lastBackup: null,
  auditLogs: [],
};

/* DEV BYPASS için sahte ama dolu admin verisi — paneli giriş yapmadan görmek için. */
function demoAdminData(): AdminData {
  const day = 86_400_000;
  const businesses: AdminBusiness[] = SEED.map((b, i) => ({
    ...b,
    status: i % 7 === 0 ? "pending" : "approved",
    createdAt: new Date(Date.now() - i * day).toISOString(),
  }));

  const applications: AdminApplication[] = [
    {
      id: 1, name: "Global Horizon Tours", email: "iletisim@globalhorizon.com", group: "acente",
      categoryLabel: "Seyahat Acentesi", status: "pending", createdAt: new Date(Date.now() - day).toISOString(),
      contactPerson: "Ahmet Yılmaz", phone: "+90 555 123 4567", address: "İstanbul, Şişli",
      documents: [
        { label: "TÜRSAB Belgesi", uploaded: true },
        { label: "Vergi Levhası", uploaded: true },
        { label: "İmza Sirküleri", uploaded: true },
      ],
    },
    {
      id: 2, name: "Anadolu Transfer Hizmetleri", email: "op@anadolutransfer.com", group: "eglence",
      categoryLabel: "Taşımacılık", status: "pending", createdAt: new Date(Date.now() - 2 * day).toISOString(),
      contactPerson: "Mehmet Demir", phone: "+90 532 987 6543", address: "Antalya, Muratpaşa",
      documents: [
        { label: "D2 Belgesi", uploaded: false },
        { label: "Vergi Levhası", uploaded: true },
      ],
    },
    {
      id: 3, name: "Dr. Akın Diş Kliniği", email: "iletisim@akinklinik.com", group: "saglik",
      categoryLabel: "Diş Kliniği", status: "approved", createdAt: new Date(Date.now() - 5 * day).toISOString(),
      contactPerson: "Selin Akın", phone: "+90 312 444 1212", address: "Ankara, Çankaya",
      documents: [
        { label: "Klinik Açma Belgesi", uploaded: true },
        { label: "Uzmanlık Belgesi", uploaded: true },
      ],
    },
    {
      id: 4, name: "Batı Karadeniz Turizm", email: "info@bktur.com", group: "acente",
      categoryLabel: "Tur Operatörü", status: "rejected", createdAt: new Date(Date.now() - 8 * day).toISOString(),
      contactPerson: "Canan Şahin", phone: "+90 462 222 3344", address: "Trabzon, Ortahisar",
      documents: [{ label: "TÜRSAB Belgesi", uploaded: false }],
    },
  ];

  const quotes: AdminQuote[] = [
    { id: 1, businessId: 1, name: "Global Tours A.Ş.", company: "Global Tours A.Ş.", email: "rfq@globaltours.com", service: "Yaz Sezonu Toplu Konaklama", dateRange: "Haziran–Eylül", people: 120, message: "Antalya bölgesi için kontenjan.", status: "new", internalNote: null, createdAt: new Date(Date.now() - day).toISOString() },
    { id: 2, businessId: 6, name: "Akdeniz VIP", company: "Akdeniz VIP", email: "info@akdenizvip.com", service: "VIP Transfer Talebi", dateRange: "Temmuz", people: 8, message: null, status: "new", internalNote: null, createdAt: new Date(Date.now() - 2 * day).toISOString() },
    { id: 3, businessId: 4, name: "Ege Konaklama", company: "Ege Konaklama", email: "kontrat@ege.com", service: "Butik Otel Kontrat Yenileme", dateRange: "Yıllık", people: null, message: null, status: "contacted", internalNote: null, createdAt: new Date(Date.now() - 3 * day).toISOString() },
  ];

  const memberships = [
    { id: 1, businessId: 3, plan: "standard", status: "active" as const, startsAt: new Date(Date.now() - 351 * day).toISOString(), endsAt: new Date(Date.now() + 3 * day).toISOString() },
    { id: 2, businessId: 8, plan: "standard", status: "active" as const, startsAt: new Date(Date.now() - 357 * day).toISOString(), endsAt: new Date(Date.now() + 8 * day).toISOString() },
    { id: 3, businessId: 12, plan: "premium", status: "active" as const, startsAt: new Date(Date.now() - 354 * day).toISOString(), endsAt: new Date(Date.now() + 13 * day).toISOString() },
  ];

  const pageViews = Array.from({ length: 852 }, (_, i) => ({
    id: i + 1,
    entityType: "business",
    entityId: SEED[i % SEED.length].id,
    viewedAt: new Date(Date.now() - (i % 7) * day).toISOString(),
  }));

  return {
    mode: "demo",
    userEmail: "demo@admin.local",
    isAdmin: true,
    businesses,
    applications,
    quotes,
    pages: [],
    memberships,
    pageViews,
    lastBackup: { id: 1, status: "completed", completedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
    auditLogs: [],
  };
}

export const getAdminData = cache(async (): Promise<AdminData> => {
  // DEV BYPASS — yalnızca local geliştirme. Gerçek admin girişi DAİMA önceliklidir;
  // bypass yalnızca giriş yoksa/yetki yoksa tasarım önizlemesi için devreye girer.
  // Üretimde (NODE_ENV=production) ASLA çalışmaz.
  const devBypass =
    process.env.NODE_ENV !== "production" && process.env.ADMIN_DEV_BYPASS === "1";

  async function fallback(real: AdminData): Promise<AdminData> {
    if (devBypass) {
      // demoAdminData() Date.now() kullanıyor; Cache Components kuralı gereği önce
      // request verisi okunmalı. connection() render'ı dinamik işaretler.
      await connection();
      return demoAdminData();
    }
    return real;
  }

  if (!hasEnv()) {
    return fallback({ mode: "demo", isAdmin: false, ...EMPTY });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return fallback({ mode: "supabase", isAdmin: false, ...EMPTY });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return fallback({ mode: "supabase", userEmail: user.email ?? undefined, isAdmin: false, ...EMPTY });
  }

  // Gerçek admin: kendi oturumuyla okur; RLS admin policy'leri tüm satırlara erişim verir.
  return getSupabaseAdminData(user.email ?? undefined, supabase);
});

async function getSupabaseAdminData(
  userEmail: string | undefined,
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<AdminData> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    businessesRes,
    applicationsRes,
    quotesRes,
    pagesRes,
    membershipsRes,
    pageViewsRes,
    backupsRes,
    auditLogsRes,
  ] = await Promise.all([
    supabase
      .from("businesses")
      .select(
        "id,group,type,name,country,city,district,lat,lng,description,rating,reviews,tag,verified,sponsored,image,attributes,phone,website,documents,details,status,seo_title,seo_description,seo_keywords,canonical_path,og_image,created_at"
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("applications")
      .select("id,name,email,group,category_label,status,created_at,contact_person,phone,address,documents")
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
    supabase
      .from("business_memberships")
      .select("id,business_id,plan,status,starts_at,ends_at")
      .order("ends_at", { ascending: true })
      .limit(200),
    supabase
      .from("page_views")
      .select("id,entity_type,entity_id,viewed_at")
      .gte("viewed_at", sevenDaysAgo)
      .order("viewed_at", { ascending: false })
      .limit(10000),
    supabase
      .from("system_backups")
      .select("id,status,completed_at,created_at")
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("audit_logs")
      .select("id,admin_id,action,entity_type,entity_id,ip_address,user_agent,created_at")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const memberships = (membershipsRes.data ?? []).map((row) => ({
    id: Number(row.id),
    businessId: Number(row.business_id),
    plan: String(row.plan ?? "standard"),
    status: row.status ?? "active",
    startsAt: row.starts_at,
    endsAt: row.ends_at,
  }));

  const pageViews = (pageViewsRes.data ?? []).map((row) => ({
    id: Number(row.id),
    entityType: String(row.entity_type),
    entityId: row.entity_id === null ? null : Number(row.entity_id),
    viewedAt: row.viewed_at,
  }));

  const lastBackupRow = backupsRes.data?.[0];

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
      status: applicationStatus(row.status),
      createdAt: row.created_at,
      contactPerson: row.contact_person ?? undefined,
      phone: row.phone ?? undefined,
      address: row.address ?? undefined,
      documents: Array.isArray(row.documents) ? row.documents : undefined,
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
    memberships,
    pageViews,
    lastBackup: lastBackupRow
      ? {
          id: Number(lastBackupRow.id),
          status: lastBackupRow.status,
          completedAt: lastBackupRow.completed_at,
          createdAt: lastBackupRow.created_at,
        }
      : null,
    auditLogs: (auditLogsRes.data ?? []).map((row) => ({
      id: Number(row.id),
      adminId: row.admin_id,
      action: String(row.action),
      entityType: row.entity_type,
      entityId: row.entity_id,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      createdAt: row.created_at,
    })),
  };
}
