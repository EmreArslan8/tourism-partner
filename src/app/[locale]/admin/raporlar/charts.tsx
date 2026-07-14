"use client";

import { BarChart, BarList, DonutChart, SparkAreaChart, Tracker } from "@tremor/react";

/* Tremor grafikleri client component gerektirir; sayfa server'da hesaplayıp
   seri verilerini props ile geçer. Renkler mevcut palet adlarıdır (tailwind
   safelist'te sabitlendi): sapphire ana, gold ikincil. */

const formatNumber = (value: number) => value.toLocaleString("tr-TR");

export type DayBucket = { label: string; day: string; impressions: number; details: number };

export function KpiSparkline({ values, color = "sapphire" }: { values: number[]; color?: string }) {
  const data = values.map((value, index) => ({ index: String(index), value }));
  return (
    <SparkAreaChart
      data={data}
      index="index"
      categories={["value"]}
      colors={[color]}
      autoMinValue
      showGradient
      className="h-8 w-full"
    />
  );
}

export function HourlyTracker({ hourly }: { hourly: number[] }) {
  const max = Math.max(...hourly, 1);
  const data = hourly.map((value, hour) => ({
    color: value === 0 ? "gray" : value / max > 0.66 ? "sapphire" : value / max > 0.33 ? "blue" : "cyan",
    tooltip: `${String(hour).padStart(2, "0")}:00 · ${formatNumber(value)} olay`,
  }));
  return <Tracker data={data} className="mt-1" />;
}

export function QuoteStatusDonut({ rows }: { rows: Array<{ label: string; count: number }> }) {
  const data = rows.map((row) => ({ name: row.label, value: row.count }));
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  if (data.length === 0) return null;
  return (
    <div className="grid items-center gap-4 min-[520px]:grid-cols-[150px_minmax(0,1fr)]">
      <DonutChart
        data={data}
        index="name"
        category="value"
        colors={["sapphire", "gold", "emerald", "cyan", "gray", "rose"]}
        valueFormatter={formatNumber}
        label={formatNumber(total)}
        showLabel
        showAnimation={false}
        className="h-36"
      />
      <div className="grid gap-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 text-[12.5px]">
            <span className="truncate text-muted">{row.label}</span>
            <strong className="font-semibold text-ink">{formatNumber(row.count)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DailyTrendChart({ days }: { days: DayBucket[] }) {
  const data = days.map((d) => ({
    gün: `${d.day} ${d.label}`,
    Impression: d.impressions,
    "Detay Ziyareti": d.details,
  }));
  return (
    <BarChart
      data={data}
      index="gün"
      categories={["Impression", "Detay Ziyareti"]}
      colors={["sapphire", "gold"]}
      valueFormatter={formatNumber}
      yAxisWidth={44}
      startEndOnly={days.length > 14}
      showAnimation={false}
      className="h-64"
    />
  );
}

export function ConversionFunnelChart({
  impressions,
  details,
  quotes,
}: {
  impressions: number;
  details: number;
  quotes: number;
}) {
  const detailRate = impressions > 0 ? (details / impressions) * 100 : 0;
  const quoteRate = details > 0 ? (quotes / details) * 100 : 0;
  const stages = [
    { name: "Gösterim", value: impressions, width: 100, rate: null },
    { name: "Profil ziyareti", value: details, width: Math.max(10, detailRate), rate: detailRate },
    { name: "Teklif talebi", value: quotes, width: Math.max(10, impressions > 0 ? (quotes / impressions) * 100 : 0), rate: quoteRate },
  ];
  return (
    <div className="grid gap-3" role="img" aria-label={`Gösterim ${impressions}, profil ziyareti ${details}, teklif talebi ${quotes}`}>
      {stages.map((stage, index) => (
        <div key={stage.name}>
          {stage.rate !== null && <p className="mb-1.5 text-center text-[11.5px] font-semibold text-muted">↓ Önceki adımdan %{stage.rate.toLocaleString("tr-TR", { maximumFractionDigits: 1 })}</p>}
          <div className="rounded-[9px] bg-cream/70 p-2.5">
            <div className="mb-2 flex items-center justify-between gap-3"><span className="text-[12.5px] font-medium text-muted">{stage.name}</span><strong className="text-[18px] font-semibold text-ink">{formatNumber(stage.value)}</strong></div>
            <div className="h-2 overflow-hidden rounded-full bg-paper"><div className={index === 0 ? "h-full rounded-full bg-sapphire" : index === 1 ? "h-full rounded-full bg-blue-400" : "h-full rounded-full bg-gold"} style={{ width: `${stage.width}%` }} /></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CountBarList({ rows }: { rows: Array<{ label: string; count: number }> }) {
  const data = rows.map((row) => ({ name: row.label, value: row.count }));
  return <BarList data={data} color="gold" valueFormatter={formatNumber} sortOrder="none" />;
}
