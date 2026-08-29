import type { ReactNode } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Eye } from "lucide-react";
import { SOCIAL_ICONS } from "@/components/SocialIcons";
import ServicesList from "./ServicesList";
import AboutText from "./AboutText";
import type { FeaturedFacetTag } from "@/lib/facets";
import { serviceTranslationKey, groupUrlSlug } from "@/lib/categories";
import { businessDescription } from "@/lib/business-localization";
import SupplierGallery from "@/components/SupplierGallery";
import { businessImageUrl } from "@/lib/business-images";
import Button from "@/components/common/Button";
import RecordView from "@/components/RecordView";
import FavoriteButton from "@/components/FavoriteButton";
import ShareButton from "@/components/ShareButton";
import ReviewsSection from "@/components/ReviewsSection";
import BusinessBadges from "@/components/BusinessBadges";
import type { Business, SocialPlatform } from "@/lib/types";
import type { PublicBusinessPartner } from "@/lib/business-partners";
import { cn } from "@/lib/utils";
import styles from "./styles";

type TranslationFn = (key: string) => string;

interface Props {
  b: Business;
  partners: PublicBusinessPartner[];
  partnerFeatureEnabled: boolean;
  contactSection: ReactNode;
  t: TranslationFn;
  tc: TranslationFn;
  tCommon: TranslationFn;
  tService: TranslationFn;
  services: FeaturedFacetTag[];
  gallery: string[];
  locale: string;
  /** Sahibin henüz yayında olmayan (pending) ilanını önizleme modunda gösterir. */
  preview?: boolean;
}

const SupplierDetailView = ({ b, partners, partnerFeatureEnabled, contactSection, t, tc, tCommon, tService, services, gallery, locale, preview = false }: Props) => {
  const translateService = (value: string) => {
    const key = serviceTranslationKey(value);
    return key ? tService(key) : value;
  };
  const businessType = translateService(b.type);
  // Başlık yanındaki avatar her zaman kapak görseli; galeri kapağı içermez (bkz. realBusinessGalleryImages).
  const cover = businessImageUrl(b.image);
  const socialEntries = Object.entries(b.socials ?? {}).filter(
    (entry): entry is [SocialPlatform, string] => Boolean(entry[1]) && entry[0] in SOCIAL_ICONS
  );
  // Harita yalnızca gerçek koordinat varsa; lat/lng boşsa coords [0,0] olur (Gine
  // Körfezi) — yanlış pin göstermek yerine haritayı gizleyip sadece adresi bırakırız.
  const [lat, lng] = b.coords;
  const hasCoords =
    Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180 && !(lat === 0 && lng === 0);
  return (
    <main className={cn(styles.main, b.sponsored && styles.premiumProfile)}>
      {!preview && <RecordView type="business" id={b.id} />}
      {preview && (
        <div className="mb-4 flex items-center gap-3 rounded-[12px] border border-amber-300 bg-amber-50 px-4 py-3 dark:border-amber-500/40 dark:bg-amber-950/40">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
            <Eye size={18} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-[13.5px] font-extrabold text-amber-900 dark:text-amber-100">{t("previewTitle")}</p>
            <p className="mt-0.5 text-[12.5px] font-medium leading-snug text-amber-800 dark:text-amber-200">{t("previewSub")}</p>
          </div>
        </div>
      )}
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>{t("home")}</Link><span>›</span>
        <Link href={{ pathname: "/explore" }} className={styles.navLink}>{t("explore")}</Link><span>›</span>
        <Link href={{ pathname: "/explore", query: { cat: groupUrlSlug(b.group) } }} className={styles.navLink}>{tc(b.group)}</Link>
      </nav>

      <header className={styles.heroHead}>
        <div>
          <div className={styles.titleWrap}>
            {cover && (
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[14px] border border-line bg-panel-bg">
                <Image src={cover} alt={b.name} fill sizes="64px" className="object-cover" />
              </span>
            )}
            <h1 className={styles.title}>{b.name}</h1>
            <BusinessBadges
              verified={b.verified}
              founderPartner={b.founderPartner}
              sponsored={b.sponsored}
              labels={{
                verified: tCommon("verified"),
                founder: tCommon("founderPartner"),
                premium: tCommon("ad"),
              }}
              mode="all"
              size="lg"
              className={styles.identityBadges}
              verifiedClassName={styles.verifiedBadge}
              founderClassName={styles.founderBadge}
              premiumClassName={styles.premiumBadge}
            />
          </div>
          <p className={styles.meta}>
            {[businessType, b.district, b.city].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className={styles.heroActions}>
          <ShareButton title={b.name} />
          <FavoriteButton businessId={b.id} variant="header" />
        </div>
      </header>

      {/* Görseli olmayan ilanda galeri (ve "görsel bekleniyor" kutusu) hiç render edilmez. */}
      {gallery.length > 0 && (
        <SupplierGallery
          images={gallery}
          title={b.name}
          eyebrow={`${tc(b.group)} · ${businessType}`}
          adLabel={tCommon("ad")}
          sponsored={b.sponsored}
        />
      )}

      <div className={styles.grid}>
        <article>
          <section className={cn(styles.svcCard, "!mt-0")} aria-labelledby="profile-about">
            <h2 id="profile-about" className={styles.svcTitle}>{t("about")}</h2>
            <AboutText text={businessDescription(b, locale)} className={styles.desc} />
          </section>

          {(b.serviceTypes?.length ?? 0) > 1 && (
            <section className={styles.svcCard} aria-labelledby="profile-service-types">
              <h2 id="profile-service-types" className={styles.svcTitle}>{t("offeredServices")}</h2>
              <div className="flex flex-wrap gap-2">
                {b.serviceTypes!.map((slug) => (
                  <span key={slug} className="inline-flex items-center rounded-full border border-line bg-cream/50 px-3 py-1.5 text-[13px] font-medium text-ink">
                    {translateService(slug)}
                  </span>
                ))}
              </div>
            </section>
          )}

          {services.length > 0 && (
            <section className={styles.svcCard} aria-labelledby="profile-services">
              <h2 id="profile-services" className={styles.svcTitle}>{t("services")}</h2>
              <ServicesList tags={services} />
            </section>
          )}

          {contactSection}

          {partnerFeatureEnabled && <section className={styles.partners} aria-labelledby="profile-partners">
            <div className={styles.partnersHead}>
              <span className={styles.partnersEyebrow}>{t("partnersEyebrow")}</span>
              <h2 id="profile-partners" className={styles.partnersTitle}>{t("partnersTitle")}</h2>
              <p className={styles.partnersSub}>{t("partnersSub")}</p>
            </div>
            {partners.length > 0 ? (
              <div className={styles.partnersGrid}>
                {partners.map((partner) => (
                  <Link
                    key={partner.id}
                    href={{ pathname: "/supplier/[id]", params: { id: partner.slug || String(partner.id) } }}
                    className={styles.partnerItem}
                  >
                    <span className={styles.partnerMark}>{partner.name.slice(0, 2).toLocaleUpperCase(locale)}</span>
                    <span className={styles.partnerBody}>
                      <strong>{partner.name}</strong>
                      <small>{[tc(partner.group), translateService(partner.type), partner.city, partner.country].filter(Boolean).join(" · ")}</small>
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className={styles.partnersEmpty}>{t("partnersEmpty")}</p>
            )}
          </section>}

          <ReviewsSection businessId={b.id} />
        </article>

        <aside className={styles.aside}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>{t("quoteTitle")}</h3>
            <p className={styles.cardSub}>{t("quoteSub")}</p>
            <Button
              href={{ pathname: "/quote", query: { s: b.id.toString() } }}
              block
              className="mt-4"
            >
              {t("requestQuote")}
            </Button>
          </div>
          {/* Kurum iletişim — herkese açık (yetkili kişi bilgisi BURADA gösterilmez) */}
          {(b.phone || b.website || socialEntries.length > 0) && (
            <div className={styles.card}>
              <h3 className={cn(styles.cardTitle, "mb-3")}>{t("contactTitle")}</h3>
              {b.phone && (
                <Row k={t("phone")} v={b.phone} href={`tel:${b.phone.replace(/\s+/g, "")}`} />
              )}
              {b.website && (
                <Row
                  k={t("website")}
                  v={b.website.replace(/^https?:\/\//, "")}
                  href={b.website.startsWith("http") ? b.website : `https://${b.website}`}
                />
              )}
              <Row k={t("addressLabel")} v={`${b.district}, ${b.city} · ${b.country}`} />
              {socialEntries.length > 0 && (
                <div className={styles.socialRow}>
                  {socialEntries.map(([platform, url]) => {
                    const Icon = SOCIAL_ICONS[platform];
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={platform}
                        title={platform}
                        className={styles.socialLink}
                      >
                        <Icon size={17} aria-hidden />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className={styles.card}>
            <h3 className={cn(styles.cardTitle, "mb-3")}>{t("location")}</h3>
            <p className={cn("text-[13.5px] text-muted", hasCoords && "mb-3")}>{`${b.district}, ${b.city} · ${b.country}`}</p>
            {hasCoords && (
              <iframe
                title={`${b.name} — ${t("location")}`}
                src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&hl=${locale}&output=embed`}
                className="h-[240px] w-full overflow-hidden rounded-card-lg border border-line"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </div>

          <div className={styles.card}>
            <h3 className={cn(styles.cardTitle, "mb-3")}>{t("quickInfo")}</h3>
            <Row k={t("category")} v={`${tc(b.group)} · ${businessType}`} />
            <Row k={t("location")} v={`${b.city}, ${b.country}`} />
            {b.rating > 0 && b.reviews > 0 && (
              <Row
                k={t("rating")}
                v={
                  <>
                    <span className="text-star">★</span> {b.rating.toFixed(1)} ({b.reviews})
                  </>
                }
              />
            )}
          </div>
        </aside>
      </div>
    </main>
  );
};

const Row = ({ k, v, href }: { k: string; v: ReactNode; href?: string }) => (
  <div className={styles.row}>
    <span className={styles.rowKey}>{k}</span>
    {href ? (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
        className={cn(styles.rowVal, "text-terra hover:underline dark:text-border-purple")}
      >
        {v}
      </a>
    ) : (
      <span className={styles.rowVal}>{v}</span>
    )}
  </div>
);

export default SupplierDetailView;
