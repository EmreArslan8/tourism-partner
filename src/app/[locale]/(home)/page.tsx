import { setRequestLocale } from "next-intl/server";
import { getBusinesses } from "@/lib/businesses";
import { getActiveAdBanners } from "@/lib/platform-data";
import HomeView from "./view";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [businesses, adBanners] = await Promise.all([
    getBusinesses(),
    getActiveAdBanners("home"),
  ]);

  return <HomeView businesses={businesses} adBanners={adBanners} />;
}
