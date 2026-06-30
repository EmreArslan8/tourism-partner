import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { businessSlug, getBusinessBySlug, getBusinesses } from "@/lib/businesses";
import { supplierPath } from "@/lib/site";
import { GROUP_COVER } from "@/lib/categories";
import type { GroupKey } from "@/lib/types";
import SupplierDetailView from "./view";

const GALLERY_BY_GROUP: Record<GroupKey, string[]> = {
  konaklama: [
    "/assets/cards/hotel-1.webp",
    "/assets/cards/hotel-2.webp",
    "/assets/cards/hotel-3.webp",
    "/assets/cards/resort-1.webp",
  ],
  acente: ["/assets/cards/agency-1.webp", "/assets/cards/agency-1.webp"],
  rehber: ["/assets/cards/guide-1.webp", "/assets/cards/hotel-3.webp"],
  eglence: [
    "/assets/cards/balloon-1.webp",
    "/assets/cards/yacht-1.webp",
    "/assets/cards/resort-1.webp",
  ],
  saglik: ["/assets/cards/clinic-1.webp", "/assets/cards/hotel-2.webp"],
};

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
  const cover = b.image ?? GROUP_COVER[b.group];
  const gallery = Array.from(new Set([cover, ...(b.images?.length ? b.images : GALLERY_BY_GROUP[b.group])]));

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
