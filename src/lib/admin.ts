import { createReadOnlyClient as createClient } from "@/lib/supabase/read-only-server";
import { withSignedDocumentUrls } from "@/lib/business-documents";
import { getSignupIntentHealth } from "@/lib/signup-intents";
import { selectAll } from "@/lib/supabase/select-all";
import type {
  GroupKey,
  AdminBusiness,
  AdminApplication,
  AdminQuote,
  ContentPage,
  AdminData,
  BusinessLifecycleStatus,
  BusinessDocument,
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
  founder_partner: boolean;
  image: string | null;
  attributes: string[] | null;
  phone: string | null;
  website: string | null;
  documents: BusinessDocument[] | null;
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

function rowToAdminBusiness(r: AdminBusinessRow, documents?: AdminBusiness["documents"]): AdminBusiness {
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
    founderPartner: r.founder_partner ?? false,
    image: r.image ?? undefined,
    attributes: r.attributes ?? [],
    phone: r.phone ?? undefined,
    website: r.website ?? undefined,
    documents: documents ?? (Array.isArray(r.documents) ? r.documents : []),
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
  signupIntentHealth: { pending: 0, failed: 0 },
};

export const getAdminData = cache(async (): Promise<AdminData> => {
  if (!hasEnv()) {
    console.error("[admin] Supabase env eksik; seed/demo fallback kapalı.");
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
        "id,group,type,name,country,city,district,lat,lng,description,rating,reviews,tag,verified,sponsored,founder_partner,image,attributes,phone,website,documents,details,status,seo_title,seo_description,seo_keywords,canonical_path,og_image,created_at"
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("applications")
      .select("id,name,email,group,category_label,status,created_at,contact_person,phone,address,documents")
      .order("created_at", { ascending: false }),
    supabase
      .from("quotes")
      .select("id,business_id,name,company,email,phone,service,category_group,category_type,country,city,district,date_range,valid_until,people,message,status,internal_note,created_at")
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
    // Haftalık görüntülenme KPI'ı ve tedarikçi/teklif sayfaları bu satırları sayar;
    // sayfalanmazsa PostgREST 1000'de sessizce keser (bkz. supabase/select-all.ts).
    selectAll(
      (from, to) =>
        supabase
          .from("page_views")
          .select("id,entity_type,entity_id,visitor_id,viewed_at")
          .gte("viewed_at", sevenDaysAgo)
          .order("viewed_at", { ascending: false })
          .order("id", { ascending: false })
          .range(from, to),
      { label: "admin/page_views" },
    ),
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
    visitorId: row.visitor_id ?? null,
    viewedAt: row.viewed_at,
  }));

  const signupIntentHealth = await getSignupIntentHealth(supabase);

  const lastBackupRow = backupsRes.data?.[0];
  const businesses = await Promise.all(
    ((businessesRes.data ?? []) as AdminBusinessRow[]).map(async (row) =>
      rowToAdminBusiness(row, await withSignedDocumentUrls(supabase, row.documents)),
    ),
  );

  return {
    mode: "supabase",
    userEmail,
    isAdmin: true,
    businesses,
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
      phone: row.phone,
      service: row.service,
      categoryGroup: row.category_group,
      categoryType: row.category_type,
      country: row.country,
      city: row.city,
      district: row.district,
      dateRange: row.date_range,
      validUntil: row.valid_until,
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
      note: null,
      createdAt: row.created_at,
    })),
    signupIntentHealth,
  };
}
