import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import QuoteForm from "@/components/QuoteForm";
import { getBusinessById } from "@/lib/businesses";

export default async function TeklifPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ s?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="container-px pb-10 pt-[104px]">
      <Suspense fallback={<QuoteForm business={null} />}>
        <QuoteFormWithBusiness searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

/* searchParams runtime erişimi — Cache Components için <Suspense> altında. */
async function QuoteFormWithBusiness({
  searchParams,
}: {
  searchParams: Promise<{ s?: string }>;
}) {
  const sp = await searchParams;
  const business = sp.s ? await getBusinessById(sp.s) : null;
  return <QuoteForm business={business} />;
}
