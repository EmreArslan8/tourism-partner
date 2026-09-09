import { businessSlug } from "@/lib/businesses";
import { getPathname } from "@/i18n/navigation";
import { BusinessForm, Metric, PageHeader, StatusPill, panel, seoScore } from "../_components";
import { DataTable, type Column } from "@/components/common";
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
          <div className="mt-4">
            <DataTable
              data={businesses}
              getRowKey={(business) => business.id}
              empty="İşletme kaydı yok."
              minWidth={760}
              columns={[
                { key: "firm", header: "Firma", cell: (business) => <span className="font-bold">{business.name}</span> },
                { key: "title", header: "Title", cell: (business) => business.seoTitle ? `${business.seoTitle.length} krk` : "Eksik" },
                { key: "description", header: "Description", cell: (business) => business.seoDescription ? `${business.seoDescription.length} krk` : "Eksik" },
                {
                  key: "canonical",
                  header: "Canonical",
                  cell: (business) => <span className="break-all text-muted">{business.canonicalPath || getPathname({ locale, href: { pathname: "/supplier/[id]", params: { id: businessSlug(business) } } })}</span>,
                },
                { key: "status", header: "Durum", cell: (business) => <StatusPill value={business.seoTitle && business.seoDescription ? "complete" : "pending"} /> },
              ] satisfies Column<AdminBusiness>[]}
            />
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

export default AdminSeoView;
