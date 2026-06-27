import { setRequestLocale, getTranslations } from "next-intl/server";
import LoginPageView from "./view";


const LoginPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("login");

  return <LoginPageView t={t} />;
};

export default LoginPage;
