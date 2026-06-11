import { setRequestLocale } from "next-intl/server";
import QuoteForm from "@/components/QuoteForm";
import { getBusiness } from "@/lib/data";

export default async function TeklifPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ s?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const business = sp.s ? getBusiness(sp.s) ?? null : null;

  return (
    <main className="container-px pb-10 pt-[104px]">
      <QuoteForm business={business} />
    </main>
  );
}
