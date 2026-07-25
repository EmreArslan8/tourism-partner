import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

/* 404 — notFound() çağrıldığında veya eşleşmeyen yolda gösterilir. */
export default async function NotFound() {
  const t = await getTranslations("errors");
  return (
    <main className="container-px flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <span className="eyebrow text-gold">404</span>
      <h1 className="heading-section text-white">{t("notFoundTitle")}</h1>
      <p className="max-w-[460px] text-body-base text-white/80">{t("notFoundDescription")}</p>
      <Link href="/" className="btn btn-solid">
        {t("home")}
      </Link>
    </main>
  );
}
