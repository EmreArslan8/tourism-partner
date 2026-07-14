import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getBusinesses, toListingBusiness } from "@/lib/businesses";
import { getActiveAdBanners } from "@/lib/platform-data";
import { localeAlternates } from "@/lib/seo";
import { getPageSeo, PAGE_SLUGS } from "@/lib/pages";
import type { SiteLocale } from "@/lib/site";
import HomeView from "./view";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  // Kod içi varsayılan (şablon); admin `/admin/icerik`'te "home" slug'ıyla üzerine yazabilir.
  const fallback =
    locale === "en"
      ? {
          title: "Tourism Partner - B2B Tourism Network",
          description:
            "Discover, compare and request quotes from hotels, agencies, guides, transfers, activities and health tourism suppliers — all in one B2B platform.",
        }
      : {
          title: "Tourism Partner - B2B Tourism Network",
          description:
            "Otel, acente, rehber, transfer, etkinlik ve sağlık turizmi tedarikçilerini tek platformda keşfedin, karşılaştırın ve hızlıca teklif alın.",
        };
  const override = await getPageSeo(locale, PAGE_SLUGS.home);
  const title = override?.seoTitle || fallback.title;
  const description = override?.seoDescription || fallback.description;
  return {
    title,
    description,
    keywords: override?.seoKeywords.length ? override.seoKeywords : undefined,
    alternates: localeAlternates(locale as SiteLocale, "/"),
    openGraph: {
      title,
      description,
      type: "website",
      images: override?.ogImage ? [{ url: override.ogImage }] : undefined,
    },
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
