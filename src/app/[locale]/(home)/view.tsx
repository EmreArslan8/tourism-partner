import { Suspense } from "react";
import Hero from "@/components/Hero";
import Showcase from "@/components/Showcase";
import Categories from "@/components/Categories";
import HowItWorks from "@/components/HowItWorks";
import Cta from "@/components/Cta";
import Faq from "@/components/Faq";
import Trust from "@/components/Trust";
import ReelDeck from "@/components/ReelDeck";
import AdSlider from "@/components/AdSlider";
import { getBusinesses, toListingBusiness } from "@/lib/businesses";
import { getActiveAdBanners } from "@/lib/platform-data";
import styles from "./styles";

/*
 * Anasayfa = Reels tarzı tam-sayfa panel destesi (ReelDeck).
 * Her doğrudan child = bir 100dvh panel. Sıra:
 * 1) Hero  2) Vitrin + CTA  3) Tedarikçi türleri
 * 4) Üç adımda iş birliği  5) SSS
 * Son panelden sonra Footer (SiteChrome) normal scroll ile gelir.
 *
 * PPR notu: Veri bekleyen paneller (2-3) içerik seviyesinde Suspense ile
 * stream edilir; Hero (LCP) veri beklemeden statik kabukta boyanır.
 * ReelDeck'in doğrudan child sayısı SABİT kalmalı (panel sayacı bozulmasın) —
 * bu yüzden Suspense panel div'inin İÇİNE konur, panelin kendisine değil.
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

/* Veri beklerken gösterilen nabız iskeleti — panel yüksekliği ReelDeck'ten
   geldiği için yerleşim oynamaz (CLS 0). */
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
    <ReelDeck>
      {/* 1 — Hero (tam-bleed, panelin tamamını kaplar) */}
      <div className={styles.panelDark}>
        <div className={styles.heroFill}>
          <Hero />
        </div>
      </div>

      {/* 2 — Vitrin + CTA */}
      <div className={styles.panelStack}>
        <Suspense fallback={<PanelFallback />}>
          <ShowcaseContent />
        </Suspense>
      </div>

      {/* 3 — Tedarikçi türleri */}
      <div className={styles.panelCategories}>
        <div className="flex w-full flex-col justify-start gap-6 max-[1024px]:gap-5 max-[640px]:gap-6 max-[640px]:h-full max-[640px]:min-h-0">
          <Suspense fallback={<PanelFallback />}>
            <CategoriesContent />
          </Suspense>
        </div>
      </div>


      {/* 6 — Üç adımda iş birliği */}
      <div className={styles.panelLight}>
        <div className={styles.inner}>
          <HowItWorks />
        </div>
      </div>

      {/* 7 — Sık sorulan sorular + güven rozetleri (FAQ üstte, rozetler altta) */}
      <div className={styles.panelFaq}>
        <div className={styles.faqStack}>
          <Faq />
          <Trust />
        </div>
      </div>
    </ReelDeck>
  );
};

export default HomeView;
