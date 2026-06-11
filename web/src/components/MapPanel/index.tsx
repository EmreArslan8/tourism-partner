"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { Business } from "@/lib/types";
import { GROUP_COLORS } from "@/lib/categories";
import { s } from "./styles";

/* Stilize pin haritası — coords'tan normalize edilmiş konumlar.
   Gerçek OSM/Leaflet karoları deploy'da bu bileşenin yerine takılabilir. */
export default function MapPanel({ items }: { items: Business[] }) {
  const router = useRouter();
  const t = useTranslations("listing");

  const pins = useMemo(() => {
    if (items.length === 0) return [];
    const lats = items.map((b) => b.coords[0]);
    const lngs = items.map((b) => b.coords[1]);
    const minLat = Math.min(...lats), maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
    const spanLat = maxLat - minLat || 1;
    const spanLng = maxLng - minLng || 1;
    const norm = (v: number, min: number, span: number) => 10 + ((v - min) / span) * 80;
    return items.map((b) => ({
      b,
      top: 100 - norm(b.coords[0], minLat, spanLat),
      left: norm(b.coords[1], minLng, spanLng),
    }));
  }, [items]);

  return (
    <div className={s.wrap} aria-label={t("mapLabel")}>
      <div className={s.canvas} />
      <span className={s.label}>{t("mapLabel")}</span>
      {pins.length === 0 ? (
        <p className={s.empty}>{t("emptyTitle")}</p>
      ) : (
        pins.map(({ b, top, left }) => (
          <button
            key={b.id}
            type="button"
            className={s.pin}
            style={{ top: `${top}%`, left: `${left}%` }}
            onClick={() => router.push(`/tedarikci/${b.id}`)}
            aria-label={b.name}
          >
            <span className={s.dot} style={{ background: GROUP_COLORS[b.group] }} />
            <span className={s.tip}>{b.name}</span>
          </button>
        ))
      )}
      <span className={s.note}>{t("mapNote")}</span>
    </div>
  );
}
