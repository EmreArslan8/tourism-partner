import { Eye, MousePointerClick, TrendingUp, Users } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { getAdminData } from "@/lib/admin";
import { Card, CardContent } from "@/components/common";


export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = await getAdminData();
  const topCities = countBy(data.businesses.map((business) => business.city)).slice(0, 6);
  const topGroups = countBy(data.businesses.map((business) => business.group)).slice(0, 6);

  // Görüntülenme metrikleri (son 7 gün penceresi — admin.ts sorgusu böyle sınırlıyor).
  // Çoğul = toplam olay; Tekil = distinct visitor_id (bot trafiği recordView'de zaten elenmiş).
  const totalViews = data.pageViews.length; // çoğul
  const uniqueVisitors = new Set(
    data.pageViews.map((view) => view.visitorId).filter((id): id is string => !!id),
  ).size; // tekil
  const impressions = data.pageViews.filter((view) => view.entityType === "impression").length;
  const detailViews = data.pageViews.filter((view) => view.entityType === "business").length;

  return (
    <>
      <header className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[.12em] text-[#2563EB]">Raporlar</p>
        <h2 className="mt-1 text-[30px] font-extrabold leading-tight text-[#0B1C30]">Veri Analitiği</h2>
        <p className="mt-1.5 max-w-[760px] text-[14px] font-medium leading-6 text-[#64748B]">
          Görüntülenme, bölge yoğunluğu ve kategori performansını takip edin. Son 7 gün.
        </p>
      </header>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ReportCard icon={<TrendingUp size={20} aria-hidden />} label="Çoğul Görüntülenme" value={totalViews} hint="Toplam olay (impression + detay)" />
        <ReportCard icon={<Users size={20} aria-hidden />} label="Tekil Ziyaretçi" value={uniqueVisitors} hint="Distinct ziyaretçi (bot hariç)" />
        <ReportCard icon={<Eye size={20} aria-hidden />} label="Kart Impression" value={impressions} hint="Kart ekrana geldi" />
        <ReportCard icon={<MousePointerClick size={20} aria-hidden />} label="Detay Ziyareti" value={detailViews} hint="Profil sayfası açıldı" />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <ReportPanel title="Bölge Yoğunluğu" rows={topCities} />
        <ReportPanel title="Kategori Yoğunluğu" rows={topGroups} />
      </div>

      <section className="mt-6 rounded-[10px] border border-[#D4DCEA] bg-white p-5 shadow-[0_8px_18px_rgba(15,23,42,.04)]">
        <h3 className="text-[18px] font-extrabold text-[#162238]">Gelişmiş Sorgu</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
          <select className="h-10 rounded-[8px] border border-[#C9D3E5] bg-white px-3 text-[13px] font-semibold text-[#162238]">
            <option>Son 30 gün</option>
            <option>Son 7 gün</option>
            <option>Bu ay</option>
          </select>
          <select className="h-10 rounded-[8px] border border-[#C9D3E5] bg-white px-3 text-[13px] font-semibold text-[#162238]">
            <option>Tüm bölgeler</option>
            {topCities.map((city) => <option key={city.label}>{city.label}</option>)}
          </select>
          <select className="h-10 rounded-[8px] border border-[#C9D3E5] bg-white px-3 text-[13px] font-semibold text-[#162238]">
            <option>Tüm kategoriler</option>
            {topGroups.map((group) => <option key={group.label}>{group.label}</option>)}
          </select>
          <button type="button" className="h-10 rounded-[8px] bg-[#0057D9] px-5 text-[13px] font-extrabold text-white hover:bg-[#0047B8]">
            Analiz Et
          </button>
        </div>
      </section>
    </>
  );
}

/* common/Card (composition) ile beslenen metric kartı. */
const ReportCard = ({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  hint?: string;
}) => (
  <Card interactive>
    <CardContent>
      <div className="mb-4 grid h-10 w-10 place-items-center rounded-[8px] bg-[#EEF4FF] text-[#0057D9]">{icon}</div>
      <p className="text-[12px] font-extrabold uppercase tracking-[.08em] text-[#64748B]">{label}</p>
      <p className="mt-2 text-[30px] font-black leading-none text-[#0B1C30]">{value.toLocaleString("tr-TR")}</p>
      {hint && <p className="mt-1.5 text-[11.5px] font-medium text-[#94A3B8]">{hint}</p>}
    </CardContent>
  </Card>
);

const ReportPanel = ({ title, rows }: { title: string; rows: Array<{ label: string; count: number }> }) => {
  const max = Math.max(...rows.map((row) => row.count), 1);
  return (
    <section className="rounded-[10px] border border-[#D4DCEA] bg-white p-5 shadow-[0_8px_18px_rgba(15,23,42,.04)]">
      <h3 className="mb-4 text-[18px] font-extrabold text-[#162238]">{title}</h3>
      <div className="grid gap-3">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-1 flex justify-between gap-3 text-[13px] font-bold text-[#3D4B64]">
              <span>{row.label}</span>
              <span>{row.count}</span>
            </div>
            <div className="h-2 rounded-full bg-[#EEF4FF]">
              <div className="h-2 rounded-full bg-[#0057D9]" style={{ width: `${Math.max(8, (row.count / max) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const countBy = (items: string[]) => {
  const counts = new Map<string, number>();
  items.forEach((item) => counts.set(item, (counts.get(item) ?? 0) + 1));
  return Array.from(counts, ([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
};
