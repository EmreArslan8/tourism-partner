import { getBusinesses } from "@/lib/businesses";
import { isDoped } from "@/lib/listing";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Business } from "@/lib/types";
import type { ExploreInitialFilters } from "@/lib/explore-filters";

const MAX_SUGGESTIONS = 3;

/* Çapraz kategori öneri (Brief §7A / El Kitabı §6).
   Kullanıcı bir bölgede bir kategori ararken (ör. Kapadokya'da Otel), aranan
   kategoriden FARKLI bir kategoriden (ör. Gastronomi) aynı bölgedeki işletmeler
   önerilir. Seçim rastgeledir ancak "impression balancing" uygulanır: en az
   gösterilmiş (page_views'ta en düşük görüntülenmeli) işletmeler öne alınır, böylece
   tüm işletmeler zamanla eşit görünürlük kazanır.

   Koşullar: hem bölge (ülke) hem de aranan kategori seçili olmalı. Misafir
   kullanıcıya yalnızca dopingli/premium öneriler gösterilir. */
export async function getCrossCategorySuggestions(
  filters: ExploreInitialFilters,
  opts: { isGuest?: boolean } = {},
): Promise<Business[]> {
  // Aranan kategori yoksa "farklı kategori" tanımsızdır; bölge yoksa liste çok geniş olur.
  if (filters.groups.length === 0 || filters.country === "all") return [];

  const searched = new Set(filters.groups);
  const businesses = await getBusinesses();

  let candidates = businesses.filter(
    (b) =>
      !searched.has(b.group) &&
      b.country === filters.country &&
      (filters.city === "all" || b.city === filters.city) &&
      (filters.district === "all" || b.district === filters.district),
  );

  if (opts.isGuest) candidates = candidates.filter(isDoped);
  if (candidates.length === 0) return [];

  const counts = await getImpressionCounts(candidates.map((b) => b.id));

  // En az gösterilmiş önce; eşitlikte rastgele → dengeli rotasyon.
  const ranked = candidates
    .map((b) => ({ b, count: counts.get(b.id) ?? 0, r: Math.random() }))
    .sort((a, b) => a.count - b.count || a.r - b.r);

  return ranked.slice(0, MAX_SUGGESTIONS).map(({ b }) => b);
}

/* İşletme başına toplam görüntülenme (impression + detay ziyareti) sayısı.
   page_views yalnızca admin/service-role tarafından okunabildiğinden service-role
   client kullanılır. Anahtar yoksa boş harita döner → seçim tamamen rastgele olur. */
async function getImpressionCounts(ids: number[]): Promise<Map<number, number>> {
  const map = new Map<number, number>();
  if (ids.length === 0) return map;

  const admin = createAdminClient();
  if (!admin) return map;

  try {
    const { data, error } = await admin
      .from("page_views")
      .select("entity_id")
      .in("entity_type", ["impression", "business"])
      .in("entity_id", ids);
    if (error || !data) return map;

    for (const row of data as { entity_id: number | null }[]) {
      if (row.entity_id == null) continue;
      map.set(row.entity_id, (map.get(row.entity_id) ?? 0) + 1);
    }
  } catch {
    // sayım alınamazsa rastgele seçime düş
  }
  return map;
}
