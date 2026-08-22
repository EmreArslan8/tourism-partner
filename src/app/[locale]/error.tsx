"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

/* Segment hata sınırı — [locale] altındaki sayfalarda beklenmedik hata olursa
   ham Next ekranı yerine markalı, tekrar-denenebilir bir ekran gösterir.

   ÖNEMLİ: Kendi koyu zeminini render eder. Eskiden yalnız beyaz metin basıyordu;
   panel gibi beyaz zeminli sayfalarda metin görünmez olup yalnız buton kalıyordu
   ("boş sayfa + Tekrar dene" görüntüsü). Artık kart kendi arka planını taşır. */
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
    // Hatayı Sentry'ye ilet — aksi halde bu ekran kullanıcıda görünür ama bize
    // hiçbir yerde ulaşmaz. Dinamik import: yalnız hata anında yüklenir, ana
    // bundle'ı büyütmez. DSN yoksa/init olmadıysa no-op.
    void import("@sentry/nextjs").then((Sentry) => {
      Sentry.captureException(error, {
        tags: { boundary: "segment", digest: error.digest },
      });
    });
  }, [error]);

  return (
    <main
      className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20"
      style={{
        background:
          "linear-gradient(160deg, #01145d 0%, #0a2472 55%, #071a52 100%)",
      }}
    >
      <div className="flex max-w-[480px] flex-col items-center gap-4 text-center">
        <h1 className="heading-section text-white">{t("genericTitle")}</h1>
        <p className="text-body-base text-white/80">{t("genericDescription")}</p>
        <button type="button" onClick={reset} className="btn btn-solid">
          {t("retry")}
        </button>
        {error.digest ? (
          <p className="mt-2 text-xs text-white/50">
            {t("errorCode")}: <span className="font-mono">{error.digest}</span>
          </p>
        ) : null}
      </div>
    </main>
  );
}
