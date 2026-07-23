import type { Business } from "@/lib/types";

export type ViewerKind = "guest" | "buyer" | "supplier" | "admin" | "authenticated";

export type BusinessStatusLike = {
  status?: string | null;
  sponsored?: boolean | null;
  dopingUntil?: string | null;
  doping_until?: string | null;
};

export const PUBLIC_BUSINESS_STATUSES = ["approved", "active"] as const;

export function isPublicBusinessStatus(status: string | null | undefined): boolean {
  return PUBLIC_BUSINESS_STATUSES.includes(status as (typeof PUBLIC_BUSINESS_STATUSES)[number]);
}

export function hasActiveDoping(business: BusinessStatusLike, now = Date.now()): boolean {
  const value = business.dopingUntil ?? business.doping_until;
  return Boolean(value && new Date(value).getTime() > now);
}

export function premiumVisibilityRank(business: BusinessStatusLike, now = Date.now()): number {
  if (business.sponsored) return 2;
  if (hasActiveDoping(business, now)) return 1;
  return 0;
}

export function isPremiumVisible(business: BusinessStatusLike, now = Date.now()): boolean {
  return premiumVisibilityRank(business, now) > 0;
}

export function canViewPublicProfile(business: BusinessStatusLike): boolean {
  return isPublicBusinessStatus(business.status);
}

export function canAppearInExplore(business: Business, viewer: ViewerKind): boolean {
  // Keşfet tüm onaylı işletmeleri gösterir. Premium/doping görünürlüğü kapı
  // olarak değil, sonuç sıralamasında öne çıkma avantajı olarak uygulanır.
  void business;
  void viewer;
  return true;
}

export function canUseFullExplore(viewer: ViewerKind): boolean {
  void viewer;
  return true;
}
