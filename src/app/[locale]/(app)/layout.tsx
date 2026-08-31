import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import SiteHeader from "@/components/Header";
import SiteFooter from "@/components/Footer";
import PopupSlot from "@/components/SitePopup/PopupSlot";

/*
 * Uygulama (iç sayfa) chrome'u: header ve footer aynı paper yüzeyinde durur,
 * aradaki sayfa kendi rengini taşır. Footer `seamless` ile mor degradesini
 * bırakır; böylece bir sayfada chrome + gövde olmak üzere iki renk görünür.
 * Header server component; etkileşim parçaları (NavLinks, MobileMenu,
 * LocaleSwitcher) client ada.
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
      <div className="min-h-screen bg-paper">
        <SiteHeader />
        {children}
        <SiteFooter seamless />
      </div>
      <Suspense fallback={null}>
        <PopupSlot />
      </Suspense>
    </>
  );
}
