import { getTranslations, setRequestLocale } from "next-intl/server";
import { Rocket, Crown, Clock, Check } from "lucide-react";
import { Link, redirect } from "@/i18n/navigation";
import { getPanelSession, getPanelBusiness } from "@/lib/panel-auth";
import DashboardTopbar from "../Topbar";
import styles from "../styles";
import { PartnerPanelCard, PartnerPanelEmptyState } from "../_ui";

// Date.now() render dışında (modül fonksiyonu) — purity lint'i tetiklemesin (bkz. lib/listing.ts).
const isDopingActive = (until: string | null | undefined) => !!until && new Date(until).getTime() > Date.now();

export default async function DopingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("panel");
  const fmt = (v: string) => new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(v));

  const session = await getPanelSession();
  if (!session) return redirect({ href: "/login", locale });
  if (session.accountType === "buyer") redirect({ href: "/dashboard", locale });
  const biz = await getPanelBusiness();

  const dopingActive = isDopingActive(biz?.doping_until);
  const premium = !!biz?.sponsored;

  return (
    <>
      <DashboardTopbar title={t("dopingNav")} />
      <div className={styles.content}>
      {!biz ? (
        <PartnerPanelEmptyState
          title={t("profileRequiredTitle")}
          action={<Link href="/dashboard/businesses" className={styles.compactPrimaryButton}>{t("goToListings")}</Link>}
        />
      ) : (
        <div className="grid gap-4">
          {/* Mevcut durum */}
          <PartnerPanelCard bodyClassName="p-5" className={dopingActive || premium ? "border-[#BFD2F2] bg-[#F8FBFF]" : ""}>
            <div className="flex items-center gap-2.5">
              <Rocket size={18} className={dopingActive || premium ? "text-[#1557C2]" : "text-[#667085]"} aria-hidden />
              <h2 className="text-[15px] font-medium text-[#172033]">{t("dopingCurrentStatus")}</h2>
            </div>
            {premium ? (
              <p className="mt-3 inline-flex items-center gap-2 text-[14px] font-medium text-[#1557C2]"><Crown size={16} aria-hidden /> {t("dopingPremiumActive")}</p>
            ) : dopingActive ? (
              <p className="mt-3 inline-flex items-center gap-2 text-[14px] font-medium text-[#1557C2]">
                <Clock size={16} aria-hidden /> {t("dopingActiveUntil", { date: fmt(biz.doping_until!) })}
              </p>
            ) : (
              <p className="mt-3 text-[14px] font-semibold text-muted">{t("dopingInactive")}</p>
            )}
          </PartnerPanelCard>

          {/* Doping türleri (Brief §9 / El Kitabı §6) */}
          <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
            <PartnerPanelCard bodyClassName="p-4">
              <h3 className="inline-flex items-center gap-2 text-[14px] font-medium text-[#172033]"><Crown size={15} className="text-[#1557C2]" aria-hidden /> {t("dopingPremiumTitle")}</h3>
              <p className="mt-1.5 text-[13px] leading-5 text-muted">{t("dopingPremiumDescription")}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ink">{premium ? <><Check size={14} className="text-emerald-600" aria-hidden /> {t("active")}</> : t("dopingContactSupport")}</p>
            </PartnerPanelCard>
            <PartnerPanelCard bodyClassName="p-4">
              <h3 className="inline-flex items-center gap-2 text-[14px] font-medium text-[#172033]"><Rocket size={15} className="text-[#1557C2]" aria-hidden /> {t("dopingWelcomeTitle")}</h3>
              <p className="mt-1.5 text-[13px] leading-5 text-muted">{t("dopingWelcomeDescription")}</p>
              <p className="mt-2 text-[12.5px] font-semibold text-ink">{t("dopingWelcomeAutomatic")}</p>
            </PartnerPanelCard>
          </div>

          <div className="rounded-[10px] border border-dashed border-[#DDE6F2] bg-[#F8FBFF] p-4 text-[13px] text-[#667085]">
            {t.rich("dopingFooter", {
              support: (chunks) => <Link href="/dashboard/support" className="font-medium text-[#1557C2] hover:underline">{chunks}</Link>,
            })}
          </div>
        </div>
      )}
      </div>
    </>
  );
}
