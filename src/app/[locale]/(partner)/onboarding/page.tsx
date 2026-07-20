import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getPanelSession } from "@/lib/panel-auth";
import { getSupplierOnboarding } from "@/lib/onboarding";
import OnboardingCover from "./OnboardingCover";

/* Kayıt akışının son (zorunlu) adımı — kapak görseli. Oturum gerektirdiği için
   doğrulama sonrası burada tamamlanır. Kapak zaten varsa veya işletme yoksa panele döner. */
export default async function OnboardingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getPanelSession();
  if (!session) return redirect({ href: "/login", locale });
  if (session.accountType === "buyer") return redirect({ href: "/dashboard", locale });

  const ob = await getSupplierOnboarding();
  if (!ob.businessId || ob.hasCover) return redirect({ href: "/dashboard", locale });

  return (
    <OnboardingCover
      userId={session.userId}
      businessId={ob.businessId}
      businessName={ob.businessName}
    />
  );
}
