import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import SupplierGallery from "@/components/SupplierGallery";
import { businessSlug, getBusinessBySlug, getBusinesses } from "@/lib/businesses";
import { GROUP_COVER } from "@/lib/categories";
import type { GroupKey } from "@/lib/types";

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

/* Statik params'i gerçek (onaylı) tedarikçilerden üret — build'de DB'deki
   ilanlar prebuild edilir; env yoksa getBusinesses seed'e düşer. İlk 200 ile
   sınırlı tutulur, kalan id'ler ilk ziyarette PPR ile üretilir. */
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

  // Firma sorgusu ve çeviriler birbirine bağlı değil — paralel çekiliyor.
  const [b, t, tc, tCommon] = await Promise.all([
    getBusinessBySlug(id),
    getTranslations("supplier"),
    getTranslations("cat"),
    getTranslations("common"),
  ]);
  if (!b) notFound();
  const services = [b.type, t("svcGroupDiscount"), t("svcTransfer"), t("svcCommission")];
  const cover = b.image ?? GROUP_COVER[b.group];
  const gallery = getGalleryImages(cover, b.group);

  return (
    <main className="container-px pb-8 pt-[100px]">
      <nav className="mb-4 flex flex-wrap items-center gap-2 text-[13px] text-muted">
        <Link href="/" className="hover:text-ink">{t("home")}</Link><span>›</span>
        <Link href="/kesfet" className="hover:text-ink">{t("explore")}</Link><span>›</span>
        <Link href={`/kesfet?cat=${b.group}`} className="hover:text-ink">{tc(b.group)}</Link><span>›</span>
        <strong className="text-ink">{b.name}</strong>
      </nav>

      <SupplierGallery
        images={gallery}
        title={b.name}
        eyebrow={`${tc(b.group)} · ${b.type}`}
        adLabel={tCommon("ad")}
        sponsored={b.sponsored}
      />

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)_360px] items-start gap-7 max-[900px]:grid-cols-1">
        <article>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[clamp(26px,3vw,38px)]">{b.name}</h1>
            {b.verified && <span className="text-[12px] font-bold text-group-acente">✓ {tCommon("verified")}</span>}
          </div>
          <p className="mt-2 text-[14.5px] text-muted">
            {tc(b.group)} · {b.type} &nbsp;|&nbsp; {b.district}, {b.city} · {b.country}
            &nbsp;|&nbsp; <span className="text-gold">★ {b.rating.toFixed(1)}</span> ({b.reviews})
          </p>

          <h2 className="mt-7 text-[22px]">{t("about")}</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{b.desc}</p>

          <h2 className="mt-7 text-[22px]">{t("services")}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {services.map((sv) => (
              <span key={sv} className="rounded-pill border border-line bg-cream px-3 py-1.5 text-[13px] font-medium">{sv}</span>
            ))}
          </div>

          <div className="mt-7 rounded-[14px] border border-dashed border-line bg-cream px-5 py-4 text-[13.5px] text-muted">
            {t("gated")} <Link href="/giris" className="font-semibold text-terra">{t("loginCta")}</Link>.
          </div>
        </article>

        <aside className="flex flex-col gap-4">
          <div className="rounded-[16px] border border-line bg-paper p-5 shadow-card">
            <h3 className="text-[18px]">{t("quoteTitle")}</h3>
            <p className="mt-1 text-[13.5px] text-muted">{t("quoteSub")}</p>
            <Link href={`/teklif?s=${b.id}`} className="btn btn-solid btn-block mt-4">{t("requestQuote")}</Link>
          </div>
          <div className="rounded-[16px] border border-line bg-paper p-5 shadow-card">
            <h3 className="mb-3 text-[18px]">{t("quickInfo")}</h3>
            <Row k={t("category")} v={`${tc(b.group)} · ${b.type}`} />
            <Row k={t("location")} v={`${b.city}, ${b.country}`} />
            <Row k={t("rating")} v={`★ ${b.rating.toFixed(1)} (${b.reviews})`} />
            <Row k={t("verification")} v={b.verified ? t("verifiedDone") : t("verifiedPending")} />
          </div>
        </aside>
      </div>
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 border-t border-line py-2 text-[13.5px] first:border-t-0">
      <span className="text-muted">{k}</span>
      <span className="font-medium text-ink">{v}</span>
    </div>
  );
}

function getGalleryImages(cover: string, group: GroupKey): string[] {
  return Array.from(new Set([cover, ...GALLERY_BY_GROUP[group]]));
}
