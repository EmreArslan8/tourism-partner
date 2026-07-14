import {
  BarChart3,
  Eye,
  MapPin,
  MessageSquare,
  Percent,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { getAdminData } from "@/lib/admin";
import { groupLabel } from "@/lib/categories";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AdminBusiness, GroupKey } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AdminEmptyState, AdminPage, AdminPanel, adminUi } from "../_ui";
import { ConversionFunnelChart, CountBarList, DailyTrendChart, HourlyTracker, KpiSparkline, QuoteStatusDonut, type DayBucket } from "./charts";

type Period = "7d" | "30d" | "month";

const PERIODS: Array<{ value: Period; label: string }> = [
  { value: "7d", label: "Son 7 gün" },
  { value: "30d", label: "Son 30 gün" },
  { value: "month", label: "Bu ay" },
];

type ReportView = { entityType: string; entityId: number | null; visitorId: string | null; viewedAt: string };
type ReportQuote = { id: number; businessId: number | null; city: string | null; status: string; createdAt: string };

/* Seçili dönem + önceki eşdeğer dönemi tek sorguda çeker; JS'te iki pencereye bölünür.
   getAdminData'nın 7 günlük pageViews penceresi diğer admin sayfaları için sabit kalır,
   raporlar kendi penceresini burada okur. RLS admin policy'leri erişim verir (AdminGate). */
async function fetchReportData(period: Period) {
  const now = new Date();
  const currentStart =
    period === "month"
      ? new Date(now.getFullYear(), now.getMonth(), 1)
      : new Date(now.getTime() - (period === "7d" ? 7 : 30) * 86_400_000);
  const duration = Math.max(now.getTime() - currentStart.getTime(), 86_400_000);
  const prevStart = new Date(currentStart.getTime() - duration);

  const supabase = await createClient();
  const [viewsRes, quotesRes] = await Promise.all([
    supabase
      .from("page_views")
      .select("entity_type,entity_id,visitor_id,viewed_at")
      .in("entity_type", ["impression", "business"])
      .gte("viewed_at", prevStart.toISOString())
      .order("viewed_at", { ascending: false })
      .limit(20_000),
    supabase
      .from("quotes")
      .select("id,business_id,city,status,created_at")
      .gte("created_at", prevStart.toISOString())
      .limit(2_000),
  ]);

  const views: ReportView[] = (viewsRes.data ?? []).map((row) => ({
    entityType: String(row.entity_type),
    entityId: row.entity_id === null ? null : Number(row.entity_id),
    visitorId: row.visitor_id ?? null,
    viewedAt: row.viewed_at,
  }));
  const quotes: ReportQuote[] = (quotesRes.data ?? []).map((row) => ({
    id: Number(row.id),
    businessId: row.business_id === null ? null : Number(row.business_id),
    city: row.city ?? null,
    status: String(row.status ?? "new"),
    createdAt: row.created_at,
  }));

  return { views, quotes, currentStart, prevStart, now };
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

  const period: Period = sp.period === "30d" || sp.period === "month" ? sp.period : "7d";
  const selectedCity = sp.city ?? "";
  const selectedGroup = sp.group ?? "";
  const hasFilter = Boolean(selectedCity || selectedGroup);

  const { views, quotes, currentStart, now } = await fetchReportData(period);

  // Bölge/kategori filtresi: business eşlemesi üzerinden tüm panellere uygulanır.
  const bizById = new Map(data.businesses.map((b) => [b.id, b]));
  const filteredBusinesses = data.businesses.filter(
    (b) => (!selectedCity || b.city === selectedCity) && (!selectedGroup || b.group === selectedGroup),
  );
  const allowedIds = hasFilter ? new Set(filteredBusinesses.map((b) => b.id)) : null;
  const viewInFilter = (v: ReportView) =>
    !allowedIds || (v.entityId != null && allowedIds.has(v.entityId));
  const quoteInFilter = (q: ReportQuote) => {
    if (!hasFilter) return true;
    const biz = q.businessId != null ? bizById.get(q.businessId) : undefined;
    if (selectedCity && (q.city ?? biz?.city) !== selectedCity) return false;
    if (selectedGroup && biz?.group !== selectedGroup) return false;
    return true;
  };

  const startMs = currentStart.getTime();
  const currentViews = views.filter((v) => new Date(v.viewedAt).getTime() >= startMs && viewInFilter(v));
  const prevViews = views.filter((v) => new Date(v.viewedAt).getTime() < startMs && viewInFilter(v));
  const currentQuotes = quotes.filter((q) => new Date(q.createdAt).getTime() >= startMs && quoteInFilter(q));
  const prevQuotes = quotes.filter((q) => new Date(q.createdAt).getTime() < startMs && quoteInFilter(q));

  const cur = windowStats(currentViews, currentQuotes.length);
  const prev = windowStats(prevViews, prevQuotes.length);

  const perBusiness = viewsByBusiness(currentViews, filteredBusinesses);
  const topBusinesses = perBusiness
    .slice()
    .sort((a, b) => b.impressions + b.details - (a.impressions + a.details))
    .slice(0, 8);
  const cityRows = densityRows(filteredBusinesses, perBusiness, (b) => b.city).slice(0, 6);
  const groupRows = densityRows(filteredBusinesses, perBusiness, (b) => b.group).slice(0, 6);

  const days = dailyBuckets(currentViews, period);
  const visitorTrend = dailyVisitorBuckets(currentViews, period);
  const quoteTrend = dailyCountBuckets(currentQuotes.map((quote) => quote.createdAt), period);
  const totalTrend = days.map((day) => day.impressions + day.details);
  const ctrTrend = days.map((day) => day.impressions > 0 ? (day.details / day.impressions) * 100 : 0);
  const hourly = hourlyBuckets(currentViews);
  const hourlyPeakValue = Math.max(...hourly, 0);
  const hourlyPeak = hourlyPeakValue > 0 ? hourly.indexOf(hourlyPeakValue) : null;
  const quoteStatuses = countBy(currentQuotes.map((q) => q.status || "new"));
  const quoteCities = countBy(
    currentQuotes.map((q) => q.city).filter((c): c is string => !!c),
  ).slice(0, 5);

  const allCities = countBy(data.businesses.map((b) => b.city));
  const allGroups = countBy(data.businesses.map((b) => b.group));
  const periodLabel = PERIODS.find((p) => p.value === period)?.label ?? "";
  const rangeLabel = `${formatDate(currentStart)} – ${formatDate(now)}`;

  const queryFor = (patch: Partial<{ period: string; city: string; group: string }>) => {
    const merged = { period, city: selectedCity, group: selectedGroup, ...patch };
    const query: Record<string, string> = {};
    if (merged.period && merged.period !== "7d") query.period = merged.period;
    if (merged.city) query.city = merged.city;
    if (merged.group) query.group = merged.group;
    return query;
  };

  return (
    <AdminPage
      title="Veri Analitiği"
      description={`Görüntülenme, dönüşüm, bölge yoğunluğu ve talep performansı. ${periodLabel} · ${rangeLabel}${selectedCity ? ` · ${selectedCity}` : ""}${selectedGroup ? ` · ${selectedGroup}` : ""}`}
    >
      {/* Global filtre barı — tüm panelleri etkiler */}
      <AdminPanel className="mb-4 border-line/80 bg-paper/80 shadow-none" bodyClassName="p-2.5 min-[760px]:p-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5 rounded-[9px] bg-cream/65 p-1">
            {PERIODS.map((p) => (
              <Link
                key={p.value}
                href={{ pathname: "/admin/raporlar", query: queryFor({ period: p.value }) }}
                className={cn(
                  "inline-flex h-8 items-center rounded-[7px] border px-3 text-[12px] font-medium transition-[color,background-color,border-color,box-shadow]",
                  p.value === period
                    ? "border-sapphire bg-sapphire text-paper shadow-card"
                    : "border-transparent bg-transparent text-muted hover:bg-paper hover:text-brand",
                )}
              >
                {p.label}
              </Link>
            ))}
          </div>
          <form method="get" className="flex min-w-0 flex-1 flex-wrap items-center gap-2 min-[760px]:justify-end">
            {period !== "7d" && <input type="hidden" name="period" value={period} />}
            <select name="city" defaultValue={selectedCity} className={cn(adminUi.input, "!min-h-9 w-auto min-w-[150px] flex-1 !py-1 text-[12.5px] min-[1100px]:max-w-[260px]")}>
              <option value="">Tüm bölgeler</option>
              {allCities.map((city) => <option key={city.label} value={city.label}>{city.label}</option>)}
            </select>
            <select name="group" defaultValue={selectedGroup} className={cn(adminUi.input, "!min-h-9 w-auto min-w-[150px] flex-1 !py-1 text-[12.5px] min-[1100px]:max-w-[260px]")}>
              <option value="">Tüm kategoriler</option>
              {allGroups.map((group) => <option key={group.label} value={group.label}>{groupLabel(group.label as GroupKey)}</option>)}
            </select>
            <button type="submit" className={cn(adminUi.sapphireButton, "!h-9 !px-3.5")}>Filtrele</button>
            {hasFilter && (
              <Link
                href={{ pathname: "/admin/raporlar", query: queryFor({ city: "", group: "" }) }}
                className={cn(adminUi.ghostButton, "!h-9 !px-3")}
              >
                Temizle
              </Link>
            )}
          </form>
        </div>
      </AdminPanel>

      {/* KPI satırı — önceki eşdeğer döneme göre delta */}
      <section className="mb-5 grid overflow-hidden rounded-[12px] border border-line bg-paper shadow-card sm:grid-cols-2 xl:grid-cols-4" aria-label="Temel performans göstergeleri">
        <KpiCard className="border-b sm:border-r xl:border-b-0" icon={<TrendingUp size={18} aria-hidden />} label="Görüntülenme" value={cur.total.toLocaleString("tr-TR")} delta={deltaPct(cur.total, prev.total)} hint="Gösterim + profil ziyareti" trend={totalTrend} />
        <KpiCard className="border-b xl:border-b-0 xl:border-r" icon={<Users size={18} aria-hidden />} label="Tekil Ziyaretçi" value={cur.visitors.toLocaleString("tr-TR")} delta={deltaPct(cur.visitors, prev.visitors)} hint="Bot hariç tekil ziyaretçi" trend={visitorTrend} />
        <KpiCard className="border-b sm:border-b-0 sm:border-r" icon={<Percent size={18} aria-hidden />} label="CTR" value={cur.ctr === null ? "—" : `%${cur.ctr.toLocaleString("tr-TR", { maximumFractionDigits: 1 })}`} delta={deltaPct(cur.ctr, prev.ctr)} hint="Gösterimden profile geçiş" trend={ctrTrend} />
        <KpiCard icon={<MessageSquare size={18} aria-hidden />} label="Teklif Talebi" value={cur.quotes.toLocaleString("tr-TR")} delta={deltaPct(cur.quotes, prev.quotes)} hint="Gelen teklif talepleri" trend={quoteTrend} />
      </section>

      {/* Ana satır: trend + saatlik şerit | huni */}
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <AdminPanel title="Günlük Trend" icon={<BarChart3 size={18} aria-hidden />} bodyClassName="p-5">
          <DailyTrendChart days={days} />
          <div className="mt-5 border-t border-line/80 pt-4">
            <p className="mb-2 text-[12px] font-extrabold uppercase tracking-[.08em] text-muted">Saatlik yoğunluk</p>
            <HourlyTracker hourly={hourly} />
            <div className="mt-2 flex justify-between text-[11px] font-semibold text-muted"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span></div>
            <p className="mt-2 text-[12px] font-medium text-muted">{hourlyPeak === null ? "Henüz saatlik veri yok." : `En yoğun saat ${String(hourlyPeak).padStart(2, "0")}:00 · ${hourlyPeakValue.toLocaleString("tr-TR")} olay`}</p>
          </div>
        </AdminPanel>

        <AdminPanel title="Dönüşüm Hunisi" icon={<Target size={18} aria-hidden />} bodyClassName="p-5">
          <ConversionFunnelChart impressions={cur.impressions} details={cur.details} quotes={cur.quotes} />
        </AdminPanel>
      </div>

      {/* İkinci satır: en çok görüntülenen işletmeler | talep analizi */}
      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[2fr_1fr]">
        <AdminPanel title="En Çok Görüntülenen İşletmeler" icon={<Eye size={18} aria-hidden />} bodyClassName="p-5">
          {topBusinesses.length > 0 ? (
            <div>
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 border-b border-line px-2 pb-2 text-[11px] font-extrabold uppercase tracking-[.08em] text-muted">
                <span>İşletme</span>
                <span className="w-14 text-right">Impr.</span>
                <span className="w-14 text-right">Detay</span>
                <span className="w-14 text-right">CTR</span>
              </div>
              {topBusinesses.map((row) => {
                const rowCtr = row.impressions > 0 ? (row.details / row.impressions) * 100 : null;
                return (
                  <Link
                    key={row.id}
                    href={{ pathname: "/admin/tedarikciler/[id]", params: { id: String(row.id) } }}
                    className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 border-b border-line/70 px-2 py-2.5 text-[13px] font-bold text-ink/80 transition-colors last:border-b-0 hover:bg-cream/55"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-ink">{row.name}</span>
                      <span className="block truncate text-[12px] font-semibold text-muted">{row.city}</span>
                    </span>
                    <span className="w-14 text-right">{row.impressions.toLocaleString("tr-TR")}</span>
                    <span className="w-14 text-right">{row.details.toLocaleString("tr-TR")}</span>
                    <span className="w-14 text-right text-sapphire">{rowCtr === null ? "—" : `%${rowCtr.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}`}</span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <AdminEmptyState icon={<Eye size={18} aria-hidden />} title="Henüz görüntülenme yok" description="Seçili dönem ve filtrede işletme bazlı görüntülenme kaydı bulunamadı." />
          )}
        </AdminPanel>

        <AdminPanel title="Talep Analizi" icon={<MessageSquare size={18} aria-hidden />} bodyClassName="p-5">
          {currentQuotes.length === 0 ? (
            <div className="flex items-start gap-3 rounded-[10px] bg-cream/55 p-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-paper text-brand"><MessageSquare size={17} aria-hidden /></span>
              <div><p className="text-[13.5px] font-semibold text-ink">Bu dönemde teklif talebi yok</p><p className="mt-1 text-[12.5px] leading-5 text-muted">Talep oluştuğunda durum ve şehir dağılımı burada gösterilecek.</p></div>
            </div>
          ) : (
            <>
              <p className="mb-3 text-[12px] font-extrabold uppercase tracking-[.08em] text-muted">Durum dağılımı</p>
              <QuoteStatusDonut rows={quoteStatuses.map((row) => ({ label: QUOTE_STATUS[row.label]?.label ?? row.label, count: row.count }))} />
              <p className="mb-3 mt-6 text-[12px] font-extrabold uppercase tracking-[.08em] text-muted">En çok talep gelen şehirler</p>
              {quoteCities.length > 0 ? <CountBarList rows={quoteCities} /> : <p className="text-[13px] font-semibold text-muted">Şehir bilgili talep bulunamadı.</p>}
            </>
          )}
        </AdminPanel>
      </div>

      {/* Üçüncü satır: bölge / kategori yoğunluğu — satırlar filtre linki */}
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <AdminPanel title="Bölge Yoğunluğu" icon={<MapPin size={18} aria-hidden />} bodyClassName="p-4">
          <DensityLinkList rows={cityRows} accent="sapphire" hrefFor={(label) => ({ pathname: "/admin/raporlar" as const, query: queryFor({ city: label }) })} />
        </AdminPanel>
        <AdminPanel title="Kategori Yoğunluğu" icon={<BarChart3 size={18} aria-hidden />} bodyClassName="p-4">
          <DensityLinkList rows={groupRows} accent="gold" displayLabel={(label) => groupLabel(label as GroupKey)} hrefFor={(label) => ({ pathname: "/admin/raporlar" as const, query: queryFor({ group: label }) })} />
        </AdminPanel>
      </div>
    </AdminPage>
  );
}

/* ---- Sunum bileşenleri (server) ---- */

const KpiCard = ({
  icon,
  label,
  value,
  delta,
  hint,
  className,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: number | null;
  hint: string;
  className?: string;
  trend: number[];
}) => (
  <article className={cn("group flex min-h-[104px] items-center gap-3 border-line/80 px-4 py-3.5 transition-colors hover:bg-cream/35", className)}>
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-sapphire/10 text-brand transition-colors group-hover:bg-sapphire group-hover:text-paper">{icon}</span>
    <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_76px] items-end gap-2">
      <div className="min-w-0">
      <p className="text-[12px] font-medium text-muted">{label}</p>
      <p className="mt-1 flex flex-wrap items-baseline gap-1.5 text-[25px] font-semibold leading-none tracking-[-.02em] text-ink">
        {value}
        <DeltaBadge delta={delta} />
      </p>
      <p className="mt-1.5 truncate text-[11.5px] font-normal text-muted" title={hint}>{hint}</p>
      </div>
      <KpiSparkline values={trend} />
    </div>
  </article>
);

const DeltaBadge = ({ delta }: { delta: number | null }) => {
  if (delta === null) {
    return <span className="rounded-full bg-cream/70 px-1.5 py-0.5 text-[10.5px] font-semibold text-muted">—</span>;
  }
  const up = delta > 0;
  const flat = delta === 0;
  return (
    <span
      className={cn(
        "rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold",
        flat ? "bg-cream/70 text-muted" : up ? "bg-group-saglik/15 text-group-saglik" : "bg-red-50 text-red-700",
      )}
      title="Önceki eşdeğer döneme göre"
    >
      {flat ? "%0" : `${up ? "▲" : "▼"} %${Math.abs(delta).toLocaleString("tr-TR", { maximumFractionDigits: 1 })}`}
    </span>
  );
};

const DensityLinkList = ({
  rows,
  hrefFor,
  displayLabel = (label) => label,
  accent,
}: {
  rows: Array<{ label: string; businesses: number; views: number }>;
  hrefFor: (label: string) => { pathname: "/admin/raporlar"; query: Record<string, string> };
  displayLabel?: (label: string) => string;
  accent: "sapphire" | "gold";
}) => {
  if (rows.length === 0) {
    return <p className="text-[13px] font-semibold text-muted">Veri bulunamadı.</p>;
  }
  const max = Math.max(...rows.map((r) => r.views), 1);
  const totalViews = rows.reduce((sum, row) => sum + row.views, 0);
  const totalBusinesses = rows.reduce((sum, row) => sum + row.businesses, 0);
  const accentBar = accent === "gold" ? "bg-gold" : "bg-sapphire";
  const accentSoft = accent === "gold" ? "bg-gold/20 text-ink" : "bg-sapphire/10 text-brand";
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-[9px] bg-cream/55 px-3 py-2.5">
        <span className="text-[12px] font-medium text-muted">İlk {rows.length} sonuç</span>
        <span className="text-[12px] font-semibold text-ink">{totalBusinesses.toLocaleString("tr-TR")} işletme · {totalViews.toLocaleString("tr-TR")} görüntülenme</span>
      </div>
      <div className="grid gap-1">
      {rows.map((row, index) => {
        const share = totalViews > 0 ? (row.views / totalViews) * 100 : 0;
        return (
        <Link
          key={row.label}
          href={hrefFor(row.label)}
          className="group grid grid-cols-[30px_minmax(0,1fr)] gap-2.5 rounded-[9px] px-2 py-2.5 transition-colors hover:bg-cream/60"
        >
          <span className={`grid h-7 w-7 place-items-center rounded-[8px] text-[11px] font-bold ${accentSoft}`}>{index + 1}</span>
          <div className="min-w-0">
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="truncate text-[13px] font-semibold text-ink group-hover:text-sapphire">{displayLabel(row.label)}</span>
              <span className="shrink-0 text-[13px] font-semibold text-ink">{row.views.toLocaleString("tr-TR")}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-line/70">
              <div className={`h-full rounded-full ${accentBar}`} style={{ width: `${Math.max(5, (row.views / max) * 100)}%` }} />
            </div>
            <div className="mt-1.5 flex justify-between gap-3 text-[11.5px] font-medium text-muted">
              <span>{row.businesses.toLocaleString("tr-TR")} işletme</span>
              <span>Toplamın %{share.toLocaleString("tr-TR", { maximumFractionDigits: 1 })}&apos;i</span>
            </div>
          </div>
        </Link>
      )})}
      </div>
    </div>
  );
};

/* ---- Saf yardımcılar ---- */

function windowStats(views: ReportView[], quoteCount: number) {
  const impressions = views.filter((v) => v.entityType === "impression").length;
  const details = views.filter((v) => v.entityType === "business").length;
  return {
    total: views.length,
    visitors: new Set(views.map((v) => v.visitorId).filter((id): id is string => !!id)).size,
    impressions,
    details,
    ctr: impressions > 0 ? (details / impressions) * 100 : null,
    quotes: quoteCount,
  };
}

/* Önceki dönem 0 (veya hesaplanamaz) ise delta gösterilmez ("—"). */
function deltaPct(current: number | null, previous: number | null): number | null {
  if (current === null || previous === null || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

type BusinessViews = { id: number; name: string; city: string; group: string; impressions: number; details: number };

function viewsByBusiness(views: ReportView[], businesses: AdminBusiness[]): BusinessViews[] {
  const byId = new Map<number, BusinessViews>(
    businesses.map((b) => [b.id, { id: b.id, name: b.name, city: b.city, group: b.group, impressions: 0, details: 0 }]),
  );
  for (const v of views) {
    if (v.entityId == null) continue;
    const row = byId.get(v.entityId);
    if (!row) continue;
    if (v.entityType === "impression") row.impressions += 1;
    else if (v.entityType === "business") row.details += 1;
  }
  return Array.from(byId.values()).filter((r) => r.impressions + r.details > 0);
}

function densityRows(
  businesses: AdminBusiness[],
  perBusiness: BusinessViews[],
  keyOf: (b: AdminBusiness) => string,
): Array<{ label: string; businesses: number; views: number }> {
  const viewsById = new Map(perBusiness.map((r) => [r.id, r.impressions + r.details]));
  const acc = new Map<string, { businesses: number; views: number }>();
  for (const b of businesses) {
    const key = keyOf(b);
    if (!key) continue;
    const cur = acc.get(key) ?? { businesses: 0, views: 0 };
    cur.businesses += 1;
    cur.views += viewsById.get(b.id) ?? 0;
    acc.set(key, cur);
  }
  return Array.from(acc, ([label, v]) => ({ label, ...v })).sort((a, b) => b.views - a.views || b.businesses - a.businesses);
}

function dailyBuckets(views: ReportView[], period: Period): DayBucket[] {
  const dayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
  const now = new Date();
  const dayCount = period === "7d" ? 7 : period === "30d" ? 30 : now.getDate();
  const days: DayBucket[] = [];
  const keys: string[] = [];
  for (let i = dayCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    keys.push(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    days.push({
      label: `${d.getDate()}/${d.getMonth() + 1}`,
      day: dayNames[d.getDay()],
      impressions: 0,
      details: 0,
    });
  }
  const idx = new Map(keys.map((k, i) => [k, i]));
  for (const v of views) {
    const d = new Date(v.viewedAt);
    const i = idx.get(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    if (i == null) continue;
    if (v.entityType === "impression") days[i].impressions += 1;
    else if (v.entityType === "business") days[i].details += 1;
  }
  return days;
}

function dailyCountBuckets(timestamps: string[], period: Period): number[] {
  const now = new Date();
  const dayCount = period === "7d" ? 7 : period === "30d" ? 30 : now.getDate();
  const keys: string[] = [];
  for (let i = dayCount - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    keys.push(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
  }
  const index = new Map(keys.map((key, i) => [key, i]));
  const counts = new Array(dayCount).fill(0) as number[];
  for (const timestamp of timestamps) {
    const date = new Date(timestamp);
    const i = index.get(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
    if (i != null) counts[i] += 1;
  }
  return counts;
}

function dailyVisitorBuckets(views: ReportView[], period: Period): number[] {
  const now = new Date();
  const dayCount = period === "7d" ? 7 : period === "30d" ? 30 : now.getDate();
  const keys: string[] = [];
  for (let i = dayCount - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    keys.push(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
  }
  const index = new Map(keys.map((key, i) => [key, i]));
  const visitors = Array.from({ length: dayCount }, () => new Set<string>());
  for (const view of views) {
    if (!view.visitorId) continue;
    const date = new Date(view.viewedAt);
    const i = index.get(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
    if (i != null) visitors[i].add(view.visitorId);
  }
  return visitors.map((day) => day.size);
}

function hourlyBuckets(views: ReportView[]): number[] {
  const hours = new Array(24).fill(0) as number[];
  for (const v of views) {
    const h = new Date(v.viewedAt).getHours();
    if (h >= 0 && h < 24) hours[h] += 1;
  }
  return hours;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

const QUOTE_STATUS: Record<string, { label: string; cls: string }> = {
  new: { label: "Yeni", cls: "bg-sapphire/15 text-sapphire" },
  in_progress: { label: "İşlemde", cls: "bg-gold/25 text-ink" },
  quoted: { label: "Teklif verildi", cls: "bg-gold/25 text-ink" },
  won: { label: "Kazanıldı", cls: "bg-group-saglik/15 text-group-saglik" },
  closed: { label: "Kapandı", cls: "bg-cream text-ink/70" },
  lost: { label: "Kaybedildi", cls: "bg-red-50 text-red-700" },
  rejected: { label: "Reddedildi", cls: "bg-red-50 text-red-700" },
};

const countBy = (items: string[]) => {
  const counts = new Map<string, number>();
  items.forEach((item) => counts.set(item, (counts.get(item) ?? 0) + 1));
  return Array.from(counts, ([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
};
