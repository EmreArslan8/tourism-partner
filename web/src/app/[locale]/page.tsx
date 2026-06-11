import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Splash from "@/components/Splash";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Showcase from "@/components/Showcase";
import HowItWorks from "@/components/HowItWorks";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cta");

  return (
    <>
      <Splash />
      <main>
        <Hero />

        <div className="container-px">
          <Categories />
          <Showcase />
          <HowItWorks />
        </div>

        <section className="bg-pine">
          <div className="container-px flex flex-wrap items-center justify-between gap-6 py-14">
            <div>
              <h2 className="text-[clamp(24px,3vw,34px)] text-cream">{t("title")}</h2>
              <p className="mt-2 max-w-[520px] text-[15px] text-cream/70">{t("sub")}</p>
            </div>
            <Link href="/kayit" className="btn btn-cream">{t("button")}</Link>
          </div>
        </section>
      </main>
    </>
  );
}
