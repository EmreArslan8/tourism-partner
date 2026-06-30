import { setRequestLocale } from "next-intl/server";
import { getAdminData } from "@/lib/admin";
import { getAdminContentExtras } from "@/lib/platform-data";
import AdminContentView from "./view";

const AdminContentPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const [data, extras] = await Promise.all([getAdminData(), getAdminContentExtras()]);

  return (
    <AdminContentView
      pages={data.pages}
      blogPosts={extras.blogPosts}
      popups={extras.popups}
      locale={locale}
    />
  );
}

export default AdminContentPage;
