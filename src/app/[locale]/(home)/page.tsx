import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getBusinesses, toListingBusiness } from "@/lib/businesses";
import { getActiveAdBanners } from "@/lib/platform-data";
import { localeAlternates } from "@/lib/seo";
import type { SiteLocale } from "@/lib/site";
import HomeView from "./view";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const meta =
    locale === "en"
      ? {
          title: "Tourism Partner — B2B Travel Supplier Marketplace",
          description:
            "Discover, compare and request quotes from hotels, agencies, guides, transfers, activities and health tourism suppliers — all in one B2B platform.",
        }
      : {
          title: "Tourism Partner — B2B Turizm Tedarikçi Pazaryeri",
          description:
            "Otel, acente, rehber, transfer, etkinlik ve sağlık turizmi tedarikçilerini tek platformda keşfedin, karşılaştırın ve hızlıca teklif alın.",
        };
  return {
    title: meta.title,
    description: meta.description,
    alternates: localeAlternates(locale as SiteLocale, "/"),
    openGraph: { title: meta.title, description: meta.description, type: "website" },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [businesses, adBanners] = await Promise.all([
    getBusinesses(),
    getActiveAdBanners("home"),
  ]);

  // Liste payload'ında iletişim alanları taşınmaz (telefon/website yalnız detay sayfasında).
  return <HomeView businesses={businesses.map(toListingBusiness)} adBanners={adBanners} />;
}
