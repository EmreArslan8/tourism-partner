import { CalendarClock, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { extendMembership } from "@/lib/actions/membership";
import { membershipDaysLeft } from "@/lib/membership";
import { adminUi } from "../_ui";
import type { AdminBusiness, AdminMembership } from "@/lib/types";

/* CRM "Üyelik Süresi Sonlanan İşletmeler" bölümü — periyodu tamamen bitmiş
   firmaların toplu listesi. Her satırdan manuel üyelik uzatma ve hızlı iletişim. */
const ExpiredMembershipsSection = ({
  businesses,
  memberships,
  locale,
}: {
  businesses: AdminBusiness[];
  memberships: AdminMembership[];
  locale: string;
}) => {
  if (businesses.length === 0) return null;

  const membershipByBusiness = new Map(memberships.map((membership) => [membership.businessId, membership]));

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-amber-200/80 bg-amber-50/40 shadow-card">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/70 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-[8px] bg-amber-100 text-amber-700">
            <CalendarClock size={18} aria-hidden />
          </span>
          <div>
            <h3 className="text-[16px] font-semibold text-ink">Üyelik Süresi Sonlanan İşletmeler</h3>
            <p className="mt-0.5 text-[13px] text-muted">
              Periyodu biten {businesses.length} işletme. Uzatma yapılana kadar üyelik pasiftir.
            </p>
          </div>
        </div>
      </header>

      <ul className="divide-y divide-amber-200/60">
        {businesses.map((business) => {
          const membership = membershipByBusiness.get(business.id);
          const daysAgo = membership ? Math.abs(membershipDaysLeft(membership.endsAt)) : null;
          return (
            <li key={business.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
              <div className="min-w-0">
                <Link
                  href={{ pathname: "/admin/tedarikciler/[id]", params: { id: String(business.id) } }}
                  className="block truncate text-[14.5px] font-semibold text-ink hover:text-brand"
                >
                  {business.name}
                </Link>
                <p className="truncate text-[12.5px] text-muted">
                  {business.city}
                  {membership ? ` · ${membership.plan} · ${daysAgo} gün önce bitti` : ""}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {business.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-line bg-paper px-3 text-[13px] font-semibold text-brand transition-colors hover:bg-cream/70"
                    aria-label={`${business.name} ara`}
                  >
                    <Phone size={14} aria-hidden />
                    İletişim
                  </a>
                )}
                <form action={extendMembership} className="flex items-center gap-1.5">
                  <input type="hidden" name="businessId" value={business.id} />
                  <input type="hidden" name="locale" value={locale} />
                  <select name="months" defaultValue="12" className={adminUi.input} aria-label="Uzatma süresi">
                    <option value="1">1 ay</option>
                    <option value="3">3 ay</option>
                    <option value="6">6 ay</option>
                    <option value="12">12 ay</option>
                  </select>
                  <button type="submit" className={adminUi.sapphireButton}>
                    Üyeliği Uzat
                  </button>
                </form>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default ExpiredMembershipsSection;
