"use client";

import { useRef, useState } from "react";
import { PlayCircle } from "lucide-react";
import type { Driver, DriveStep } from "driver.js";

type TourStep = DriveStep & { panelIndex: number };

const STEP_DELAY_MS = 620;
const TOUR_PANEL_INDEX = 4;

const steps: TourStep[] = [
  {
    panelIndex: TOUR_PANEL_INDEX,
    element: "[data-tour='overview-map']",
    popover: {
      title: "Tourism Partner ne yapar?",
      description: "Acente/firma ile tedarikçiyi aynı B2B turizm akışında buluşturur.",
      side: "left",
      align: "center",
    },
  },
  {
    panelIndex: TOUR_PANEL_INDEX,
    element: "[data-tour='overview-buyer']",
    popover: {
      title: "Acente / Firma tarafı",
      description: "Kullanıcı ihtiyacına göre otel, transfer, rehber, acente veya hizmet sağlayıcı arar.",
      side: "right",
      align: "center",
    },
  },
  {
    panelIndex: TOUR_PANEL_INDEX,
    element: "[data-tour='overview-platform']",
    popover: {
      title: "Platform eşleştirir",
      description: "Arama, kısa liste, teklif talebi ve güven katmanı Tourism Partner üzerinde birleşir.",
      side: "bottom",
      align: "center",
    },
  },
  {
    panelIndex: TOUR_PANEL_INDEX,
    element: "[data-tour='overview-supplier']",
    popover: {
      title: "Tedarikçi tarafı",
      description: "Tedarikçi görünür olur, gelen talebi karşılar ve iş fırsatını yönetir.",
      side: "left",
      align: "center",
    },
  },
  {
    panelIndex: TOUR_PANEL_INDEX,
    element: "[data-tour='overview-flow']",
    popover: {
      title: "İş akışı basit",
      description: "Arama yapılır, kısa liste oluşur, teklif istenir ve tedarikçi yanıt verir.",
      side: "bottom",
      align: "center",
    },
  },
  {
    panelIndex: TOUR_PANEL_INDEX,
    element: "[data-tour='overview-value']",
    popover: {
      title: "Değer önerisi net",
      description: "Acente daha hızlı tedarikçi bulur; tedarikçi daha görünür olur; platform güveni düzenler.",
      side: "bottom",
      align: "center",
    },
  },
];

export default function HomeTourButton() {
  const [loading, setLoading] = useState(false);
  const activeRef = useRef<Driver | null>(null);

  async function startTour() {
    if (loading) return;
    setLoading(true);
    try {
      const { driver } = await import("driver.js");
      goToPanel(TOUR_PANEL_INDEX);
      window.setTimeout(() => {
        const tour = driver({
          steps: steps.map(toDriverStep),
          animate: true,
          smoothScroll: false,
          allowClose: true,
          overlayClickBehavior: "close",
          overlayColor: "#051126",
          overlayOpacity: 0.72,
          stagePadding: 8,
          stageRadius: 14,
          popoverClass: "tp-home-tour-popover",
          showProgress: true,
          progressText: "{{current}} / {{total}}",
          nextBtnText: "İleri",
          prevBtnText: "Geri",
          doneBtnText: "Bitir",
          onNextClick: (_element, _step, { driver }) => move(driver, 1),
          onPrevClick: (_element, _step, { driver }) => move(driver, -1),
          onDestroyed: () => {
            activeRef.current = null;
            setLoading(false);
          },
        });
        activeRef.current = tour;
        tour.drive(0);
      }, STEP_DELAY_MS);
    } catch (error) {
      console.error("[home-tour] Driver yüklenemedi", error);
      setLoading(false);
    }
  }

  function move(tour: Driver, direction: 1 | -1) {
    const currentIndex = tour.getActiveIndex() ?? 0;
    const nextIndex = currentIndex + direction;
    const next = steps[nextIndex];
    if (!next) {
      tour.destroy();
      return;
    }
    goToPanel(next.panelIndex);
    window.setTimeout(() => {
      if (direction === 1) tour.moveNext();
      else tour.movePrevious();
    }, STEP_DELAY_MS);
  }

  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-xl border border-[#0047B8] bg-[#0057D9] px-4 py-3 text-[14px] font-extrabold text-white shadow-[0_18px_38px_-24px_rgba(0,87,217,.75)] transition-colors hover:bg-[#0047B8] focus:outline-none focus:ring-2 focus:ring-[#8EA2FF] disabled:cursor-wait disabled:opacity-70 max-[640px]:w-full max-[640px]:justify-center"
      onClick={startTour}
      disabled={loading}
      aria-label="Platformu tanı"
    >
      <PlayCircle size={18} strokeWidth={2.4} aria-hidden />
      {loading ? "Hazırlanıyor..." : "Platformu Tanı"}
    </button>
  );
}

function goToPanel(index: number) {
  window.dispatchEvent(new CustomEvent("tp:reel-go", { detail: { index } }));
}

function toDriverStep(step: TourStep): DriveStep {
  return {
    element: step.element,
    popover: step.popover,
    disableActiveInteraction: step.disableActiveInteraction,
    data: step.data,
  };
}
