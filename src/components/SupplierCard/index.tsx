import type { ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { GROUP_COLORS, GROUP_COVER } from "@/lib/categories";
import type { Business } from "@/lib/types";
import { styles } from "./styles";


/* Ortak tedarikçi kartı. `flag` rozeti, `showStars` puan yıldızları,
   `children` ise alt aksiyon alanını verir. Server ve client'ta çalışır. */
export default function SupplierCard({
  business,
  flag = null,
  showStars = false,
  children,
}: {
  business: Business;
  flag?: string | null;
  showStars?: boolean;
  children: ReactNode;
}) {
  const tc = useTranslations("cat");
  const tv = useTranslations("common");
  const cover = business.image ?? GROUP_COVER[business.group];
  
  return (
    <article className={styles.card}>
      <div className={styles.cover} style={{ backgroundColor: GROUP_COLORS[business.group] }}>
        <Image
          src={cover}
          alt={business.name}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className={styles.coverImg}
        />
        <span className={styles.coverGrad} aria-hidden />
        {flag && <span className={styles.flag}>{flag}</span>}
        {showStars && <span className={styles.coverRating}>★ {business.rating.toFixed(1)}</span>}
      </div>
      <div className={styles.body}>
        <div className={styles.tags}>
          <span className={styles.badge}>{tc(business.group)} · {business.type}</span>
          {business.verified && <span className={styles.verified}>✓ {tv("verified")}</span>}
        </div>
        <h3 className={styles.name}>{business.name}</h3>
        <p className={styles.loc}>
          <span>{business.district}, {business.city} · {business.country}</span>
        </p>
        <p className={styles.desc}>{business.desc}</p>
        <div className={styles.foot}>{children}</div>
      </div>
    </article>
  );
}
