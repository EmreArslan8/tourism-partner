"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { GlobeMethods } from "react-globe.gl";
import { useRouter } from "@/i18n/navigation";

// react-globe.gl WebGL kullanır → yalnızca client'ta (ssr:false), lazy.
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export type GlobePoint = { city: string; lat: number; lng: number; count: number };

/*
 * Etkileşimli destinasyon globe'u — gerçek Dünya dokusu, sürükle-döndür,
 * kendi kendine yavaş dönüş, şehir pinleri (tıklayınca o bölgeye filtre).
 */
const GlobeDestinations = ({ points }: { points: GlobePoint[] }) => {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const wrapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Konteyner boyutunu ölç (responsive)
  useEffect(() => {
    const measure = () => {
      const el = wrapRef.current;
      if (el) setSize({ w: el.clientWidth, h: el.clientHeight });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const maxCount = Math.max(1, ...points.map((p) => p.count));
  const goToCity = (city: string) =>
    router.push({ pathname: "/explore", query: { city } });

  return (
    <div ref={wrapRef} className="h-full w-full">
      {size.w > 0 && (
        <Globe
          ref={globeRef}
          width={size.w}
          height={size.h}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="/assets/globe/earth-night.jpg"
          bumpImageUrl="/assets/globe/earth-topology.png"
          atmosphereColor="#6f8bff"
          atmosphereAltitude={0.2}
          // Pinler — şehir başına yükseklik = işletme sayısı
          pointsData={points}
          pointLat="lat"
          pointLng="lng"
          pointColor={() => "#9db4ff"}
          pointAltitude={(d) => 0.03 + ((d as GlobePoint).count / maxCount) * 0.28}
          pointRadius={0.32}
          pointsMerge={false}
          // Şehir etiketleri
          labelsData={points}
          labelLat="lat"
          labelLng="lng"
          labelText="city"
          labelSize={1}
          labelDotRadius={0.32}
          labelColor={() => "rgba(244,247,255,0.9)"}
          labelResolution={2}
          onPointClick={(d) => goToCity((d as GlobePoint).city)}
          onLabelClick={(d) => goToCity((d as GlobePoint).city)}
          onGlobeReady={() => {
            const g = globeRef.current;
            if (!g) return;
            g.pointOfView({ lat: 39, lng: 35, altitude: 2.2 }, 0); // Türkiye'ye odakla
            const controls = g.controls() as unknown as {
              autoRotate: boolean;
              autoRotateSpeed: number;
              enableZoom: boolean;
            };
            controls.enableZoom = false;
            controls.autoRotateSpeed = 0.6;
            controls.autoRotate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          }}
        />
      )}
    </div>
  );
};

export default GlobeDestinations;
