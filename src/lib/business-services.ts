import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { GroupKey } from "@/lib/types";
import { groupServiceSlugs } from "@/lib/categories";

/* business_services (M2M) okuma/yazma yardımcıları — bir işletme birden fazla alt
   kategori (hizmet) sunabilir. slug tutulur; etiket gösterimde serviceLabel ile çözülür. */

type Client = SupabaseClient<Database>;

/** Verilen işletme id'leri için hizmet slug'ları; birincil (is_primary) önce sıralanır. */
export async function getServiceSlugsByBusiness(
  supabase: Client,
  businessIds: number[],
): Promise<Map<number, string[]>> {
  const map = new Map<number, string[]>();
  if (businessIds.length === 0) return map;
  const { data } = await supabase
    .from("business_services")
    .select("business_id,service_slug,is_primary")
    .in("business_id", businessIds)
    .order("is_primary", { ascending: false })
    .order("id", { ascending: true });
  for (const row of data ?? []) {
    const list = map.get(row.business_id) ?? [];
    list.push(row.service_slug);
    map.set(row.business_id, list);
  }
  return map;
}

/** Tek işletmenin hizmet slug'ları (birincil önce). */
export async function getServiceSlugs(supabase: Client, businessId: number): Promise<string[]> {
  return (await getServiceSlugsByBusiness(supabase, [businessId])).get(businessId) ?? [];
}

/** Bir işletmenin hizmetlerini verilen slug listesine göre yeniden yazar (replace).
    İlk slug birincil olur. Geçersiz veya gruba ait olmayan slug'lar elenir. */
export async function replaceBusinessServices(
  supabase: Client,
  businessId: number,
  group: GroupKey,
  slugs: string[],
): Promise<void> {
  const allowed = groupServiceSlugs(group);
  const clean = [...new Set(slugs.filter((slug) => allowed.has(slug)))];

  await supabase.from("business_services").delete().eq("business_id", businessId);
  if (clean.length === 0) return;

  const rows = clean.map((slug, index) => ({
    business_id: businessId,
    group_key: group,
    service_slug: slug,
    is_primary: index === 0,
  }));
  await supabase.from("business_services").insert(rows);
}
