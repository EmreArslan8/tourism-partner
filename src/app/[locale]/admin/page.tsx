import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAdminData } from "@/lib/admin";
import { BusinessTable, Metric, PageHeader, panel, seoScore } from "./_components";

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = await getAdminData();

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

      <section className="grid gap-3 md:grid-cols-5">
        <Metric title="Tedarikçi" value={data.businesses.length} hint={`${pendingBusinesses.length} beklemede`} />
        <Metric title="Başvuru" value={pendingApplications.length} hint="onay bekleyen" />
        <Metric title="Teklif" value={newQuotes.length} hint="yeni RFQ" />
        <Metric title="İçerik" value={data.pages.length} hint="sayfa kaydı" />
        <Metric title="SEO" value={seoScore(data.businesses)} hint={`${missingSeo.length} eksik`} />
      </section>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)_340px] gap-6 max-[1040px]:grid-cols-1">
        <section className={panel}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[24px]">Son tedarikçiler</h2>
              <p className="text-[13.5px] text-muted">Yayın ve SEO durumuna göre hızlı tarama.</p>
            </div>
            <Link href="/admin/tedarikciler" className="btn btn-outline btn-sm">Tümü</Link>
          </div>
          <BusinessTable businesses={data.businesses.slice(0, 8)} />
        </section>

        <aside className="grid content-start gap-4">
          <section className={panel}>
            <div className="flex items-center justify-between">
              <h2 className="text-[22px]">Öncelikler</h2>
              <span className="rounded-[999px] bg-[#f3f6f2] px-3 py-1 text-[11px] font-bold uppercase tracking-[.06em] text-muted">Canlı</span>
            </div>
            <div className="mt-4 grid gap-3">
              <QuickLink href="/admin/onay" title="Onay bekleyenler" value={pendingBusinesses.length + pendingApplications.length} />
              <QuickLink href="/admin/teklifler" title="Yeni teklifler" value={newQuotes.length} />
              <QuickLink href="/admin/seo" title="SEO eksikleri" value={missingSeo.length} />
              <QuickLink href="/admin/icerik" title="İçerik sayfaları" value={data.pages.length} />
            </div>
          </section>

          <section className={panel}>
            <h2 className="text-[22px]">Panel kapsamı</h2>
            <ul className="mt-3 space-y-2 text-[13.5px] text-muted">
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
}

function QuickLink({ href, title, value }: { href: string; title: string; value: number }) {
  return (
    <Link href={href} className="flex items-center justify-between rounded-[8px] border border-[#d8ded7] bg-[#f3f6f2] px-4 py-3 transition hover:border-terra hover:bg-white">
      <span className="text-[14px] font-bold">{title}</span>
      <span className="rounded-[999px] bg-white px-3 py-1 text-[12px] font-bold text-terra">{value}</span>
    </Link>
  );
}
