import { setRequestLocale } from "next-intl/server";
import RegisterPageView from "./view";

const RegisterPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ref?: string | string[] }>;
}) => {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);
  const ref = Array.isArray(query.ref) ? query.ref[0] : query.ref;
  return <RegisterPageView referral={ref?.slice(0, 80)} />;
};

export default RegisterPage;
