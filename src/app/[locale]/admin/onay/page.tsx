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
  const pendingBusinesses = data.businesses.filter(
    (business) => business.status === "pending",
  );
  const pendingApplications = data.applications.filter(
    (application) => application.status === "pending",
  );

  return (
    <ApprovalsView
      pendingBusinesses={pendingBusinesses}
      pendingApplications={pendingApplications}
      locale={locale}
    />
  );
};

export default AdminApprovalsPage;
