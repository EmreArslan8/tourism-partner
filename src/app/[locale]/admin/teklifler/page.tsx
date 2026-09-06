import { setRequestLocale } from "next-intl/server";
import { getAdminOffers } from "@/lib/platform-data";
import AdminOffersView from "./view";

export default async function AdminOffersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const offers = await getAdminOffers();

  return <AdminOffersView offers={offers} />;
}
