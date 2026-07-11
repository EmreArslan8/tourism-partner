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
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AdminBusiness } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AdminEmptyState, AdminPage, AdminPanel, adminUi } from "../_ui";
import { ConversionFunnelChart, CountBarList, DailyTrendChart, type DayBucket } from "./charts";

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
  const hourly = hourlyBuckets(currentViews);
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
      <AdminPanel className="mb-6" bodyClassName="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {PERIODS.map((p) => (
              <Link
                key={p.value}
                href={{ pathname: "/admin/raporlar", query: queryFor({ period: p.value }) }}
                className={cn(
                  "inline-flex h-9 items-center rounded-full border px-4 text-[13px] font-medium transition-colors",
                  p.value === period
                    ? "border-sapphire bg-sapphire text-paper"
                    : "border-line bg-paper text-brand hover:bg-cream",
                )}
              >
                {p.label}
              </Link>
            ))}
          </div>
          <form method="get" className="flex flex-1 flex-wrap items-center gap-2 sm:min-w-[380px]">
            {period !== "7d" && <input type="hidden" name="period" value={period} />}
            <select name="city" defaultValue={selectedCity} className={cn(adminUi.input, "w-auto min-w-[160px] flex-1")}>
              <option value="">Tüm bölgeler</option>
              {allCities.map((city) => <option key={city.label} value={city.label}>{city.label}</option>)}
            </select>
            <select name="group" defaultValue={selectedGroup} className={cn(adminUi.input, "w-auto min-w-[160px] flex-1")}>
              <option value="">Tüm kategoriler</option>
              {allGroups.map((group) => <option key={group.label} value={group.label}>{group.label}</option>)}
            </select>
            <button type="submit" className={adminUi.sapphireButton}>Filtrele</button>
            {hasFilter && (
              <Link
                href={{ pathname: "/admin/raporlar", query: queryFor({ city: "", group: "" }) }}
                className={adminUi.ghostButton}
              >
                Temizle
              </Link>
            )}
          </form>
        </div>
      </AdminPanel>

      {/* KPI satırı — önceki eşdeğer döneme göre delta */}
      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={<TrendingUp size={20} aria-hidden />} label="Görüntülenme" value={cur.total.toLocaleString("tr-TR")} delta={deltaPct(cur.total, prev.total)} hint="Toplam olay (impression + detay)" />
        <KpiCard icon={<Users size={20} aria-hidden />} label="Tekil Ziyaretçi" value={cur.visitors.toLocaleString("tr-TR")} delta={deltaPct(cur.visitors, prev.visitors)} hint="Distinct ziyaretçi (bot hariç)" />
        <KpiCard icon={<Percent size={20} aria-hidden />} label="CTR" value={cur.ctr === null ? "—" : `%${cur.ctr.toLocaleString("tr-TR", { maximumFractionDigits: 1 })}`} delta={deltaPct(cur.ctr, prev.ctr)} hint="Impression → detay oranı" />
        <KpiCard icon={<MessageSquare size={20} aria-hidden />} label="Teklif Talebi" value={cur.quotes.toLocaleString("tr-TR")} delta={deltaPct(cur.quotes, prev.quotes)} hint="Dönem içi gelen talepler" />
      </section>

      {/* Ana satır: trend + saatlik şerit | huni */}
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <AdminPanel title="Günlük Trend" icon={<BarChart3 size={18} aria-hidden />} bodyClassName="p-5">
          <DailyTrendChart days={days} />
          <div className="mt-5 border-t border-line/80 pt-4">
            <p className="mb-2 text-[12px] font-extrabold uppercase tracking-[.08em] text-muted">Saatlik yoğunluk</p>
            <HourlyStrip hourly={hourly} />
          </div>
        </AdminPanel>

        <AdminPanel title="Dönüşüm Hunisi" icon={<Target size={18} aria-hidden />} bodyClassName="p-5">
          <ConversionFunnelChart impressions={cur.impressions} details={cur.details} quotes={cur.quotes} />
        </AdminPanel>
      </div>

      {/* İkinci satır: en çok görüntülenen işletmeler | talep analizi */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <AdminPanel title="En Çok Görüntülenen İşletmeler" icon={<Eye size={18} aria-hidden />} bodyClassName="p-5">
          {topBusinesses.length > 0 ? (
            <div className="grid gap-2">
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-3 pb-1 text-[11px] font-extrabold uppercase tracking-[.08em] text-muted">
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
                    className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 rounded-[8px] border border-line/80 bg-cream/45 px-3 py-2 text-[13px] font-bold text-ink/80 transition-colors hover:border-sapphire/50 hover:bg-cream"
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
          <p className="mb-3 text-[12px] font-extrabold uppercase tracking-[.08em] text-muted">Durum dağılımı</p>
          {quoteStatuses.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {quoteStatuses.map((row) => {
                const meta = QUOTE_STATUS[row.label] ?? { label: row.label, cls: "bg-cream text-ink/70" };
                return (
                  <span key={row.label} className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12.5px] font-bold ${meta.cls}`}>
                    {meta.label}
                    <span className="rounded-full bg-paper/70 px-1.5 text-[12px]">{row.count.toLocaleString("tr-TR")}</span>
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-[13px] font-semibold text-muted">Dönem içinde teklif talebi yok.</p>
          )}
          <p className="mb-3 mt-6 text-[12px] font-extrabold uppercase tracking-[.08em] text-muted">En çok talep gelen şehirler</p>
          {quoteCities.length > 0 ? (
            <CountBarList rows={quoteCities} />
          ) : (
            <p className="text-[13px] font-semibold text-muted">Şehir bilgili talep bulunamadı.</p>
          )}
        </AdminPanel>
      </div>

      {/* Üçüncü satır: bölge / kategori yoğunluğu — satırlar filtre linki */}
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <AdminPanel title="Bölge Yoğunluğu" icon={<MapPin size={18} aria-hidden />} bodyClassName="p-5">
          <DensityLinkList rows={cityRows} hrefFor={(label) => ({ pathname: "/admin/raporlar" as const, query: queryFor({ city: label }) })} />
        </AdminPanel>
        <AdminPanel title="Kategori Yoğunluğu" icon={<BarChart3 size={18} aria-hidden />} bodyClassName="p-5">
          <DensityLinkList rows={groupRows} hrefFor={(label) => ({ pathname: "/admin/raporlar" as const, query: queryFor({ group: label }) })} />
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
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: number | null;
  hint: string;
}) => (
  <article className={cn(adminUi.metric, "flex items-center gap-4")}>
    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[10px] bg-cream text-brand">{icon}</span>
    <div className="min-w-0">
      <p className="text-[13px] font-normal text-muted">{label}</p>
      <p className="mt-1 flex items-baseline gap-2 text-[28px] font-medium leading-none text-ink">
        {value}
        <DeltaBadge delta={delta} />
      </p>
      <p className="mt-2 text-[12.5px] font-normal text-muted">{hint}</p>
    </div>
  </article>
);

const DeltaBadge = ({ delta }: { delta: number | null }) => {
  if (delta === null) {
    return <span className="rounded-full bg-cream/70 px-2 py-0.5 text-[11.5px] font-bold text-muted">—</span>;
  }
  const up = delta > 0;
  const flat = delta === 0;
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[11.5px] font-bold",
        flat ? "bg-cream/70 text-muted" : up ? "bg-group-saglik/15 text-group-saglik" : "bg-red-50 text-red-700",
      )}
      title="Önceki eşdeğer döneme göre"
    >
      {flat ? "%0" : `${up ? "▲" : "▼"} %${Math.abs(delta).toLocaleString("tr-TR", { maximumFractionDigits: 1 })}`}
    </span>
  );
};

const HourlyStrip = ({ hourly }: { hourly: number[] }) => {
  const max = Math.max(...hourly, 1);
  const peak = hourly.indexOf(max);
  const hasData = Math.max(...hourly, 0) > 0;
  return (
    <div>
      <div className="flex items-end gap-[3px]" style={{ height: 56 }}>
        {hourly.map((count, hour) => {
          const h = Math.max(2, (count / max) * 56);
          const isPeak = hour === peak && count > 0;
          return (
            <div key={hour} className="flex-1" title={`${String(hour).padStart(2, "0")}:00 · ${count.toLocaleString("tr-TR")} olay`}>
              <div className={cn("rounded-t-[2px]", isPeak ? "bg-gold" : "bg-sapphire/70")} style={{ height: h }} />
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] font-semibold text-muted">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:00</span>
      </div>
      <p className="mt-2 text-[12.5px] font-semibold text-muted">
        {hasData
          ? `En yoğun saat: ${String(peak).padStart(2, "0")}:00 (${max.toLocaleString("tr-TR")} olay)`
          : "Henüz saatlik veri yok."}
      </p>
    </div>
  );
};

const DensityLinkList = ({
  rows,
  hrefFor,
}: {
  rows: Array<{ label: string; businesses: number; views: number }>;
  hrefFor: (label: string) => { pathname: "/admin/raporlar"; query: Record<string, string> };
}) => {
  if (rows.length === 0) {
    return <p className="text-[13px] font-semibold text-muted">Veri bulunamadı.</p>;
  }
  const max = Math.max(...rows.map((r) => r.views), 1);
  return (
    <div className="grid gap-2">
      {rows.map((row) => (
        <Link
          key={row.label}
          href={hrefFor(row.label)}
          className="group rounded-[8px] px-2 py-1.5 transition-colors hover:bg-cream/60"
        >
          <div className="mb-1 flex justify-between gap-3 text-[13px] font-medium text-ink/80">
            <span className="truncate group-hover:text-sapphire">{row.label}</span>
            <span className="shrink-0 text-[12px] font-semibold text-muted">
              {row.businesses.toLocaleString("tr-TR")} işletme · {row.views.toLocaleString("tr-TR")} görüntülenme
            </span>
          </div>
          <div className="h-2 rounded-full bg-cream">
            <div className="h-2 rounded-full bg-sapphire" style={{ width: `${Math.max(8, (row.views / max) * 100)}%` }} />
          </div>
        </Link>
      ))}
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
