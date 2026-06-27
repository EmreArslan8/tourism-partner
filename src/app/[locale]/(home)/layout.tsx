import { setRequestLocale } from "next-intl/server";
import SiteFooter from "@/components/Footer";

/*
 * Pazarlama (anasayfa/landing) chrome'u: header YOK — Hero kendi glass
 * header'ını hero görselinin üzerinde render eder. Footer son panelden sonra gelir.
 */
export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      {children}
      <SiteFooter />
    </>
  );
}
