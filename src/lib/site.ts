/* Kanonik site kök URL'i — sitemap, robots ve metadataBase için tek kaynak.
   Üretimde NEXT_PUBLIC_SITE_URL tanımlanmalı (ör. https://tourismpartner.com). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ??
  "http://localhost:3000"
).replace(/\/$/, "");

export const LOCALES = ["tr", "en"] as const;
export type SiteLocale = (typeof LOCALES)[number];

/** İşletme detay sayfasının locale'e göre yolu (routing.ts ile aynı kalıp). */
export function supplierPath(locale: SiteLocale, slug: string): string {
  return locale === "tr" ? `/tr/tedarikci/${slug}` : `/en/supplier/${slug}`;
}
