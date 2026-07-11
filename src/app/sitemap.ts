import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { getBusinesses, businessSlug } from "@/lib/businesses";
import { SITE_URL, LOCALES, supplierPath, INDEXING_ENABLED } from "@/lib/site";

/* Dinamik sitemap (Brief §3B / El Kitabı §1.2): tüm onaylı işletme profilleri
   Google botları için index'lenebilir olarak listelenir. Profiller herkese açıktır
   (deep-link), bu yüzden organik trafik için sitemap'e dahil edilir. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  // Statik üst sayfalar (her locale)
  for (const locale of LOCALES) {
    entries.push({
      url: `${SITE_URL}${getPathname({ locale, href: "/" })}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    });
    entries.push({
      url: `${SITE_URL}${getPathname({ locale, href: "/explore" })}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    });
    entries.push({
      url: `${SITE_URL}${getPathname({ locale, href: "/help" })}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    });
  }

  // İşletme profilleri (her locale) — asıl SEO yüzeyimiz.
  // Demo veri döneminde SAHTE profiller sitemap'e girmez; launch'ta NEXT_PUBLIC_ALLOW_INDEXING ile açılır.
  if (INDEXING_ENABLED) {
    const businesses = await getBusinesses();
    for (const b of businesses) {
      const slug = businessSlug(b);
      for (const locale of LOCALES) {
        entries.push({
          url: `${SITE_URL}${supplierPath(locale, slug)}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  }

  return entries;
}
