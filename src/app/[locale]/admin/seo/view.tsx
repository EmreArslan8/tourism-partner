import { businessSlug } from "@/lib/businesses";
import { getPathname } from "@/i18n/navigation";
import { BusinessForm, Metric, PageHeader, StatusPill, panel, seoScore } from "../_components";
import styles from "./styles";
import type { AdminBusiness, ContentPage } from "@/lib/types";

interface Props {
  businesses: AdminBusiness[];
  pages: ContentPage[];
  locale: string;
}

const AdminSeoView = ({ businesses, pages, locale }: Props) => {
  const missing = businesses.filter((b) => !b.seoTitle || !b.seoDescription);
  const withOg = businesses.filter((b) => b.ogImage || b.image);
  const target = missing[0] ?? businesses[0];

  return (
    <>
      <PageHeader
        eyebrow="SEO"
        title="Metadata kontrol merkezi"
        description="Tedarikçi detay sayfaları için title, description, keywords, canonical ve OG görsel doluluğunu yönet."
      />

      <section className={styles.statsGrid}>
        <Metric title="SEO skoru" value={seoScore(businesses)} hint="title + description" />
        <Metric title="Eksik meta" value={missing.length} hint="tamamlanmalı" />
        <Metric title="OG görsel" value={withOg.length} hint="görseli olan" />
        <Metric title="Toplam URL" value={businesses.length + pages.length} hint="takip edilen" />
      </section>

      <div className={styles.contentGrid}>
        <section className={panel}>
          <h2 className={styles.sectionTitle}>SEO eksikleri</h2>
          <p className={styles.sectionSub}>Önce title ve description boş olan kayıtları tamamla.</p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Firma</th>
                  <th className={styles.th}>Title</th>
                  <th className={styles.th}>Description</th>
                  <th className={styles.th}>Canonical</th>
                  <th className={styles.th}>Durum</th>
                </tr>
              </thead>
              <tbody>
                {businesses.map((business) => (
                  <tr key={business.id}>
                    <td className={cn(styles.td, styles.name)}>{business.name}</td>
                    <td className={styles.td}>{business.seoTitle ? `${business.seoTitle.length} krk` : "Eksik"}</td>
                    <td className={styles.td}>{business.seoDescription ? `${business.seoDescription.length} krk` : "Eksik"}</td>
                    <td className={styles.td}>
                      {business.canonicalPath ||
                        getPathname({
                          locale,
                          href: { pathname: "/supplier/[id]", params: { id: businessSlug(business) } },
                        })}
                    </td>
                    <td className={styles.td}>
                      <StatusPill value={business.seoTitle && business.seoDescription ? "complete" : "pending"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={panel}>
          <h2 className={styles.sectionTitle}>Hızlı SEO düzenle</h2>
          <p className={styles.sectionSub}>Eksik ilk kaydı formda açtım. ID değiştirerek başka kaydı da güncelleyebilirsin.</p>
          <div className="mt-4">
            <BusinessForm locale={locale} business={target} />
          </div>
        </section>
      </div>
    </>
  );
};

import { cn } from "@/lib/utils";

export default AdminSeoView;
