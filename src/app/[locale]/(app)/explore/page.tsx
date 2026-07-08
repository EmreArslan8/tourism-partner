import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ListingView from "@/components/ListingView";
import SuggestionRail from "@/components/SuggestionRail";
import { getExploreResults, getIsGuest } from "@/lib/explore-search";
import { getCrossCategorySuggestions } from "@/lib/suggestions";
import { parseExploreFilters, type ExploreSearchParams } from "@/lib/explore-filters";
import { getPathname } from "@/i18n/navigation";
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
  const canonical = getPathname({ href: "/explore", locale: locale as SiteLocale });
  return {
    robots: isFiltered ? { index: false, follow: true } : { index: true, follow: true },
    alternates: { canonical },
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

  // isGuest'i bir kez hesapla; sonuç + öneri sorgularını PARALEL çalıştır (birbirini beklemesin).
  // getBusinesses her ikisinde de cache'li — tek DB okuması paylaşılır.
  const isGuest = await getIsGuest();
  const [results, suggestions] = await Promise.all([
    getExploreResults(filters, pageNum, isGuest),
    getCrossCategorySuggestions(filters, { isGuest }),
  ]);

  return (
    <>
      <ListingView
        isGuest={results.isGuest}
        items={results.items}
        index={results.index}
        mapItems={results.mapItems}
        total={results.total}
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
