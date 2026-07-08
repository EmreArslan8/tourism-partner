/* Kanonik site kök URL'i — sitemap, robots ve metadataBase için tek kaynak.
   Üretimde NEXT_PUBLIC_SITE_URL tanımlanmalı (ör. https://tourismpartner.com). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ??
  "http://localhost:3000"
).replace(/\/$/, "");

/* İndekslemeye izin — YALNIZ NEXT_PUBLIC_ALLOW_INDEXING="true" iken açık.
   Demo/gerçek-olmayan veri döneminde Google sahte profilleri indekslemesin diye
   varsayılan KAPALI. Yayına hazır olunca Vercel'de bu env'i "true" yap. */
export const INDEXING_ENABLED = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export const LOCALES = ["tr", "en"] as const;
export type SiteLocale = (typeof LOCALES)[number];

/** İşletme detay sayfasının locale'e göre yolu (routing.ts ile aynı kalıp). */
export function supplierPath(locale: SiteLocale, slug: string): string {
  return locale === "tr" ? `/tr/tedarikci/${slug}` : `/en/supplier/${slug}`;
}
