import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

/* Giriş, kayıt ve şifre işlemleri arama niyetine hizmet eden açılış sayfaları
 * değildir. Linklerin keşfi sürsün, ancak bu ince/işlemsel sayfalar SERP'e
 * girmesin. Bu metadata auth grubundaki tüm rotalara uygulanır. */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

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
