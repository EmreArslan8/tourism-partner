/* Keşfet liste mantığı — SAF fonksiyonlar (UI/state'ten bağımsız, test edilebilir).
   ListingView yalnızca state tutar; süzme/sıralama/skor burada yaşar. */
import type { Business, GroupKey } from "./types";
import { attrsPass } from "./facets";
import { normalizeTr } from "./utils";

export type Sort = "featured" | "rating" | "az";

export interface ListingFilters {
  groups: Set<GroupKey>;
  types: Set<string>;
  country: string;
  city: string;
  district: string;
  verifiedOnly: boolean;
  minRating: number;
  attrs: Set<string>;
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
  // Varsayılan: arama varsa önce alaka skoru, yoksa sponsor + puan.
  else if (needle)
    items.sort((a, b) => b.s - a.s || Number(b.b.sponsored) - Number(a.b.sponsored) || b.b.rating - a.b.rating);
  else items.sort((a, b) => Number(b.b.sponsored) - Number(a.b.sponsored) || b.b.rating - a.b.rating);

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
