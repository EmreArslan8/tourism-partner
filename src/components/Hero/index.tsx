import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import HeroSearch from "@/components/HeroSearch";
import type { Business } from "@/lib/types";
import { styles } from "./styles";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E\")";

const POPULAR = [
  { href: "/kesfet?city=İstanbul&cat=konaklama", key: "pop1" },
  { href: "/kesfet?city=Nevşehir&q=balon", key: "pop2" },
  { href: "/kesfet?city=Antalya&cat=acente", key: "pop3" },
  { href: "/kesfet?cat=saglik&city=Ankara", key: "pop4" },
] as const;

const STATS = [
  { n: "4.700+", key: "statSuppliers" },
  { n: "18", key: "statCities" },
  { n: "3", key: "statCountries" },
  { n: "~4 sa", key: "statResponse" },
] as const;

/* Eski HTML'deki hero görseli + degrade + grain + güven şeridi (Next/Image ile). */
export default function Hero({ businesses }: { businesses: Business[] }) {
  const t = useTranslations("hero");
  return (
    <section className={styles.section}>
      <Image src="/assets/hero-turizm-b2b-v2.png" alt="" fill priority sizes="100vw" className={`-z-10 ${styles.image}`} />
      <div className={styles.overlay} />
      <div className={styles.grain} style={{ backgroundImage: GRAIN }} />

      <div className={styles.inner}>
        <h1 className={styles.title}>
          {t("titlePre")}<em>{t("titleEm")}</em>{t("titlePost")}
        </h1>
        <p className={styles.sub}>{t("sub")}</p>

        <div className={styles.searchWrap}>
          <HeroSearch businesses={businesses} />
        </div>

        <div className={styles.pop}>
          <span className={styles.popLabel}>{t("popularLabel")}</span>
          {POPULAR.map((p) => (
            <Link key={p.href} href={p.href} className={styles.popLink}>{t(p.key)}</Link>
          ))}
        </div>

        <div className={styles.stats} aria-label="Stats">
          {STATS.map((st) => (
            <div key={st.key} className={styles.stat}>
              <strong className={styles.statNum}>{st.n}</strong>
              <span className={styles.statLabel}>{t(st.key)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
