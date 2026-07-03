import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  pathnames: {
    "/": "/",
    "/explore": {
      tr: "/kesfet",
      en: "/explore",
    },
    "/login": {
      tr: "/giris",
      en: "/login",
    },
    "/register": {
      tr: "/kayit",
      en: "/register",
    },
    "/quote": {
      tr: "/teklif",
      en: "/quote",
    },
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/dashboard": {
      tr: "/panel",
      en: "/dashboard",
    },
    "/dashboard/listings": {
      tr: "/panel/ilanlar",
      en: "/dashboard/listings",
    },
    "/dashboard/listings/new": {
      tr: "/panel/ilanlar/yeni",
      en: "/dashboard/listings/new",
    },
    "/dashboard/listings/[id]/edit": {
      tr: "/panel/ilanlar/[id]/duzenle",
      en: "/dashboard/listings/[id]/edit",
    },
    "/supplier/[id]": {
      tr: "/tedarikci/[id]",
      en: "/supplier/[id]",
    },
    "/admin": "/admin",
    "/admin/tedarikciler": "/admin/tedarikciler",
    "/admin/tedarikciler/[id]": "/admin/tedarikciler/[id]",
    "/admin/teklifler": "/admin/teklifler",
    "/admin/onay": "/admin/onay",
    "/admin/icerik": "/admin/icerik",
    "/admin/seo": "/admin/seo",
    "/admin/kategoriler": "/admin/kategoriler",
    "/admin/raporlar": "/admin/raporlar",
    "/admin/reklam": "/admin/reklam",
    "/admin/destek": "/admin/destek",
    "/admin/guvenlik": "/admin/guvenlik",
  },
});
