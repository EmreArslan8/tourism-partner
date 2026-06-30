import type { MetadataRoute } from "next";
import { getBusinesses, businessSlug } from "@/lib/businesses";
import { SITE_URL, LOCALES, supplierPath } from "@/lib/site";

/* Dinamik sitemap (Brief §3B / El Kitabı §1.2): tüm onaylı işletme profilleri
   Google botları için index'lenebilir olarak listelenir. Profiller herkese açıktır
   (deep-link), bu yüzden organik trafik için sitemap'e dahil edilir. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const businesses = await getBusinesses();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  // Statik üst sayfalar (her locale)
  for (const locale of LOCALES) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    });
    entries.push({
      url: `${SITE_URL}/${locale}/${locale === "tr" ? "kesfet" : "explore"}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    });
  }

  // İşletme profilleri (her locale) — asıl SEO yüzeyimiz
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

  return entries;
}
