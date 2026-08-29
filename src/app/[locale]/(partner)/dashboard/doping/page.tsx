import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight, Check, CheckCircle2, Clock, Crown, Rocket, Sparkles } from "lucide-react";
import { Link, redirect } from "@/i18n/navigation";
import { getPanelSession, getPanelBusiness } from "@/lib/panel-auth";
import BusinessBadges from "@/components/BusinessBadges";
import { cn } from "@/lib/utils";
import DashboardTopbar from "../Topbar";
import styles from "../styles";
import { PartnerPanelCard, PartnerPanelEmptyState } from "../_ui";

const isDopingActive = (until: string | null | undefined) => !!until && new Date(until).getTime() > Date.now();
type MembershipKind = "verified" | "premium" | "founder";

const CARD_THEME: Record<MembershipKind, string> = {
  verified: "border-[#b9d7ff] bg-[linear-gradient(150deg,#ffffff_0%,#eef6ff_100%)]",
  premium: "tp-membership-card-featured border-[#d8b75e]/75 bg-[linear-gradient(155deg,#111224_0%,#181526_48%,#211a11_100%)] text-white shadow-[0_26px_60px_-34px_rgba(17,12,4,.95)]",
  founder: "border-[#e0bb64] bg-[linear-gradient(150deg,#fffdf6_0%,#fff2ca_100%)]",
};

function MembershipCard({ kind, badge, title, description, benefits, active, activeLabel, cta, eyebrow, note }: {
  kind: MembershipKind;
  badge: ReactNode;
  title: string;
  description: string;
  benefits: string[];
  active: boolean;
  activeLabel: string;
  cta: string;
  eyebrow: string;
  note?: string;
}) {
  const featured = kind === "premium";
  return (
    <article className={cn("tp-membership-card relative flex min-h-[390px] flex-col overflow-hidden rounded-[18px] border p-5", CARD_THEME[kind])}>
      <div className="relative z-[2] flex items-start justify-between gap-3">
        <span className={cn("rounded-full px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[.14em]", featured ? "inline-flex items-center gap-2 !rounded-none !p-0 tracking-[.18em] text-[#cbb777] before:h-px before:w-5 before:bg-[#cbb777]/55" : kind === "verified" ? "bg-[#dcecff] text-[#195ea8]" : "bg-[#f8dfa0] text-[#714806]")}>{eyebrow}</span>
        <span className={cn("grid min-h-11 min-w-11 place-items-center rounded-[12px] border px-2", featured ? "min-h-0 border-0 bg-transparent p-0" : "border-white/80 bg-white/75 shadow-sm")}>{badge}</span>
      </div>

      <div className="relative z-[2] mt-5">
        <h2 className={cn("text-[21px] font-semibold leading-tight", featured ? "text-[#f3d985] tracking-[-.015em]" : kind === "verified" ? "text-[#165b9f]" : "text-[#704707]")}>{title}</h2>
        <p className={cn("mt-2 text-[13px] leading-[1.65]", featured ? "text-[#eee9dc]/72" : "text-[#62593f]")}>{description}</p>
      </div>

      <ul className={cn("relative z-[2] mt-5 grid gap-2.5 border-t pt-4", featured ? "border-[#d6b863]/22" : "border-black/8")}>
        {benefits.map((benefit) => (
          <li key={benefit} className={cn("flex items-start gap-2 text-[12.5px] leading-5", featured ? "text-[#f4f0e8]/82" : "text-[#423a29]")}>
            <CheckCircle2 size={15} className={cn("mt-0.5 shrink-0", featured ? "text-[#d9b84f]" : kind === "verified" ? "text-[#3181c7]" : "text-[#c58b1a]")} aria-hidden />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      {note && <p className="relative z-[2] mt-4 rounded-[9px] border border-[#d8a93b]/35 bg-[#fff4cd]/80 px-3 py-2 text-[11.5px] font-semibold leading-5 text-[#704707]">{note}</p>}

      <div className="relative z-[2] mt-auto pt-5">
        {active ? (
          <span className={cn("inline-flex min-h-10 items-center gap-2 rounded-[9px] px-4 text-[12.5px] font-semibold", featured ? "bg-emerald-400/15 text-emerald-200" : "bg-emerald-100 text-emerald-700")}><Check size={15} aria-hidden />{activeLabel}</span>
        ) : (
          <Link href={{ pathname: "/dashboard/support", query: { topic: kind } }} className={cn("inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-[9px] px-4 text-[12.5px] font-bold transition-[transform,filter,background-color] hover:-translate-y-0.5", featured ? "border border-[#e0bd59] bg-[linear-gradient(180deg,#f9e6a2_0%,#d5ab3d_100%)] text-[#251a06] shadow-[0_12px_24px_-15px_rgba(0,0,0,.9),inset_0_1px_0_rgba(255,255,255,.7)] hover:brightness-105" : kind === "verified" ? "bg-[#1769b0] text-white hover:bg-[#11578f]" : "bg-[#81530b] text-white hover:bg-[#684207]")}>
            {cta}<ArrowUpRight size={15} aria-hidden />
          </Link>
        )}
      </div>
    </article>
  );
}

export default async function DopingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tCommon] = await Promise.all([getTranslations("panel"), getTranslations("common")]);
  const fmt = (value: string) => new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

  const session = await getPanelSession();
  if (!session) return redirect({ href: "/login", locale });
  if (session.accountType === "buyer") redirect({ href: "/dashboard", locale });
  const biz = await getPanelBusiness();

  const dopingActive = isDopingActive(biz?.doping_until);
  const premium = Boolean(biz?.sponsored);
  const badgeLabels = { verified: tCommon("verified"), founder: tCommon("founderPartner"), premium: tCommon("ad") };

  return (
    <>
      <DashboardTopbar title={t("dopingNav")} />
      <div className={styles.content}>
        {!biz ? (
          <PartnerPanelEmptyState title={t("profileRequiredTitle")} action={<Link href="/dashboard/businesses" className={styles.compactPrimaryButton}>{t("goToListings")}</Link>} />
        ) : (
          <div className="grid gap-4">
            <section className="relative isolate overflow-hidden rounded-[16px] border border-[#e5c573]/60 bg-[linear-gradient(125deg,#fffdf7_0%,#fff4ce_48%,#f7df99_100%)] px-5 py-4 shadow-[0_20px_44px_-38px_rgba(114,70,0,.65)] min-[760px]:px-6 min-[760px]:py-5">
              <div className="pointer-events-none absolute -end-10 -top-16 h-40 w-40 rounded-full border-[24px] border-white/25" />
              <div className="pointer-events-none absolute bottom-0 end-[26%] h-px w-40 bg-gradient-to-r from-transparent via-[#c89621]/50 to-transparent" />
              <div className="relative z-[1] max-w-[760px]">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d7aa42]/45 bg-white/55 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[.15em] text-[#76500b]"><Sparkles size={11} aria-hidden />{t("dopingShowcaseEyebrow")}</span>
                <h1 className="mt-2 max-w-[760px] text-[23px] font-semibold leading-[1.12] tracking-[-.02em] text-[#2f220c] min-[760px]:text-[28px]">{t("dopingShowcaseTitle")}</h1>
                <p className="mt-2 max-w-[760px] text-[12.5px] leading-5 text-[#66583b] min-[760px]:text-[13.5px]">{t("dopingShowcaseDescription")}</p>
              </div>
            </section>

            <PartnerPanelCard bodyClassName="px-4 py-3 min-[680px]:px-5 min-[680px]:py-3.5" className={dopingActive || premium ? "border-[#d9bd73]/55 bg-[#fffaf0]" : ""}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5"><Rocket size={18} className={dopingActive || premium ? "text-[#b37b10]" : "text-muted"} aria-hidden /><h2 className="text-[14px] font-semibold text-ink">{t("dopingCurrentStatus")}</h2></div>
                {premium ? <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#98670b]"><Crown size={15} aria-hidden />{t("dopingPremiumActive")}</span> : dopingActive ? <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#98670b]"><Clock size={15} aria-hidden />{t("dopingActiveUntil", { date: fmt(biz.doping_until!) })}</span> : <span className="text-[12.5px] font-medium text-muted">{t("dopingInactive")}</span>}
              </div>
            </PartnerPanelCard>

            <section className="grid gap-4 min-[760px]:grid-cols-3">
              <MembershipCard kind="verified" eyebrow={t("dopingVerifiedEyebrow")} badge={<BusinessBadges verified labels={badgeLabels} mode="identity" size="lg" />} title={t("dopingVerifiedTitle")} description={t("dopingVerifiedDescription")} benefits={t.raw("dopingVerifiedBenefits") as string[]} active={Boolean(biz.verified)} activeLabel={t("active")} cta={t("dopingContactCta")} />
              <MembershipCard kind="premium" eyebrow={t("dopingPremiumEyebrow")} badge={<BusinessBadges sponsored labels={badgeLabels} mode="premium" size="lg" premiumVariant="onImage" premiumClassName="!gap-1 !px-2.5 !py-1 !text-[9.5px] !tracking-[.12em] !whitespace-nowrap [&>svg]:!h-3 [&>svg]:!w-3" />} title={t("dopingPremiumTitle")} description={t("dopingPremiumDescription")} benefits={t.raw("dopingPremiumBenefits") as string[]} active={premium} activeLabel={t("active")} cta={t("dopingContactCta")} />
              <MembershipCard kind="founder" eyebrow={t("dopingFounderEyebrow")} badge={<BusinessBadges founderPartner labels={badgeLabels} mode="identity" size="lg" />} title={t("dopingFounderTitle")} description={t("dopingFounderDescription")} benefits={t.raw("dopingFounderBenefits") as string[]} note={t("dopingFounderLimit")} active={Boolean(biz.founder_partner)} activeLabel={t("active")} cta={t("dopingContactCta")} />
            </section>

            <div className="rounded-[12px] border border-dashed border-[#d8bd78] bg-[#fffaf0] p-4 text-[12.5px] leading-5 text-[#6e6043]">{t("dopingInquiryHint")}</div>
          </div>
        )}
      </div>
    </>
  );
}
