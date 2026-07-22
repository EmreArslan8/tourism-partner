import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { BadgeCheck, Eye } from "lucide-react";
import { SOCIAL_ICONS } from "@/components/SocialIcons";
import ServicesList from "./ServicesList";
import AboutText from "./AboutText";
import type { FeaturedFacetTag } from "@/lib/facets";
import { serviceTranslationKey } from "@/lib/categories";
import { businessDescription } from "@/lib/business-localization";
import SupplierGallery from "@/components/SupplierGallery";
import Button from "@/components/common/Button";
import RecordView from "@/components/RecordView";
import FavoriteButton from "@/components/FavoriteButton";
import ShareButton from "@/components/ShareButton";
import ReviewsSection from "@/components/ReviewsSection";
import type { Business, SocialPlatform } from "@/lib/types";
import type { PublicBusinessPartner } from "@/lib/business-partners";
import styles from "./styles";

type TranslationFn = (key: string) => string;

interface Props {
  b: Business;
  partners: PublicBusinessPartner[];
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

const SupplierDetailView = ({ b, partners, contactSection, t, tc, tCommon, tService, services, gallery, locale, preview = false }: Props) => {
  const translateService = (value: string) => {
    const key = serviceTranslationKey(value);
    return key ? tService(key) : value;
  };
  const businessType = translateService(b.type);
  const socialEntries = Object.entries(b.socials ?? {}).filter(
    (entry): entry is [SocialPlatform, string] => Boolean(entry[1]) && entry[0] in SOCIAL_ICONS
  );
  return (
    <main className={styles.main}>
      {!preview && <RecordView type="business" id={b.id} />}
      {preview && (
        <div className="mb-4 flex items-center gap-3 rounded-[12px] border border-amber-300 bg-amber-50 px-4 py-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700">
            <Eye size={18} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-[13.5px] font-extrabold text-amber-900">{t("previewTitle")}</p>
            <p className="mt-0.5 text-[12.5px] font-medium leading-snug text-amber-800">{t("previewSub")}</p>
          </div>
        </div>
      )}
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>{t("home")}</Link><span>›</span>
        <Link href={{ pathname: "/explore" }} className={styles.navLink}>{t("explore")}</Link><span>›</span>
        <Link href={{ pathname: "/explore", query: { cat: b.group } }} className={styles.navLink}>{tc(b.group)}</Link>
      </nav>

      <header className={styles.heroHead}>
        <div>
          <div className={styles.titleWrap}>
            <h1 className={styles.title}>{b.name}</h1>
            {b.founderPartner && (
              <span
                className={styles.founderBadge}
                title={tCommon("founderPartner")}
                aria-label={tCommon("founderPartner")}
              >
                <BadgeCheck size={28} strokeWidth={2.35} aria-hidden />
              </span>
            )}
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

      <SupplierGallery
        images={gallery}
        title={b.name}
        eyebrow={`${tc(b.group)} · ${businessType}`}
        adLabel={tCommon("ad")}
        sponsored={b.sponsored}
      />

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

          <section className={styles.partners} aria-labelledby="profile-partners">
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
          </section>

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
            <h3 className={cn(styles.cardTitle, "mb-3")}>{t("quickInfo")}</h3>
            <Row k={t("category")} v={`${tc(b.group)} · ${businessType}`} />
            <Row k={t("location")} v={`${b.city}, ${b.country}`} />
            <Row
              k={t("rating")}
              v={
                <>
                  <span className="text-star">★</span> {b.rating.toFixed(1)} ({b.reviews})
                </>
              }
            />
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
        className={cn(styles.rowVal, "text-terra hover:underline")}
      >
        {v}
      </a>
    ) : (
      <span className={styles.rowVal}>{v}</span>
    )}
  </div>
);

import { cn } from "@/lib/utils";

export default SupplierDetailView;
