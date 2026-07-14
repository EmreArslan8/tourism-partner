import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/* robots.txt — public profiller taranabilir; panel/admin ve özel uçlar dışlanır. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Yalnızca giriş gerektiren/özel alanlar (her iki locale yolu da).
      disallow: ["/admin", "/api", "/tr/panel", "/en/dashboard", "/tr/giris", "/en/login"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
