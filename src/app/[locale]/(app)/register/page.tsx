import { setRequestLocale, getTranslations } from "next-intl/server";
import RegisterPageView from "./view";

const RegisterPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("register");

  return <RegisterPageView t={t} />;
};

export default RegisterPage;
