import { ApplicationList, BusinessTable, Empty, PageHeader, panel } from "../_components";
import styles from "./styles";
import type { AdminApplication, AdminBusiness } from "@/lib/types";

interface Props {
  pendingBusinesses: AdminBusiness[];
  pendingApplications: AdminApplication[];
  locale: string;
}

const ApprovalsView = ({ pendingBusinesses, pendingApplications, locale }: Props) => {
  return (
    <>
      <PageHeader
        eyebrow="Onay"
        title="Onay bekleyenler"
        description="Yeni firma kayıtları ve kategori başvurularını ayrı ayrı incele, yayın durumunu hızlı güncelle."
      />

      <div className={styles.grid}>
        <section className={panel}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className={styles.sectionTitle}>Firma kayıtları</h2>
              <p className={styles.sectionSub}>Business tablosundaki bekleyen tedarikçiler.</p>
            </div>
            <span className={styles.badge}>{pendingBusinesses.length}</span>
          </div>
          {pendingBusinesses.length > 0 ? <BusinessTable businesses={pendingBusinesses} /> : <Empty text="Bekleyen firma kaydı yok." />}
        </section>

        <section className={panel}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className={styles.sectionTitle}>Başvurular</h2>
              <p className={styles.sectionSub}>Kayıt formundan gelen başvurular.</p>
            </div>
            <span className={styles.badge}>{pendingApplications.length}</span>
          </div>
          <ApplicationList applications={pendingApplications} locale={locale} />
        </section>
      </div>
    </>
  );
};

export default ApprovalsView;
