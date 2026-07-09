import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { businessSlug, getBusinessBySlug, getBusinesses } from "@/lib/businesses";
import { INDEXING_ENABLED, type SiteLocale } from "@/lib/site";
import { localeAlternates } from "@/lib/seo";
import { realBusinessImages } from "@/lib/business-images";
import { getBusinessPartners } from "@/lib/business-partners";
import { featuredFacetTags } from "@/lib/facets";
import SupplierDetailView from "./view";

export async function generateStaticParams() {
  const businesses = await getBusinesses();
  return routing.locales.flatMap((locale) =>
    businesses.slice(0, 200).map((b) => ({ locale, id: businessSlug(b) }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const b = await getBusinessBySlug(id);
  if (!b) return { title: "Tourism Partner" };

  // Public, index'lenebilir profil (Brief §3B): Google deep-link + organik trafik.
  const title = b.seoTitle || `${b.name} — ${b.city} · Tourism Partner`;
  const description =
    b.seoDescription ||
    (b.desc ? b.desc.slice(0, 160) : `${b.name}, ${b.city}/${b.country} · ${b.type}`);
  const alternates = localeAlternates(locale as SiteLocale, {
    pathname: "/supplier/[id]",
    params: { id: businessSlug(b) },
  });

  return {
    title,
    description,
    keywords: b.seoKeywords,
    alternates,
    robots: { index: INDEXING_ENABLED, follow: INDEXING_ENABLED },
    openGraph: {
      title,
      description,
      type: "profile",
      url: alternates.canonical as string,
      images: b.ogImage || b.image ? [{ url: b.ogImage || b.image! }] : undefined,
    },
  };
}

export default async function DetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const [b, t, tc, tCommon] = await Promise.all([
    getBusinessBySlug(id),
    getTranslations("supplier"),
    getTranslations("cat"),
    getTranslations("common"),
  ]);
  
  if (!b) notFound();
  
  const [partners] = await Promise.all([
    getBusinessPartners(b.id),
  ]);
  const services = featuredFacetTags(b).map((tag) => tag.label);
  const gallery = realBusinessImages(b.image, b.images);

  return (
    <SupplierDetailView
      b={b}
      partners={partners}
      t={t}
      tc={tc}
      tCommon={tCommon}
      services={services}
      gallery={gallery}
    />
  );
}
