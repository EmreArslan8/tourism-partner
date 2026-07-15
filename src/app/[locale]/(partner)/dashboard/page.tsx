import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { getPanelSession } from "@/lib/panel-auth";
import BuyerOverview from "./BuyerOverview";
import { PanelData } from "./data";

const DashboardPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getPanelSession();
  if (session?.accountType === "buyer") return <BuyerOverview />;

  return (
    <Suspense fallback={null}>
      <PanelData locale={locale} mode="overview" />
    </Suspense>
  );
}

export default DashboardPage;
