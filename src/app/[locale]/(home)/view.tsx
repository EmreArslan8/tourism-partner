import Hero from "@/components/Hero";
import Showcase from "@/components/Showcase";
import Categories from "@/components/Categories";
import HowItWorks from "@/components/HowItWorks";
import Cta from "@/components/Cta";
import Faq from "@/components/Faq";
import Trust from "@/components/Trust";
import ReelDeck from "@/components/ReelDeck";
import AdSlider from "@/components/AdSlider";
import type { PublicAdBanner } from "@/lib/platform-data";
import type { Business } from "@/lib/types";
import styles from "./styles";

/*
 * Anasayfa = Reels tarzı tam-sayfa panel destesi (ReelDeck).
 * Her doğrudan child = bir 100dvh panel. Sıra:
 * 1) Hero  2) Vitrin + CTA  3) Tedarikçi türleri
 * 4) Üç adımda iş birliği  5) SSS
 * Son panelden sonra Footer (SiteChrome) normal scroll ile gelir.
 */
const HomeView = ({
  businesses,
  adBanners,
}: {
  businesses: Business[];
  adBanners: PublicAdBanner[];
}) => {
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
        {adBanners.length > 0 && (
          <div className={styles.inner}>
            <AdSlider banners={adBanners} />
          </div>
        )}
        <div className={styles.inner}>
          <Showcase businesses={businesses} />
        </div>
        <div className={styles.inner}>
          <Cta />
        </div>
      </div>

      {/* 3 — Tedarikçi türleri */}
      <div className={styles.panelCategories}>
        <div className="flex w-full flex-col justify-start gap-6 max-[1024px]:gap-5 max-[640px]:gap-6">
          <Categories businesses={businesses} />
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
