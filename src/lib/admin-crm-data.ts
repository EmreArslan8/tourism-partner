import { cache } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BUSINESSES as SEED } from "@/lib/data";
import type { AdminAuditLog, AdminBusiness, AdminMembership, BusinessLifecycleStatus, GroupKey } from "@/lib/types";
import type { CrmFilters, ExportColumn } from "@/lib/admin-crm";
import { businessesToCsv, filterBusinesses } from "@/lib/admin-crm";

const BUSINESS_SELECT =
  "id,group,type,name,country,city,district,lat,lng,description,rating,reviews,tag,verified,sponsored,doping_until,phone,website,image,attributes,status,seo_title,seo_description,seo_keywords,canonical_path,og_image,created_at";

const hasEnv = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type BusinessRow = {
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
  doping_until: string | null;
  phone: string | null;
  website: string | null;
  image: string | null;
  attributes: string[] | null;
  status: BusinessLifecycleStatus;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[] | null;
  canonical_path: string | null;
  og_image: string | null;
  created_at: string | null;
};

export type CrmListData = {
  businesses: AdminBusiness[];
  total: number;
  memberships: AdminMembership[];
  expiringBusinesses: AdminBusiness[];
  expiringMemberships: AdminMembership[];
  cities: string[];
  activeHotels: number;
  activeAgencies: number;
};

export type CrmBusinessDetailData = {
  business: AdminBusiness | null;
  membership: AdminMembership | null;
  auditLogs: AdminAuditLog[];
};

export const getCrmListData = cache(async (filters: CrmFilters): Promise<CrmListData> => {
  if (!hasEnv()) {
    await connection();
    return demoListData(filters);
  }

  const supabase = await createClient();
  const offset = (filters.page - 1) * filters.limit;
  const visiblePromise = runBusinessQuery(applyBusinessFilters(supabase.from("businesses").select(BUSINESS_SELECT, { count: "exact" }), filters)
    .order("created_at", { ascending: false })
    .range(offset, offset + filters.limit - 1));
  const citiesPromise = supabase.from("businesses").select("city").order("city", { ascending: true });
  const expiringPromise = supabase
    .from("business_memberships")
    .select("id,business_id,plan,status,starts_at,ends_at")
    .neq("status", "expired")
    .order("ends_at", { ascending: true })
    .limit(25);
  const activeCountsPromise = Promise.all([
    supabase.from("businesses").select("id", { count: "exact", head: true }).in("status", ["approved", "active"]).eq("group", "konaklama"),
    supabase.from("businesses").select("id", { count: "exact", head: true }).in("status", ["approved", "active"]).eq("group", "acente"),
  ]);

  const [visible, citiesRes, expiringRes, activeCounts] = await Promise.all([
    visiblePromise,
    citiesPromise,
    expiringPromise,
    activeCountsPromise,
  ]);

  const businesses = visible.businesses;
  const visibleIds = businesses.map((business) => business.id);
  const expiringRows = expiringRes.data ?? [];
  const expiringIds = expiringRows.map((row) => Number(row.business_id));
  const membershipBusinessIds = Array.from(new Set([...visibleIds, ...expiringIds]));

  const [membershipsRes, expiringBusinessesRes] = await Promise.all([
    membershipBusinessIds.length > 0
      ? supabase
          .from("business_memberships")
          .select("id,business_id,plan,status,starts_at,ends_at")
          .in("business_id", membershipBusinessIds)
          .order("ends_at", { ascending: true })
      : Promise.resolve({ data: [], error: null }),
    expiringIds.length > 0
      ? supabase.from("businesses").select(BUSINESS_SELECT).in("id", expiringIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (citiesRes.error) throw new Error(citiesRes.error.message);
  if (expiringRes.error) throw new Error(expiringRes.error.message);
  if (membershipsRes.error) throw new Error(membershipsRes.error.message);
  if (expiringBusinessesRes.error) throw new Error(expiringBusinessesRes.error.message);
  if (activeCounts[0].error) throw new Error(activeCounts[0].error.message);
  if (activeCounts[1].error) throw new Error(activeCounts[1].error.message);

  return {
    businesses,
    total: visible.total,
    memberships: mapMemberships(membershipsRes.data ?? []),
    expiringBusinesses: ((expiringBusinessesRes.data ?? []) as BusinessRow[]).map(rowToAdminBusiness),
    expiringMemberships: mapMemberships(expiringRows),
    cities: Array.from(new Set((citiesRes.data ?? []).map((row) => String(row.city)).filter(Boolean))).sort((a, b) => a.localeCompare(b, "tr")),
    activeHotels: activeCounts[0].count ?? 0,
    activeAgencies: activeCounts[1].count ?? 0,
  };
});

export const getCrmBusinessDetail = cache(async (id: number): Promise<CrmBusinessDetailData> => {
  if (!hasEnv()) {
    await connection();
    return demoDetailData(id);
  }

  const supabase = await createClient();
  const [businessRes, membershipRes, auditRes] = await Promise.all([
    supabase.from("businesses").select(BUSINESS_SELECT).eq("id", id).maybeSingle(),
    supabase
      .from("business_memberships")
      .select("id,business_id,plan,status,starts_at,ends_at")
      .eq("business_id", id)
      .order("ends_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("audit_logs")
      .select("id,admin_id,action,entity_type,entity_id,ip_address,user_agent,created_at")
      .eq("entity_type", "business")
      .eq("entity_id", String(id))
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  if (businessRes.error) throw new Error(businessRes.error.message);
  if (membershipRes.error) throw new Error(membershipRes.error.message);
  if (auditRes.error) throw new Error(auditRes.error.message);

  return {
    business: businessRes.data ? rowToAdminBusiness(businessRes.data as BusinessRow) : null,
    membership: membershipRes.data ? mapMembership(membershipRes.data) : null,
    auditLogs: mapAuditLogs(auditRes.data ?? []),
  };
});

export async function exportCrmBusinesses(filters: CrmFilters, columns: ExportColumn[], ids: number[] = []): Promise<string> {
  if (!hasEnv()) {
    await connection();
    const demo = demoListData({ ...filters, page: 1, limit: 10_000 });
    const businesses = ids.length > 0 ? demo.businesses.filter((business) => ids.includes(business.id)) : demo.businesses;
    return businessesToCsv(businesses, demo.memberships, columns);
  }

  const supabase = await createClient();
  const query = applyBusinessFilters(supabase.from("businesses").select(BUSINESS_SELECT), filters)
    .order("created_at", { ascending: false })
    .limit(10_000);
  const scopedQuery = ids.length > 0 ? query.in("id", ids) : query;
  const result = await runBusinessQuery(
    scopedQuery,
  );
  const resultIds = result.businesses.map((business) => business.id);
  const membershipsRes = resultIds.length > 0
    ? await supabase
        .from("business_memberships")
        .select("id,business_id,plan,status,starts_at,ends_at")
        .in("business_id", resultIds)
        .order("ends_at", { ascending: true })
    : { data: [], error: null };
  if (membershipsRes.error) throw new Error(membershipsRes.error.message);
  return businessesToCsv(result.businesses, mapMemberships(membershipsRes.data ?? []), columns);
}

type BusinessFilterQuery = {
  or(filter: string): BusinessFilterQuery;
  eq(column: string, value: string | number): BusinessFilterQuery;
  in(column: string, values: number[]): BusinessFilterQuery;
};

function applyBusinessFilters<T extends BusinessFilterQuery>(query: T, filters: CrmFilters): T {
  let next = query;
  if (filters.q) {
    const q = filters.q.replaceAll("%", "").replaceAll(",", " ");
    next = next.or(`name.ilike.%${q}%,type.ilike.%${q}%,city.ilike.%${q}%,district.ilike.%${q}%,website.ilike.%${q}%`) as T;
  }
  if (filters.group !== "all") next = next.eq("group", filters.group) as T;
  if (filters.city) next = next.eq("city", filters.city) as T;
  if (filters.status !== "all") next = next.eq("status", filters.status) as T;
  return next;
}

type BusinessQueryResult = PromiseLike<{
  data: unknown[] | null;
  error: { message: string } | null;
  count?: number | null;
}>;

async function runBusinessQuery(query: BusinessQueryResult): Promise<{ businesses: AdminBusiness[]; total: number }> {
  const { data, error, count } = await query;
  if (error) throw new Error(error.message);
  return {
    businesses: ((data ?? []) as BusinessRow[]).map(rowToAdminBusiness),
    total: count ?? ((data ?? []) as unknown[]).length,
  };
}

function rowToAdminBusiness(row: BusinessRow): AdminBusiness {
  return {
    id: row.id,
    group: row.group,
    type: row.type,
    name: row.name,
    country: row.country,
    city: row.city,
    district: row.district,
    coords: [Number(row.lat ?? 0), Number(row.lng ?? 0)],
    desc: row.description ?? "",
    rating: Number(row.rating),
    reviews: row.reviews,
    tag: row.tag ?? "",
    verified: row.verified,
    sponsored: row.sponsored,
    dopingUntil: row.doping_until ?? undefined,
    phone: row.phone ?? undefined,
    website: row.website ?? undefined,
    image: row.image ?? undefined,
    attributes: row.attributes ?? [],
    status: row.status,
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    seoKeywords: row.seo_keywords ?? [],
    canonicalPath: row.canonical_path ?? undefined,
    ogImage: row.og_image ?? undefined,
    createdAt: row.created_at ?? undefined,
  };
}

type MembershipRow = {
  id: number | string;
  business_id: number | string;
  plan: string | null;
  status: AdminMembership["status"] | null;
  starts_at: string;
  ends_at: string;
};

function mapMembership(row: MembershipRow): AdminMembership {
  return {
    id: Number(row.id),
    businessId: Number(row.business_id),
    plan: String(row.plan ?? "standard"),
    status: row.status ?? "active",
    startsAt: row.starts_at,
    endsAt: row.ends_at,
  };
}

function mapMemberships(rows: MembershipRow[]): AdminMembership[] {
  return rows.map(mapMembership);
}

type AuditRow = {
  id: number | string;
  admin_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

function mapAuditLogs(rows: AuditRow[]): AdminAuditLog[] {
  return rows.map((row) => ({
    id: Number(row.id),
    adminId: row.admin_id,
    action: String(row.action),
    entityType: row.entity_type,
    entityId: row.entity_id,
    ipAddress: row.ip_address,
    userAgent: row.user_agent,
    createdAt: row.created_at,
  }));
}

function demoBusinesses(): AdminBusiness[] {
  const day = 86_400_000;
  return SEED.map((business, index) => ({
    ...business,
    status: index % 7 === 0 ? "pending" : "approved",
    createdAt: new Date(Date.now() - index * day).toISOString(),
  }));
}

function demoMemberships(): AdminMembership[] {
  const day = 86_400_000;
  return [
    { id: 1, businessId: 3, plan: "standard", status: "active", startsAt: new Date(Date.now() - 351 * day).toISOString(), endsAt: new Date(Date.now() + 3 * day).toISOString() },
    { id: 2, businessId: 8, plan: "standard", status: "active", startsAt: new Date(Date.now() - 357 * day).toISOString(), endsAt: new Date(Date.now() + 8 * day).toISOString() },
    { id: 3, businessId: 12, plan: "premium", status: "active", startsAt: new Date(Date.now() - 354 * day).toISOString(), endsAt: new Date(Date.now() + 13 * day).toISOString() },
  ];
}

function demoListData(filters: CrmFilters): CrmListData {
  const allBusinesses = demoBusinesses();
  const filtered = filterBusinesses(allBusinesses, filters);
  const offset = (filters.page - 1) * filters.limit;
  const businesses = filtered.slice(offset, offset + filters.limit);
  const memberships = demoMemberships();
  return {
    businesses,
    total: filtered.length,
    memberships,
    expiringBusinesses: allBusinesses.filter((business) => memberships.some((membership) => membership.businessId === business.id)).slice(0, 4),
    expiringMemberships: memberships,
    cities: Array.from(new Set(allBusinesses.map((business) => business.city))).sort((a, b) => a.localeCompare(b, "tr")),
    activeHotels: allBusinesses.filter((business) => business.group === "konaklama" && business.status === "approved").length,
    activeAgencies: allBusinesses.filter((business) => business.group === "acente" && business.status === "approved").length,
  };
}

function demoDetailData(id: number): CrmBusinessDetailData {
  const business = demoBusinesses().find((item) => item.id === id) ?? null;
  const membership = demoMemberships().find((item) => item.businessId === id) ?? null;
  return { business, membership, auditLogs: [] };
}
