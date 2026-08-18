import Image, { getImageProps } from "next/image";
import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Header from "@/components/Header";
import HeroSearch from "@/components/HeroSearch";
import Partners from "@/components/Partners";
import { getBusinesses } from "@/lib/businesses";
import styles from "./styles";

const commonImageProps = {
  alt: "",
  sizes: "100vw",
};

const {
  props: { srcSet: lightDesktopSrcSet },
} = getImageProps({
  ...commonImageProps,
  src: "/assets/hero-mobile-globe-light-v4.webp",
  width: 1774,
  height: 887,
  quality: 88,
});

const {
  props: { srcSet: lightMobileSrcSet, ...lightImageProps },
} = getImageProps({
  ...commonImageProps,
  src: "/assets/hero-mobile-globe-light-v5.webp",
  width: 941,
  height: 1672,
  quality: 84,
  // LCP görseli — lazy OLMAMALI (Lighthouse: "LCP kaynaklarında loading=lazy
  // kullanılmamalıdır"). getImageProps varsayılanı lazy; eager'a çekmezsek görsel
  // ~1.6sn geç keşfediliyordu. Koyu tema hero'su lazy KALIR: display:none + lazy
  // sayesinde açık tema kullanıcısında hiç inmez (çift indirme yok).
  loading: "eager",
});

const {
  props: { srcSet: darkDesktopSrcSet },
} = getImageProps({
  ...commonImageProps,
  src: "/assets/hero-globe-midnight.webp",
  width: 1376,
  height: 768,
  quality: 88,
});

const {
  props: { srcSet: darkMobileSrcSet, ...darkImageProps },
} = getImageProps({
  ...commonImageProps,
  src: "/assets/hero-mobile-v2.webp",
  width: 1024,
  height: 1536,
  quality: 84,
});

async function ApprovedBusinessMarquee() {
  const businesses = await getBusinesses();
  return <Partners brands={businesses.map((business) => business.name)} />;
}

const Hero = () => {
  const t = useTranslations("hero");
  const categoryLinks = [
    { key: "saglik", label: t("catHealth"), icon: <Image src="/assets/icons/health-tourism.svg" alt="" width={32} height={32} className={styles.categoryIcon} /> },
    { key: "konaklama", label: t("catHotels"), icon: <Image src="/assets/icons/hotels.svg" alt="" width={32} height={32} className={styles.categoryIcon} /> },
    { key: "acente", label: t("catAgencies"), icon: <Image src="/assets/icons/agencies.svg" alt="" width={32} height={32} className={styles.categoryIcon} /> },
    { key: "ulasim", label: t("catTransfers"), icon: <Image src="/assets/icons/transfers.svg" alt="" width={44} height={39} className={styles.transferIcon} /> },
    { key: "rehber", label: t("catGuides"), icon: <Image src="/assets/icons/guides.svg" alt="" width={32} height={32} className={styles.categoryIcon} /> },
    { key: "aktivite", label: t("catActivities"), icon: <Image src="/assets/icons/activities.svg" alt="" width={32} height={32} className={styles.categoryIcon} /> },
    { key: "gastronomi", label: t("catGastro"), icon: <Image src="/assets/icons/gastronomy.svg" alt="" width={40} height={40} className={styles.gastronomyIcon} /> },
  ] as const;

  return (
    <section className={styles.section}>
      <Header variant="glass" />
      <picture className={`${styles.picture} ${styles.pictureLight}`}>
        <source media="(min-width: 641px)" srcSet={lightDesktopSrcSet} />
        <source media="(max-width: 640px)" srcSet={lightMobileSrcSet} />
        <img {...lightImageProps} alt="" className={`${styles.image} ${styles.imageLight}`} fetchPriority="high" decoding="async" />
      </picture>
      <picture className={`${styles.picture} ${styles.pictureDark}`}>
        <source media="(min-width: 641px)" srcSet={darkDesktopSrcSet} />
        <source media="(max-width: 640px)" srcSet={darkMobileSrcSet} />
        <img {...darkImageProps} alt="" className={`${styles.image} ${styles.imageDark}`} fetchPriority="high" decoding="async" />
      </picture>
      {/* NOT: Etkileşimli 3D küre (Hero/Globe.tsx, three-globe) şimdilik devre dışı —
          görsel ayarı yapılamadan sayfayı bozuyordu. Geri açmak için: Globe import'u +
          styles.globeWrap bloğunu buraya ekle (git geçmişinde hazır). */}

      <div className={styles.inner}>
        <p className={styles.eyebrow}>{t("eyebrow")}</p>
        <h1 className={styles.title}>
          <span className={styles.desktopTitle}>
            {t("titlePre").trim()}{" "}
            <em>{t("titleEm")}</em> {t("titlePost").trim()}
          </span>
          <span className={styles.mobileTitle}>
            {t("mobileTitlePre")} <em>{t("mobileTitleEm")}</em> {t("mobileTitlePost")}
          </span>
        </h1>
        <p className={styles.mobileLead}>{t("mobileSub")}</p>
        <nav className={styles.categories} aria-label={t("categoryNavLabel")}>
          {categoryLinks.map(({ key, label, icon }) => (
            <Link key={key} href={{ pathname: "/explore", query: { cat: key } }} prefetch={false} className={styles.categoryLink}>
              {icon}
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.searchWrap}>
          <HeroSearch />
        </div>

        {/* Aramaya alternatif olarak kullanıcı ihtiyacını paylaşır ve uygun firmalardan teklif alır. */}
        <div className={styles.ctaBlock}>
          <div className={styles.ctaCopy}>
            <p className={styles.ctaPrompt}>{t("quickPrompt")}</p>
          </div>
          <Link href={{ pathname: "/quote" }} className={styles.ctaPrimary}>
            <span>{t("quickQuote")}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        <nav className={styles.mobileCategories} aria-label={t("categoryNavLabel")}>
          {categoryLinks.map(({ key, label, icon }) => (
            <Link key={key} href={{ pathname: "/explore", query: { cat: key } }} prefetch={false} className={styles.mobileCategoryLink}>
              {icon}
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobilde referanstaki sade hiyerarşi: tek ana aksiyon ve güven metrikleri. */}
        <div className={styles.mobileCtas}>
          <Link href={{ pathname: "/register" }} className={styles.mobileCtaPrimary}>
            {t("mobileGetStarted")}
          </Link>
        </div>

        <dl className={styles.mobileStats} aria-label={t("statsLabel")}>
          <div className={styles.mobileStat}>
            <dt className={styles.mobileStatValue}>50+</dt>
            <dd className={styles.mobileStatLabel}>{t("statBusinesses")}</dd>
          </div>
          <div className={styles.mobileStat}>
            <dt className={styles.mobileStatValue}>200+</dt>
            <dd className={styles.mobileStatLabel}>{t("statCountries")}</dd>
          </div>
          <div className={styles.mobileStat}>
            <dt className={styles.mobileStatValue}>100+</dt>
            <dd className={styles.mobileStatLabel}>{t("statConnections")}</dd>
          </div>
        </dl>

      </div>
      <div className={styles.marquee}>
        <Suspense fallback={<div className="h-[58px]" aria-hidden />}>
          <ApprovedBusinessMarquee />
        </Suspense>
      </div>
    </section>
  );
};

export default Hero;
