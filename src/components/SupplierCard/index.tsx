"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, type Href } from "@/i18n/navigation";
import { GROUP_COLORS } from "@/lib/categories";
import { businessImageUrl } from "@/lib/business-images";
import type { Business } from "@/lib/types";
import styles from "./styles";
import Badge from "@/components/common/Badge";
import ImpressionTracker from "@/components/ImpressionTracker";
import FavoriteButton from "@/components/FavoriteButton";
import Logo from "@/components/Logo";

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
  children,
}: {
  business: Business;
  flag?: string | null;
  showStars?: boolean;
  impressionId?: number;
  href?: Href;
  children: ReactNode;
}) => {
  const tc = useTranslations("cat");
  const tCommon = useTranslations("common");
  const cover = businessImageUrl(business.image);
  const [imageFailed, setImageFailed] = useState(false);
  const hasCover = Boolean(cover && !imageFailed);
  const flagLabel = business.sponsored ? tCommon("ad") : flag;

  return (
    <article className={`${styles.card} relative`}>
      {impressionId != null && <ImpressionTracker id={impressionId} />}
      {href && (
        <Link href={href} aria-label={business.name} className="absolute inset-0 z-[1] rounded-card" />
      )}
      <div className={styles.cover} style={{ backgroundColor: GROUP_COLORS[business.group] }}>
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
        <div className={styles.favorite}>
          <FavoriteButton businessId={business.id} variant="icon" />
        </div>
        {flagLabel && <Badge className={styles.flag}>{flagLabel}</Badge>}
      </div>
      <div className={styles.body}>
        <div className={styles.tags}>
          <Badge className={styles.badge}>{tc(business.group)} · {business.type}</Badge>
        </div>
        <div className={styles.nameWrap}>
          <h3 className={styles.name}>{business.name}</h3>
          {business.founderPartnerNumber && (
            <span
              className={styles.partnerMedal}
              title={`${tCommon("founderPartner")} #${business.founderPartnerNumber}`}
              aria-label={`${tCommon("founderPartner")} #${business.founderPartnerNumber}`}
              tabIndex={0}
            >
              <svg viewBox="0 0 48 54" aria-hidden>
                <path d="M13 30v18l11-5 11 5V30Z" fill="#ffb957" />
                <path d="M17.5 32.5v8.7l6.5-3 6.5 3v-8.7Z" fill="#0e2745" />
                <circle cx="24" cy="20" r="16" fill="#0e2745" stroke="#ffb957" strokeWidth="5" />
                <path d="m24 9 3.2 6.5 7.2 1-5.2 5 1.2 7.1-6.4-3.4-6.4 3.4 1.2-7.1-5.2-5 7.2-1Z" fill="#ffb957" />
              </svg>
              <span className={styles.partnerTooltip} role="tooltip">{tCommon("founderPartnerTooltip")}</span>
            </span>
          )}
        </div>
        <p className={styles.loc}>
          <span>{business.district}, {business.city} · {business.country}</span>
          {showStars && <span className={styles.rating}>★ {business.rating.toFixed(1)}</span>}
        </p>
        <p className={styles.desc}>{business.desc}</p>
        <div className={`${styles.foot} relative z-[2]`}>
          <div className={styles.actions}>{children}</div>
        </div>
      </div>
    </article>
  );
};

export default SupplierCard;
