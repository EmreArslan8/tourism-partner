import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import QuoteForm, { type QuoteInitialFilters } from "@/components/QuoteForm";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { getBusinessById } from "@/lib/businesses";
import { ALL_FACET_SLUGS } from "@/lib/facets";
import { localeAlternates } from "@/lib/seo";
import type { SiteLocale } from "@/lib/site";
import type { GroupKey } from "@/lib/types";
import QuoteView from "./view";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<QuoteSearchParams>;
}): Promise<Metadata> {
  const [{ locale }, filters] = await Promise.all([params, searchParams]);
  const isFiltered = Object.values(filters).some((value) => value !== undefined && value !== "");

  return {
    // ?cat=, ?type=, ?city= ve ?s= gibi varyasyonlar aynı formun önceden
    // doldurulmuş kopyalarıdır; ayrı arama sonucu olmamalıdır.
    robots: isFiltered ? { index: false, follow: true } : { index: true, follow: true },
    // Parametrelerden bağımsız olarak temiz teklif URL'sini kanonik tut.
    alternates: localeAlternates(locale as SiteLocale, "/quote"),
  };
}

const QuotePage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<QuoteSearchParams>;
}) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <QuoteView>
      <QuoteFormWithBusiness searchParams={searchParams} />
    </QuoteView>
  );
}

async function QuoteFormWithBusiness({
  searchParams,
}: {
  searchParams: Promise<QuoteSearchParams>;
}) {
  const sp = await searchParams;
  const business = sp.s ? await getBusinessById(sp.s) : null;
  return <QuoteForm business={business} initialFilters={business ? undefined : parseQuoteFilters(sp)} />;
}

type QuoteSearchParams = {
  s?: string;
  cat?: string;
  type?: string;
  country?: string;
  city?: string;
  district?: string;
  q?: string;
  rating?: string;
  attr?: string;
};

const GROUPS = new Set(CATEGORY_GROUPS.map((group) => group.key));
const TYPES = new Set(CATEGORY_GROUPS.flatMap((group) => group.children.map((child) => child.label)));

function parseQuoteFilters(sp: QuoteSearchParams): QuoteInitialFilters {
  const group = sp.cat?.split(",").find((value): value is GroupKey => GROUPS.has(value as GroupKey));
  const types = sp.type?.split(",").filter((value) => TYPES.has(value)) ?? [];
  const validTypesForGroup = group
    ? CATEGORY_GROUPS.find((item) => item.key === group)?.children.map((child) => child.label) ?? []
    : [];
  const primaryType = types.find((type) => validTypesForGroup.includes(type)) ?? types[0];
  return {
    group,
    types: [primaryType, ...types.filter((type) => type !== primaryType)].filter(Boolean),
    country: sp.country && sp.country !== "all" ? sp.country : undefined,
    city: sp.city && sp.city !== "all" ? sp.city : undefined,
    district: sp.district && sp.district !== "all" ? sp.district : undefined,
    q: sp.q?.trim() || undefined,
    attrs: sp.attr?.split(",").filter((slug) => ALL_FACET_SLUGS.has(slug)) ?? [],
  };
}

export default QuotePage;
