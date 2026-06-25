import { setRequestLocale } from "next-intl/server";
import { getAdminData } from "@/lib/admin";
import AdminContentView from "./view";

const AdminContentPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = await getAdminData();

  return <AdminContentView pages={data.pages} locale={locale} />;
}

export default AdminContentPage;
