import type { Metadata } from "next";
import ListingView from "@/components/ListingView";
import type { GroupKey } from "@/lib/types";

export const metadata: Metadata = { title: "Listeleme — Tourism Partner" };

export default async function ListelemePage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; city?: string }>;
}) {
  const sp = await searchParams;
  const groups = (sp.cat?.split(",").filter(Boolean) ?? []) as GroupKey[];
  const city = sp.city ?? "all";

  return (
    <main className="container-px py-10">
      <ListingView initialGroups={groups} initialCity={city} />
    </main>
  );
}
