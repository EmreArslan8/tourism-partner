import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ListingView from "@/components/ListingView";
import SuggestionRail from "@/components/SuggestionRail";
import { getExploreResults, getExploreViewerKind } from "@/lib/explore-search";
import { getCrossCategorySuggestions } from "@/lib/suggestions";
import { parseExploreFilters, type ExploreSearchParams } from "@/lib/explore-filters";
import { localeAlternates } from "@/lib/seo";
import { getPageSeo, PAGE_SLUGS } from "@/lib/pages";
import type { SiteLocale } from "@/lib/site";
import ExploreView from "./view";

/* Filtreli keşfet URL'leri (?cat=&city=…) duplicate/ince içeriktir: noindex + temel /kesfet'e
   canonical. Filtresiz temel sayfa index'lenir ve kendine canonical verir. */
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<ExploreSearchParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const sp = await searchParams;
  const isFiltered = Boolean(
    sp.cat || sp.type || sp.city || sp.country || sp.district || sp.q || sp.rating || sp.attr || sp.sort || sp.page,
  );
  // Kod içi varsayılan (şablon); admin `/admin/icerik`'te "explore" slug'ıyla üzerine yazabilir.
  const fallback =
    locale === "en"
      ? {
          title: "Explore Travel Suppliers — Tourism Partner",
          description:
            "Hotels, agencies, guides, transfers, activities and health tourism: explore and compare B2B tourism suppliers by category and city.",
        }
      : {
          title: "Turizm Tedarikçilerini Keşfet — Tourism Partner",
          description:
            "Otel, acente, rehber, transfer, etkinlik ve sağlık turizmi: B2B turizm tedarikçilerini kategoriye ve şehre göre keşfedin, karşılaştırın.",
        };
  const override = await getPageSeo(locale, PAGE_SLUGS.explore);
  const title = override?.seoTitle || fallback.title;
  const description = override?.seoDescription || fallback.description;
  return {
    title,
    description,
    keywords: override?.seoKeywords.length ? override.seoKeywords : undefined,
    robots: isFiltered ? { index: false, follow: true } : { index: true, follow: true },
    // Filtreli olsun olmasın canonical + hreflang temel /kesfet'e işaret eder.
    alternates: localeAlternates(locale as SiteLocale, "/explore"),
  };
}

export default async function ExplorePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<ExploreSearchParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ExploreView>
      <Listing searchParams={searchParams} />
    </ExploreView>
  );
}

/* searchParams + useSearchParams(ListingView) runtime erişimleri — <Suspense> altında. */
async function Listing({ searchParams }: { searchParams: Promise<ExploreSearchParams> }) {
  const sp = await searchParams;
  const filters = parseExploreFilters(sp);
  const pageNum = Math.max(1, Number(sp.page) || 1);

  // Viewer'ı bir kez hesapla; sonuç + öneri sorgularını PARALEL çalıştır (birbirini beklemesin).
  // getBusinesses her ikisinde de cache'li — tek DB okuması paylaşılır.
  const viewer = await getExploreViewerKind();
  const [results, suggestions] = await Promise.all([
    getExploreResults(filters, pageNum, viewer),
    getCrossCategorySuggestions(filters, { isGuest: viewer === "guest" }),
  ]);

  return (
    <>
      <ListingView
        isGuest={results.isGuest}
        items={results.items}
        lockedPreviewItems={results.lockedPreviewItems}
        index={results.index}
        mapItems={results.mapItems}
        total={results.total}
        fullTotal={results.fullTotal}
        page={results.page}
        pageCount={results.pageCount}
        initialGroups={filters.groups}
        initialTypes={filters.types}
        initialCountry={filters.country}
        initialCity={filters.city}
        initialDistrict={filters.district}
        initialQ={filters.q}
        initialMinRating={filters.minRating}
        initialAttrs={filters.attrs}
        initialSort={filters.sort}
      />
      <SuggestionRail items={suggestions} />
    </>
  );
}
