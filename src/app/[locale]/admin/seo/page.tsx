import { setRequestLocale } from "next-intl/server";
import { getAdminData } from "@/lib/admin";
import { BusinessForm, Metric, PageHeader, StatusPill, panel, seoScore } from "../_components";

export default async function AdminSeoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = await getAdminData();
  const missing = data.businesses.filter((b) => !b.seoTitle || !b.seoDescription);
  const withOg = data.businesses.filter((b) => b.ogImage || b.image);
  const target = missing[0] ?? data.businesses[0];

  return (
    <>
      <PageHeader
        eyebrow="SEO"
        title="Metadata kontrol merkezi"
        description="Tedarikçi detay sayfaları için title, description, keywords, canonical ve OG görsel doluluğunu yönet."
      />

      <section className="grid gap-3 md:grid-cols-4">
        <Metric title="SEO skoru" value={seoScore(data.businesses)} hint="title + description" />
        <Metric title="Eksik meta" value={missing.length} hint="tamamlanmalı" />
        <Metric title="OG görsel" value={withOg.length} hint="görseli olan" />
        <Metric title="Toplam URL" value={data.businesses.length + data.pages.length} hint="takip edilen" />
      </section>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)_420px] gap-6 max-[1100px]:grid-cols-1">
        <section className={panel}>
          <h2 className="text-[24px]">SEO eksikleri</h2>
          <p className="mt-1 text-[13.5px] text-muted">Önce title ve description boş olan kayıtları tamamla.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-[13.5px]">
              <thead className="text-[11px] uppercase tracking-[.06em] text-muted">
                <tr>
                  <th className="border-b border-line py-2 pr-3">Firma</th>
                  <th className="border-b border-line py-2 pr-3">Title</th>
                  <th className="border-b border-line py-2 pr-3">Description</th>
                  <th className="border-b border-line py-2 pr-3">Canonical</th>
                  <th className="border-b border-line py-2 pr-3">Durum</th>
                </tr>
              </thead>
              <tbody>
                {data.businesses.map((business) => (
                  <tr key={business.id}>
                    <td className="border-b border-line py-3 pr-3 font-bold">{business.name}</td>
                    <td className="border-b border-line py-3 pr-3">{business.seoTitle ? `${business.seoTitle.length} krk` : "Eksik"}</td>
                    <td className="border-b border-line py-3 pr-3">{business.seoDescription ? `${business.seoDescription.length} krk` : "Eksik"}</td>
                    <td className="border-b border-line py-3 pr-3">{business.canonicalPath || `/tedarikci/${business.id}`}</td>
                    <td className="border-b border-line py-3 pr-3">
                      <StatusPill value={business.seoTitle && business.seoDescription ? "complete" : "pending"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={panel}>
          <h2 className="text-[24px]">Hızlı SEO düzenle</h2>
          <p className="mt-1 text-[13.5px] text-muted">Eksik ilk kaydı formda açtım. ID değiştirerek başka kaydı da güncelleyebilirsin.</p>
          <div className="mt-4">
            <BusinessForm locale={locale} business={target} />
          </div>
        </section>
      </div>
    </>
  );
}
