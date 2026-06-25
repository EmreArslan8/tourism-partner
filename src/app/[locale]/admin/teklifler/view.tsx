import { Metric, PageHeader, QuoteList, panel } from "../_components";
import styles from "./styles";
import type { AdminQuote } from "@/lib/types";

interface Props {
  quotes: AdminQuote[];
  locale: string;
}

const AdminQuotesView = ({ quotes, locale }: Props) => {
  const newQuotes = quotes.filter((quote) => quote.status === "new");
  const contacted = quotes.filter((quote) => quote.status === "contacted");
  const won = quotes.filter((quote) => quote.status === "won");

  return (
    <>
      <PageHeader
        eyebrow="Teklifler"
        title="RFQ takip ekranı"
        description="Gelen teklif taleplerini durumlandır, iç not ekle ve satış/partner operasyonunu takip et."
      />

      <section className={styles.statsGrid}>
        <Metric title="Yeni" value={newQuotes.length} hint="ilk temas bekler" />
        <Metric title="Temasta" value={contacted.length} hint="takipte" />
        <Metric title="Kazanıldı" value={won.length} hint="pozitif sonuç" />
        <Metric title="Toplam" value={quotes.length} hint="son 50 kayıt" />
      </section>

      <section className={cn(panel, "mt-6")}>
        <div className="mb-4">
          <h2 className={styles.sectionTitle}>Tüm teklif talepleri</h2>
          <p className={styles.sectionSub}>Durum ve iç not alanları kaydedilebilir.</p>
        </div>
        <QuoteList quotes={quotes} locale={locale} />
      </section>
    </>
  );
};

import { cn } from "@/lib/utils";

export default AdminQuotesView;
