import { setRequestLocale } from "next-intl/server";
import ListingView from "@/components/ListingView";
import type { GroupKey } from "@/lib/types";

export default async function ListelemePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ cat?: string; city?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const groups = (sp.cat?.split(",").filter(Boolean) ?? []) as GroupKey[];
  const city = sp.city ?? "all";

  return (
    <main className="container-px py-10">
      <ListingView initialGroups={groups} initialCity={city} />
    </main>
  );
}
