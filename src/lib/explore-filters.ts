import { CATEGORY_GROUPS } from "@/lib/categories";
import { ALL_FACET_SLUGS } from "@/lib/facets";
import type { GroupKey, Sort } from "@/lib/types";

export type ExploreSearchParams = {
  cat?: string;
  type?: string;
  city?: string;
  country?: string;
  district?: string;
  q?: string;
  attr?: string;
  sort?: string;
  page?: string;
};

export type ExploreInitialFilters = {
  groups: GroupKey[];
  types: string[];
  city: string;
  country: string;
  district: string;
  q: string;
  minRating: number;
  attrs: string[];
  sort: Sort;
};

export type ExploreFilterValues = {
  groups: Iterable<GroupKey>;
  types: Iterable<string>;
  city: string;
  country: string;
  district: string;
  q: string;
  attrs: Iterable<string>;
  sort: Sort;
  page: number;
};

const GROUPS = new Set(CATEGORY_GROUPS.map((group) => group.key));
const TYPES = new Set(CATEGORY_GROUPS.flatMap((group) => group.children.map((child) => child.label)));

export function parseExploreFilters(sp: ExploreSearchParams): ExploreInitialFilters {
  const groups = (sp.cat?.split(",").filter((value): value is GroupKey => GROUPS.has(value as GroupKey)) ?? []);
  const types = sp.type?.split(",").filter((value) => TYPES.has(value)) ?? [];

  return {
    groups,
    types,
    city: sp.city || "all",
    country: sp.country || "all",
    district: sp.district || "all",
    q: sp.q?.trim() || "",
    minRating: 0,
    attrs: sp.attr?.split(",").filter((slug) => ALL_FACET_SLUGS.has(slug)) ?? [],
    sort: sp.sort === "az" ? sp.sort : "featured",
  };
}

export function parseExplorePage(value?: string): number {
  const page = Number(value);
  return Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
}

export function serializeExploreFilters(filters: ExploreFilterValues): Record<string, string> {
  const groups = [...filters.groups];
  const types = [...filters.types];
  const attrs = [...filters.attrs];
  const q = filters.q.trim();
  const query: Record<string, string> = {};

  if (groups.length) query.cat = groups.join(",");
  if (types.length) query.type = types.join(",");
  if (filters.country !== "all") query.country = filters.country;
  if (filters.city !== "all") query.city = filters.city;
  if (filters.district !== "all") query.district = filters.district;
  if (q) query.q = q;
  if (attrs.length) query.attr = attrs.join(",");
  if (filters.sort !== "featured") query.sort = filters.sort;
  if (filters.page > 1) query.page = String(filters.page);

  return query;
}
