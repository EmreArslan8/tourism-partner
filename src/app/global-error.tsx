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
        }}
      >
        <h1 style={{ fontSize: 28 }}>Bir şeyler ters gitti</h1>
        <p style={{ color: "#666", maxWidth: 420 }}>
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
