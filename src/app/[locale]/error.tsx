"use client";

import { useEffect } from "react";

/* Segment hata sınırı — [locale] altındaki sayfalarda beklenmedik hata olursa
   ham Next ekranı yerine markalı, tekrar-denenebilir bir ekran gösterir. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[segment error]", error);
  }, [error]);

  return (
    <main className="container-px flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <h1 className="text-[clamp(24px,3vw,36px)] text-pine">Bir şeyler ters gitti</h1>
      <p className="max-w-[480px] text-[15px] leading-7 text-muted">
        Beklenmedik bir hata oluştu. Lütfen tekrar deneyin; sorun sürerse biraz sonra
        yeniden ziyaret edin.
      </p>
      <button type="button" onClick={reset} className="btn btn-solid">
        Tekrar dene
      </button>
    </main>
  );
}
