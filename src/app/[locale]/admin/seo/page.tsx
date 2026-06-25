import { setRequestLocale } from "next-intl/server";
import { getAdminData } from "@/lib/admin";
import AdminSeoView from "./view";

const AdminSeoPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = await getAdminData();

  return <AdminSeoView businesses={data.businesses} pages={data.pages} locale={locale} />;
}

export default AdminSeoPage;
