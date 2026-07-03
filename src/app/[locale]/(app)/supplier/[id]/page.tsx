import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { businessSlug, getBusinessBySlug, getBusinesses } from "@/lib/businesses";
import { supplierPath } from "@/lib/site";
import { realBusinessImages } from "@/lib/business-images";
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
  const canonical = supplierPath(locale === "en" ? "en" : "tr", businessSlug(b));

  return {
    title,
    description,
    keywords: b.seoKeywords,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: "profile",
      url: canonical,
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
  
  const services = [b.type, t("svcGroupDiscount"), t("svcTransfer"), t("svcCommission")];
  const gallery = realBusinessImages(b.image, b.images);

  return (
    <SupplierDetailView
      b={b}
      t={t}
      tc={tc}
      tCommon={tCommon}
      services={services}
      gallery={gallery}
    />
  );
}
