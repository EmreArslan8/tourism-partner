import { setRequestLocale } from "next-intl/server";
import { getAdminData } from "@/lib/admin";
import { BusinessForm, BusinessTable, PageHeader, panel } from "../_components";

export default async function AdminBusinessesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = await getAdminData();
  const firstBusiness = data.businesses[0];

  return (
    <>
      <PageHeader
        eyebrow="Tedarikçiler"
        title="Tedarikçi yönetimi"
        description="Firma bilgisi, kategori, konum, görsel, yayın durumu, sponsor/doğrulama ve tedarikçi SEO alanlarını buradan yönet."
      />

      <section className={panel}>
        <div className="mb-4">
          <h2 className="text-[24px]">Kayıt formu</h2>
          <p className="text-[13.5px] text-muted">ID boşsa yeni tedarikçi açılır; ID doluysa mevcut kayıt güncellenir.</p>
        </div>
        <BusinessForm locale={locale} business={firstBusiness} />
      </section>

      <section className={`${panel} mt-6`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[24px]">Tüm tedarikçiler</h2>
            <p className="text-[13.5px] text-muted">Liste üzerinden kayıt durumlarını ve eksikleri takip et.</p>
          </div>
          <span className="rounded-pill bg-cream px-3 py-1.5 text-[12px] font-bold text-muted">
            {data.businesses.length} kayıt
          </span>
        </div>
        <BusinessTable businesses={data.businesses} />
      </section>
    </>
  );
}
