import { getImageProps } from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import HeroSearch from "@/components/HeroSearch";
import type { Business } from "@/lib/types";
import styles from "./styles";

const STATS = [
  { n: "4.700+", key: "statSuppliers" },
  { n: "18", key: "statCities" },
  { n: "3", key: "statCountries" },
  { n: "~4 sa", key: "statResponse" },
] as const;

const commonImageProps = {
  alt: "",
  sizes: "100vw",
};

const {
  props: { srcSet: desktopSrcSet },
} = getImageProps({
  ...commonImageProps,
  src: "/assets/hero-2.webp",
  width: 1672,
  height: 941,
  quality: 85,
});

const {
  props: { srcSet: mobileSrcSet, ...imageProps },
} = getImageProps({
  ...commonImageProps,
  src: "/assets/hero-2-mobile.webp",
  width: 1086,
  height: 1448,
  quality: 85,
});

const Hero = ({ businesses }: { businesses: Business[] }) => {
  const t = useTranslations("hero");
  const tn = useTranslations("nav");
  return (
    <section className={styles.section}>
      <picture className={styles.picture}>
        <source media="(max-width: 640px)" srcSet={mobileSrcSet} />
        <source media="(min-width: 641px)" srcSet={desktopSrcSet} />
        <img {...imageProps} alt="" className={styles.image} fetchPriority="high" loading="eager" decoding="async" />
      </picture>
      <div className={styles.overlay} />

      <div className={styles.inner}>
        <h1 className={styles.title}>
          {t("titlePre").trim()}<br />
          <em>{t("titleEm")}</em> {t("titlePost").trim()}
        </h1>
        <p className={styles.sub}>{t("sub")}</p>

        <div className={styles.searchWrap}>
          <HeroSearch businesses={businesses} />
        </div>

        {/* Mobilde arama yerine acente/firma giriş butonları */}
        <div className={styles.mobileCtas}>
          <Link href="/login" className={styles.mobileCtaPrimary}>
            {tn("agencyLogin")}
          </Link>
          <Link href="/login" className={styles.mobileCtaGhost}>
            {tn("supplierLogin")}
          </Link>
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
};

export default Hero;
