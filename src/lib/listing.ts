/* Keşfet liste mantığı — SAF fonksiyonlar (UI/state'ten bağımsız, test edilebilir).
   ListingView yalnızca state tutar; süzme/sıralama/skor burada yaşar. */
import type { Business, GroupKey, Sort, ListingFilters } from "./types";
import { attrsPass } from "./facets";
import { normalizeTr } from "./utils";

/* Doping rütbesi (öne çıkarma) — büyük olan üstte listelenir.
   2 = Premium Partner (ücretli, kalıcı). 1 = süreli doping (24s hoş geldin veya
   süreli premium paketi, dopingUntil gelecekte). 0 = normal. */
export function dopingRank(b: Business): number {
  if (b.sponsored) return 2;
  if (b.dopingUntil && new Date(b.dopingUntil).getTime() > Date.now()) return 1;
  return 0;
}

/** İşletme şu an öne çıkan (doping aktif) mı? Kart rozetinde kullanılır. */
export function isDoped(b: Business): boolean {
  return dopingRank(b) > 0;
}

/* Profil doluluk skoru (0–8) — dolu profiller arama sonuçlarında üst sırada.
   Doluluk hem alıcıya daha iyi bilgi verir hem işletmeyi profil tamamlamaya teşvik eder. */
export function profileScore(b: Business): number {
  let s = 0;
  if (b.desc && b.desc.trim().length > 20) s++;
  if (b.image) s++;
  if (b.attributes && b.attributes.length > 0) s++;
  if (b.phone) s++;
  if (b.website) s++;
  if (b.tag) s++;
  if (b.coords && (b.coords[0] !== 0 || b.coords[1] !== 0)) s++;
  if (b.reviews > 0) s++;
  return s;
}

/* Alaka skoru: isimde geçen +3, tür +2, etiket/şehir/ilçe +1. `needle` normalize edilmiş olmalı. */
export function scoreBusiness(b: Business, needle: string): number {
  if (!needle) return 0;
  let s = 0;
  if (normalizeTr(b.name).includes(needle)) s += 3;
  if (normalizeTr(b.type).includes(needle)) s += 2;
  if (normalizeTr(b.tag).includes(needle)) s += 1;
  if (normalizeTr(b.city).includes(needle)) s += 1;
  if (normalizeTr(b.district).includes(needle)) s += 1;
  return s;
}

/* Tek facet'i atlayabilen ortak süzgeç — hem sonuç listesi hem sayaçlar için. */
export function businessPasses(
  b: Business,
  needle: string,
  f: ListingFilters,
  opts: { ignoreGroup?: boolean; ignoreType?: boolean } = {}
): boolean {
  if (!opts.ignoreGroup && f.groups.size && !f.groups.has(b.group)) return false;
  if (!opts.ignoreType && f.types.size && !f.types.has(b.type)) return false;
  if (f.country !== "all" && b.country !== f.country) return false;
  if (f.city !== "all" && b.city !== f.city) return false;
  if (f.district !== "all" && b.district !== f.district) return false;
  if (f.verifiedOnly && !b.verified) return false;
  if (f.minRating > 0 && b.rating < f.minRating) return false;
  if (!attrsPass(b.attributes, f.attrs)) return false;
  if (needle && scoreBusiness(b, needle) === 0) return false;
  return true;
}

/* Süz + sırala. `rawQuery` ham arama metni (içeride normalize edilir). */
export function filterAndSortBusinesses(
  businesses: Business[],
  f: ListingFilters,
  rawQuery: string,
  sort: Sort
): Business[] {
  const needle = normalizeTr(rawQuery);
  const items = businesses
    .filter((b) => businessPasses(b, needle, f))
    .map((b) => ({ b, s: scoreBusiness(b, needle) }));

  if (sort === "rating") items.sort((a, b) => b.b.rating - a.b.rating || b.b.reviews - a.b.reviews);
  else if (sort === "az") items.sort((a, b) => a.b.name.localeCompare(b.b.name, "tr"));
  // Varsayılan: arama varsa önce alaka skoru → doping → puan → profil doluluk.
  else if (needle)
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
  const needle = normalizeTr(rawQuery);
  const opts = key === "group" ? { ignoreGroup: true, ignoreType: true } : { ignoreType: true };
  const acc: Record<string, number> = {};
  businesses.forEach((b) => {
    if (businessPasses(b, needle, f, opts)) {
      const k = b[key];
      acc[k] = (acc[k] ?? 0) + 1;
    }
  });
  return acc;
}
