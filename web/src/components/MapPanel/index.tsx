"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Business } from "@/lib/types";
import { GROUP_COLORS } from "@/lib/categories";
import { s } from "./styles";

/* Stilize pin haritası — coords'tan normalize edilmiş konumlar.
   Gerçek OSM/Leaflet karoları deploy'da bu bileşenin yerine takılabilir. */
export default function MapPanel({ items }: { items: Business[] }) {
  const router = useRouter();

  const pins = useMemo(() => {
    if (items.length === 0) return [];
    const lats = items.map((b) => b.coords[0]);
    const lngs = items.map((b) => b.coords[1]);
    const minLat = Math.min(...lats), maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
    const spanLat = maxLat - minLat || 1;
    const spanLng = maxLng - minLng || 1;
    // kenarlara yapışmasın diye %10–%90 aralığına yerleştir
    const norm = (v: number, min: number, span: number) => 10 + ((v - min) / span) * 80;
    return items.map((b) => ({
      b,
      top: 100 - norm(b.coords[0], minLat, spanLat), // kuzey yukarıda
      left: norm(b.coords[1], minLng, spanLng),
    }));
  }, [items]);

  return (
    <div className={s.wrap} aria-label="Harita">
      <div className={s.canvas} />
      <span className={s.label}>Harita</span>
      {pins.length === 0 ? (
        <p className={s.empty}>Sonuç yok</p>
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
      <span className={s.note}>Demo harita · gerçek OSM karoları deploy’da</span>
    </div>
  );
}
