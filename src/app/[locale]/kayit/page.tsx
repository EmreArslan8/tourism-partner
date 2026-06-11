import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CATEGORY_GROUPS } from "@/lib/categories";

const fieldCls = "field h-[46px] font-normal";
const labelCls = "flex flex-col gap-1.5 text-[13px] font-semibold";

/* Faz 1 yer tutucu — kayıt + onay akışı Faz 2-3'te. İşletme kategorisini seçer. */
export default async function KayitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("register");
  const tc = await getTranslations("cat");

  return (
    <main className="grid min-h-[70vh] place-items-center px-5 pb-[60px] pt-[120px]">
      <div className="w-full max-w-[480px] rounded-[18px] border border-line bg-paper p-[34px] shadow-card">
        <h1 className="mb-2 text-[28px]">{t("title")}</h1>
        <p className="mb-[22px] text-[14.5px] text-muted">{t("sub")}</p>
        <form className="flex flex-col gap-3.5">
          <label className={labelCls}>
            {t("name")}
            <input type="text" placeholder={t("namePh")} className={fieldCls} />
          </label>
          <label className={labelCls}>
            {t("category")}
            <select defaultValue="" className={fieldCls}>
              <option value="" disabled>{t("select")}</option>
              {CATEGORY_GROUPS.flatMap((g) =>
                g.children.map((c) => (
                  <option key={c.slug} value={c.slug}>{tc(g.key)} › {c.label}</option>
                ))
              )}
            </select>
          </label>
          <label className={labelCls}>
            {t("email")}
            <input type="email" placeholder={t("emailPh")} className={fieldCls} />
          </label>
          <button type="button" className="btn btn-solid btn-block mt-1.5 disabled:opacity-60" disabled>
            {t("submit")}
          </button>
        </form>
        <p className="mt-[18px] text-center text-[14px] text-muted">
          {t("haveAccount")} <Link href="/giris" className="font-semibold text-terra">{t("loginLink")}</Link>
        </p>
      </div>
    </main>
  );
}
