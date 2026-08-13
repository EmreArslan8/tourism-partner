import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

/* 404 — notFound() çağrıldığında veya eşleşmeyen yolda gösterilir. */
export default async function NotFound() {
  const t = await getTranslations("errors");
  return (
    <main className="relative isolate grid min-h-[72svh] place-items-center overflow-hidden bg-[linear-gradient(135deg,theme(colors.ultra-light-purple)_0%,theme(colors.soft-lavender)_48%,theme(colors.white)_100%)] py-20 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(109,40,217,.09)_1px,transparent_1px),linear-gradient(90deg,rgba(109,40,217,.09)_1px,transparent_1px)] bg-[length:48px_48px] [mask-image:linear-gradient(to_bottom,transparent_0%,black_22%,black_78%,transparent_100%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[10%] -z-10 -translate-x-1/2 select-none text-[clamp(9rem,24vw,22rem)] font-black leading-none tracking-normal text-royal-purple/[.08]"
      >
        404
      </span>

      <section className="container-px grid w-full justify-items-center">
        <h1 className="max-w-[780px] text-[clamp(2.4rem,7vw,5.4rem)] font-extrabold leading-[.96] tracking-normal text-ink">
          {t("notFoundTitle")}
        </h1>
        <p className="mt-5 max-w-[540px] text-[17px] leading-7 text-muted">{t("notFoundDescription")}</p>
        <Link href="/" className="btn btn-contained mt-8">
          {t("home")}
        </Link>
      </section>
    </main>
  );
}
