import { Link, type Href } from "@/i18n/navigation";
import { BusinessTable, Metric, PageHeader, panel, seoScore } from "./_components";
import styles from "./styles";
import type { AdminData } from "@/lib/types";

interface Props {
  data: AdminData;
}

const AdminView = ({ data }: Props) => {
  const pendingBusinesses = data.businesses.filter((b) => b.status === "pending");
  const pendingApplications = data.applications.filter((a) => a.status === "pending");
  const newQuotes = data.quotes.filter((q) => q.status === "new");
  const missingSeo = data.businesses.filter((b) => !b.seoTitle || !b.seoDescription);

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Operasyon özeti"
        description="Yayındaki tedarikçiler, bekleyen onaylar, teklif akışı ve SEO sağlığı için hızlı kontrol ekranı."
        action={<Link href="/admin/tedarikciler" className="btn btn-solid btn-sm">Tedarikçi ekle</Link>}
      />

      <section className={styles.statsGrid}>
        <Metric title="Tedarikçi" value={data.businesses.length} hint={`${pendingBusinesses.length} beklemede`} />
        <Metric title="Başvuru" value={pendingApplications.length} hint="onay bekleyen" />
        <Metric title="Teklif" value={newQuotes.length} hint="yeni RFQ" />
        <Metric title="İçerik" value={data.pages.length} hint="sayfa kaydı" />
        <Metric title="SEO" value={seoScore(data.businesses)} hint={`${missingSeo.length} eksik`} />
      </section>

      <div className={styles.contentGrid}>
        <section className={panel}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className={styles.sectionTitle}>Son tedarikçiler</h2>
              <p className={styles.sectionSub}>Yayın ve SEO durumuna göre hızlı tarama.</p>
            </div>
            <Link href="/admin/tedarikciler" className="btn btn-outline btn-sm">Tümü</Link>
          </div>
          <BusinessTable businesses={data.businesses.slice(0, 8)} />
        </section>

        <aside className={styles.aside}>
          <section className={panel}>
            <div className="flex items-center justify-between">
              <h2 className={styles.asideTitle}>Öncelikler</h2>
              <span className={styles.badge}>Canlı</span>
            </div>
            <div className={styles.list}>
              <QuickLink href="/admin/onay" title="Onay bekleyenler" value={pendingBusinesses.length + pendingApplications.length} />
              <QuickLink href="/admin/teklifler" title="Yeni teklifler" value={newQuotes.length} />
              <QuickLink href="/admin/seo" title="SEO eksikleri" value={missingSeo.length} />
              <QuickLink href="/admin/icerik" title="İçerik sayfaları" value={data.pages.length} />
            </div>
          </section>

          <section className={panel}>
            <h2 className={styles.asideTitle}>Panel kapsamı</h2>
            <ul className={styles.bullets}>
              <li>Tedarikçi kayıt ve yayın yönetimi</li>
              <li>SEO title, description, keywords, canonical ve OG görsel</li>
              <li>Başvuru onay süreci</li>
              <li>Teklif talebi durum ve iç not takibi</li>
              <li>Landing ve özel içerik sayfaları</li>
            </ul>
          </section>
        </aside>
      </div>
    </>
  );
};

const QuickLink = ({ href, title, value }: { href: Href; title: string; value: number }) => (
  <Link href={href} className={styles.quickLink}>
    <span className={styles.quickLinkTitle}>{title}</span>
    <span className={styles.quickLinkValue}>{value}</span>
  </Link>
);

export default AdminView;
