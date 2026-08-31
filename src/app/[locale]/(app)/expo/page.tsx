import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";
import type { SiteLocale } from "@/lib/site";

const countdownUnits = ["days", "hours", "minutes", "seconds"] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "expo" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localeAlternates(locale as SiteLocale, "/expo"),
  };
}

export default async function ExpoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "expo" });

  return (
    <main className="relative isolate grid min-h-[calc(100svh-88px)] place-items-center overflow-hidden bg-[#080511] px-4 py-20 text-white">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_38%,rgba(125,64,190,.3),transparent_38%),radial-gradient(circle_at_70%_78%,rgba(210,140,55,.12),transparent_30%),linear-gradient(145deg,#130923,#080511_55%,#10091a)]" />
      <div className="absolute inset-0 -z-10 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />

      <section className="w-full max-w-[1040px] text-center" aria-labelledby="expo-title">
        <h1 id="expo-title" className="text-balance font-display text-[clamp(3.2rem,8vw,7.5rem)] font-semibold leading-none tracking-[-.065em]">
          Tourism Partner <span className="bg-[linear-gradient(110deg,#e4c5ff,#aa70ff_55%,#f2b968)] bg-clip-text text-transparent">Expo</span>
        </h1>

        <dl className="mt-12 grid grid-cols-4 gap-3 max-[640px]:mt-9 max-[640px]:gap-2" aria-label={t("countdownLabel")}>
          {countdownUnits.map((unit) => (
            <div key={unit} className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(155deg,rgba(255,255,255,.09),rgba(255,255,255,.025))] px-3 py-7 shadow-[inset_0_1px_0_rgba(255,255,255,.07),0_20px_60px_rgba(0,0,0,.24)] max-[640px]:rounded-2xl max-[640px]:px-1 max-[640px]:py-5">
              <span className="absolute inset-x-4 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(213,169,255,.75),transparent)]" aria-hidden="true" />
              <dd className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-semibold tabular-nums leading-none tracking-[-.07em]">00</dd>
              <dt className="mt-3 text-[10px] font-semibold uppercase tracking-[.18em] text-white/40 max-[640px]:text-[8px] max-[640px]:tracking-[.1em]">
                {t(`countdown.${unit}`)}
              </dt>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
