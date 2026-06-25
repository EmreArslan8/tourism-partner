import { BusinessForm, BusinessTable, PageHeader, panel } from "../_components";
import styles from "./styles";
import type { AdminBusiness } from "@/lib/types";

interface Props {
  businesses: AdminBusiness[];
  locale: string;
}

const AdminSuppliersView = ({ businesses, locale }: Props) => {
  const firstBusiness = businesses[0];

  return (
    <>
      <PageHeader
        eyebrow="Tedarikçiler"
        title="Tedarikçi yönetimi"
        description="Firma bilgisi, kategori, konum, görsel, yayın durumu, sponsor/doğrulama ve tedarikçi SEO alanlarını buradan yönet."
      />

      <section className={panel}>
        <div className="mb-4">
          <h2 className={styles.sectionTitle}>Kayıt formu</h2>
          <p className={styles.sectionSub}>ID boşsa yeni tedarikçi açılır; ID doluysa mevcut kayıt güncellenir.</p>
        </div>
        <BusinessForm locale={locale} business={firstBusiness} />
      </section>

      <section className={cn(panel, "mt-6")}>
        <div className={styles.allHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Tüm tedarikçiler</h2>
            <p className={styles.sectionSub}>Liste üzerinden kayıt durumlarını ve eksikleri takip et.</p>
          </div>
          <span className={styles.badge}>
            {businesses.length} kayıt
          </span>
        </div>
        <BusinessTable businesses={businesses} />
      </section>
    </>
  );
};

import { cn } from "@/lib/utils";

export default AdminSuppliersView;
