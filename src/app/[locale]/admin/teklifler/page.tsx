import { setRequestLocale } from "next-intl/server";
import { getAdminData } from "@/lib/admin";
import AdminQuotesView from "./view";

export default async function AdminQuotesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = await getAdminData();

  return <AdminQuotesView quotes={data.quotes} locale={locale} />;
}
