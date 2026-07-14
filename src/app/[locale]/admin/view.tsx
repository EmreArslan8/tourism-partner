import { Link } from "@/i18n/navigation";
import { DataTable, type Column } from "@/components/common";
import type { AdminBusiness, AdminData, AdminMembership, AdminQuote } from "@/lib/types";
import { EXPIRY_WARNING_DAYS, latestMembershipByBusiness, membershipDaysLeft, membershipState } from "@/lib/membership";
import { AdminActionButton, AdminHero, AdminMetric, AdminPage, AdminPanel } from "./_ui";

interface Props {
  data: AdminData;
}

type ExpiringRow = { business: AdminBusiness; membership: AdminMembership; days: number };

const AdminView = ({ data }: Props) => {
  const pendingBusinesses = data.businesses.filter((b) => b.status === "pending").length;
  const pendingApplications = data.applications.filter((a) => a.status === "pending").length;
  const approvalCount = pendingApplications + pendingBusinesses;

  const recentQuotes = data.quotes.slice(0, 5);
  const pendingReview = data.businesses
    .filter((business) => business.status === "pending")
    .slice(0, 5);

  // Üyelik süresi son 2 haftaya girmiş (henüz bitmemiş) işletmeler.
  const businessById = new Map(data.businesses.map((business) => [business.id, business]));
  const expiringSoon: ExpiringRow[] = [...latestMembershipByBusiness(data.memberships).values()]
    .filter((membership) => membershipState(membership) === "expiring")
    .map((membership) => ({ business: businessById.get(membership.businessId), membership }))
    .filter((row): row is { business: AdminBusiness; membership: AdminMembership } => Boolean(row.business))
    .map((row) => ({ business: row.business, membership: row.membership, days: membershipDaysLeft(row.membership.endsAt) }))
    .sort((a, b) => a.days - b.days)
    .slice(0, 5);

  return (
    <AdminPage
        title="Dashboard"
        description="Sistem genel bakış ve anlık durum raporu."
      >
      <AdminHero
        title="Operasyon akışı sakin, öncelikler görünür."
        action={
          <Link href="/admin/onay">
            <AdminActionButton>Bekleyenleri İncele</AdminActionButton>
          </Link>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricLink>
          <AdminMetric
          tone="blue"
          label="Toplam Firma"
          value={data.businesses.length}
          icon={<Svg><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 8h1m4 0h1M9 12h1m4 0h1M9 16h1m4 0h1" /></Svg>}
        />
        </MetricLink>
        <Link href="/admin/onay" className="block">
          <AdminMetric
          tone="amber"
          label="Bekleyen Başvuru"
          value={approvalCount}
          icon={<Svg><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>}
        />
        </Link>
        <MetricLink>
          <AdminMetric
          tone="emerald"
          label="Haftalık Görüntülenme"
          value={data.pageViews.length}
          hint="son 7 gün"
          icon={<Svg><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></Svg>}
        />
        </MetricLink>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Son teklifler */}
        <AdminPanel
          title="Son Teklifler / Talepler"
          tone="blue"
          icon={<Svg size={18}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" /><path d="M14 2v6h6M9 13h6M9 17h4" /></Svg>}
          action={<Link href="/admin/teklifler" className="shrink-0 text-[12px] font-medium text-brand hover:underline">Tümünü Gör</Link>}
        >
          <div className="overflow-x-auto">
          <DataTable
            data={recentQuotes}
            getRowKey={(q) => q.id}
            empty="Henüz talep yok."
            minWidth={420}
            columns={[
              { key: "title", header: "Başlık", cell: (q) => <span className="font-medium text-ink">{q.service || q.name}</span> },
              { key: "firm", header: "Firma", cell: (q) => <span className="text-muted">{q.company || q.name}</span> },
              { key: "date", header: "Tarih", cell: (q) => <span className="text-muted">{fmtDate(q.createdAt)}</span> },
            ] satisfies Column<AdminQuote>[]}
          />
          </div>
        </AdminPanel>

        {/* Onay bekleyen işletmeler */}
        <AdminPanel
          title="Onay Bekleyen İşletmeler"
          tone="amber"
          icon={<Svg size={18}><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></Svg>}
          action={<Link href="/admin/onay" className="shrink-0 text-[12px] font-medium text-brand hover:underline">İncele</Link>}
        >
          <div className="overflow-x-auto">
          <DataTable
            data={pendingReview}
            getRowKey={(business) => business.id}
            empty="Onay bekleyen işletme yok."
            minWidth={420}
            columns={[
              { key: "firm", header: "Firma", cell: (business) => <span className="font-medium text-ink">{business.name}</span> },
              {
                key: "city",
                header: "Şehir",
                cell: (business) => <span className="text-muted">{business.city}</span>,
              },
              {
                key: "action",
                header: "İşlem",
                align: "right",
                cell: (business) => (
                  <Link
                    href={{ pathname: "/admin/tedarikciler/[id]", params: { id: String(business.id) } }}
                    className="rounded-[8px] border border-line px-3 py-1 text-[12px] font-medium text-brand transition-colors hover:bg-cream"
                  >
                    Aç
                  </Link>
                ),
              },
            ] satisfies Column<(typeof pendingReview)[number]>[]}
          />
          </div>
        </AdminPanel>
      </div>

      {/* Üyelik süresi son 2 hafta kalan işletmeler */}
      <div className="mt-5">
        <AdminPanel
          title="Üyelik Süresi Son 2 Hafta Kalan İşletmeler"
          tone="amber"
          icon={<Svg size={18}><path d="M8 2v4M16 2v4M3 10h18" /><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M12 14v3l2 1" /></Svg>}
          action={<Link href="/admin/tedarikciler" className="shrink-0 text-[12px] font-medium text-brand hover:underline">Tümünü Gör</Link>}
        >
          <div className="overflow-x-auto">
            <DataTable
              data={expiringSoon}
              getRowKey={(row) => row.business.id}
              empty={`Üyeliğine ${EXPIRY_WARNING_DAYS} gün veya daha az kalan işletme yok.`}
              minWidth={520}
              columns={[
                { key: "firm", header: "Firma", cell: (row) => <span className="font-medium text-ink">{row.business.name}</span> },
                { key: "city", header: "Şehir", cell: (row) => <span className="text-muted">{row.business.city}</span> },
                {
                  key: "left",
                  header: "Kalan",
                  cell: (row) => (
                    <span className={row.days <= 3 ? "font-semibold text-red-600" : "font-semibold text-amber-700"}>
                      {row.days <= 0 ? "Bugün" : `${row.days} gün`}
                    </span>
                  ),
                },
                {
                  key: "contact",
                  header: "İletişim",
                  align: "right",
                  cell: (row) =>
                    row.business.phone ? (
                      <a href={`tel:${row.business.phone}`} className="text-[12px] font-semibold text-brand hover:underline">
                        {row.business.phone}
                      </a>
                    ) : (
                      <Link
                        href={{ pathname: "/admin/tedarikciler/[id]", params: { id: String(row.business.id) } }}
                        className="rounded-[8px] border border-line px-3 py-1 text-[12px] font-medium text-brand transition-colors hover:bg-cream"
                      >
                        Aç
                      </Link>
                    ),
                },
              ] satisfies Column<ExpiringRow>[]}
            />
          </div>
        </AdminPanel>
      </div>

      {/* Yedekleme bilgisi */}
      <div className="mt-7 flex items-center justify-end gap-1.5 px-2 text-[12px] font-normal text-muted">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5M3 12c0 1.7 4 3 9 3s9-1.3 9-3" /></svg>
        Son Yedekleme Tarihi: {data.lastBackup?.completedAt ? fmtDateTime(data.lastBackup.completedAt) : "—"}
      </div>
    </AdminPage>
  );
};

const MetricLink = ({ children }: { children: React.ReactNode }) => (
  <div className="block transition-all duration-200 hover:-translate-y-0.5 hover:[&>article]:border-line">
    {children}
  </div>
);

const Svg = ({ children, size = 22 }: { children: React.ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {children}
  </svg>
);

function fmtDate(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "short" }).format(new Date(value));
}

function fmtDateTime(value: string) {
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

export default AdminView;
