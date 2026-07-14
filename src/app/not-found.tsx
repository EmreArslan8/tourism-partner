import Link from "next/link";

/* Kök 404 — locale segmentine hiç düşmeyen eşleşmeyen yollarda gösterilir. */
export default function RootNotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        margin: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f4ec",
        color: "#12237f",
        fontFamily: "system-ui, sans-serif",
        padding: 24,
        textAlign: "center",
      }}
    >
      <div>
        <p
          style={{
            color: "#b35b34",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: ".14em",
            margin: "0 0 10px",
          }}
        >
          404
        </p>
        <h1 style={{ fontSize: 32, margin: "0 0 10px" }}>Sayfa bulunamadı</h1>
        <p style={{ color: "#66708f", margin: "0 0 22px" }}>
          Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.
        </p>
        <Link
          href="/tr"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 42,
            padding: "0 18px",
            borderRadius: 12,
            background: "#3542ee",
            color: "#fff",
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          Ana sayfaya dön
        </Link>
      </div>
    </main>
  );
}
