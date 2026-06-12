import { setRequestLocale } from "next-intl/server";
import { getAdminData } from "@/lib/admin";
import { ContentForm, ContentTable, PageHeader, panel } from "../_components";

export default async function AdminContentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = await getAdminData();
  const firstPage = data.pages[0];

  return (
    <>
      <PageHeader
        eyebrow="İçerik"
        title="Sayfa içerikleri"
        description="Landing, kategori, özel kampanya veya SEO odaklı içerik sayfalarını metin ve metadata ile yönet."
      />

      <div className="grid grid-cols-[minmax(0,1fr)_420px] gap-6 max-[1100px]:grid-cols-1">
        <section className={panel}>
          <div className="mb-4">
            <h2 className="text-[24px]">Kayıtlı sayfalar</h2>
            <p className="text-[13.5px] text-muted">Yayın/taslak durumu ve SEO doluluğu.</p>
          </div>
          <ContentTable pages={data.pages} />
        </section>

        <section className={panel}>
          <h2 className="text-[24px]">İçerik formu</h2>
          <p className="mt-1 text-[13.5px] text-muted">Slug aynıysa günceller, yeni slug ile yeni sayfa açar.</p>
          <div className="mt-4">
            <ContentForm locale={locale} page={firstPage} />
          </div>
        </section>
      </div>
    </>
  );
}
