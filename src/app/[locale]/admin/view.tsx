import { Link } from "@/i18n/navigation";
import { PageHeader, Card, CardHeader, type ChipTone } from "./_components";
import { DataTable, StatusBadge, type Column } from "@/components/common";
import type { AdminData, AdminQuote } from "@/lib/types";

interface Props {
  data: AdminData;
}

const AdminView = ({ data }: Props) => {
  const pendingBusinesses = data.businesses.filter((b) => b.status === "pending").length;
  const pendingApplications = data.applications.filter((a) => a.status === "pending").length;
  const approvalCount = pendingApplications + pendingBusinesses;

  const recentQuotes = data.quotes.slice(0, 5);

  const businessName = (id: number | null) =>
    data.businesses.find((b) => b.id === id)?.name ?? `Firma #${id ?? "-"}`;

  const expiring = data.memberships
    .map((m) => ({ ...m, days: daysUntil(m.endsAt) }))
    .filter((m) => m.status !== "expired" && m.days >= 0 && m.days <= 14)
    .sort((a, b) => a.days - b.days)
    .slice(0, 5);

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Dashboard"
        description="Sistem genel bakış ve anlık durum raporu."
        action={
          <Link
            href="/admin/tedarikciler"
            className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-[#1D4FD7]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden><path d="M12 5v14M5 12h14" /></svg>
            Yeni İşletme Kaydı
          </Link>
        }
      />

      {/* Sayaç kartları */}
      <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-3">
        <CounterCard
          tone="blue"
          label="Toplam Firma"
          value={data.businesses.length}
          icon={<path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 8h1m4 0h1M9 12h1m4 0h1M9 16h1m4 0h1" />}
        />
        <CounterCard
          tone="amber"
          label="Bekleyen Başvuru"
          value={approvalCount}
          href="/admin/onay"
          icon={<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>}
        />
        <CounterCard
          tone="emerald"
          label="Haftalık Görüntülenme"
          value={data.pageViews.length}
          detail="son 7 gün"
          icon={<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>}
        />
      </div>

      {/* Alt tablolar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Son teklifler */}
        <TableCard
          title="Son Teklifler / Talepler"
          tone="blue"
          icon={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" /><path d="M14 2v6h6M9 13h6M9 17h4" /></>}
          link={{ href: "/admin/teklifler", label: "Tümünü Gör" }}
        >
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
        </TableCard>

        {/* Üyeliği bitmek üzere olanlar */}
        <TableCard
          title="Üyeliği 14 Günden Az Kalanlar"
          tone="amber"
          icon={<><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>}
          link={{ href: "/admin/tedarikciler", label: "Tümü" }}
        >
          <DataTable
            data={expiring}
            getRowKey={(m) => m.id}
            empty="Yaklaşan üyelik bitişi yok."
            minWidth={420}
            columns={[
              { key: "firm", header: "Firma", cell: (m) => <span className="font-medium text-ink">{businessName(m.businessId)}</span> },
              {
                key: "days",
                header: "Kalan Gün",
                cell: (m) => <StatusBadge tone={m.days <= 3 ? "solidRed" : "amber"}>{m.days} Gün</StatusBadge>,
              },
              {
                key: "action",
                header: "İşlem",
                align: "right",
                cell: () => (
                  <Link
                    href="/admin/tedarikciler"
                    className="rounded-lg border border-[#2563EB]/30 px-3 py-1 text-[12px] font-semibold text-[#2563EB] transition-colors hover:bg-[#EFF4FF]"
                  >
                    İletişim
                  </Link>
                ),
              },
            ] satisfies Column<(typeof expiring)[number]>[]}
          />
        </TableCard>
      </div>

      {/* Yedekleme bilgisi */}
      <div className="mt-8 flex items-center justify-end gap-1.5 px-2 text-[12px] text-[#94A3B8]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5M3 12c0 1.7 4 3 9 3s9-1.3 9-3" /></svg>
        Son Yedekleme Tarihi: {data.lastBackup?.completedAt ? fmtDateTime(data.lastBackup.completedAt) : "—"}
      </div>
    </>
  );
};

const CHIP = {
  blue: "bg-[#EFF4FF] text-[#2563EB]",
  amber: "bg-[#FFF7ED] text-[#D97706]",
  emerald: "bg-[#ECFDF5] text-[#059669]",
} as const;

const CounterCard = ({
  tone,
  label,
  value,
  detail,
  icon,
  href,
}: {
  tone: keyof typeof CHIP;
  label: string;
  value: number | string;
  detail?: string;
  icon: React.ReactNode;
  href?: "/admin/onay";
}) => {
  const inner = (
    <div className="flex items-center gap-4 rounded-2xl border border-[#EEF2F8] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,.04),0_12px_26px_-20px_rgba(15,23,42,.16)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#DDE5F0] hover:shadow-[0_6px_18px_-10px_rgba(15,23,42,.12)]">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${CHIP[tone]}`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden>{icon}</svg>
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-[#64748B]">{label}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-[26px] font-extrabold leading-none tracking-tight text-[#0B1C30]">{value}</span>
          {detail && <span className="text-[12px] font-semibold text-emerald-600">{detail}</span>}
        </div>
      </div>
    </div>
  );
  return href ? <Link href={href} className="block">{inner}</Link> : inner;
};

const TableCard = ({
  title,
  icon,
  tone = "blue",
  link,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  tone?: ChipTone;
  link: { href: "/admin/teklifler" | "/admin/tedarikciler"; label: string };
  children: React.ReactNode;
}) => (
  <Card className="flex flex-col overflow-hidden">
    <CardHeader
      title={title}
      tone={tone}
      icon={icon && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden>{icon}</svg>}
      action={<Link href={link.href} className="shrink-0 text-[12px] font-semibold text-[#0057D9] hover:underline">{link.label}</Link>}
    />
    <div className="flex-1 overflow-x-auto">{children}</div>
  </Card>
);

function daysUntil(value: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return Math.ceil((date.getTime() - today.getTime()) / 86_400_000);
}

function fmtDate(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "short" }).format(new Date(value));
}

function fmtDateTime(value: string) {
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

export default AdminView;
