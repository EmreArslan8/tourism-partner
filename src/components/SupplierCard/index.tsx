"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, type Href } from "@/i18n/navigation";
import { GROUP_COLORS, serviceTranslationKey } from "@/lib/categories";
import { businessImageUrl } from "@/lib/business-images";
import { businessDescription } from "@/lib/business-localization";
import type { Business } from "@/lib/types";
import styles from "./styles";
import Badge from "@/components/common/Badge";
import ImpressionTracker from "@/components/ImpressionTracker";
import FavoriteButton from "@/components/FavoriteButton";
import Logo from "@/components/Logo";
import BusinessBadges from "@/components/BusinessBadges";
import { cn } from "@/lib/utils";

/* Ortak tedarikçi kartı. `flag` rozeti, `showStars` puan yıldızları,
   `children` ise alt aksiyon alanını verir. Server ve client'ta çalışır.
   `impressionId` verilirse kart ekrana gelince impression sayılır (arama listesi).
   `href` verilirse kartın gövdesi (görsel + metin) komple tıklanır → detay; alttaki
   butonlar (Detay/Teklif) üstte kalıp kendi aksiyonlarını korur (stretched-link). */
const SupplierCard = ({
  business,
  flag = null,
  showStars = false,
  impressionId,
  href,
  horizontal = false,
  children,
}: {
  business: Business;
  flag?: string | null;
  showStars?: boolean;
  impressionId?: number;
  href?: Href;
  /** Yatay düzen (görsel solda) — explore tam genişlik listesi için. */
  horizontal?: boolean;
  children: ReactNode;
}) => {
  const locale = useLocale();
  const tc = useTranslations("cat");
  const ts = useTranslations("service");
  const tCommon = useTranslations("common");
  const cover = businessImageUrl(business.image);
  const businessTypeKey = serviceTranslationKey(business.type);
  const [imageFailed, setImageFailed] = useState(false);
  const hasCover = Boolean(cover && !imageFailed);
  const flagLabel = flag;
  const hasRating = showStars && business.rating > 0 && business.reviews > 0;

  return (
    <article
      className={cn(
        horizontal ? styles.cardH : styles.card,
        business.sponsored && styles.premiumCard,
        "relative",
      )}
    >
      {impressionId != null && <ImpressionTracker id={impressionId} />}
      {href && (
        <Link href={href} aria-label={business.name} className="absolute inset-0 z-[1] rounded-card" />
      )}
      <div className={styles.favorite}>
        <FavoriteButton businessId={business.id} variant="icon" />
      </div>
      <div className={horizontal ? styles.coverH : styles.cover} style={{ backgroundColor: GROUP_COLORS[business.group] }}>
        {hasCover && cover ? (
          <Image
            src={cover}
            alt={business.name}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className={styles.coverImg}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderLogo}><Logo href={null} height={34} variant="light" /></span>
            <span className={styles.placeholderLabel}>Tourism Partner</span>
          </div>
        )}
        <span className={styles.coverGrad} aria-hidden />
        {business.sponsored ? (
          <BusinessBadges
            verified={business.verified}
            founderPartner={business.founderPartner}
            sponsored={business.sponsored}
            labels={{
              verified: tCommon("verified"),
              founder: tCommon("founderPartner"),
              premium: tCommon("ad"),
            }}
            mode="premium"
            premiumVariant="onImage"
            className={styles.flag}
            premiumClassName={styles.premiumFlag}
          />
        ) : (
          flagLabel && <Badge className={styles.flag}>{flagLabel}</Badge>
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.tags}>
          <Badge className={styles.badge}>{tc(business.group)} · {businessTypeKey ? ts(businessTypeKey) : business.type}</Badge>
          {(business.serviceTypes?.length ?? 0) > 1 && (
            <Badge className={styles.badge}>{tCommon("moreServices", { count: business.serviceTypes!.length - 1 })}</Badge>
          )}
        </div>
        <div className={styles.nameWrap}>
          <h3 className={styles.name}>{business.name}</h3>
          <BusinessBadges
            verified={business.verified}
            founderPartner={business.founderPartner}
            sponsored={business.sponsored}
            labels={{
              verified: tCommon("verified"),
              founder: tCommon("founderPartner"),
              premium: tCommon("ad"),
            }}
            mode="identity"
            size="sm"
            verifiedClassName={styles.verifiedBadge}
            founderClassName={styles.partnerMedal}
          />
        </div>
        <p className={styles.loc}>
          <span>{business.district}, {business.city} · {business.country}</span>
          {hasRating && <span className={styles.rating}><span className="text-star">★</span> {business.rating.toFixed(1)}</span>}
        </p>
        <p className={styles.desc}>{businessDescription(business, locale)}</p>
        <div className={`${styles.foot} relative z-[2]`}>
          <div className={styles.actions}>{children}</div>
        </div>
      </div>
    </article>
  );
};

export default SupplierCard;
