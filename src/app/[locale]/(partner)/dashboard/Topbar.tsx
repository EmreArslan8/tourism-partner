import { getTranslations } from "next-intl/server";
import { getPanelBusiness, getPanelUser } from "@/lib/panel-auth";
import styles from "./styles";

/* Alt panel sayfaları için sade üst bar (overview/listings kendi zengin
   topbar'ını view.tsx içinde kullanır). Sabit panel başlığı + çıkış. */
export default async function DashboardTopbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const t = await getTranslations("panel");
  const [business, user] = await Promise.all([getPanelBusiness(), getPanelUser()]);
  const meta = (user?.user_metadata ?? {}) as Record<string, string>;
  const group = business?.group ?? meta.biz_group ?? "";
  const isAgency = group === "acente";
  const isGuide = group === "rehber";
  const panelTitle = isAgency ? t("agencyTitle") : t("supplierTitle");
  const panelSubtitle =
    subtitle ||
    business?.name ||
    meta.firm_name ||
    (isAgency ? t("agencyMode") : isGuide ? t("guideMode") : t("supplierMode")) ||
    title;

  return (
    <div className={styles.topbar}>
      <div className={styles.topbarInner}>
        <div className={styles.topbarText}>
          <h1 className={styles.title}>{panelTitle}</h1>
          <p className={styles.email}>{panelSubtitle}</p>
        </div>
      </div>
    </div>
  );
}
