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
    "/dashboard/requests": {
      tr: "/panel/talepler",
      en: "/dashboard/requests",
    },
    "/dashboard/favorites": {
      tr: "/panel/favoriler",
      en: "/dashboard/favorites",
    },
    "/dashboard/reviews": {
      tr: "/panel/degerlendirmeler",
      en: "/dashboard/reviews",
    },
    "/dashboard/support": {
      tr: "/panel/destek",
      en: "/dashboard/support",
    },
    "/dashboard/doping": {
      tr: "/panel/doping",
      en: "/dashboard/doping",
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
      tr: "/isletme/[id]",
      en: "/supplier/[id]",
    },
    "/admin": "/admin",
    "/admin/tedarikciler": {
      tr: "/admin/tedarikciler",
      en: "/admin/suppliers",
    },
    "/admin/tedarikciler/[id]": {
      tr: "/admin/tedarikciler/[id]",
      en: "/admin/suppliers/[id]",
    },
    "/admin/teklifler": {
      tr: "/admin/teklifler",
      en: "/admin/quotes",
    },
    "/admin/talepler": {
      tr: "/admin/talepler",
      en: "/admin/requests",
    },
    "/admin/onay": {
      tr: "/admin/onay",
      en: "/admin/approvals",
    },
    "/admin/icerik": {
      tr: "/admin/icerik",
      en: "/admin/content",
    },
    "/admin/seo": "/admin/seo",
    "/admin/kategoriler": {
      tr: "/admin/kategoriler",
      en: "/admin/categories",
    },
    "/admin/raporlar": {
      tr: "/admin/raporlar",
      en: "/admin/reports",
    },
    "/admin/reklam": {
      tr: "/admin/reklam",
      en: "/admin/ads",
    },
    "/admin/destek": {
      tr: "/admin/destek",
      en: "/admin/support",
    },
    "/admin/guvenlik": {
      tr: "/admin/guvenlik",
      en: "/admin/security",
    },
  },
});
