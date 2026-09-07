import { countQuoteResponses, quoteRequestKey, type RequestStatus } from "@/lib/quote-workflow";
import { cacheLife, cacheTag } from "next/cache";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { getAdminAccess } from "@/lib/admin-auth";
import { createReadOnlyClient as createClient } from "@/lib/supabase/read-only-server";
import { createPublicClient } from "@/lib/supabase/public";
import { cleanHttpUrl } from "@/lib/actions/validate";
import type {
  AdBannerRow,
  AdminPopupRow,
  B2BRequestStatus,
  B2BDealStatus,
  BusinessGroup,
  BlogPostRow,
  CategoryRow,
  SupportTicketRow,
  SupportTicketMessageRow,
} from "@/lib/supabase/database.types";

export type AdminB2bRequest = {
  id: number;
  businessId: number | null;
  businessName: string | null;
  title: string;
  description: string | null;
  region: string | null;
  status: B2BRequestStatus;
  viewCount: number;
  moderationNote: string | null;
  createdAt: string;
};

export type AdminB2bRequestBusiness = {
  id: number;
  name: string;
  group: BusinessGroup;
  type: string;
  country: string;
  city: string;
  district: string;
  phone: string | null;
  website: string | null;
};

export type AdminB2bOffer = {
  id: number;
  businessId: number;
  business: Pick<AdminB2bRequestBusiness, "id" | "name" | "group" | "type" | "country" | "city"> | null;
  message: string;
  price: string | null;
  createdAt: string;
};

export type AdminB2bRequestDetail = AdminB2bRequest & {
  targetGroup: BusinessGroup | null;
  targetTypes: string[];
  updatedAt: string;
  business: AdminB2bRequestBusiness | null;
  offers: AdminB2bOffer[];
};

export type AdminQuoteResponse = {
  id: number;
  businessId: number;
  business: Pick<AdminB2bRequestBusiness, "id" | "name" | "group" | "type" | "country" | "city"> | null;
  message: string;
  emailStatus: string;
  emailSentAt: string | null;
  lastError: string | null;
  createdAt: string;
};

export type AdminQuoteDetail = AdminQuote & {
  reviewStatus: RequestStatus;
  reviewNote: string | null;
  reviewUpdatedAt: string | null;
  targets: { quoteId: number; business: AdminB2bRequestBusiness | null; status: string; internalNote: string | null; responseCount: number }[];
  business: AdminB2bRequestBusiness | null;
  responses: AdminQuoteResponse[];
};

/* Form talebinin admin listesi kaydı: fan-out satırları tek talepte toplanmış hâli. */
export type AdminQuoteRequest = {
  key: string;
  /** Detay linki için kullanılan satır (gruptaki en küçük id). */
  primaryId: number;
  /** Bu gönderimin yazdığı tüm quotes satırları. */
  ids: number[];
  reviewStatus: RequestStatus;
  targets: { id: number; name: string }[];
  responseCount: number;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  service: string | null;
  categoryGroup: string | null;
  categoryType: string | null;
  country: string | null;
  city: string | null;
  district: string | null;
  dateRange: string | null;
  validUntil: string | null;
  people: number | null;
  message: string | null;
  createdAt: string;
};

/* Tedarikçinin verdiği teklif — kaynağı ne olursa olsun aynı şekil. */
export type AdminOffer = {
  source: "quote" | "b2b";
  id: number;
  requestId: number;
  requestLabel: string;
  businessId: number;
  business: { id: number; name: string } | null;
  message: string;
  price: string | null;
  emailStatus: string | null;
  createdAt: string;
};
import type { AdminQuote, CategoryGroup, GroupKey } from "@/lib/types";

const hasEnv = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type PublicAdBanner = Pick<
  AdBannerRow,
  "id" | "title" | "image_url" | "target_url" | "placement" | "starts_at" | "ends_at"
>;

export type AdminAdData = {
  banners: AdBannerRow[];
  activeBanners: AdBannerRow[];
};

export type AdminContentExtras = {
  blogPosts: BlogPostRow[];
  popups: AdminPopupRow[];
};

export type AdminSupportTicket = SupportTicketRow;

function isActiveWindow(
  row: { starts_at: string | null; ends_at: string | null },
  now = Date.now(),
): boolean {
  const starts = row.starts_at ? new Date(row.starts_at).getTime() : null;
  const ends = row.ends_at ? new Date(row.ends_at).getTime() : null;
  if (starts !== null && starts > now) return false;
  if (ends !== null && ends < now) return false;
  return true;
}

async function getAdBannerCandidates(placement: string): Promise<PublicAdBanner[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("ad-banners");

  if (!hasEnv()) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("ad_banners")
    .select("id,title,image_url,target_url,placement,starts_at,ends_at")
    .eq("status", "active")
    .eq("placement", placement)
    .order("updated_at", { ascending: false })
    .limit(20);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getActiveAdBanners(placement = "home"): Promise<PublicAdBanner[]> {
  try {
    const candidates = await getAdBannerCandidates(placement);
    return candidates.filter((row) => isActiveWindow(row));
  } catch (error) {
    console.error("[platform-data] ad_banners okunamadı:", error);
    return [];
  }
}

export type PublicPopup = Pick<
  AdminPopupRow,
  "id" | "title" | "body" | "image_url" | "cta_label" | "cta_url" | "frequency" | "target_role"
>;

type PublicPopupCandidate = PublicPopup & Pick<AdminPopupRow, "starts_at" | "ends_at">;

/* Aktif pop-up (çerezsiz public client + 'use cache'). Hedef role: 'all' veya kullanıcının
   account_type'ı. Zaman penceresi (starts_at/ends_at) burada süzülür; ilk uygun kayıt döner. */
async function getPopupCandidates(accountType?: string): Promise<PublicPopupCandidate[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("popups");

  if (!hasEnv()) return [];

  const roles = accountType ? ["all", accountType] : ["all"];
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("admin_popups")
    .select("id,title,body,image_url,cta_label,cta_url,frequency,target_role,starts_at,ends_at")
    .eq("status", "active")
    .in("target_role", roles)
    .order("updated_at", { ascending: false })
    .limit(20);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getActivePopup(accountType?: string): Promise<PublicPopup | null> {
  try {
    const candidates = await getPopupCandidates(accountType);
    const active = candidates.find((row) => isActiveWindow(row));
    if (!active) return null;
    return {
      id: active.id,
      title: active.title,
      body: active.body,
      image_url: active.image_url,
      cta_label: active.cta_label,
      // Admin girdisi olsa da href'e ham basılmaz — javascript: vb. şemalar süzülür.
      cta_url: cleanHttpUrl(active.cta_url),
      frequency: active.frequency,
      target_role: active.target_role,
    };
  } catch (error) {
    console.error("[platform-data] admin_popups okunamadı:", error);
    return null;
  }
}

export async function getAdminAdData(): Promise<AdminAdData> {
  if (!hasEnv()) return { banners: [], activeBanners: [] };
  const access = await getAdminAccess();
  if (!access.isAdmin) return { banners: [], activeBanners: [] };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ad_banners")
    .select("id,title,image_url,target_url,placement,status,starts_at,ends_at,created_at,updated_at")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);

  const banners = data ?? [];
  return {
    banners,
    activeBanners: banners.filter((row) => row.status === "active" && isActiveWindow(row)),
  };
}

/* B2B Talepler (İlan Denetimi) — acentelerin açtığı talepler + oluşturan işletme adı.
   Admin izleme/moderasyon için; RLS "admin manage b2b requests" ile korunur. */
export async function getAdminB2bRequests(): Promise<AdminB2bRequest[]> {
  if (!hasEnv()) return [];
  const access = await getAdminAccess();
  if (!access.isAdmin) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("b2b_requests")
    .select("id,business_id,title,description,region,status,view_count,moderation_note,created_at,businesses(name)")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);

  type Row = {
    id: number;
    business_id: number | null;
    title: string;
    description: string | null;
    region: string | null;
    status: B2BRequestStatus;
    view_count: number;
    moderation_note: string | null;
    created_at: string;
    businesses: { name: string } | { name: string }[] | null;
  };
  return ((data ?? []) as unknown as Row[]).map((r) => ({
    id: r.id,
    businessId: r.business_id,
    businessName: Array.isArray(r.businesses) ? r.businesses[0]?.name ?? null : r.businesses?.name ?? null,
    title: r.title,
    description: r.description,
    region: r.region,
    status: r.status,
    viewCount: r.view_count,
    moderationNote: r.moderation_note,
    createdAt: r.created_at,
  }));
}

/* Fırsat ilanları (b2b_deals) admin listesi. */
export type AdminB2bDeal = {
  id: number;
  businessId: number;
  businessName: string | null;
  title: string;
  description: string | null;
  region: string | null;
  price: string | null;
  capacity: number | null;
  validUntil: string | null;
  status: B2BDealStatus;
  viewCount: number;
  interestCount: number;
  sourceRequestId: number | null;
  moderationNote: string | null;
  createdAt: string;
};

export async function getAdminB2bDeals(): Promise<AdminB2bDeal[]> {
  if (!hasEnv()) return [];
  const access = await getAdminAccess();
  if (!access.isAdmin) return [];

  const supabase = await createClient();
  const [dealsResult, interestsResult] = await Promise.all([
    supabase
      .from("b2b_deals")
      .select("id,business_id,title,description,country,city,district,price,capacity,valid_until,status,view_count,moderation_note,source_request_id,created_at,businesses(name)")
      .order("created_at", { ascending: false })
      .limit(500),
    supabase.from("b2b_deal_interests").select("deal_id").limit(5000),
  ]);
  if (dealsResult.error) throw new Error(dealsResult.error.message);
  if (interestsResult.error) throw new Error(interestsResult.error.message);

  const interestCounts = new Map<number, number>();
  for (const row of (interestsResult.data ?? []) as { deal_id: number }[]) {
    interestCounts.set(row.deal_id, (interestCounts.get(row.deal_id) ?? 0) + 1);
  }

  type Row = {
    id: number;
    business_id: number;
    title: string;
    description: string | null;
    country: string | null;
    city: string | null;
    district: string | null;
    price: string | null;
    capacity: number | null;
    valid_until: string | null;
    status: B2BDealStatus;
    view_count: number;
    moderation_note: string | null;
    source_request_id: number | null;
    created_at: string;
    businesses: { name: string } | { name: string }[] | null;
  };
  return ((dealsResult.data ?? []) as unknown as Row[]).map((d) => ({
    id: d.id,
    businessId: d.business_id,
    businessName: Array.isArray(d.businesses) ? d.businesses[0]?.name ?? null : d.businesses?.name ?? null,
    title: d.title,
    description: d.description,
    region: [d.country, d.city, d.district].filter(Boolean).join(" / ") || null,
    price: d.price,
    capacity: d.capacity,
    validUntil: d.valid_until,
    status: d.status,
    viewCount: d.view_count,
    interestCount: interestCounts.get(d.id) ?? 0,
    sourceRequestId: d.source_request_id,
    moderationNote: d.moderation_note,
    createdAt: d.created_at,
  }));
}

/* Tek fırsat ilanının admin görünümü — ilan + yayınlayan + ilgilenen firmalar. */
export type AdminB2bDealBusiness = {
  id: number;
  name: string;
  group: BusinessGroup;
  type: string;
  country: string | null;
  city: string | null;
  district: string | null;
  phone: string | null;
  website: string | null;
};

export type AdminB2bDealDetail = Omit<AdminB2bDeal, "businessName" | "interestCount"> & {
  groupKey: BusinessGroup | null;
  types: string[];
  validFrom: string | null;
  updatedAt: string;
  business: AdminB2bDealBusiness | null;
  interests: {
    id: number;
    message: string | null;
    createdAt: string;
    business: Pick<AdminB2bDealBusiness, "id" | "name" | "type" | "city" | "phone"> | null;
  }[];
};

export async function getAdminB2bDealDetail(id: number): Promise<AdminB2bDealDetail | null> {
  if (!hasEnv() || !Number.isInteger(id) || id < 1) return null;
  const access = await getAdminAccess();
  if (!access.isAdmin) return null;

  const supabase = await createClient();
  const [dealResult, interestsResult] = await Promise.all([
    supabase
      .from("b2b_deals")
      .select("id,business_id,title,description,group_key,types,country,city,district,price,capacity,valid_from,valid_until,status,view_count,moderation_note,source_request_id,created_at,updated_at,businesses(id,name,group,type,country,city,district,phone,website)")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("b2b_deal_interests")
      .select("id,message,created_at,businesses(id,name,type,city,phone)")
      .eq("deal_id", id)
      .order("created_at", { ascending: false }),
  ]);
  if (dealResult.error) throw new Error(dealResult.error.message);
  if (interestsResult.error) throw new Error(interestsResult.error.message);
  if (!dealResult.data) return null;

  const one = <T,>(value: T | T[] | null): T | null => (Array.isArray(value) ? value[0] ?? null : value);
  const row = dealResult.data as unknown as {
    id: number;
    business_id: number;
    title: string;
    description: string | null;
    group_key: BusinessGroup | null;
    types: string[];
    country: string | null;
    city: string | null;
    district: string | null;
    price: string | null;
    capacity: number | null;
    valid_from: string | null;
    valid_until: string | null;
    status: B2BDealStatus;
    view_count: number;
    moderation_note: string | null;
    source_request_id: number | null;
    created_at: string;
    updated_at: string;
    businesses: AdminB2bDealBusiness | AdminB2bDealBusiness[] | null;
  };
  type InterestRow = {
    id: number;
    message: string | null;
    created_at: string;
    businesses: Pick<AdminB2bDealBusiness, "id" | "name" | "type" | "city" | "phone"> | Pick<AdminB2bDealBusiness, "id" | "name" | "type" | "city" | "phone">[] | null;
  };

  return {
    id: row.id,
    businessId: row.business_id,
    title: row.title,
    description: row.description,
    groupKey: row.group_key,
    types: row.types ?? [],
    region: [row.country, row.city, row.district].filter(Boolean).join(" / ") || null,
    price: row.price,
    capacity: row.capacity,
    validFrom: row.valid_from,
    validUntil: row.valid_until,
    status: row.status,
    viewCount: row.view_count,
    moderationNote: row.moderation_note,
    sourceRequestId: row.source_request_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    business: one(row.businesses),
    interests: ((interestsResult.data ?? []) as unknown as InterestRow[]).map((i) => ({
      id: i.id,
      message: i.message,
      createdAt: i.created_at,
      business: one(i.businesses),
    })),
  };
}

/* Tek B2B talebinin tam admin görünümü. Talep ve teklifleri iki sorguda yükler;
   böylece teklif olmayan talepler de eksiksiz döner. */
export async function getAdminB2bRequestDetail(id: number): Promise<AdminB2bRequestDetail | null> {
  if (!hasEnv() || !Number.isInteger(id) || id < 1) return null;
  const access = await getAdminAccess();
  if (!access.isAdmin) return null;

  const supabase = await createClient();
  const [requestResult, offersResult] = await Promise.all([
    supabase
      .from("b2b_requests")
      .select(
        "id,business_id,title,description,region,target_group,target_types,status,view_count,moderation_note,created_at,updated_at,businesses(id,name,group,type,country,city,district,phone,website)",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("b2b_offers")
      .select("id,business_id,message,price,created_at,businesses(id,name,group,type,country,city)")
      .eq("request_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (requestResult.error) throw new Error(requestResult.error.message);
  if (offersResult.error) throw new Error(offersResult.error.message);
  if (!requestResult.data) return null;

  type BusinessRelation = AdminB2bRequestBusiness | AdminB2bRequestBusiness[] | null;
  type OfferBusiness = Pick<AdminB2bRequestBusiness, "id" | "name" | "group" | "type" | "country" | "city">;
  type OfferRow = {
    id: number;
    business_id: number;
    message: string;
    price: string | null;
    created_at: string;
    businesses: OfferBusiness | OfferBusiness[] | null;
  };
  type RequestRow = {
    id: number;
    business_id: number | null;
    title: string;
    description: string | null;
    region: string | null;
    target_group: BusinessGroup | null;
    target_types: string[];
    status: B2BRequestStatus;
    view_count: number;
    moderation_note: string | null;
    created_at: string;
    updated_at: string;
    businesses: BusinessRelation;
  };

  const row = requestResult.data as unknown as RequestRow;
  const business = Array.isArray(row.businesses) ? row.businesses[0] ?? null : row.businesses;
  const offers = ((offersResult.data ?? []) as unknown as OfferRow[]).map((offer) => ({
    id: offer.id,
    businessId: offer.business_id,
    business: Array.isArray(offer.businesses) ? offer.businesses[0] ?? null : offer.businesses,
    message: offer.message,
    price: offer.price,
    createdAt: offer.created_at,
  }));

  return {
    id: row.id,
    businessId: row.business_id,
    businessName: business?.name ?? null,
    title: row.title,
    description: row.description,
    region: row.region,
    targetGroup: row.target_group,
    targetTypes: row.target_types ?? [],
    status: row.status,
    viewCount: row.view_count,
    moderationNote: row.moderation_note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    business,
    offers,
  };
}

export async function getAdminSupportTickets(): Promise<AdminSupportTicket[]> {
  if (!hasEnv()) return [];
  const access = await getAdminAccess();
  if (!access.isAdmin) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .select(
      "id,sender_name,sender_email,business_id,subject,message,status,assigned_admin_id,resolved_at,created_at,updated_at",
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw new Error(error.message);
  return data ?? [];
}

/* Birden çok talebin mesajlarını tek sorguda çekip ticket_id'ye göre gruplar —
   admin destek listesinde her satırın yazışmasını N+1 olmadan yüklemek için. */
export async function getSupportMessagesByTickets(
  ticketIds: number[],
): Promise<Record<number, SupportTicketMessageRow[]>> {
  if (!hasEnv() || ticketIds.length === 0) return {};
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("support_ticket_messages")
    .select("id,ticket_id,author_id,author_name,body,created_at")
    .in("ticket_id", ticketIds)
    .order("created_at", { ascending: true });
  if (error) return {};
  const grouped: Record<number, SupportTicketMessageRow[]> = {};
  for (const m of data ?? []) (grouped[m.ticket_id] ??= []).push(m);
  return grouped;
}

/* İşleme alınmamış ("new") destek talebi sayısı — admin panelde rozet/badge için.
   Layout zaten admin erişimini doğruladığı için burada tekrar kontrol edilmez. */
export async function getNewSupportTicketCount(): Promise<number> {
  if (!hasEnv()) return 0;
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("support_tickets")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");
  if (error) return 0;
  return count ?? 0;
}

/* Denetlenmemiş yeni B2B talebi sayısı: yayında olup henüz moderasyon notu
   girilmemiş (admin dokunmamış) ilanlar. Bildirim zili bunu gösterir. */
export async function getNewB2bRequestCount(): Promise<number> {
  if (!hasEnv()) return 0;
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("b2b_requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "published")
    .is("moderation_note", null);
  if (error) return 0;
  return count ?? 0;
}

export async function getAdminContentExtras(): Promise<AdminContentExtras> {
  if (!hasEnv()) return { blogPosts: [], popups: [] };
  const access = await getAdminAccess();
  if (!access.isAdmin) return { blogPosts: [], popups: [] };

  const supabase = await createClient();
  const [blogRes, popupRes] = await Promise.all([
    supabase
      .from("blog_posts")
      .select(
        "id,locale,slug,title,excerpt,body,category,cover_image,status,seo_title,seo_description,published_at,created_at,updated_at",
      )
      .order("updated_at", { ascending: false })
      .limit(50),
    supabase
      .from("admin_popups")
      .select(
        "id,title,body,image_url,cta_label,cta_url,target_role,frequency,status,starts_at,ends_at,created_at,updated_at",
      )
      .order("updated_at", { ascending: false })
      .limit(50),
  ]);

  if (blogRes.error) throw new Error(blogRes.error.message);
  if (popupRes.error) throw new Error(popupRes.error.message);

  return {
    blogPosts: blogRes.data ?? [],
    popups: popupRes.data ?? [],
  };
}

async function getCategoryTreeCached(): Promise<CategoryGroup[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");

  if (!hasEnv()) return CATEGORY_GROUPS;

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id,parent_id,group_key,label,slug,sort_order,is_active,created_at,updated_at")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("label", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  if (!data || data.length === 0) return CATEGORY_GROUPS;

  return rowsToCategoryGroups(data);
}

export async function getCategoryTree(): Promise<CategoryGroup[]> {
  try {
    return await getCategoryTreeCached();
  } catch (error) {
    console.error("[platform-data] categories okunamadı, fallback kullanılıyor:", error);
    return CATEGORY_GROUPS;
  }
}

export type AdminCategoryChild = { id: number; label: string; slug: string };
export type AdminCategoryGroup = { key: GroupKey; label: string; children: AdminCategoryChild[] };

/* Admin yönetimi için DB kategorileri (id'li) — her 5 grup için, çocuklar DB satırları.
   DB'de o grubun çocuğu yoksa children boş döner (yönetilecek kayıt yok). */
export async function getAdminCategoryGroups(): Promise<AdminCategoryGroup[]> {
  const base = CATEGORY_GROUPS.map((g) => ({ key: g.key, label: g.label, children: [] as AdminCategoryChild[] }));
  if (!hasEnv()) return base;
  const access = await getAdminAccess();
  if (!access.isAdmin) return base;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id,parent_id,group_key,label,slug,sort_order")
    .order("sort_order", { ascending: true })
    .order("label", { ascending: true });
  if (error) throw new Error(error.message);

  const byKey = new Map(base.map((g) => [g.key, g]));
  for (const row of data ?? []) {
    const g = byKey.get(row.group_key);
    if (!g) continue;
    if (row.parent_id === null) g.label = row.label; // kök → grup etiketi
    else g.children.push({ id: Number(row.id), label: row.label, slug: row.slug });
  }
  return base;
}

function rowsToCategoryGroups(rows: CategoryRow[]): CategoryGroup[] {
  const groupLabels = new Map<GroupKey, string>();
  const children = new Map<GroupKey, CategoryGroup["children"]>();
  const databaseRoots = new Set<GroupKey>();

  for (const row of rows) {
    if (!children.has(row.group_key)) children.set(row.group_key, []);
    if (row.parent_id === null) {
      databaseRoots.add(row.group_key);
      groupLabels.set(row.group_key, row.label);
    } else {
      children.get(row.group_key)?.push({ slug: row.slug, label: row.label });
    }
  }

  return CATEGORY_GROUPS.map((fallback) => ({
    key: fallback.key,
    label: groupLabels.get(fallback.key) ?? fallback.label,
    children: databaseRoots.has(fallback.key) ? (children.get(fallback.key) ?? []) : fallback.children,
  }));
}

/* Tek teklif talebinin (quotes) tam admin görünümü. Talep, hedef işletme ve
   tedarikçi yanıtları (quote_responses) tek ekranda incelenebilsin diye iki
   sorguda yüklenir; yanıtı olmayan talepler de eksiksiz döner. */
export async function getAdminQuoteDetail(id: number): Promise<AdminQuoteDetail | null> {
  if (!hasEnv() || !Number.isInteger(id) || id < 1) return null;
  const access = await getAdminAccess();
  if (!access.isAdmin) return null;

  const supabase = await createClient();
  const { data: seed, error: seedError } = await supabase.from("quotes")
    .select("email,created_at").eq("id", id).maybeSingle();
  if (seedError) throw new Error(seedError.message);
  if (!seed) return null;
  const [groupResult, reviewResult] = await Promise.all([
    supabase.from("quotes").select(
      "id,business_id,name,company,email,phone,service,category_group,category_type,country,city,district,date_range,valid_until,people,message,status,internal_note,created_at,businesses(id,name,group,type,country,city,district,phone,website)",
    ).eq("email", seed.email).eq("created_at", seed.created_at).order("id"),
    supabase.from("quote_request_reviews").select("status,internal_note,updated_at")
      .eq("email", seed.email).eq("submitted_at", seed.created_at).maybeSingle(),
  ]);
  if (groupResult.error) throw new Error(groupResult.error.message);
  if (reviewResult.error) throw new Error(reviewResult.error.message);
  if (!groupResult.data?.length) return null;
  const responsesResult = await supabase.from("quote_responses")
    .select("id,quote_id,business_id,message,email_status,email_sent_at,last_error,created_at,businesses(id,name,group,type,country,city)")
    .in("quote_id", groupResult.data.map((target) => target.id))
    .order("created_at", { ascending: false });
  if (responsesResult.error) throw new Error(responsesResult.error.message);

  type QuoteBusiness = AdminB2bRequestBusiness;
  type ResponderBusiness = Pick<AdminB2bRequestBusiness, "id" | "name" | "group" | "type" | "country" | "city">;
  type ResponseRow = {
    id: number;
    business_id: number;
    message: string;
    email_status: string;
    email_sent_at: string | null;
    last_error: string | null;
    created_at: string;
    businesses: ResponderBusiness | ResponderBusiness[] | null;
  };
  type QuoteRow = {
    id: number;
    business_id: number | null;
    name: string;
    company: string | null;
    email: string;
    phone: string | null;
    service: string | null;
    category_group: string | null;
    category_type: string | null;
    country: string | null;
    city: string | null;
    district: string | null;
    date_range: string | null;
    valid_until: string | null;
    people: number | null;
    message: string | null;
    status: string;
    internal_note: string | null;
    created_at: string;
    businesses: QuoteBusiness | QuoteBusiness[] | null;
  };

  const group = groupResult.data as unknown as QuoteRow[];
  const row = group[0];
  const responseCounts = countQuoteResponses(responsesResult.data ?? []);
  const business = Array.isArray(row.businesses) ? row.businesses[0] ?? null : row.businesses;
  const responses = ((responsesResult.data ?? []) as unknown as ResponseRow[]).map((response) => ({
    id: response.id,
    businessId: response.business_id,
    business: Array.isArray(response.businesses) ? response.businesses[0] ?? null : response.businesses,
    message: response.message,
    emailStatus: response.email_status,
    emailSentAt: response.email_sent_at,
    lastError: response.last_error,
    createdAt: response.created_at,
  }));

  return {
    id: row.id,
    businessId: row.business_id,
    name: row.name,
    company: row.company,
    email: row.email,
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
    business,
    responses,
    reviewStatus: reviewResult.data?.status ?? "new",
    reviewNote: reviewResult.data?.internal_note ?? null,
    reviewUpdatedAt: reviewResult.data?.updated_at ?? null,
    targets: group.map((target) => ({
      quoteId: target.id,
      business: Array.isArray(target.businesses) ? target.businesses[0] ?? null : target.businesses,
      status: target.status ?? "new",
      internalNote: target.internal_note,
      responseCount: responseCounts.get(target.id) ?? 0,
    })),
  };
}

/* Form talebi (quotes) admin listesi. Tek bir form gönderimi hedeflenen her
   tedarikçi için ayrı satır yazar (bkz. actions/quote.ts fan-out); admin'de bu
   N satır TEK talep olarak görünmeli. Aynı gönderim e-posta + created_at ile
   gruplanır, hedef işletmeler ve satır durumları tek kayıtta toplanır. */
export async function getAdminQuoteRequests(): Promise<AdminQuoteRequest[]> {
  if (!hasEnv()) return [];
  const access = await getAdminAccess();
  if (!access.isAdmin) return [];

  const supabase = await createClient();
  const [quotesResult, responsesResult] = await Promise.all([
    supabase
      .from("quotes")
      .select(
        "id,business_id,name,company,email,phone,service,category_group,category_type,country,city,district,date_range,valid_until,people,message,status,created_at,businesses(id,name)",
      )
      .order("created_at", { ascending: false })
      .limit(500),
    supabase.from("quote_responses").select("quote_id"),
  ]);

  if (quotesResult.error) throw new Error(quotesResult.error.message);
  if (responsesResult.error) throw new Error(responsesResult.error.message);

  type Target = { id: number; name: string };
  type Row = {
    id: number;
    business_id: number | null;
    name: string;
    company: string | null;
    email: string;
    phone: string | null;
    service: string | null;
    category_group: string | null;
    category_type: string | null;
    country: string | null;
    city: string | null;
    district: string | null;
    date_range: string | null;
    valid_until: string | null;
    people: number | null;
    message: string | null;
    status: string | null;
    created_at: string;
    businesses: Target | Target[] | null;
  };

  const responseCounts = countQuoteResponses(responsesResult.data ?? []);
  const emails = [...new Set((quotesResult.data ?? []).map((row) => row.email))];
  const reviewsResult = emails.length
    ? await supabase.from("quote_request_reviews").select("email,submitted_at,status").in("email", emails)
    : { data: [], error: null };
  if (reviewsResult.error) throw new Error(reviewsResult.error.message);
  const reviews = new Map((reviewsResult.data ?? []).map((review) => [quoteRequestKey(review.email, review.submitted_at), review.status]));

  const groups = new Map<string, AdminQuoteRequest>();
  for (const row of (quotesResult.data ?? []) as unknown as Row[]) {
    const key = quoteRequestKey(row.email, row.created_at);
    const target = Array.isArray(row.businesses) ? row.businesses[0] ?? null : row.businesses;
    const existing = groups.get(key);
    if (existing) {
      existing.ids.push(row.id);
      if (target) existing.targets.push(target);
      existing.responseCount += responseCounts.get(row.id) ?? 0;
      continue;
    }
    groups.set(key, {
      key,
      primaryId: row.id,
      ids: [row.id],
      reviewStatus: reviews.get(key) ?? "new",
      targets: target ? [target] : [],
      responseCount: responseCounts.get(row.id) ?? 0,
      name: row.name,
      company: row.company,
      email: row.email,
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
      createdAt: row.created_at,
    });
  }

  /* Gruptaki en küçük id detay linki olsun — fan-out satırları arasında sabit kalır. */
  return [...groups.values()].map((group) => ({
    ...group,
    primaryId: Math.min(...group.ids),
  }));
}

/* Tedarikçilerin verdiği GERÇEK teklifler: hem form talebine yanıtlar
   (quote_responses) hem de B2B ilana verilen teklifler (b2b_offers) tek listede. */
export async function getAdminOffers(): Promise<AdminOffer[]> {
  if (!hasEnv()) return [];
  const access = await getAdminAccess();
  if (!access.isAdmin) return [];

  const supabase = await createClient();
  const [responsesResult, offersResult] = await Promise.all([
    supabase
      .from("quote_responses")
      .select("id,quote_id,business_id,message,email_status,created_at,businesses(id,name),quotes(id,name,company,service)")
      .order("created_at", { ascending: false })
      .limit(300),
    supabase
      .from("b2b_offers")
      .select("id,request_id,business_id,message,price,created_at,businesses(id,name),b2b_requests(id,title)")
      .order("created_at", { ascending: false })
      .limit(300),
  ]);

  if (responsesResult.error) throw new Error(responsesResult.error.message);
  if (offersResult.error) throw new Error(offersResult.error.message);

  type Named = { id: number; name: string };
  const one = <T,>(value: T | T[] | null): T | null =>
    Array.isArray(value) ? value[0] ?? null : value;

  type ResponseRow = {
    id: number;
    quote_id: number;
    business_id: number;
    message: string;
    email_status: string;
    created_at: string;
    businesses: Named | Named[] | null;
    quotes: { id: number; name: string; company: string | null; service: string | null } | { id: number; name: string; company: string | null; service: string | null }[] | null;
  };
  type OfferRow = {
    id: number;
    request_id: number;
    business_id: number;
    message: string;
    price: string | null;
    created_at: string;
    businesses: Named | Named[] | null;
    b2b_requests: { id: number; title: string } | { id: number; title: string }[] | null;
  };

  const fromResponses = ((responsesResult.data ?? []) as unknown as ResponseRow[]).map((row) => {
    const quote = one(row.quotes);
    return {
      source: "quote" as const,
      id: row.id,
      requestId: row.quote_id,
      requestLabel: quote?.service || quote?.company || quote?.name || `Talep #${row.quote_id}`,
      business: one(row.businesses),
      businessId: row.business_id,
      message: row.message,
      price: null,
      emailStatus: row.email_status,
      createdAt: row.created_at,
    };
  });

  const fromOffers = ((offersResult.data ?? []) as unknown as OfferRow[]).map((row) => ({
    source: "b2b" as const,
    id: row.id,
    requestId: row.request_id,
    requestLabel: one(row.b2b_requests)?.title ?? `İlan #${row.request_id}`,
    business: one(row.businesses),
    businessId: row.business_id,
    message: row.message,
    price: row.price,
    emailStatus: null,
    createdAt: row.created_at,
  }));

  return [...fromResponses, ...fromOffers].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
