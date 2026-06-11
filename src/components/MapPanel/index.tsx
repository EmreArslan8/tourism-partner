"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { Business } from "@/lib/types";
import { GROUP_COLORS } from "@/lib/categories";
import { styles } from "./styles";

/* Gerçek OSM/Leaflet haritası. Bu bileşen ListingView'da next/dynamic
   (ssr:false) ile lazy yüklenir; leaflet paketi + CSS yalnızca kullanıcı
   harita görünümüne geçtiğinde indirilir, ilk sayfa yüküne maliyeti yoktur. */
export default function MapPanel({ items }: { items: Business[] }) {
  const router = useRouter();
  const t = useTranslations("listing");
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  // Haritayı bir kez kur
  useEffect(() => {
    if (!elRef.current || mapRef.current) return;
    const map = L.map(elRef.current, {
      scrollWheelZoom: false, // sayfa kaydırması kaçırılmasın
      zoomControl: false,
    }).setView([39, 35], 5); // Türkiye merkezli varsayılan
    L.control.zoom({ position: "topright" }).addTo(map);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    // Konteyner yeni mount edildiyse boyutu doğru ölçsün
    setTimeout(() => map.invalidateSize(), 0);
    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // Pin'leri filtre sonuçları değiştikçe güncelle ve görünüme sığdır
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    if (items.length === 0) return;

    const points: [number, number][] = [];
    items.forEach((b) => {
      const icon = L.divIcon({
        className: "",
        html: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:${GROUP_COLORS[b.group]};border:2px solid #fff;box-shadow:0 2px 6px rgba(7,9,42,.42)"></span>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      const marker = L.marker(b.coords, { icon }).addTo(layer);
      marker.bindTooltip(b.name, { direction: "top", offset: [0, -8] });
      marker.on("click", () => router.push(`/tedarikci/${b.id}`));
      points.push(b.coords);
    });

    if (points.length === 1) {
      map.setView(points[0], 11);
    } else {
      map.fitBounds(points, { padding: [40, 40], maxZoom: 12 });
    }
  }, [items, router]);

  return (
    <div className={styles.wrap} aria-label={t("mapLabel")}>
      <div ref={elRef} className={styles.map} />
      <span className={styles.label}>{t("mapLabel")}</span>
      {items.length === 0 && <p className={styles.empty}>{t("emptyTitle")}</p>}
    </div>
  );
}
