import { setRequestLocale } from "next-intl/server";
import { getBusinesses } from "@/lib/businesses";
import HomeView from "./view";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const businesses = await getBusinesses();

  return <HomeView businesses={businesses} />;
}
