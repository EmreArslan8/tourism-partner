import { setRequestLocale } from "next-intl/server";
import { getAdminData } from "@/lib/admin";
import { ApplicationList, BusinessTable, Empty, PageHeader, panel } from "../_components";

export default async function AdminApprovalsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = await getAdminData();
  const pendingBusinesses = data.businesses.filter((business) => business.status === "pending");
  const pendingApplications = data.applications.filter((application) => application.status === "pending");

  return (
    <>
      <PageHeader
        eyebrow="Onay"
        title="Onay bekleyenler"
        description="Yeni firma kayıtları ve kategori başvurularını ayrı ayrı incele, yayın durumunu hızlı güncelle."
      />

      <div className="grid grid-cols-2 gap-6 max-[1080px]:grid-cols-1">
        <section className={panel}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[24px]">Firma kayıtları</h2>
              <p className="text-[13.5px] text-muted">Business tablosundaki bekleyen tedarikçiler.</p>
            </div>
            <span className="rounded-pill bg-cream px-3 py-1 text-[12px] font-bold text-muted">{pendingBusinesses.length}</span>
          </div>
          {pendingBusinesses.length > 0 ? <BusinessTable businesses={pendingBusinesses} /> : <Empty text="Bekleyen firma kaydı yok." />}
        </section>

        <section className={panel}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[24px]">Başvurular</h2>
              <p className="text-[13.5px] text-muted">Kayıt formundan gelen başvurular.</p>
            </div>
            <span className="rounded-pill bg-cream px-3 py-1 text-[12px] font-bold text-muted">{pendingApplications.length}</span>
          </div>
          <ApplicationList applications={pendingApplications} locale={locale} />
        </section>
      </div>
    </>
  );
}
