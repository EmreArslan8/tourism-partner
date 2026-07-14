import { setRequestLocale } from "next-intl/server";
import RegisterPageView from "./view";

const RegisterPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <RegisterPageView />;
};

export default RegisterPage;
