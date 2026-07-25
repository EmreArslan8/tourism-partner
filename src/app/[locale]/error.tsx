"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

/* Segment hata sınırı — [locale] altındaki sayfalarda beklenmedik hata olursa
   ham Next ekranı yerine markalı, tekrar-denenebilir bir ekran gösterir. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");
  useEffect(() => {
    console.error("[segment error]", error);
  }, [error]);

  return (
    <main className="container-px flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <h1 className="heading-section text-white">{t("genericTitle")}</h1>
      <p className="max-w-[480px] text-body-base text-white/80">{t("genericDescription")}</p>
      <button type="button" onClick={reset} className="btn btn-solid">
        {t("retry")}
      </button>
    </main>
  );
}
