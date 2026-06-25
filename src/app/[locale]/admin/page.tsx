import { setRequestLocale } from "next-intl/server";
import { getAdminData } from "@/lib/admin";
import AdminView from "./view";

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = await getAdminData();

  return <AdminView data={data} />;
}
