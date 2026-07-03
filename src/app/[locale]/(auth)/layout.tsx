import { setRequestLocale } from "next-intl/server";

/*
 * Auth chrome'u: site header/footer YOK. Tam ekran split-screen kabuk (AuthShell)
 * kendi marka panelini ve alt bilgisini taşır. Kayıt/giriş gibi odak ekranları burada.
 */
export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return children;
}
