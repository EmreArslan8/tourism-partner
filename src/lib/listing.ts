/* Keşfet liste mantığı — SAF fonksiyonlar (UI/state'ten bağımsız, test edilebilir).
   ListingView yalnızca state tutar; süzme/sıralama/skor burada yaşar. */
import type { Business, Sort, ListingFilters } from "./types";
import { attrsPass } from "./facets";
import { CATEGORY_GROUPS, serviceLabel } from "./categories";
import { normalizeTr } from "./utils";
import { isPremiumVisible, premiumVisibilityRank } from "./business-visibility";

/* Kullanıcının doğal cümlesinde sonuç kümesini daraltmaması gereken yardımcı
   kelimeler. Konum/kategori/hizmet/işletme kelimeleri ise AND mantığıyla eşleşir. */
const QUERY_STOP_WORDS = new Set([
  "ara", "arama", "ariyorum", "ariyoruz", "bul", "bulur", "bulmak",
  "goster", "gosterir", "istiyorum", "istiyoruz", "lazim", "icin", "bir",
  "bana", "bize", "olan", "var", "nerede", "da", "de", "ta", "te",
  "find", "show", "search", "looking", "for", "need", "a", "an", "the", "in",
]);

const GROUP_ALIASES: Record<Business["group"], string[]> = {
  konaklama: ["otel", "hotels", "hotel", "accommodation", "lodging", "stay"],
  acente: ["acente", "ajans", "agency", "travel agency", "tour operator"],
  ulasim: ["ulasim", "transfer", "transport", "transportation", "arac", "car"],
  rehber: ["rehber", "rehberlik", "guide", "guiding"],
  aktivite: ["aktivite", "etkinlik", "eglence", "activity", "activities", "entertainment"],
  saglik: ["saglik", "klinik", "hastane", "health", "clinic", "hospital", "medical"],
  gastronomi: ["gastronomi", "restoran", "yemek", "gastronomy", "restaurant", "food"],
};

const GROUP_SEARCH_TEXT = new Map(
  CATEGORY_GROUPS.map((group) => [
    group.key,
    normalizeTr([
      group.key,
      group.label,
      ...GROUP_ALIASES[group.key],
      ...group.children.flatMap((child) => [child.slug, child.label, child.section ?? ""]),
    ].join(" ")),
  ]),
);

function queryTokens(rawQuery: string): string[] {
  return [...new Set(
    normalizeTr(rawQuery)
      .split(/[^\p{L}\p{N}]+/u)
      .filter((token) => token.length > 1 && !QUERY_STOP_WORDS.has(token)),
  )];
}

/* Basit Türkçe ek toleransı: "Mısır'da / Mısırdaki" ve "oteller / oteli"
   gibi kullanımları kök sözcükle eşleştirir. Çok kısa kelimelerde yanlış eşleşmeyi
   önlemek için yalnızca 4+ karakterli alan sözcüklerinde uygulanır. */
function searchTextMatches(text: string, token: string): boolean {
  if (text.includes(token)) return true;
  if (token.length < 4) return false;
  return text
    .split(/[^\p{L}\p{N}]+/u)
    .some((word) => word.length >= 4 && token.startsWith(word));
}

function searchableFields(b: Business): { text: string; weight: number }[] {
  return [
    { text: normalizeTr(b.name), weight: 4 },
    {
      text: normalizeTr([
        b.type,
        ...(b.serviceTypes ?? []).map(serviceLabel),
      ].join(" ")),
      weight: 3,
    },
    { text: GROUP_SEARCH_TEXT.get(b.group) ?? normalizeTr(b.group), weight: 3 },
    {
      text: normalizeTr([
        b.tag,
        b.country,
        b.city,
        b.district,
        ...(b.workRegions ?? []),
      ].join(" ")),
      weight: 2,
    },
  ];
}

function locationSearchText(b: Business): string {
  return normalizeTr([
    b.country,
    b.city,
    b.district,
    ...(b.workRegions ?? []),
  ].join(" "));
}

/* Sorguda tanınan bir konum (ülke/şehir/ilçe/çalışma bölgesi) geçiyor mu?
   Geçiyorsa serbest metin araması, dropdown'daki ülke/şehir/ilçe seçimini gevşetir:
   TR seçiliyken "mısır DMC" → Mısır sonuçları gelir (Booking/Airbnb tarzı birleşik
   arama). Konum içermeyen sorgular ("otel") dropdown seçimini korur. */
export function queryReferencesLocation(businesses: Business[], rawQuery: string): boolean {
  const tokens = queryTokens(rawQuery);
  if (tokens.length === 0) return false;
  return tokens.some((token) =>
    businesses.some((business) => searchTextMatches(locationSearchText(business), token)),
  );
}

/* Önce bütün anlamlı kelimeleri karşılayan kayıtları döndürür. Böyle bir kayıt
   yoksa sorguda tanınan konumu korur ve o konumdaki mevcut tedarikçileri gösterir:
   "Mısır otel" için otel yoksa Mısır'daki acente/transferler kaybolmaz. */
function applySmartQueryFallback(businesses: Business[], rawQuery: string): Business[] {
  const tokens = queryTokens(rawQuery);
  if (tokens.length === 0) return businesses;

  const strict = businesses.filter((business) => scoreBusiness(business, rawQuery) > 0);
  if (strict.length > 0) return strict;

  const locationTokens = tokens.filter((token) =>
    businesses.some((business) => searchTextMatches(locationSearchText(business), token)),
  );
  if (locationTokens.length === 0) return [];

  return businesses.filter((business) => {
    const location = locationSearchText(business);
    return locationTokens.every((token) => searchTextMatches(location, token));
  });
}

/* Doping rütbesi (öne çıkarma) — büyük olan üstte listelenir.
   2 = Premium Partner (ücretli, kalıcı). 1 = süreli doping (24s hoş geldin veya
   süreli premium paketi, dopingUntil gelecekte). 0 = normal. */
export function dopingRank(b: Business): number {
  return premiumVisibilityRank(b);
}

/** İşletme şu an öne çıkan (doping aktif) mı? Kart rozetinde kullanılır. */
export function isDoped(b: Business): boolean {
  return isPremiumVisible(b);
}

/* Profil doluluk skoru (0–100) — dolu profiller arama sonuçlarında üst sırada.
   Doluluk hem alıcıya daha iyi bilgi verir hem işletmeyi profil tamamlamaya teşvik eder.
   Liste payload'ında phone/website istemciye gönderilmediğinden skor sunucuda önceden
   hesaplanıp `completeness` olarak taşınır; varsa o kullanılır. */
export function profileScore(b: Business): number {
  if (typeof b.completeness === "number") return b.completeness;
  // Partner panelindeki checklist ile birebir aynı koşullar kullanılmalı; aksi hâlde
  // panel %100 gösterirken public kart Kurucu Üye rozetini yanlışlıkla gizler.
  const checks = [
    Boolean(b.name),
    Boolean(b.type),
    Boolean(b.country && b.city && b.district),
    Boolean(b.desc),
    Boolean(b.phone),
    Boolean(b.website),
    Boolean(b.image),
    Boolean(b.attributes && b.attributes.length > 0),
    Boolean((b.contactCount ?? 0) > 0),
    Boolean((b.partnerCount ?? 0) > 0),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

/* Akıllı alaka skoru: sorguyu anlamlı kelimelere böler; her kelimenin işletmenin
   konumu, kategorisi, hizmeti veya adında eşleşmesini ister. Böylece
   "Mısır otel" → ülke=Mısır + kategori=Konaklama niyeti gibi davranır. */
export function scoreBusiness(b: Business, rawQuery: string): number {
  const tokens = queryTokens(rawQuery);
  if (tokens.length === 0) return 0;

  const fields = searchableFields(b);
  let score = 0;
  for (const token of tokens) {
    const bestWeight = fields.reduce(
      (best, field) => searchTextMatches(field.text, token) ? Math.max(best, field.weight) : best,
      0,
    );
    // AND mantığı: sorgudaki her anlamlı parça eşleşmeli.
    if (bestWeight === 0) return 0;
    score += bestWeight;
  }

  const normalizedQuery = normalizeTr(rawQuery);
  if (fields.some((field) => field.text.includes(normalizedQuery))) score += 2;
  return score;
}

/* Tek facet'i atlayabilen ortak süzgeç — hem sonuç listesi hem sayaçlar için. */
export function businessPasses(
  b: Business,
  rawQuery: string,
  f: ListingFilters,
  opts: { ignoreGroup?: boolean; ignoreType?: boolean; ignoreRegion?: boolean } = {}
): boolean {
  if (!opts.ignoreGroup && f.groups.size && !f.groups.has(b.group)) return false;
  // Tür filtresi çoklu-hizmete duyarlı: işletmenin herhangi bir hizmeti eşleşirse geçer.
  if (!opts.ignoreType && f.types.size && !businessTypeLabels(b).some((label) => f.types.has(label))) return false;
  // ignoreRegion: sorgu bir konum içerdiğinde (queryReferencesLocation) ülke/şehir/ilçe
  // dropdown facet'i gevşetilir; konum eşlemesini serbest metin skoru üstlenir.
  if (!opts.ignoreRegion && f.country !== "all" && b.country !== f.country) return false;
  // Şehir filtresi: rehber, çalışma bölgeleri arasında aranan şehir varsa da eşleşir
  // (Brief §2.7: rehber birden çok bölgede hizmet verir, acente ona göre arar).
  const guideRegionMatch = b.group === "rehber" && f.city !== "all" && !!b.workRegions?.includes(f.city);
  if (!opts.ignoreRegion && f.city !== "all" && b.city !== f.city && !guideRegionMatch) return false;
  // Rehber çalışma bölgesiyle eşleştiyse ilçe filtresi uygulanmaz (bölge = şehir düzeyi).
  if (!opts.ignoreRegion && f.district !== "all" && b.district !== f.district && !guideRegionMatch) return false;
  if (f.minRating > 0 && b.rating < f.minRating) return false;
  if (!attrsPass(b.attributes, f.attrs)) return false;
  if (queryTokens(rawQuery).length > 0 && scoreBusiness(b, rawQuery) === 0) return false;
  return true;
}

/* Süz + sırala. `rawQuery` ham arama metni (içeride normalize edilir). */
export function filterAndSortBusinesses(
  businesses: Business[],
  f: ListingFilters,
  rawQuery: string,
  sort: Sort
): Business[] {
  const hasQuery = queryTokens(rawQuery).length > 0;
  const ignoreRegion = queryReferencesLocation(businesses, rawQuery);
  const eligible = businesses.filter((b) => businessPasses(b, "", f, { ignoreRegion }));
  const items = applySmartQueryFallback(eligible, rawQuery)
    .map((b) => ({ b, s: scoreBusiness(b, rawQuery) }));

  if (sort === "rating") items.sort((a, b) => b.b.rating - a.b.rating || b.b.reviews - a.b.reviews);
  else if (sort === "az") items.sort((a, b) => a.b.name.localeCompare(b.b.name, "tr"));
  // Varsayılan: arama varsa önce alaka skoru → doping → puan → profil doluluk.
  else if (hasQuery)
    items.sort(
      (a, b) =>
        b.s - a.s ||
        dopingRank(b.b) - dopingRank(a.b) ||
        b.b.rating - a.b.rating ||
        profileScore(b.b) - profileScore(a.b),
    );
  // Aramasız varsayılan: doping → puan → profil doluluk.
  else
    items.sort(
      (a, b) =>
        dopingRank(b.b) - dopingRank(a.b) ||
        b.b.rating - a.b.rating ||
        profileScore(b.b) - profileScore(a.b),
    );

  return items.map(({ b }) => b);
}

/* Facet sayaçları. `key`'e göre ilgili facet'i yok sayarak sayar. */
export function facetCounts(
  businesses: Business[],
  f: ListingFilters,
  rawQuery: string,
  key: "group" | "type"
): Record<string, number> {
  const ignoreRegion = queryReferencesLocation(businesses, rawQuery);
  const opts = key === "group"
    ? { ignoreGroup: true, ignoreType: true, ignoreRegion }
    : { ignoreType: true, ignoreRegion };
  const acc: Record<string, number> = {};
  const eligible = businesses.filter((business) => businessPasses(business, "", f, opts));
  applySmartQueryFallback(eligible, rawQuery).forEach((b) => {
    if (key === "group") {
      acc[b.group] = (acc[b.group] ?? 0) + 1;
    } else {
      // Tür facet'i: işletme her hizmeti için ayrı sayılır (çoklu-hizmet).
      for (const label of businessTypeLabels(b)) acc[label] = (acc[label] ?? 0) + 1;
    }
  });
  return acc;
}

/** İşletmenin tür etiketleri: birincil type + tüm çoklu hizmetler (slug→label). Tekilleştirilmiş. */
export function businessTypeLabels(b: Business): string[] {
  const labels = new Set<string>();
  if (b.type) labels.add(b.type);
  for (const slug of b.serviceTypes ?? []) labels.add(serviceLabel(slug));
  return [...labels];
}
