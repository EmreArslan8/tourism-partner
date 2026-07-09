import type { ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { BadgeCheck } from "lucide-react";
import { Link, type Href } from "@/i18n/navigation";
import { GROUP_COLORS } from "@/lib/categories";
import { businessImageUrl } from "@/lib/business-images";
import type { Business } from "@/lib/types";
import styles from "./styles";
import Badge from "@/components/common/Badge";
import ImpressionTracker from "@/components/ImpressionTracker";
import FavoriteButton from "@/components/FavoriteButton";

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
  const cover = businessImageUrl(business.image);

  return (
    <article className={`${styles.card} relative`}>
      {impressionId != null && <ImpressionTracker id={impressionId} />}
      {href && (
        <Link href={href} aria-label={business.name} className="absolute inset-0 z-[1] rounded-card" />
      )}
      <div className={styles.cover} style={{ backgroundColor: GROUP_COLORS[business.group] }}>
        {cover ? (
          <Image
            src={cover}
            alt={business.name}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className={styles.coverImg}
          />
        ) : (
          <div className={styles.placeholder}>Görsel bekleniyor</div>
        )}
        <span className={styles.coverGrad} aria-hidden />
        <div className={styles.favorite}>
          <FavoriteButton businessId={business.id} variant="icon" />
        </div>
        {flag && <Badge variant="gold" className={styles.flag}>{flag}</Badge>}
      </div>
      <div className={styles.body}>
        <div className={styles.tags}>
          <Badge className={styles.badge}>{tc(business.group)} · {business.type}</Badge>
        </div>
        <div className={styles.nameWrap}>
          <h3 className={styles.name}>{business.name}</h3>
          {business.founderPartnerNumber && (
            <span
              className={styles.founderBadge}
              title={`Kurucu Partner #${business.founderPartnerNumber}`}
              aria-label={`Kurucu Partner #${business.founderPartnerNumber}`}
            >
              <BadgeCheck size={16} strokeWidth={2.5} aria-hidden />
            </span>
          )}
        </div>
        <p className={styles.loc}>
          <span>{business.district}, {business.city} · {business.country}</span>
          {showStars && <span className={styles.rating}>★ {business.rating.toFixed(1)}</span>}
        </p>
        <p className={styles.desc}>{business.desc}</p>
        <div className={`${styles.foot} relative z-[2]`}>{children}</div>
      </div>
    </article>
  );
};

export default SupplierCard;
