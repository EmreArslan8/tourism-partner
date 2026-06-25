import { setRequestLocale } from "next-intl/server";
import { getAdminData } from "@/lib/admin";
import AdminSuppliersView from "./view";

export default async function AdminBusinessesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = await getAdminData();

  return <AdminSuppliersView businesses={data.businesses} locale={locale} />;
}
