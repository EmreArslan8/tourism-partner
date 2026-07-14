import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { PanelData } from "../../data";

const NewListingPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={null}>
      <PanelData locale={locale} mode="edit" />
    </Suspense>
  );
};

export default NewListingPage;
