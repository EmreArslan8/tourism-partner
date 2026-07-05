import { setRequestLocale } from "next-intl/server";
import ListingView from "@/components/ListingView";
import SuggestionRail from "@/components/SuggestionRail";
import { getExploreData } from "@/lib/explore-data";
import { getCrossCategorySuggestions } from "@/lib/suggestions";
import { parseExploreFilters, type ExploreSearchParams } from "@/lib/explore-filters";
import ExploreView from "./view";

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
  const { businesses, isGuest } = await getExploreData();
  const suggestions = await getCrossCategorySuggestions(filters, { isGuest });

  return (
    <>
      <ListingView
        isGuest={isGuest}
        businesses={businesses}
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
