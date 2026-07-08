import { Link } from "@/i18n/navigation";
import { PageHeader } from "../_components";
import { AdminMetric, AdminPanel, adminUi } from "../_ui";
import SelectableSuppliersTable from "./SelectableSuppliersTable";
import { membershipFor, type CrmFilters } from "@/lib/admin-crm";
import type { AdminBusiness, AdminMembership } from "@/lib/types";

interface Props {
  businesses: AdminBusiness[];
  total: number;
  expiringBusinesses: AdminBusiness[];
  expiringMemberships: AdminMembership[];
  memberships: AdminMembership[];
  filters: CrmFilters;
  cities: string[];
  activeHotels: number;
  activeAgencies: number;
  locale: string;
}

const AdminSuppliersView = ({
  businesses,
  total,
  expiringBusinesses,
  memberships,
  filters,
  cities,
  activeHotels,
  activeAgencies,
  locale,
}: Props) => {
  const visibleBusinesses = businesses;
  const expiring = expiringBusinesses
    .map((business) => ({ business, membership: membershipFor(business.id, memberships) }))
    .filter(({ membership }) => membership && daysUntil(membership.endsAt) <= 14)
    .sort((a, b) => daysUntil(a.membership?.endsAt) - daysUntil(b.membership?.endsAt))
    .slice(0, 4);

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-5">
      <section className="min-w-0">
        <PageHeader
          eyebrow="İşletmeler"
          title="İşletmeler (CRM)"
          description="Sistemdeki tüm kayıtlı B2B acente ve otelleri yönetin."
        />

        <div className="mb-5 grid gap-3 lg:grid-cols-[repeat(3,minmax(0,1fr))_1.2fr]">
          <AdminMetric label="Toplam İşletme" value={total} />
          <AdminMetric label="Aktif Otel" value={activeHotels} tone="emerald" />
          <AdminMetric label="Aktif Acente" value={activeAgencies} tone="blue" />
          <ExpiringBand count={Math.max(expiring.length, expiringBusinesses.length)} businesses={expiring.map(({ business }) => business)} />
        </div>

        <AdminPanel className="mb-5" bodyClassName="p-3">
          <form action="" className="grid gap-2 lg:grid-cols-[minmax(220px,1fr)_180px_170px_170px_auto_auto] lg:items-center">
            <input name="q" defaultValue={filters.q} placeholder="Firma adı, VKN veya ID" className={adminUi.input} />
            <select name="group" defaultValue={filters.group} className={adminUi.input}>
              <option value="all">Tüm Kategoriler</option>
              <option value="konaklama">Konaklama</option>
              <option value="acente">Acente</option>
              <option value="ulasim">Ulaşım</option>
              <option value="rehber">Rehber</option>
              <option value="aktivite">Aktivite / Deneyim</option>
              <option value="saglik">Sağlık</option>
              <option value="gastronomi">Gastronomi</option>
            </select>
            <select name="city" defaultValue={filters.city} className={adminUi.input}>
              <option value="">Tüm Şehirler</option>
              {cities.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
            <select name="status" defaultValue={filters.status} className={adminUi.input}>
              <option value="all">Tüm Durumlar</option>
              <option value="approved">Aktif</option>
              <option value="pending">Beklemede</option>
              <option value="suspended">Askıda</option>
              <option value="expired">Süresi Bitti</option>
              <option value="blacklisted">Blacklist</option>
            </select>
            <button className={adminUi.sapphireButton} type="submit">Filtrele</button>
            <Link href="/admin/tedarikciler" className={adminUi.ghostButton}>
              Temizle
            </Link>
          </form>
        </AdminPanel>

        <SelectableSuppliersTable
          businesses={visibleBusinesses}
          total={total}
          memberships={memberships}
          filters={filters}
          locale={locale}
        />
      </section>
    </div>
  );
};

const ExpiringBand = ({ count, businesses }: { count: number; businesses: AdminBusiness[] }) => (
  <section className="rounded-[10px] border border-red-200 bg-red-50 p-5 shadow-card">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[13px] font-normal text-red-700">Üyelik Riski</p>
        <strong className="mt-1 block text-[28px] font-medium leading-none tracking-[0] text-ink">{count}</strong>
      </div>
      <span className="rounded-full bg-red-100 px-2.5 py-1 text-[12px] font-medium text-red-700">14 gün</span>
    </div>
    {businesses.length > 0 && (
      <p className="mt-3 truncate text-[12.5px] font-normal text-muted">
        {businesses.map((business) => business.name).join(", ")}
      </p>
    )}
  </section>
);

const daysUntil = (value?: string) => {
  if (!value) return Number.POSITIVE_INFINITY;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return Math.ceil((date.getTime() - today.getTime()) / 86_400_000);
};

export default AdminSuppliersView;
