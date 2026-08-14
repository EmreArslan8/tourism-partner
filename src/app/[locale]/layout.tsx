import type { Metadata } from "next";
import { Suspense } from "react";
import { Poppins, Noto_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getMessages, type Locale } from "@/i18n/messages";
import { SITE_URL } from "@/lib/site";
import { themeCssVariables } from "@/theme";
import { AnalyticsScripts, GoogleTagManagerNoScript } from "@/components/Analytics";
import "../globals.css";

/* Tek font instance'ı — display ve body aynı aileyi paylaşır; --font-display,
   globals.css'te --font-body'ye eşitlenir (iki next/font kopyası dosyaları
   duplike ediyor, woff2 sayısını ikiye katlıyordu → Lighthouse sim LCP şişiyordu).
   display:"optional": font LCP kritik yolundan çıkar; ilk boyamaya yetişemezse
   metrik-uyumlu fallback ile kalır (CLS yok), sonraki gezinmede web font gelir. */
const sans = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "optional",
});

/* preload:false ŞART — preload manifest'i locale ayrımı yapamıyor; aksi halde
   TR/EN/RU dahil HER sayfaya Link header'ıyla ~194KB Arapça font itiliyor
   (High priority, LCP bandını yiyor). AR sayfası fontu CSS'ten keşfeder. */
const sansAr = Noto_Sans_Arabic({
  subsets: ["arabic", "latin"],
  variable: "--font-body",
  display: "optional",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Google arama sonucundaki "site adı" sinyali (og:site_name ana sayfada da verilir).
  applicationName: "Tourism Partner",
  title: "Tourism Partner - B2B Tourism Network",
  description:
    "B2B supplier network for hotels, agencies, guides, tour companies, activities and health tourism. Filter, sign up, find partners.",
  verification: { google: "aWHNh-loW2ujCEWgv1x5fm58kUgsuK-2RHdn6FpAlzw" },
  // Favicon: src/app/icon.svg (adaptif — içinde prefers-color-scheme media query;
  // Chrome dahil tarayıcılarda çalışır). /favicon.ico (public) Google + eski tarayıcı fallback'ı.
  // src/app/icon.png (desktop PNG fallback), src/app/apple-icon.png (iOS touch icon).
  // Marka/statik sayfalar (ana sayfa, keşfet) her zaman indekslenebilir — .com Google'da çıksın.
  // Sahte tedarikçi PROFİL sayfaları ayrıca noindex (bkz. supplier/[id]/page.tsx).
  robots: { index: true, follow: true },
  // iOS "ana ekrana ekle" başlığı (apple-mobile-web-app-title).
  appleWebApp: { capable: true, title: "Tourism Partner", statusBarStyle: "default" },
};

/* Google'a site adını ("Tourism Partner") açıkça bildiren yapısal veri.
   Tüm sayfalarda render edilir; arama sonucundaki kalın site adını netleştirir. */
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", name: "Tourism Partner", url: SITE_URL },
    {
      "@type": "Organization",
      name: "Tourism Partner",
      url: SITE_URL,
      logo: `${SITE_URL}/assets/logo-mark.svg`,
    },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages(locale as Locale);

  const isAr = locale === "ar";
  const fontVars = isAr ? sansAr.variable : sans.variable;

  return (
    <html
      lang={locale}
      dir={isAr ? "rtl" : "ltr"}
      data-scroll-behavior="smooth"
      className={fontVars}
      suppressHydrationWarning
      style={themeCssVariables as React.CSSProperties}
    >
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('tp-theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme:dark)').matches;document.documentElement.classList.toggle('dark',d);document.documentElement.dataset.theme=d?'dark':'light'}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <GoogleTagManagerNoScript />
        <NextIntlClientProvider locale={locale} messages={messages}>{children}</NextIntlClientProvider>
        <Suspense fallback={null}>
          <AnalyticsScripts />
        </Suspense>
      </body>
    </html>
  );
}
