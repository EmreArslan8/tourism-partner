"use client";

import { useEffect } from "react";

/* Kök hata sınırı — root layout dahil her şeyde çökme olursa devreye girer.
   Kendi <html>/<body>'sini render etmek zorundadır. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error]", error);
    // Kök çökmeyi Sentry'ye ilet. Dinamik import: ana bundle'a girmez, yalnız
    // bu hata sınırı render olduğunda yüklenir. DSN yoksa/init olmadıysa no-op.
    void import("@sentry/nextjs").then((Sentry) => Sentry.captureException(error));
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: 24,
          background:
            "linear-gradient(160deg, #01145d 0%, #0a2472 55%, #071a52 100%)",
          color: "#fff",
        }}
      >
        <h1 style={{ fontSize: 28, margin: 0 }}>Bir şeyler ters gitti</h1>
        <p style={{ color: "rgba(255,255,255,.82)", maxWidth: 420, margin: 0 }}>
          Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: "10px 20px",
            borderRadius: 12,
            border: "none",
            background: "#3542ee",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Tekrar dene
        </button>
      </body>
    </html>
  );
}
