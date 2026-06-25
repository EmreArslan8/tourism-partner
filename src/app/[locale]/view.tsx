import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import Showcase from "@/components/Showcase";
import Regions from "@/components/Regions";
import Categories from "@/components/Categories";
import HowItWorks from "@/components/HowItWorks";
import Cta from "@/components/Cta";
import type { Business } from "@/lib/types";
import styles from "./styles";

const HomeView = ({ businesses }: { businesses: Business[] }) => {
  return (
    <main className={styles.main}>
      <Hero businesses={businesses} />
      <Partners />

      <div className={styles.container}>
        <Showcase businesses={businesses} />
      </div>

      <Cta />

      <div className={styles.container}>
        <Regions businesses={businesses} />
        <Categories businesses={businesses} />
        <HowItWorks />
      </div>
    </main>
  );
};

export default HomeView;
