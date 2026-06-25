import { ContentForm, ContentTable, PageHeader, panel } from "../_components";
import styles from "./styles";
import type { ContentPage } from "@/lib/types";

interface Props {
  pages: ContentPage[];
  locale: string;
}

const AdminContentView = ({ pages, locale }: Props) => {
  const firstPage = pages[0];

  return (
    <>
      <PageHeader
        eyebrow="İçerik"
        title="Sayfa içerikleri"
        description="Landing, kategori, özel kampanya veya SEO odaklı içerik sayfalarını metin ve metadata ile yönet."
      />

      <div className={styles.grid}>
        <section className={panel}>
          <div className="mb-4">
            <h2 className={styles.sectionTitle}>Kayıtlı sayfalar</h2>
            <p className={styles.sectionSub}>Yayın/taslak durumu ve SEO doluluğu.</p>
          </div>
          <ContentTable pages={pages} />
        </section>

        <section className={panel}>
          <h2 className={styles.formTitle}>İçerik formu</h2>
          <p className={styles.formSub}>Slug aynıysa günceller, yeni slug ile yeni sayfa açar.</p>
          <div className="mt-4">
            <ContentForm locale={locale} page={firstPage} />
          </div>
        </section>
      </div>
    </>
  );
};

export default AdminContentView;
