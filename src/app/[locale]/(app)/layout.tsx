import { setRequestLocale } from "next-intl/server";
import SiteHeader from "@/components/Header";
import SiteFooter from "@/components/Footer";

/*
 * Uygulama (iç sayfa) chrome'u: opak header (footer ile aynı sapphire) + footer.
 * Header server component; etkileşim parçaları (NavLinks, MobileMenu, LocaleSwitcher) client ada.
 */
export default async function AppLayout({
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
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
