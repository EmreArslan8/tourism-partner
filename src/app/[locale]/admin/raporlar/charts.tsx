"use client";

import { BarChart, BarList, FunnelChart } from "@tremor/react";

/* Tremor grafikleri client component gerektirir; sayfa server'da hesaplayıp
   seri verilerini props ile geçer. Renkler mevcut palet adlarıdır (tailwind
   safelist'te sabitlendi): sapphire ana, gold ikincil. */

const formatNumber = (value: number) => value.toLocaleString("tr-TR");

export type DayBucket = { label: string; day: string; impressions: number; details: number };

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
  const data = [
    { name: "Impression", value: impressions },
    { name: "Detay Ziyareti", value: details },
    { name: "Teklif Talebi", value: quotes },
  ];
  return (
    <FunnelChart
      data={data}
      calculateFrom="previous"
      color="sapphire"
      valueFormatter={formatNumber}
      showGridLines={false}
      className="h-64"
    />
  );
}

export function CountBarList({ rows }: { rows: Array<{ label: string; count: number }> }) {
  const data = rows.map((row) => ({ name: row.label, value: row.count }));
  return <BarList data={data} color="gold" valueFormatter={formatNumber} sortOrder="none" />;
}
