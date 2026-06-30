import { cacheLife, cacheTag } from "next/cache";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import type {
  AdBannerRow,
  AdminPopupRow,
  BlogPostRow,
  CategoryRow,
  SupportTicketRow,
} from "@/lib/supabase/database.types";
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

export async function getAdminAdData(): Promise<AdminAdData> {
  if (!hasEnv()) return { banners: [], activeBanners: [] };

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

export async function getAdminSupportTickets(): Promise<AdminSupportTicket[]> {
  if (!hasEnv()) return [];

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

export async function getAdminContentExtras(): Promise<AdminContentExtras> {
  if (!hasEnv()) return { blogPosts: [], popups: [] };

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
  if (!hasEnv()) return CATEGORY_GROUPS;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id,parent_id,group_key,label,slug,sort_order,is_active,created_at,updated_at")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("label", { ascending: true });

  if (error) throw new Error(error.message);
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

  for (const row of rows) {
    if (!children.has(row.group_key)) children.set(row.group_key, []);
    if (row.parent_id === null) {
      groupLabels.set(row.group_key, row.label);
    } else {
      children.get(row.group_key)?.push({ slug: row.slug, label: row.label });
    }
  }

  return CATEGORY_GROUPS.map((fallback) => ({
    key: fallback.key,
    label: groupLabels.get(fallback.key) ?? fallback.label,
    children: children.get(fallback.key)?.length ? children.get(fallback.key)! : fallback.children,
  }));
}
