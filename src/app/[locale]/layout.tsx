import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getMessages, type Locale } from "@/i18n/messages";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

/* Tek font instance'ı — display ve body aynı aileyi paylaşır; --font-display,
   globals.css'te --font-body'ye eşitlenir (iki next/font kopyası dosyaları
   duplike ediyor, woff2 sayısını ikiye katlıyordu → Lighthouse sim LCP şişiyordu).
   display:"optional": font LCP kritik yolundan çıkar; ilk boyamaya yetişemezse
   metrik-uyumlu fallback ile kalır (CLS yok), sonraki gezinmede web font gelir. */
const sans = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "optional",
});

const sansAr = Noto_Sans_Arabic({
  subsets: ["arabic", "latin"],
  variable: "--font-body",
  display: "optional",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Tourism Partner - B2B Tourism Network",
  description:
    "B2B supplier network for hotels, agencies, guides, tour companies, activities and health tourism. Filter, sign up, find partners.",
  verification: { google: "aWHNh-loW2ujCEWgv1x5fm58kUgsuK-2RHdn6FpAlzw" },
  // Marka/statik sayfalar (ana sayfa, keşfet) her zaman indekslenebilir — .com Google'da çıksın.
  // Sahte tedarikçi PROFİL sayfaları ayrıca noindex (bkz. supplier/[id]/page.tsx).
  robots: { index: true, follow: true },
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
    <html lang={locale} dir={isAr ? "rtl" : "ltr"} data-scroll-behavior="smooth" className={fontVars}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
