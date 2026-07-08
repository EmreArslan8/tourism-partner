import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

const display = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Tourism Partner — B2B Travel Supplier Network",
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

  return (
    <html lang={locale} data-scroll-behavior="smooth" className={`${display.variable} ${body.variable}`}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
