import { MessageSquareText, Trash2 } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { getAdminSupportTickets, getSupportMessagesByTickets } from "@/lib/platform-data";
import { updateTicketStatus, deleteTicket } from "@/lib/actions/platform";
import { Link } from "@/i18n/navigation";
import { PageHeader, Card, CardHeader, Metric } from "../_components";
import { DataTable, StatusBadge, EmptyState, ConfirmAction, type Column } from "@/components/common";
import type { SupportTicketRow } from "@/lib/supabase/database.types";
import TicketDetail from "./TicketDetail";

const TONE = { new: "amber", in_progress: "blue", resolved: "green", archived: "neutral" } as const;
const LABEL = { new: "Yeni", in_progress: "İşlemde", resolved: "Çözüldü", archived: "Arşiv" } as const;
type TicketStatus = keyof typeof TONE;

const TABS: { key: TicketStatus | "all"; label: string }[] = [
  { key: "all", label: "Tümü" },
  { key: "new", label: "Yeni" },
  { key: "in_progress", label: "İşlemde" },
  { key: "resolved", label: "Çözüldü" },
  { key: "archived", label: "Arşiv" },
];

const fmt = (v: string) => new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(v));

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { locale } = await params;
  const { status: statusParam } = await searchParams;
  setRequestLocale(locale);
  const allTickets = await getAdminSupportTickets();
  const activeTab = TABS.some((tb) => tb.key === statusParam) ? (statusParam as TicketStatus | "all") : "all";
  const tickets = activeTab === "all" ? allTickets : allTickets.filter((t) => t.status === activeTab);
  const messagesByTicket = await getSupportMessagesByTickets(tickets.map((t) => t.id));
  const count = (s: TicketStatus) => allTickets.filter((t) => t.status === s).length;

  const tabCls = (active: boolean) =>
    "rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors " +
    (active ? "bg-sapphire text-white" : "border border-line text-muted hover:bg-cream");

  return (
    <>
      <PageHeader
        eyebrow="Destek"
        title="Help Desk / Mesaj Kutusu"
        description="Kullanıcı ve işletmelerden gelen destek taleplerini kronolojik olarak takip edin."
      />

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <Metric title="Yeni Mesaj" value={count("new")} hint="işleme alınmadı" />
        <Metric title="İşleme Alınan" value={count("in_progress")} hint="devam ediyor" />
        <Metric title="Çözülen" value={count("resolved")} hint="tamamlandı" />
      </section>

      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {TABS.map((tb) => {
          const n = tb.key === "all" ? allTickets.length : count(tb.key);
          return (
            <Link
              key={tb.key}
              href={tb.key === "all" ? { pathname: "/admin/destek" } : { pathname: "/admin/destek", query: { status: tb.key } }}
              className={tabCls(activeTab === tb.key)}
            >
              {tb.label} ({n})
            </Link>
          );
        })}
      </div>

      <Card className="overflow-hidden hover:translate-y-0">
        <CardHeader
          title="Gelen Talepler"
          tone="blue"
          icon={<MessageSquareText size={18} aria-hidden />}
          action={<span className="shrink-0 text-[12px] font-semibold text-muted">{tickets.length} talep</span>}
        />
        {tickets.length === 0 ? (
          <EmptyState
            className="border-0"
            title="Bu görünümde talep yok"
            description="Kullanıcılar destek formundan mesaj gönderdiğinde burada listelenir."
          />
        ) : (
          <DataTable
            data={tickets}
            getRowKey={(t) => t.id}
            minWidth={820}
            columns={[
              {
                key: "sender",
                header: "Gönderen",
                cell: (t) => (
                  <div className="min-w-0">
                    <p className="text-[13px] font-extrabold text-ink">{t.sender_name}</p>
                    {t.sender_email && <p className="truncate text-[12px] font-semibold text-muted">{t.sender_email}</p>}
                  </div>
                ),
              },
              {
                key: "subject",
                header: "Konu",
                cell: (t) => (
                  <TicketDetail
                    ticket={t}
                    messages={messagesByTicket[t.id] ?? []}
                    tone={TONE[t.status as TicketStatus] ?? "neutral"}
                    label={LABEL[t.status as TicketStatus] ?? t.status}
                    locale={locale}
                  />
                ),
              },
              {
                key: "status",
                header: "Durum",
                cell: (t) => <StatusBadge tone={TONE[t.status as TicketStatus] ?? "neutral"}>{LABEL[t.status as TicketStatus] ?? t.status}</StatusBadge>,
              },
              { key: "date", header: "Tarih", cell: (t) => <span className="text-muted">{fmt(t.created_at)}</span> },
              {
                key: "action",
                header: "İşlem",
                align: "right",
                cell: (t) => (
                  <div className="flex justify-end gap-1.5">
                    {t.status === "new" && <TicketBtn id={t.id} locale={locale} status="in_progress" label="İşleme al" />}
                    {t.status !== "resolved" && t.status !== "archived" && (
                      <TicketBtn id={t.id} locale={locale} status="resolved" label="Çözüldü" tone="green" />
                    )}
                    {t.status !== "archived" && <TicketBtn id={t.id} locale={locale} status="archived" label="Arşivle" />}
                    <ConfirmAction
                      action={deleteTicket}
                      fields={{ id: String(t.id), locale }}
                      title="Talebi sil"
                      description="Bu destek talebi ve tüm yazışması kalıcı olarak silinecek. Bu işlem geri alınamaz."
                      confirmLabel="Sil"
                      danger
                      trigger={
                        <button
                          type="button"
                          aria-label="Talebi sil"
                          className="grid h-[30px] w-[30px] place-items-center rounded-lg border border-red-200 text-red-600 transition-colors hover:bg-red-50"
                        >
                          <Trash2 size={14} aria-hidden />
                        </button>
                      }
                    />
                  </div>
                ),
              },
            ] satisfies Column<SupportTicketRow>[]}
          />
        )}
      </Card>
    </>
  );
}

const TicketBtn = ({
  id,
  locale,
  status,
  label,
  tone = "neutral",
}: {
  id: number;
  locale: string;
  status: "in_progress" | "resolved" | "archived";
  label: string;
  tone?: "green" | "neutral";
}) => (
  <form action={updateTicketStatus}>
    <input type="hidden" name="id" value={id} />
    <input type="hidden" name="locale" value={locale} />
    <input type="hidden" name="status" value={status} />
    <button
      type="submit"
      className={
        "rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition-colors " +
        (tone === "green"
          ? "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          : "border-line text-muted hover:bg-cream")
      }
    >
      {label}
    </button>
  </form>
);
