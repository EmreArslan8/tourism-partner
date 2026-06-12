import { Link } from "@/i18n/navigation";

/* 404 — notFound() çağrıldığında veya eşleşmeyen yolda gösterilir. */
export default function NotFound() {
  return (
    <main className="container-px flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <span className="text-[13px] font-black uppercase tracking-[.16em] text-terra">404</span>
      <h1 className="text-[clamp(24px,3vw,36px)] text-pine">Sayfa bulunamadı</h1>
      <p className="max-w-[460px] text-[15px] leading-7 text-muted">
        Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.
      </p>
      <Link href="/" className="btn btn-solid">
        Ana sayfaya dön
      </Link>
    </main>
  );
}
