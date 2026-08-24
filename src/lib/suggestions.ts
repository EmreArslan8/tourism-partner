import { cacheLife, cacheTag } from "next/cache";
import { getBusinesses, toListingBusiness } from "@/lib/businesses";
import { canAppearInExplore } from "@/lib/business-visibility";
import { createAdminReadClient } from "@/lib/supabase/admin";
import type { Business } from "@/lib/types";
import type { ExploreInitialFilters } from "@/lib/explore-filters";

const MAX_SUGGESTIONS = 3;
/* Aday havuzu örneklem sınırı: sayım sorguları aday başına 1 hafif HEAD count olduğundan
   üst sınır koyarız. Rastgele örneklem + "en az gösterileni seç" uzun vadede yine dengeler. */
const SAMPLE_SIZE = 24;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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

  if (opts.isGuest) candidates = candidates.filter((business) => canAppearInExplore(business, "guest"));
  if (candidates.length === 0) return [];

  const sampled =
    candidates.length > SAMPLE_SIZE ? shuffle(candidates).slice(0, SAMPLE_SIZE) : candidates;

  const counts = Object.fromEntries(
    await Promise.all(
      sampled.map(async (business) => [String(business.id), await getImpressionCount(business.id)] as const),
    ),
  );

  // En az gösterilmiş önce; eşitlikte rastgele → dengeli rotasyon.
  const ranked = sampled
    .map((b) => ({ b, count: counts[String(b.id)] ?? 0, r: Math.random() }))
    .sort((a, b) => a.count - b.count || a.r - b.r);

  // İletişim alanları istemci payload'ından çıkarılır (telefon/website yalnız detayda).
  return ranked.slice(0, MAX_SUGGESTIONS).map(({ b }) => toListingBusiness(b));
}

/* İşletme başına toplam görüntülenme (impression + detay ziyareti) sayısı.
   Satır çekmek yerine DB-tarafı exact HEAD count kullanılır — böylece PostgREST'in
   satır limiti (varsayılan 1000) sayımları sessizce kesemez ve balancing bozulmaz.
   Cache anahtarı yalnız tek işletme ID'sidir. Rastgele örneklem dizisini anahtar
   yapmak kombinasyon sayısını ve self-hosted Next.js bellek cache'ini büyütüyordu.
   page_views yalnızca admin/service-role tarafından okunabildiğinden service-role
   client kullanılır. Anahtar yoksa boş döner → seçim tamamen rastgele olur. */
async function getImpressionCountCached(id: number): Promise<number> {
  "use cache";
  cacheLife("minutes");
  cacheTag("impression-counts");

  const admin = createAdminReadClient();
  if (!admin) throw new Error("Supabase admin read client yapılandırılmamış");

  const { count, error } = await admin
    .from("page_views")
    .select("id", { count: "exact", head: true })
    .in("entity_type", ["impression", "business"])
    .eq("entity_id", id);
  if (error) throw new Error(`page_views sayımı başarısız: ${error.message}`);
  return count ?? 0;
}

async function getImpressionCount(id: number): Promise<number> {
  try {
    return await getImpressionCountCached(id);
  } catch {
    // Geçici hata sonucunu cache'lemeden rastgele seçime düş.
    return 0;
  }
}
