import { setRequestLocale } from "next-intl/server";
import ListingView from "@/components/ListingView";
import { getBusinesses } from "@/lib/businesses";
import type { GroupKey } from "@/lib/types";

export default async function KesfetPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    cat?: string;
    type?: string;
    city?: string;
    country?: string;
    district?: string;
    q?: string;
    verified?: string;
    rating?: string;
    attr?: string;
    sort?: string;
  }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const groups = (sp.cat?.split(",").filter(Boolean) ?? []) as GroupKey[];
  const typesArr = sp.type?.split(",").filter(Boolean) ?? [];
  const city = sp.city ?? "all";
  const country = sp.country ?? "all";
  const district = sp.district ?? "all";
  const q = sp.q ?? "";
  const verified = sp.verified === "1";
  const minRating = Number(sp.rating) || 0;
  const attrsArr = sp.attr?.split(",").filter(Boolean) ?? [];
  const sort = (sp.sort === "rating" || sp.sort === "az" ? sp.sort : "featured") as "featured" | "rating" | "az";
  const businesses = await getBusinesses();

  return (
    <main className="mx-auto w-full max-w-[1280px] px-6 pb-16 pt-[104px] max-[560px]:px-4">
      <ListingView
        businesses={businesses}
        initialGroups={groups}
        initialTypes={typesArr}
        initialCountry={country}
        initialCity={city}
        initialDistrict={district}
        initialQ={q}
        initialVerified={verified}
        initialMinRating={minRating}
        initialAttrs={attrsArr}
        initialSort={sort}
      />
    </main>
  );
}
