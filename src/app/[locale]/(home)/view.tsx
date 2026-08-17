import { Suspense } from "react";
import { connection } from "next/server";
import Hero from "@/components/Hero";
import Showcase from "@/components/Showcase";
import Categories from "@/components/Categories";
import HowItWorks from "@/components/HowItWorks";
import WhyJoin from "@/components/WhyJoin";
import Cta from "@/components/Cta";
import Faq from "@/components/Faq";
import Trust from "@/components/Trust";
import AdSlider from "@/components/AdSlider";
import { getBusinesses, toListingBusiness } from "@/lib/businesses";
import { rankShowcaseCandidates, SHOWCASE_POOL_LIMIT } from "@/lib/showcase";
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
  // Vitrin sıralaması Date.now()'a bağlı (doping süresi). cacheComponents/PPR
  // prerender'da geçerli saat yasak; bu bölüm zaten Suspense ile stream ediliyor,
  // connection() ile açıkça dinamik işaretliyoruz (Hero static shell'de kalır).
  await connection();
  const [businesses, adBanners] = await Promise.all([
    getBusinesses(),
    getActiveAdBanners("home"),
  ]);
  // Liste payload'ında iletişim alanları taşınmaz (telefon/website yalnız detay sayfasında).
  const listing = businesses.map(toListingBusiness);
  // Vitrin yalnız 5 kart gösterir; filtre+sıralamayı SUNUCUDA yapıp uygun havuzu
  // birkaç yedekle kırpıyoruz — tüm diziyi client'a taşımak RSC payload'ını ~85KB
  // şişiriyordu (döküman kritik yolda). Client bu küçük havuzda karıştırır.
  const showcasePool = rankShowcaseCandidates(listing).slice(0, SHOWCASE_POOL_LIMIT);
  return (
    <>
      {adBanners.length > 0 && (
        <div className={styles.inner}>
          <AdSlider banners={adBanners} />
        </div>
      )}
      <div className={styles.inner}>
        <Showcase businesses={showcasePool} />
      </div>
      <div className={styles.inner}>
        <Cta />
      </div>
    </>
  );
}

/* Panel 3 içeriği — tedarikçi türleri. Categories yalnız grup başına SAYI kullanır;
   tüm business dizisini prop'layıp RSC payload'ını şişirmek yerine sunucuda sayıp
   küçük bir harita geçiriyoruz (getBusinesses cache'ten, ekstra sorgu yok). */
async function CategoriesContent() {
  const counts = (await getBusinesses()).reduce<Record<string, number>>((acc, b) => {
    acc[b.group] = (acc[b.group] ?? 0) + 1;
    return acc;
  }, {});
  return <Categories counts={counts} />;
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
      {/* 1 — Hero (ilk ekranı doldurur; yüksekliği kendi kökünde) */}
      <Hero />

      {/* Masaüstü: Vitrin → Kategoriler · Mobil: Kategoriler → Vitrin */}
      <div className={styles.discoverySections}>
        {/* 2 — Vitrin + CTA */}
        <section className={`${styles.section} ${styles.showcaseSection}`}>
          <Suspense fallback={<PanelFallback />}>
            <ShowcaseContent />
          </Suspense>
        </section>

        {/* 3 — Tedarikçi türleri */}
        <section className={`${styles.section} ${styles.categoriesSection}`}>
          <div className={styles.inner}>
            <Suspense fallback={<PanelFallback />}>
              <CategoriesContent />
            </Suspense>
          </div>
        </section>
      </div>

      {/* 4 — Üç adımda iş birliği */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <HowItWorks />
        </div>
      </section>

      {/* 5 — Neden Tourism Partner? + hemen üye ol (tam genişlik dönüşüm bandı) */}
      <WhyJoin />

      {/* 6 — Sık sorulan sorular + güven rozetleri (FAQ üstte, rozetler altta) */}
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
