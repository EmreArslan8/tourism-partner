import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import RegisterForm from "./RegisterForm";

/* Firma kayıt başvurusu — form gönderimi applications tablosuna yazar (RegisterForm). */
export default async function KayitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("register");

  return (
    <main className="grid min-h-[70vh] place-items-center px-5 pb-[60px] pt-[120px]">
      <div className="w-full max-w-[480px] rounded-[18px] border border-line bg-paper p-[34px] shadow-card">
        <h1 className="mb-2 text-[28px]">{t("title")}</h1>
        <p className="mb-[22px] text-[14.5px] text-muted">{t("sub")}</p>
        <RegisterForm />
        <p className="mt-[18px] text-center text-[14px] text-muted">
          {t("haveAccount")} <Link href="/giris" className="font-semibold text-terra">{t("loginLink")}</Link>
        </p>
      </div>
    </main>
  );
}
