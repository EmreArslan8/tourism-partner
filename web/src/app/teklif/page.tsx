import type { Metadata } from "next";
import QuoteForm from "@/components/QuoteForm";
import { getBusiness } from "@/lib/data";

export const metadata: Metadata = { title: "Teklif Al — Tourism Partner" };

export default async function TeklifPage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string }>;
}) {
  const sp = await searchParams;
  const business = sp.s ? getBusiness(sp.s) ?? null : null;

  return (
    <main className="container-px py-10">
      <QuoteForm business={business} />
    </main>
  );
}
