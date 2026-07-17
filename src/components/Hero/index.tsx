import Image, { getImageProps } from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import Header from "@/components/Header";
import HeroSearch from "@/components/HeroSearch";
import Partners from "@/components/Partners";
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
  props: { srcSet: desktopSrcSetAr },
} = getImageProps({
  ...commonImageProps,
  src: "/assets/hero-ar.png",
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

const Hero = () => {
  const t = useTranslations("hero");
  const tn = useTranslations("nav");
  const locale = useLocale();
  const categoryLinks = [
    { key: "konaklama", label: t("catHotels"), icon: <Image src="/assets/icons/hotels.svg" alt="" width={32} height={32} className={styles.categoryIcon} /> },
    { key: "acente", label: t("catAgencies"), icon: <Image src="/assets/icons/agencies.svg" alt="" width={32} height={32} className={styles.categoryIcon} /> },
    { key: "ulasim", label: t("catTransfers"), icon: <Image src="/assets/icons/transfers.svg" alt="" width={44} height={39} className={styles.transferIcon} /> },
    { key: "rehber", label: t("catGuides"), icon: <Image src="/assets/icons/guides.svg" alt="" width={32} height={32} className={styles.categoryIcon} /> },
    { key: "aktivite", label: t("catActivities"), icon: <Image src="/assets/icons/activities.svg" alt="" width={32} height={32} className={styles.categoryIcon} /> },
    { key: "gastronomi", label: t("catGastro"), icon: <Image src="/assets/icons/gastronomy.svg" alt="" width={40} height={40} className={styles.gastronomyIcon} /> },
    { key: "saglik", label: t("catHealth"), icon: <Image src="/assets/icons/health-tourism.svg" alt="" width={32} height={32} className={styles.categoryIcon} /> },
  ] as const;

  return (
    <section className={styles.section}>
      <Header variant="glass" />
      <picture className={styles.picture}>
        <source media="(max-width: 640px)" srcSet={mobileSrcSet} />
        <source media="(min-width: 641px) and (max-width: 1024px)" srcSet={tabletSrcSet} />
        <source media="(min-width: 1025px)" srcSet={locale === "ar" ? desktopSrcSetAr : desktopSrcSet} />
        <img {...imageProps} alt="" className={styles.image} fetchPriority="high" loading="eager" decoding="async" />
      </picture>
      <div className={styles.overlay} />

      {/* NOT: Etkileşimli 3D küre (Hero/Globe.tsx, three-globe) şimdilik devre dışı —
          görsel ayarı yapılamadan sayfayı bozuyordu. Geri açmak için: Globe import'u +
          styles.globeWrap bloğunu buraya ekle (git geçmişinde hazır). */}

      <div className={styles.inner}>
        <h1 className={styles.title}>
          {t("titlePre").trim()}{" "}
          <em>{t("titleEm")}</em> {t("titlePost").trim()}
        </h1>
        <p className={styles.mobileIntro}>{t("quickSub")}</p>
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
            <p className={styles.ctaSub}>{t("quickSub")}</p>
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

        {/* Mobilde: kategorilerden sonra teklif ana buton, üye girişi ikincil aksiyon. */}
        <div className={styles.mobileCtas}>
          <Link href={{ pathname: "/quote" }} className={styles.mobileCtaPrimary}>
            {tn("quote")}
          </Link>
          <div className={styles.mobileCtaRow}>
            <Link href="/login" className={styles.mobileCtaGhost}>
              {tn("memberLogin")}
            </Link>
          </div>
        </div>

      </div>
      <div className={styles.marquee}>
        <Partners />
      </div>
    </section>
  );
};

export default Hero;
