import Link from "next/link";

/* Kök 404 — locale segmentine hiç düşmeyen eşleşmeyen yollarda gösterilir. */
export default function RootNotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        margin: 0,
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #f7f5ff 0%, #ede9fe 48%, #ffffff 100%)",
        color: "#17151c",
        fontFamily: "system-ui, sans-serif",
        padding: "64px 24px",
        textAlign: "center",
        position: "relative",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(109, 40, 217, .09) 1px, transparent 1px), linear-gradient(90deg, rgba(109, 40, 217, .09) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(109, 40, 217, .08)",
          fontSize: "clamp(9rem, 24vw, 22rem)",
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: 0,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        404
      </div>
      <section
        style={{
          position: "relative",
          width: "min(100%, 720px)",
          display: "grid",
          justifyItems: "center",
        }}
      >
        <h1
          style={{
            color: "#24113f",
            fontSize: "clamp(2.4rem, 7vw, 5.4rem)",
            lineHeight: ".96",
            fontWeight: 800,
            letterSpacing: 0,
            margin: 0,
          }}
        >
          Sayfa bulunamadı
        </h1>
        <p
          style={{
            color: "#6b6675",
            maxWidth: 520,
            fontSize: 17,
            lineHeight: 1.7,
            margin: "20px 0 30px",
          }}
        >
          Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.
        </p>
        <Link
          href="/tr"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 52,
            padding: "0 24px",
            borderRadius: 16,
            background: "linear-gradient(135deg, #6d28d9, #4c1d95)",
            color: "#fff",
            fontWeight: 800,
            textDecoration: "none",
            boxShadow: "0 18px 44px rgba(76, 29, 149, .22)",
          }}
        >
          Ana sayfaya dön
        </Link>
      </section>
    </main>
  );
}
