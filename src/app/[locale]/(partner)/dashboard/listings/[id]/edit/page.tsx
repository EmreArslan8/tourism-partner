import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { PanelData } from "../../../data";

const EditListingPage = async ({ params }: { params: Promise<{ locale: string; id: string }> }) => {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={null}>
      <PanelData locale={locale} mode="edit" listingId={id} />
    </Suspense>
  );
};

export default EditListingPage;
