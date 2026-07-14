import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import type { SiteLocale } from "@/lib/site";

type PathHref = Parameters<typeof getPathname>[0]["href"];

/** canonical + hreflang alternates — public sayfalar için tek kaynak.
 *  href = routing.pathnames anahtarı (ör. "/blog" veya { pathname:"/supplier/[id]", params:{ id } }).
 *  Google'a tr↔en dil varyantlarını bildirir; her kullanıcıya doğru dili gösterir. */
export function localeAlternates(locale: SiteLocale, href: PathHref): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = getPathname({ href, locale: l });
  }
  return {
    canonical: getPathname({ href, locale }),
    languages: {
      ...languages,
      "x-default": getPathname({ href, locale: routing.defaultLocale }),
    },
  };
}
