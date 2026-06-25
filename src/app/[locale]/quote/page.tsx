import { setRequestLocale } from "next-intl/server";
import QuoteForm from "@/components/QuoteForm";
import { getBusinessById } from "@/lib/businesses";
import QuoteView from "./view";

const QuotePage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ s?: string }>;
}) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <QuoteView>
      <QuoteFormWithBusiness searchParams={searchParams} />
    </QuoteView>
  );
}

async function QuoteFormWithBusiness({
  searchParams,
}: {
  searchParams: Promise<{ s?: string }>;
}) {
  const sp = await searchParams;
  const business = sp.s ? await getBusinessById(sp.s) : null;
  return <QuoteForm business={business} />;
}

export default QuotePage;