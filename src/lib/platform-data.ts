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
import type { CategoryGroup, GroupKey } from "@/lib/types";

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

export async function getActiveAdBanners(placement = "home"): Promise<PublicAdBanner[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("ad-banners");

  if (!hasEnv()) return [];

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("ad_banners")
      .select("id,title,image_url,target_url,placement,starts_at,ends_at")
      .eq("status", "active")
      .eq("placement", placement)
      .order("updated_at", { ascending: false })
      .limit(20);

    if (error || !data) {
      console.error("[platform-data] ad_banners okunamadı:", error?.message ?? "veri yok");
      return [];
    }

    return data.filter((row) => isActiveWindow(row));
  } catch (error) {
    console.error("[platform-data] ad_banners okunamadı:", error);
    return [];
  }
}

export type PublicPopup = Pick<
  AdminPopupRow,
  "id" | "title" | "body" | "image_url" | "cta_label" | "cta_url" | "frequency" | "target_role"
>;

/* Aktif pop-up (çerezsiz public client + 'use cache'). Hedef role: 'all' veya kullanıcının
   account_type'ı. Zaman penceresi (starts_at/ends_at) burada süzülür; ilk uygun kayıt döner. */
export async function getActivePopup(accountType?: string): Promise<PublicPopup | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("popups");

  if (!hasEnv()) return null;

  const roles = accountType ? ["all", accountType] : ["all"];
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("admin_popups")
      .select("id,title,body,image_url,cta_label,cta_url,frequency,target_role,starts_at,ends_at")
      .eq("status", "active")
      .in("target_role", roles)
      .order("updated_at", { ascending: false })
      .limit(20);

    if (error || !data) {
      if (error) console.error("[platform-data] admin_popups okunamadı:", error.message);
      return null;
    }

    const active = data.find((row) => isActiveWindow(row));
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

export async function getCategoryTree(): Promise<CategoryGroup[]> {
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
    console.error("[platform-data] categories okunamadı, fallback kullanılıyor:", error.message);
    return CATEGORY_GROUPS;
  }
  if (!data || data.length === 0) return CATEGORY_GROUPS;

  return rowsToCategoryGroups(data);
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
