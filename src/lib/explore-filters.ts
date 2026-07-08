import { CATEGORY_GROUPS } from "@/lib/categories";
import type { GroupKey, Sort } from "@/lib/types";

export type ExploreSearchParams = {
  cat?: string;
  type?: string;
  city?: string;
  country?: string;
  district?: string;
  q?: string;
  rating?: string;
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

const GROUPS = new Set(CATEGORY_GROUPS.map((group) => group.key));
const TYPES = new Set(CATEGORY_GROUPS.flatMap((group) => group.children.map((child) => child.label)));

export function parseExploreFilters(sp: ExploreSearchParams): ExploreInitialFilters {
  const groups = (sp.cat?.split(",").filter((value): value is GroupKey => GROUPS.has(value as GroupKey)) ?? []);
  const types = sp.type?.split(",").filter((value) => TYPES.has(value)) ?? [];
  const rating = Number(sp.rating);

  return {
    groups,
    types,
    city: sp.city || "all",
    country: sp.country || "all",
    district: sp.district || "all",
    q: sp.q || "",
    minRating: Number.isFinite(rating) ? rating : 0,
    attrs: sp.attr?.split(",").filter(Boolean) ?? [],
    sort: sp.sort === "rating" || sp.sort === "az" ? sp.sort : "featured",
  };
}
