import { Link } from "@/i18n/navigation";
import { PageHeader } from "../_components";
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
  expiringMemberships: _expiringMemberships,
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
          <CrmMetric label="Toplam İşletme" value={total} />
          <CrmMetric label="Aktif Otel" value={activeHotels} />
          <CrmMetric label="Aktif Acente" value={activeAgencies} />
          <ExpiringBand count={Math.max(expiring.length, expiringBusinesses.length)} businesses={expiring.map(({ business }) => business)} />
        </div>

        <form action="" className="mb-5 rounded-xl border border-[#DDE4EE] bg-white p-3 shadow-[0_10px_30px_-24px_rgba(15,23,42,.22)]">
          <div className="grid gap-2 lg:grid-cols-[minmax(220px,1fr)_180px_170px_170px_auto_auto] lg:items-center">
            <input
              name="q"
              defaultValue={filters.q}
              placeholder="Firma adı, VKN veya ID"
              className="h-10 rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-[14px] font-medium text-[#162238] placeholder:text-[#8B95A7]"
            />
            <select name="group" defaultValue={filters.group} className="h-10 rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-[14px] font-medium text-[#162238]">
              <option value="all">Tüm Kategoriler</option>
              <option value="konaklama">Konaklama</option>
              <option value="acente">Acente</option>
              <option value="ulasim">Ulaşım</option>
              <option value="rehber">Rehber</option>
              <option value="aktivite">Aktivite / Deneyim</option>
              <option value="saglik">Sağlık</option>
            </select>
            <select name="city" defaultValue={filters.city} className="h-10 rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-[14px] font-medium text-[#162238]">
              <option value="">Tüm Şehirler</option>
              {cities.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
            <select name="status" defaultValue={filters.status} className="h-10 rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-[14px] font-medium text-[#162238]">
              <option value="all">Tüm Durumlar</option>
              <option value="approved">Aktif</option>
              <option value="pending">Beklemede</option>
              <option value="suspended">Askıda</option>
              <option value="expired">Süresi Bitti</option>
              <option value="blacklisted">Blacklist</option>
            </select>
            <button className="h-10 rounded-[8px] bg-[#0057D9] px-4 text-[13px] font-semibold text-white hover:bg-[#0047B8]" type="submit">Filtrele
            </button>
            <Link href="/admin/tedarikciler" className="inline-flex h-10 items-center justify-center rounded-[8px] border border-[#CBD5E1] bg-white px-4 text-[13px] font-semibold text-[#3D4B64] hover:bg-[#F8FAFF]">
              Temizle
            </Link>
          </div>
        </form>

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

const CrmMetric = ({ value, label }: { value: number; label: string }) => (
  <section className="rounded-xl border border-[#DDE4EE] bg-white p-4 shadow-[0_10px_30px_-26px_rgba(15,23,42,.2)]">
    <p className="text-[12px] font-semibold uppercase tracking-[.06em] text-[#64748B]">{label}</p>
    <strong className="mt-2 block text-[28px] font-semibold leading-none text-[#0B1C30]">{value}</strong>
  </section>
);

const ExpiringBand = ({ count, businesses }: { count: number; businesses: AdminBusiness[] }) => (
  <section className="rounded-xl border border-[#F3C7C1] bg-[#FFF9F8] p-4 shadow-[0_10px_30px_-26px_rgba(185,28,28,.24)]">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[.06em] text-[#B42318]">Üyelik Riski</p>
        <strong className="mt-2 block text-[24px] font-semibold leading-none text-[#0B1C30]">{count}</strong>
      </div>
      <span className="rounded-full bg-[#FFE4E0] px-2.5 py-1 text-[12px] font-semibold text-[#B42318]">14 gün</span>
    </div>
    {businesses.length > 0 && (
      <p className="mt-3 truncate text-[12.5px] font-medium text-[#64748B]">
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
