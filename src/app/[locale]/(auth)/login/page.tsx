import { setRequestLocale } from "next-intl/server";
import LoginPageView from "./view";

const LoginPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LoginPageView />;
};

export default LoginPage;
