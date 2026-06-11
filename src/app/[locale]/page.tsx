import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import Categories from "@/components/Categories";
import Showcase from "@/components/Showcase";
import HowItWorks from "@/components/HowItWorks";
import Cta from "@/components/Cta";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <main>
        <Hero />
        <Partners />

        <div className="container-px">
          <Categories />
          <Showcase />
          <HowItWorks />
        </div>

        <Cta />
      </main>
    </>
  );
}
