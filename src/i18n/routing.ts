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
    "/dashboard": {
      tr: "/panel",
      en: "/dashboard",
    },
    "/supplier/[id]": {
      tr: "/tedarikci/[id]",
      en: "/supplier/[id]",
    },
    "/admin": "/admin",
    "/admin/tedarikciler": "/admin/tedarikciler",
    "/admin/teklifler": "/admin/teklifler",
    "/admin/onay": "/admin/onay",
    "/admin/icerik": "/admin/icerik",
    "/admin/seo": "/admin/seo",
  },
});
