import { getImageProps } from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Header from "@/components/Header";
import HeroSearch from "@/components/HeroSearch";
import type { Business } from "@/lib/types";
import styles from "./styles";

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
  src: "/assets/hero-mobile.webp",
  width: 1086,
  height: 1448,
  quality: 85,
});

const {
  props: { srcSet: tabletSrcSet },
} = getImageProps({
  ...commonImageProps,
  src: "/assets/hero-tablet.webp",
  width: 1086,
  height: 1448,
  quality: 85,
});

const Hero = ({ businesses }: { businesses: Business[] }) => {
  const t = useTranslations("hero");
  const tn = useTranslations("nav");
  const stats = [
    { n: formatCount(businesses.length), key: "statSuppliers" },
    { n: String(new Set(businesses.map((business) => business.city).filter(Boolean)).size), key: "statCities" },
    { n: String(new Set(businesses.map((business) => business.country).filter(Boolean)).size), key: "statCountries" },
    { n: "~4 sa", key: "statResponse" },
  ] as const;

  return (
    <section className={styles.section}>
      <Header variant="glass" />
      <picture className={styles.picture}>
        <source media="(max-width: 640px)" srcSet={mobileSrcSet} />
        <source media="(min-width: 641px) and (max-width: 1024px)" srcSet={tabletSrcSet} />
        <source media="(min-width: 1025px)" srcSet={desktopSrcSet} />
        <img {...imageProps} alt="" className={styles.image} fetchPriority="high" loading="eager" decoding="async" />
      </picture>
      <div className={styles.overlay} />

      {/* NOT: Etkileşimli 3D küre (Hero/Globe.tsx, three-globe) şimdilik devre dışı —
          görsel ayarı yapılamadan sayfayı bozuyordu. Geri açmak için: Globe import'u +
          styles.globeWrap bloğunu buraya ekle (git geçmişinde hazır). */}

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
          {stats.map((st) => (
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

function formatCount(value: number): string {
  if (value >= 1000) return `${Math.floor(value / 100) / 10}K+`;
  return value.toLocaleString("tr-TR");
}

export default Hero;
