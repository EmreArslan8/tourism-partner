import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { GROUP_COLORS } from "@/lib/categories";
import { initials } from "@/lib/utils";
import type { Business } from "@/lib/types";
import { s } from "./styles";

export function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <span className={s.stars} aria-label={`${rating.toFixed(1)}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < filled ? "" : "text-line"}>★</span>
      ))}
    </span>
  );
}

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
  return (
    <article className={s.card}>
      <div className={s.cover} style={{ background: GROUP_COLORS[business.group] }}>
        {flag && <span className={s.flag}>{flag}</span>}
        <span className={s.mono}>{initials(business.name)}</span>
      </div>
      <div className={s.body}>
        <div className={s.tags}>
          <span className={s.badge}>{tc(business.group)} · {business.type}</span>
          {business.verified && <span className={s.verified}>✓ {tv("verified")}</span>}
        </div>
        <h3 className={s.name}>{business.name}</h3>
        <p className={s.loc}>
          {showStars && <Stars rating={business.rating} />}
          <span>{business.district}, {business.city} · {business.country}</span>
        </p>
        <p className={s.desc}>{business.desc}</p>
        <div className={s.foot}>{children}</div>
      </div>
    </article>
  );
}
