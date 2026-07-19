"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SectionHeader from "@/components/common/SectionHeader";
import { businessSlug } from "@/lib/business-slug";
import { GROUP_COLORS, serviceTranslationKey } from "@/lib/categories";
import { realBusinessImages } from "@/lib/business-images";
import { featuredFacetTags } from "@/lib/facets";
import { businessDescription } from "@/lib/business-localization";
import { premiumVisibilityRank } from "@/lib/business-visibility";
import { profileScore } from "@/lib/listing";
import type { Business } from "@/lib/types";
import Button from "@/components/common/Button";
import PremiumPartnerBadge from "@/components/PremiumPartnerBadge";
import ImpressionTracker from "@/components/ImpressionTracker";
import styles from "./styles";

const galleryFor = (b: Business): string[] => realBusinessImages(b.image, b.images).slice(0, 4);
const SHOWCASE_LIMIT = 5;

const shuffle = <T,>(items: T[]) => {
  const list = [...items];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
};

function rankedShowcaseBusinesses(businesses: Business[]) {
  return businesses
    .filter((business) => premiumVisibilityRank(business) > 0 && galleryFor(business).length > 0)
    .sort(
      (a, b) =>
        premiumVisibilityRank(b) - premiumVisibilityRank(a) ||
        b.rating - a.rating ||
        profileScore(b) - profileScore(a),
    );
}

function balancedShowcaseBusinesses(businesses: Business[]) {
  const premium = businesses.filter((business) => premiumVisibilityRank(business) === 2);
  const timedDoping = businesses.filter((business) => premiumVisibilityRank(business) === 1);
  return [...shuffle(premium), ...shuffle(timedDoping)].slice(0, SHOWCASE_LIMIT);
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return direction === "left" ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  );
}

/* Tek slide: solda galeri (kendi aktif görsel state'i), sağda bilgiler. */
const Slide = ({ business }: { business: Business }) => {
  const locale = useLocale();
  const tc = useTranslations("cat");
  const tv = useTranslations("common");
  const ts = useTranslations("supplier");
  const tService = useTranslations("service");
  const tFacet = useTranslations("facet");
  const tShowcase = useTranslations("showcase");
  const imgs = galleryFor(business);
  const [act, setAct] = useState(0);
  const touchX = useRef<number | null>(null);

  /* Mobilde galeriyi yatay kaydırarak görsel değiştir (thumbnail'e basmaya gerek yok). */
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) {
      const n = imgs.length;
      setAct((p) => (dx < 0 ? (p + 1) % n : (p - 1 + n) % n));
    }
    touchX.current = null;
  };
  const businessTypeKey = serviceTranslationKey(business.type);
  const businessType = businessTypeKey ? tService(businessTypeKey) : business.type;
  const services = [
    businessType,
    ...featuredFacetTags(business, 5).map((tag) => tFacet(tag.slug)),
  ];
  const placeholder = tShowcase("imagePending");
  const imageLabel = tShowcase("image");

  return (
    <div className={styles.slide} data-tour="supplier-showcase">
      <ImpressionTracker id={business.id} />
      <div className={styles.panel}>
        {/* SOL — galeri */}
        <div
          className={styles.gallery}
          style={{ backgroundColor: GROUP_COLORS[business.group] }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {imgs[act] ? (
            <Image src={imgs[act]} alt={business.name} fill sizes="(max-width:860px) 100vw, 55vw" className={styles.galleryImg} />
          ) : (
            <div className={styles.placeholder}>{placeholder}</div>
          )}
          {business.sponsored && <PremiumPartnerBadge label={tv("ad")} className={styles.premium} />}
          {/* Masaüstü/tablet: tıklanabilir thumbnail'ler */}
          <div className={styles.thumbs}>
            {imgs.map((src, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${imageLabel} ${i + 1}`}
                onClick={() => setAct(i)}
                className={i === act ? styles.thumbActive : styles.thumb}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
          {/* Mobil: kaydırma göstergesi (nokta) */}
          <div className={styles.galleryDots} aria-hidden>
            {imgs.map((_, i) => (
              <span key={i} className={i === act ? styles.galleryDotActive : styles.galleryDot} />
            ))}
          </div>
        </div>

        {/* SAĞ — bilgiler */}
        <div className={styles.info}>
          <h3 className={styles.name}>{business.name}</h3>
          <p className={styles.categoryText}>{tc(business.group)} · {businessType}</p>

          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-4.5-7-10a7 7 0 0 1 14 0c0 5.5-7 10-7 10Z" /><circle cx="12" cy="11" r="2.5" /></svg>
              {business.district}, {business.city}
            </span>
            <span className={styles.metaDot} />
            <span className={styles.metaItem}>
              <span className={styles.stars}>★</span>
              <strong className={styles.ratingNum}>{business.rating.toFixed(1)}</strong>
              <span className={styles.reviews}>({business.reviews})</span>
            </span>
          </div>

          <p className={styles.desc}>{businessDescription(business, locale)}</p>

          {services.length > 0 && (
            <div className={styles.services}>
              <span className={styles.servicesLabel}>{ts("services")}</span>
              <div className={styles.chips}>
                {services.map((s, idx) => <span key={`${s}-${idx}`} className={styles.chip}>{s}</span>)}
              </div>
            </div>
          )}

          <div className={styles.foot}>
            <Button
              href={{ pathname: "/supplier/[id]", params: { id: businessSlug(business) } }}
              variant="solid"
              size="md"
              className={styles.detailButton}
            >
              {tv("detail")}
            </Button>
            <Link href={{ pathname: "/quote", query: { s: business.id.toString() } }} className={styles.quote}>{tv("requestQuote")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Öne çıkan iş ortakları — tam genişlikte, tek tek kayan carousel. */
const Showcase = ({ businesses }: { businesses: Business[] }) => {
  const locale = useLocale();
  const t = useTranslations("showcase");
  const rankedItems = useMemo(() => rankedShowcaseBusinesses(businesses), [businesses]);
  const [balancedItems, setBalancedItems] = useState<Business[] | null>(null);
  const items = balancedItems ?? rankedItems.slice(0, SHOWCASE_LIMIT);
  const [i, setI] = useState(0);
  const isRtl = locale === "ar";

  useEffect(() => {
    const id = window.setTimeout(() => {
      setBalancedItems(balancedShowcaseBusinesses(rankedItems));
      setI(0);
    }, 0);
    return () => window.clearTimeout(id);
  }, [rankedItems]);

  if (items.length === 0) return null;
  const go = (d: number) => setI((p) => (p + d + items.length) % items.length);

  return (
    <section id="vitrin">
      <div className={styles.head}>
        <SectionHeader
          className={styles.copy}
          eyebrow={t("eyebrow")}
          title={t("title")}
          desc={t("sub")}
          eyebrowClassName={styles.eyebrow}
          titleClassName={styles.title}
          descClassName={styles.sub}
        />
        <div className={styles.nav}>
          <button type="button" aria-label={t("prev")} className={styles.arrow} onClick={() => go(-1)}>
            <ArrowIcon direction={isRtl ? "right" : "left"} />
          </button>
          <button type="button" aria-label={t("next")} className={styles.arrow} onClick={() => go(1)}>
            <ArrowIcon direction={isRtl ? "left" : "right"} />
          </button>
        </div>
      </div>

      <div className={styles.viewport}>
        <div className={styles.track} style={{ transform: `translateX(-${i * 100}%)` }}>
          {items.map((b) => <Slide key={b.id} business={b} />)}
        </div>
      </div>
    </section>
  );
};

export default Showcase;
