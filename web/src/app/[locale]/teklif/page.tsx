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
    <main className="container-px py-10">
      <QuoteForm business={business} />
    </main>
  );
}
