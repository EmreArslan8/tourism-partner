import { Heart, Search } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPanelSession } from "@/lib/panel-auth";
import { createClient } from "@/lib/supabase/server";
import DashboardTopbar from "./Topbar";
import { PartnerPanelCard } from "./_ui";
import styles from "./styles";

export default async function BuyerOverview() {
  const [t, session] = await Promise.all([getTranslations("panel"), getPanelSession()]);
  const supabase = await createClient();
  const { count: favoriteCount } = session
    ? await supabase.from("favorites").select("business_id", { count: "exact", head: true }).eq("user_id", session.userId)
    : { count: 0 };

  return (
    <>
      <DashboardTopbar title={t("overview")} />
      <div className={styles.content}>
        <div className="grid gap-4">
          <section className={`${styles.overviewHero} bg-[linear-gradient(135deg,#f7faff_0%,#eef4ff_100%)]`}>
            <div>
              <span className={styles.eyebrow}>{t("buyerOverviewLabel")}</span>
              <h2>{t("buyerOverviewTitle")}</h2>
              <p>{t("buyerOverviewSub")}</p>
            </div>
            <Link href="/explore" className={styles.compactPrimaryButton}>{t("buyerExploreCta")}</Link>
          </section>

          <section className="grid gap-4 min-[700px]:grid-cols-2">
            <PartnerPanelCard bodyClassName="p-5">
              <Search size={20} className="text-sapphire" aria-hidden />
              <h2 className="mt-3 text-[17px] font-semibold text-ink">{t("buyerFindTitle")}</h2>
              <p className="mt-1.5 text-[13.5px] leading-6 text-muted">{t("buyerFindSub")}</p>
              <Link href="/explore" className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-sapphire hover:underline">{t("searchSuppliers")} →</Link>
            </PartnerPanelCard>
            <PartnerPanelCard bodyClassName="p-5">
              <Heart size={20} className="text-sapphire" aria-hidden />
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <h2 className="text-[17px] font-semibold text-ink">{t("favoritesNav")}</h2>
                <strong className="text-[24px] font-semibold text-ink">{favoriteCount ?? 0}</strong>
              </div>
              <p className="mt-1.5 text-[13.5px] leading-6 text-muted">{t("buyerFavoritesSub")}</p>
              <Link href="/dashboard/favorites" className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-sapphire hover:underline">{t("buyerFavoritesCta")} →</Link>
            </PartnerPanelCard>
          </section>

          <PartnerPanelCard bodyClassName="flex flex-wrap items-center justify-between gap-4 p-5" className="border-[#D5E2FA] bg-[#F8FBFF]">
            <div>
              <h2 className="text-[15px] font-semibold text-ink">{t("buyerRequestTitle")}</h2>
              <p className="mt-1 text-[13px] leading-5 text-muted">{t("buyerRequestSub")}</p>
            </div>
            <Link href="/explore" className={styles.compactSecondaryButton}>{t("buyerExploreCta")}</Link>
          </PartnerPanelCard>
        </div>
      </div>
    </>
  );
}
