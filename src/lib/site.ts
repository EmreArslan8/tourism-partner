import { getPathname } from "@/i18n/navigation";

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

/* Platformun kendi sosyal medya hesapları — footer'da ikon olarak gösterilir.
   URL'ler placeholder; gerçek hesaplar açıldıkça burası güncellenir.
   Boş string ("") bırakılan platformun ikonu render edilmez. */
export const PLATFORM_SOCIALS = {
  instagram: "https://instagram.com/tourismpartner",
  facebook: "https://facebook.com/tourismpartner",
  linkedin: "https://linkedin.com/company/tourismpartner",
  youtube: "https://youtube.com/@tourismpartner",
  x: "https://x.com/tourismpartner",
} as const;

export const LOCALES = ["tr", "en", "ru", "ar"] as const;
export type SiteLocale = (typeof LOCALES)[number];

/** İşletme detay sayfasının locale'e göre yolu (routing.ts ile aynı kalıp). */
export function supplierPath(locale: SiteLocale, slug: string): string {
  return getPathname({ locale, href: { pathname: "/supplier/[id]", params: { id: slug } } });
}
