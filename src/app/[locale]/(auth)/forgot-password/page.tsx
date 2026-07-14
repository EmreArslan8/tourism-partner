import { setRequestLocale } from "next-intl/server";
import AuthShell from "@/components/auth/AuthShell";
import ForgotPasswordForm from "./ForgotPasswordForm";

const ForgotPasswordPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <AuthShell>
      <ForgotPasswordForm />
    </AuthShell>
  );
};

export default ForgotPasswordPage;
