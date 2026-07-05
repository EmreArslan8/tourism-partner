"use client";

import { useEffect, useRef } from "react";

export type GlobeMarker = { location: [number, number]; size: number };

/* İstanbul — turizm ağının merkezi; uçuş yayları buradan dünyaya açılır. */
const HUB: [number, number] = [41.015, 28.979];
const VIEW_CENTER: [number, number] = [50.5, 29.5];

/* Hero'daki etkileşimli dünya — Three.js + three-globe.
   Referans kalite hedefi: gerçek uydu dokusu, sapphire atmosfer parlaması,
   İstanbul'dan destinasyonlara AKAN ışıklı uçuş yayları (uçuş hissi), fareyle
   sürüklenebilir + kendi kendine yavaş dönen küre.

   Performans önlemleri:
   - three (~170KB gz) + doku YALNIZ masaüstünde (≥1025px) ve mount sonrası yüklenir;
     mobil/tablet statik hero fotoğrafıyla kalır.
   - prefers-reduced-motion'da otomatik dönüş kapalı (sürükleme çalışır).
   - İlk kare çizilince canvas yumuşakça görünür olur (boş kare parlaması yok). */
const Globe = ({ markers }: { markers: GlobeMarker[] }) => {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (!window.matchMedia("(min-width: 1025px)").matches) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [THREE, { default: ThreeGlobe }, { OrbitControls }] = await Promise.all([
        import("three"),
        import("three-globe"),
        import("three/examples/jsm/controls/OrbitControls.js"),
      ]);
      if (disposed || !wrapRef.current) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Nokta + yay verisi: hub dışındaki her şehre İstanbul'dan bir rota.
      const points = markers.map((m) => ({ lat: m.location[0], lng: m.location[1], size: m.size }));
      const arcs = markers
        .filter((m) => Math.abs(m.location[0] - HUB[0]) > 0.5 || Math.abs(m.location[1] - HUB[1]) > 0.5)
        .map((m, i) => ({
          startLat: HUB[0],
          startLng: HUB[1],
          endLat: m.location[0],
          endLng: m.location[1],
          order: i,
        }));

      const globe = new ThreeGlobe()
        .globeImageUrl("/assets/earth-blue-marble.jpg")
        .showAtmosphere(true)
        .atmosphereColor("#4c74ff")
        .atmosphereAltitude(0.16)
        .pointsData(points)
        .pointLat("lat")
        .pointLng("lng")
        .pointColor(() => "#c8d4ff")
        .pointAltitude(0.006)
        .pointRadius((d) => (d as { size: number }).size * 5.8)
        .arcsData(arcs)
        .arcStartLat("startLat")
        .arcStartLng("startLng")
        .arcEndLat("endLat")
        .arcEndLng("endLng")
        .arcColor(() => ["#6f86ff", "#dfe7ff"] as [string, string])
        .arcAltitudeAutoScale(0.32)
        .arcStroke(0.16)
        .arcDashLength(0.22)
        .arcDashGap(1.15)
        .arcDashInitialGap((d) => (d as { order: number }).order * 0.58)
        .arcDashAnimateTime(4200);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      const canvas = renderer.domElement;
      canvas.style.opacity = "0";
      canvas.style.transition = "opacity .7s ease";
      wrap.appendChild(canvas);

      const scene = new THREE.Scene();
      scene.add(globe);
      scene.add(new THREE.AmbientLight(0xcdd8ff, 1.15));
      const sun = new THREE.DirectionalLight(0xffffff, 1.9);
      sun.position.set(-180, 140, 260); // sol-üstten gün ışığı → sağda gece terminatörü
      scene.add(sun);

      const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 1500);
      // Kuzey yarım küre / Avrupa-Türkiye odağı: dünya sağda büyük bir network kesiti gibi görünür.
      const camDist = 275;
      const phi = ((90 - VIEW_CENTER[0]) * Math.PI) / 180;
      const theta = ((90 - VIEW_CENTER[1]) * Math.PI) / 180;
      camera.position.set(
        camDist * Math.sin(phi) * Math.cos(theta),
        camDist * Math.cos(phi),
        camDist * Math.sin(phi) * Math.sin(theta),
      );

      const controls = new OrbitControls(camera, canvas);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.rotateSpeed = 0.55;
      controls.autoRotate = !reduced;
      controls.autoRotateSpeed = 0.45;
      // Kutuplara devrilmesin — hafif eğim aralığı.
      controls.minPolarAngle = Math.PI / 2 - 0.5;
      controls.maxPolarAngle = Math.PI / 2 + 0.35;

      const resize = () => {
        const w = wrap.offsetWidth;
        renderer.setSize(w, w);
        camera.aspect = 1;
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener("resize", resize);

      let frame = 0;
      let shown = false;
      const render = () => {
        controls.update();
        renderer.render(scene, camera);
        if (!shown) {
          canvas.style.opacity = "1";
          shown = true;
        }
        frame = window.requestAnimationFrame(render);
      };
      render();

      cleanup = () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
        controls.dispose();
        renderer.dispose();
        canvas.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [markers]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="h-full w-full cursor-grab active:cursor-grabbing"
    />
  );
};

export default Globe;
