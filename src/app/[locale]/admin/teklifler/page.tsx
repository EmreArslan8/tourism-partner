import { setRequestLocale } from "next-intl/server";
import { getAdminData } from "@/lib/admin";
import { Metric, PageHeader, QuoteList, panel } from "../_components";

export default async function AdminQuotesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = await getAdminData();
  const newQuotes = data.quotes.filter((quote) => quote.status === "new");
  const contacted = data.quotes.filter((quote) => quote.status === "contacted");
  const won = data.quotes.filter((quote) => quote.status === "won");

  return (
    <>
      <PageHeader
        eyebrow="Teklifler"
        title="RFQ takip ekranı"
        description="Gelen teklif taleplerini durumlandır, iç not ekle ve satış/partner operasyonunu takip et."
      />

      <section className="grid gap-3 md:grid-cols-4">
        <Metric title="Yeni" value={newQuotes.length} hint="ilk temas bekler" />
        <Metric title="Temasta" value={contacted.length} hint="takipte" />
        <Metric title="Kazanıldı" value={won.length} hint="pozitif sonuç" />
        <Metric title="Toplam" value={data.quotes.length} hint="son 50 kayıt" />
      </section>

      <section className={`${panel} mt-6`}>
        <div className="mb-4">
          <h2 className="text-[24px]">Tüm teklif talepleri</h2>
          <p className="text-[13.5px] text-muted">Durum ve iç not alanları kaydedilebilir.</p>
        </div>
        <QuoteList quotes={data.quotes} locale={locale} />
      </section>
    </>
  );
}
