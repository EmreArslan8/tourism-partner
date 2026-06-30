import { setRequestLocale } from "next-intl/server";
import { parseCrmFilters } from "@/lib/admin-crm";
import { getCrmListData } from "@/lib/admin-crm-data";
import AdminSuppliersView from "./view";

export default async function AdminBusinessesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(locale);
  const filters = parseCrmFilters(query);
  const data = await getCrmListData(filters);

  return (
    <AdminSuppliersView
      businesses={data.businesses}
      total={data.total}
      expiringBusinesses={data.expiringBusinesses}
      expiringMemberships={data.expiringMemberships}
      memberships={data.memberships}
      filters={filters}
      cities={data.cities}
      activeHotels={data.activeHotels}
      activeAgencies={data.activeAgencies}
      locale={locale}
    />
  );
}
