import { Suspense } from "react";
import Hero from "@/components/Hero";
import Showcase from "@/components/Showcase";
import Categories from "@/components/Categories";
import HowItWorks from "@/components/HowItWorks";
import Cta from "@/components/Cta";
import Faq from "@/components/Faq";
import Trust from "@/components/Trust";
import AdSlider from "@/components/AdSlider";
import { getBusinesses, toListingBusiness } from "@/lib/businesses";
import { getActiveAdBanners } from "@/lib/platform-data";
import styles from "./styles";

/*
 * Anasayfa = normal dikey akış (standart scroll). Bölümler sırayla:
 * 1) Hero (ilk ekran)  2) Vitrin + CTA  3) Tedarikçi türleri
 * 4) Üç adımda iş birliği  5) SSS + güven rozetleri
 * Ardından Footer (layout) normal scroll ile gelir.
 *
 * PPR notu: Veri bekleyen bölümler (2-3) içerik seviyesinde Suspense ile
 * stream edilir; Hero (LCP) veri beklemeden statik kabukta boyanır.
 */

/* Panel 2 içeriği — reklam bandı + vitrin + CTA. Kendi verisini bekler;
   'use cache' sayesinde sorgular panel 3 ile paylaşılır. */
async function ShowcaseContent() {
  const [businesses, adBanners] = await Promise.all([
    getBusinesses(),
    getActiveAdBanners("home"),
  ]);
  // Liste payload'ında iletişim alanları taşınmaz (telefon/website yalnız detay sayfasında).
  const listing = businesses.map(toListingBusiness);
  return (
    <>
      {adBanners.length > 0 && (
        <div className={styles.inner}>
          <AdSlider banners={adBanners} />
        </div>
      )}
      <div className={styles.inner}>
        <Showcase businesses={listing} />
      </div>
      <div className={styles.inner}>
        <Cta />
      </div>
    </>
  );
}

/* Panel 3 içeriği — tedarikçi türleri (getBusinesses cache'ten okunur). */
async function CategoriesContent() {
  const businesses = (await getBusinesses()).map(toListingBusiness);
  return <Categories businesses={businesses} />;
}

/* Veri beklerken gösterilen nabız iskeleti — bölüm yerine geçer, akış oynamaz. */
function PanelFallback() {
  return (
    <div className={styles.inner} aria-busy="true">
      <div className="h-4 w-36 animate-pulse rounded-full bg-ink/10" />
      <div className="mt-5 grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[640px]:grid-cols-1">
        <div className="h-56 animate-pulse rounded-card bg-ink/5" />
        <div className="h-56 animate-pulse rounded-card bg-ink/5 max-[640px]:hidden" />
        <div className="h-56 animate-pulse rounded-card bg-ink/5 max-[900px]:hidden" />
      </div>
    </div>
  );
}

const HomeView = () => {
  return (
    <>
      {/* 1 — Hero (ilk ekranı doldurur) */}
      <section className={styles.hero}>
        <div className={styles.heroFill}>
          <Hero />
        </div>
      </section>

      {/* 2 — Vitrin + CTA */}
      <section className={styles.section}>
        <Suspense fallback={<PanelFallback />}>
          <ShowcaseContent />
        </Suspense>
      </section>

      {/* 3 — Tedarikçi türleri */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <Suspense fallback={<PanelFallback />}>
            <CategoriesContent />
          </Suspense>
        </div>
      </section>

      {/* 4 — Üç adımda iş birliği */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <HowItWorks />
        </div>
      </section>

      {/* 5 — Sık sorulan sorular + güven rozetleri (FAQ üstte, rozetler altta) */}
      <section className={styles.section}>
        <div className={styles.faqStack}>
          <Faq />
          <Trust />
        </div>
      </section>
    </>
  );
};

export default HomeView;
