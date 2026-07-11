import { setRequestLocale } from "next-intl/server";
import { getAdminData } from "@/lib/admin";
import { getAdminContentExtras } from "@/lib/platform-data";
import AdminContentView, { type ContentTab } from "./view";

const AdminContentPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string; edit?: string; status?: string }>;
}) => {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const [data, extras] = await Promise.all([getAdminData(), getAdminContentExtras()]);

  const tab: ContentTab = sp.tab === "blog" || sp.tab === "popups" ? sp.tab : "pages";

  return (
    <AdminContentView
      pages={data.pages}
      blogPosts={extras.blogPosts}
      popups={extras.popups}
      locale={locale}
      tab={tab}
      edit={sp.edit ?? ""}
      statusFilter={sp.status ?? ""}
    />
  );
}

export default AdminContentPage;
