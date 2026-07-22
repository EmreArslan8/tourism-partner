"use client";

import { useRef, useState } from "react";
import { PlayCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Driver, DriveStep } from "driver.js";

type TourStep = DriveStep & { panelIndex: number };

const STEP_DELAY_MS = 620;
const TOUR_PANEL_INDEX = 4;

function createSteps(t: (key: string) => string): TourStep[] {
  return [{
    panelIndex: TOUR_PANEL_INDEX,
    element: "[data-tour='overview-map']",
    popover: {
      title: t("step1Title"), description: t("step1Text"),
      side: "left",
      align: "center",
    },
  },
  {
    panelIndex: TOUR_PANEL_INDEX,
    element: "[data-tour='overview-buyer']",
    popover: {
      title: t("step2Title"), description: t("step2Text"),
      side: "right",
      align: "center",
    },
  },
  {
    panelIndex: TOUR_PANEL_INDEX,
    element: "[data-tour='overview-platform']",
    popover: {
      title: t("step3Title"), description: t("step3Text"),
      side: "bottom",
      align: "center",
    },
  },
  {
    panelIndex: TOUR_PANEL_INDEX,
    element: "[data-tour='overview-supplier']",
    popover: {
      title: t("step4Title"), description: t("step4Text"),
      side: "left",
      align: "center",
    },
  },
  {
    panelIndex: TOUR_PANEL_INDEX,
    element: "[data-tour='overview-flow']",
    popover: {
      title: t("step5Title"), description: t("step5Text"),
      side: "bottom",
      align: "center",
    },
  },
  {
    panelIndex: TOUR_PANEL_INDEX,
    element: "[data-tour='overview-value']",
    popover: {
      title: t("step6Title"), description: t("step6Text"),
      side: "bottom",
      align: "center",
    },
  },
  ];
}

export default function HomeTourButton() {
  const t = useTranslations("platformTour");
  const steps = createSteps(t);
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
          nextBtnText: t("tourNext"), prevBtnText: t("tourBack"), doneBtnText: t("tourDone"),
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
      aria-label={t("tourAria")}
    >
      <PlayCircle size={18} strokeWidth={2.4} aria-hidden />
      {loading ? t("tourLoading") : t("tourButton")}
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
