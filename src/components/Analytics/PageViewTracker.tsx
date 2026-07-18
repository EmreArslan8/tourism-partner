"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

type PageViewTrackerProps = {
  gaMeasurementId?: string;
  gtmId?: string;
};

export default function PageViewTracker({ gaMeasurementId, gtmId }: PageViewTrackerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    const pageLocation = `${window.location.origin}${pagePath}`;
    const pageTitle = document.title;

    if (gtmId) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "virtual_page_view",
        page_path: pagePath,
        page_location: pageLocation,
        page_title: pageTitle,
      });
    }

    if (gaMeasurementId && typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: pagePath,
        page_location: pageLocation,
        page_title: pageTitle,
      });
    }
  }, [gaMeasurementId, gtmId, pathname, searchParams]);

  return null;
}
