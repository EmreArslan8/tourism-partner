import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";
import type { SiteLocale } from "@/lib/site";

const valueKeys = ["trust", "innovation", "transparency", "collaboration", "members"] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localeAlternates(locale as SiteLocale, "/about"),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <main className="min-h-screen">
      <article className="container-px mx-auto max-w-[940px] py-12 min-[1440px]:py-16 max-[640px]:py-8">
        <div className="rounded-card-lg border border-line bg-paper p-8 min-[1440px]:p-10 max-[640px]:p-5">
          <header className="border-b border-line pb-7">
            <p className="text-[12px] font-extrabold uppercase tracking-[.14em] text-terra">
              {t("eyebrow")}
            </p>
            <h1 className="mt-3 text-[34px] font-extrabold leading-tight text-ink min-[1440px]:text-[42px] max-[640px]:text-[29px]">
              {t("title")}
            </h1>
            <p className="mt-4 text-[16px] font-medium leading-8 text-[#4b5875]">
              {t("intro")}
            </p>
          </header>

          <div className="mt-8 space-y-10">
            <section aria-labelledby="about-approach">
              <h2 id="about-approach" className="text-[24px] font-extrabold leading-tight text-ink">
                {t("approachTitle")}
              </h2>
              <p className="mt-4 text-[15.5px] font-medium leading-8 text-[#4b5875]">
                {t("approachText")}
              </p>
            </section>

            <section aria-labelledby="mission-title">
              <h2 id="mission-title" className="text-[24px] font-extrabold leading-tight text-ink">
                {t("missionTitle")}
              </h2>
              <div className="mt-4 space-y-4 text-[15.5px] font-medium leading-8 text-[#4b5875]">
                <p>{t("missionText1")}</p>
                <p>{t("missionText2")}</p>
              </div>
            </section>

            <section aria-labelledby="vision-title">
              <h2 id="vision-title" className="text-[24px] font-extrabold leading-tight text-ink">
                {t("visionTitle")}
              </h2>
              <div className="mt-4 space-y-4 text-[15.5px] font-medium leading-8 text-[#4b5875]">
                <p>{t("visionText1")}</p>
                <p>{t("visionText2")}</p>
              </div>
            </section>

            <section aria-labelledby="values-title">
              <h2 id="values-title" className="text-[24px] font-extrabold leading-tight text-ink">
                {t("valuesTitle")}
              </h2>
              <div className="mt-5 space-y-5">
                {valueKeys.map((key) => (
                  <div key={key} className="border-t border-line pt-5 first:border-t-0 first:pt-0">
                    <h3 className="text-[18px] font-extrabold leading-snug text-ink">{t(`values.${key}.title`)}</h3>
                    <p className="mt-2 text-[15.5px] font-medium leading-8 text-[#4b5875]">
                      {t(`values.${key}.text`)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </article>
    </main>
  );
}
