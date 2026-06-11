import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/* Faz 1 yer tutucu — gerçek kimlik doğrulama Faz 2'de Supabase ile bağlanacak. */
export default async function GirisPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("login");

  return (
    <main className="grid min-h-[70vh] place-items-center px-5 py-[60px]">
      <div className="w-full max-w-[420px] rounded-[18px] border border-line bg-paper p-[34px] shadow-card">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="mb-2 text-[28px]">{t("title")}</h1>
        <p className="mb-[22px] text-[14.5px] text-muted">{t("sub")}</p>
        <form className="flex flex-col gap-3.5">
          <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
            {t("email")}
            <input type="email" placeholder={t("emailPh")} className="field h-[46px] font-normal" />
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
            {t("password")}
            <input type="password" placeholder="••••••••" className="field h-[46px] font-normal" />
          </label>
          <button type="button" className="btn btn-solid btn-block mt-1.5 disabled:opacity-60" disabled>
            {t("submit")}
          </button>
        </form>
        <p className="mt-[18px] text-center text-[14px] text-muted">
          {t("noAccount")} <Link href="/kayit" className="font-semibold text-terra">{t("signupLink")}</Link>
        </p>
      </div>
    </main>
  );
}
