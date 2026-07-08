import { Eye, MousePointerClick, TrendingUp, Users } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { getAdminData } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminMetric, AdminPage, AdminPanel, adminUi } from "../_ui";

type AdvancedQuery = { period: string; city: string; group: string };

/* Seçilen dönem/şehir/grup için page_views üzerinden hedefli görüntülenme sorgusu.
   Sayfa admin-korumalı (AdminGate); RLS admin policy'leri page_views'e erişim verir. */
async function runAdvancedQuery(
  query: AdvancedQuery,
  businesses: { id: number; city: string; group: string; name: string }[],
) {
  const now = Date.now();
  const since =
    query.period === "7d"
      ? new Date(now - 7 * 86_400_000)
      : query.period === "month"
        ? new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        : new Date(now - 30 * 86_400_000);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("page_views")
    .select("entity_type,entity_id")
    .in("entity_type", ["impression", "business"])
    .gte("viewed_at", since.toISOString())
    .limit(10_000);
  if (error) return { total: 0, top: [] as { label: string; count: number }[] };

  const byId = new Map(businesses.map((b) => [b.id, b]));
  const counts = new Map<number, number>();
  let total = 0;
  for (const row of data ?? []) {
    const biz = row.entity_id != null ? byId.get(Number(row.entity_id)) : undefined;
    if (!biz) continue;
    if (query.city && biz.city !== query.city) continue;
    if (query.group && biz.group !== query.group) continue;
    total += 1;
    counts.set(biz.id, (counts.get(biz.id) ?? 0) + 1);
  }

  const top = Array.from(counts, ([id, count]) => ({ label: byId.get(id)?.name ?? String(id), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  return { total, top };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ period?: string; city?: string; group?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const data = await getAdminData();
  const topCities = countBy(data.businesses.map((business) => business.city)).slice(0, 6);
  const topGroups = countBy(data.businesses.map((business) => business.group)).slice(0, 6);

  const period = sp.period === "7d" || sp.period === "month" ? sp.period : "30d";
  const selectedCity = sp.city ?? "";
  const selectedGroup = sp.group ?? "";
  const hasQuery = Boolean(sp.period || sp.city || sp.group);
  const advanced = hasQuery
    ? await runAdvancedQuery({ period, city: selectedCity, group: selectedGroup }, data.businesses)
    : null;
  const periodLabel = period === "7d" ? "Son 7 gün" : period === "month" ? "Bu ay" : "Son 30 gün";

  // Görüntülenme metrikleri (son 7 gün penceresi — admin.ts sorgusu böyle sınırlıyor).
  // Çoğul = toplam olay; Tekil = distinct visitor_id (bot trafiği recordView'de zaten elenmiş).
  const totalViews = data.pageViews.length; // çoğul
  const uniqueVisitors = new Set(
    data.pageViews.map((view) => view.visitorId).filter((id): id is string => !!id),
  ).size; // tekil
  const impressions = data.pageViews.filter((view) => view.entityType === "impression").length;
  const detailViews = data.pageViews.filter((view) => view.entityType === "business").length;

  return (
    <AdminPage
      title="Veri Analitiği"
      description="Görüntülenme, bölge yoğunluğu ve kategori performansını takip edin. Son 7 gün."
    >

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminMetric icon={<TrendingUp size={20} aria-hidden />} label="Çoğul Görüntülenme" value={totalViews.toLocaleString("tr-TR")} hint="Toplam olay (impression + detay)" />
        <AdminMetric icon={<Users size={20} aria-hidden />} label="Tekil Ziyaretçi" value={uniqueVisitors.toLocaleString("tr-TR")} hint="Distinct ziyaretçi (bot hariç)" tone="emerald" />
        <AdminMetric icon={<Eye size={20} aria-hidden />} label="Kart Impression" value={impressions.toLocaleString("tr-TR")} hint="Kart ekrana geldi" />
        <AdminMetric icon={<MousePointerClick size={20} aria-hidden />} label="Detay Ziyareti" value={detailViews.toLocaleString("tr-TR")} hint="Profil sayfası açıldı" tone="amber" />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <ReportPanel title="Bölge Yoğunluğu" rows={topCities} />
        <ReportPanel title="Kategori Yoğunluğu" rows={topGroups} />
      </div>

      <AdminPanel title="Gelişmiş Sorgu" className="mt-6" bodyClassName="p-5">
        <form method="get" className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
          <select name="period" defaultValue={period} className={adminUi.input}>
            <option value="30d">Son 30 gün</option>
            <option value="7d">Son 7 gün</option>
            <option value="month">Bu ay</option>
          </select>
          <select name="city" defaultValue={selectedCity} className={adminUi.input}>
            <option value="">Tüm bölgeler</option>
            {topCities.map((city) => <option key={city.label} value={city.label}>{city.label}</option>)}
          </select>
          <select name="group" defaultValue={selectedGroup} className={adminUi.input}>
            <option value="">Tüm kategoriler</option>
            {topGroups.map((group) => <option key={group.label} value={group.label}>{group.label}</option>)}
          </select>
          <button type="submit" className={adminUi.sapphireButton}>
            Analiz Et
          </button>
        </form>

        {advanced && (
          <div className="mt-5 border-t border-line/80 pt-5">
            <div className="flex flex-wrap items-baseline gap-3">
              <p className="text-[13px] font-bold text-muted">
                {periodLabel}
                {selectedCity && ` · ${selectedCity}`}
                {selectedGroup && ` · ${selectedGroup}`}
              </p>
            </div>
            <p className="mt-2 text-[34px] font-black leading-none text-ink">
              {advanced.total.toLocaleString("tr-TR")}
              <span className="ml-2 text-[13px] font-bold text-muted">görüntülenme</span>
            </p>
            {advanced.top.length > 0 ? (
              <div className="mt-4 grid gap-2">
                <p className="text-[12px] font-extrabold uppercase tracking-[.08em] text-muted">En çok görüntülenen 5 işletme</p>
                {advanced.top.map((row) => (
                  <div key={row.label} className="flex justify-between gap-3 rounded-[8px] border border-line/80 bg-cream/45 px-3 py-2 text-[13px] font-bold text-ink/80">
                    <span className="truncate">{row.label}</span>
                    <span>{row.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-[13px] font-semibold text-muted">Seçilen kriterlerde görüntülenme kaydı bulunamadı.</p>
            )}
          </div>
        )}
      </AdminPanel>
    </AdminPage>
  );
}

const ReportPanel = ({ title, rows }: { title: string; rows: Array<{ label: string; count: number }> }) => {
  const max = Math.max(...rows.map((row) => row.count), 1);
  return (
    <AdminPanel title={title} bodyClassName="p-5">
      <div className="grid gap-3">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-1 flex justify-between gap-3 text-[13px] font-medium text-ink/80">
              <span>{row.label}</span>
              <span>{row.count}</span>
            </div>
            <div className="h-2 rounded-full bg-cream">
              <div className="h-2 rounded-full bg-sapphire" style={{ width: `${Math.max(8, (row.count / max) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </AdminPanel>
  );
};

const countBy = (items: string[]) => {
  const counts = new Map<string, number>();
  items.forEach((item) => counts.set(item, (counts.get(item) ?? 0) + 1));
  return Array.from(counts, ([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
};
