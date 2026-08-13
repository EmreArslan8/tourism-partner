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
      <article className="container-px mx-auto py-12 min-[1440px]:py-16 max-[640px]:py-8">
        <div className="mx-auto max-w-[1120px]">
          <header className="pb-5">
            <p className="text-[12px] font-bold uppercase tracking-[.14em] text-brand">
              {t("eyebrow")}
            </p>
            <h1 className="mt-3 text-[38px] font-semibold leading-tight tracking-normal text-ink min-[1440px]:text-[48px] max-[640px]:text-[32px]">
              {t("title")}
            </h1>
            <p className="mt-5 max-w-[980px] text-[17px] font-normal leading-8 text-muted min-[1440px]:text-[18px] max-[640px]:text-[15.5px] max-[640px]:leading-7">
              {t("intro")}
            </p>
          </header>

          <div className="mt-8 space-y-11">
            <section aria-labelledby="about-approach">
              <h2 id="about-approach" className="text-[26px] font-semibold leading-tight tracking-normal text-ink max-[640px]:text-[22px]">
                {t("approachTitle")}
              </h2>
              <p className="mt-4 max-w-[980px] text-[16px] font-normal leading-8 text-muted max-[640px]:text-[15px] max-[640px]:leading-7">
                {t("approachText")}
              </p>
            </section>

            <section aria-labelledby="mission-title">
              <h2 id="mission-title" className="text-[26px] font-semibold leading-tight tracking-normal text-ink max-[640px]:text-[22px]">
                {t("missionTitle")}
              </h2>
              <div className="mt-4 max-w-[980px] space-y-4 text-[16px] font-normal leading-8 text-muted max-[640px]:text-[15px] max-[640px]:leading-7">
                <p>{t("missionText1")}</p>
                <p>{t("missionText2")}</p>
              </div>
            </section>

            <section aria-labelledby="vision-title">
              <h2 id="vision-title" className="text-[26px] font-semibold leading-tight tracking-normal text-ink max-[640px]:text-[22px]">
                {t("visionTitle")}
              </h2>
              <div className="mt-4 max-w-[980px] space-y-4 text-[16px] font-normal leading-8 text-muted max-[640px]:text-[15px] max-[640px]:leading-7">
                <p>{t("visionText1")}</p>
                <p>{t("visionText2")}</p>
              </div>
            </section>

            <section aria-labelledby="values-title">
              <h2 id="values-title" className="text-[26px] font-semibold leading-tight tracking-normal text-ink max-[640px]:text-[22px]">
                {t("valuesTitle")}
              </h2>
              <div className="mt-5 grid gap-x-10 gap-y-7 min-[900px]:grid-cols-2">
                {valueKeys.map((key) => (
                  <div key={key} className="border-t border-line pt-5">
                    <h3 className="text-[18px] font-semibold leading-snug tracking-normal text-ink">{t(`values.${key}.title`)}</h3>
                    <p className="mt-2 text-[15.5px] font-normal leading-7 text-muted">
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
