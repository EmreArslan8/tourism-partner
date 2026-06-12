import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import Categories from "@/components/Categories";
import Showcase from "@/components/Showcase";
import HowItWorks from "@/components/HowItWorks";
import Cta from "@/components/Cta";
import { getBusinesses } from "@/lib/businesses";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const businesses = await getBusinesses();

  return (
    <>
      <main>
        <Hero businesses={businesses} />
        <Partners />

        <div className="container-px">
          <Categories businesses={businesses} />
          <Showcase businesses={businesses} />
          <HowItWorks />
        </div>

        <Cta />
      </main>
    </>
  );
}
