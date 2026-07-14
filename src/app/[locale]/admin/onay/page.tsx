import { setRequestLocale } from "next-intl/server";
import { getAdminData } from "@/lib/admin";
import ApprovalsView from "./view";

const AdminApprovalsPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = await getAdminData();

  // Onay havuzu = gerçek işletme kayıtları (kayıt + panelden gelen evrak/detayla).
  return <ApprovalsView applications={data.applications} businesses={data.businesses} locale={locale} />;
};

export default AdminApprovalsPage;
