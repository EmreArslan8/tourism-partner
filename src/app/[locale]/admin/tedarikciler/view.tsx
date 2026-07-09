import { Link } from "@/i18n/navigation";
import { PageHeader } from "../_components";
import { AdminMetric, AdminPanel, adminUi } from "../_ui";
import SelectableSuppliersTable from "./SelectableSuppliersTable";
import type { CrmFilters } from "@/lib/admin-crm";
import type { AdminBusiness } from "@/lib/types";

interface Props {
  businesses: AdminBusiness[];
  total: number;
  filters: CrmFilters;
  cities: string[];
  activeHotels: number;
  activeAgencies: number;
  locale: string;
}

const AdminSuppliersView = ({
  businesses,
  total,
  filters,
  cities,
  activeHotels,
  activeAgencies,
  locale,
}: Props) => {
  const visibleBusinesses = businesses;

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-5">
      <section className="min-w-0">
        <PageHeader
          eyebrow="İşletmeler"
          title="İşletmeler (CRM)"
          description="Sistemdeki tüm kayıtlı B2B acente ve otelleri yönetin."
        />

        <div className="mb-5 grid gap-3 lg:grid-cols-3">
          <AdminMetric label="Toplam İşletme" value={total} />
          <AdminMetric label="Aktif Otel" value={activeHotels} tone="emerald" />
          <AdminMetric label="Aktif Acente" value={activeAgencies} tone="blue" />
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
          filters={filters}
          locale={locale}
        />
      </section>
    </div>
  );
};

export default AdminSuppliersView;
