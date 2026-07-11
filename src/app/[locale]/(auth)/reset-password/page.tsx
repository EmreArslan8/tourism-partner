import { setRequestLocale } from "next-intl/server";
import AuthShell from "@/components/auth/AuthShell";
import ResetPasswordForm from "./ResetPasswordForm";

const ResetPasswordPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <AuthShell>
      <ResetPasswordForm />
    </AuthShell>
  );
};

export default ResetPasswordPage;
