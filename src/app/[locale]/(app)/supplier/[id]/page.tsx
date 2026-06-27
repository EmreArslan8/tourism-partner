import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { businessSlug, getBusinessBySlug, getBusinesses } from "@/lib/businesses";
import { GROUP_COVER } from "@/lib/categories";
import type { GroupKey } from "@/lib/types";
import SupplierDetailView from "./view";

const GALLERY_BY_GROUP: Record<GroupKey, string[]> = {
  konaklama: [
    "/assets/cards/hotel-1.jpg",
    "/assets/cards/hotel-2.jpg",
    "/assets/cards/hotel-3.jpg",
    "/assets/cards/resort-1.jpg",
  ],
  acente: ["/assets/cards/agency-1.jpg", "/assets/hero-turizm-b2b-v2.png"],
  rehber: ["/assets/cards/guide-1.jpg", "/assets/cards/hotel-3.jpg"],
  eglence: [
    "/assets/cards/balloon-1.jpg",
    "/assets/cards/yacht-1.jpg",
    "/assets/cards/resort-1.jpg",
  ],
  saglik: ["/assets/cards/clinic-1.jpg", "/assets/cards/hotel-2.jpg"],
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
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const b = await getBusinessBySlug(id);
  return { title: b ? `${b.name} — Tourism Partner` : "Tourism Partner" };
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
  const gallery = Array.from(new Set([cover, ...GALLERY_BY_GROUP[b.group]]));

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
