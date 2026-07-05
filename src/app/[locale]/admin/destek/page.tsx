import { MessageSquareText } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { getAdminSupportTickets } from "@/lib/platform-data";
import { updateTicketStatus } from "@/lib/actions/platform";
import { PageHeader, Card, CardHeader, Metric } from "../_components";
import { DataTable, StatusBadge, EmptyState, type Column } from "@/components/common";
import type { SupportTicketRow } from "@/lib/supabase/database.types";

const TONE = { new: "amber", in_progress: "blue", resolved: "green", archived: "neutral" } as const;
const LABEL = { new: "Yeni", in_progress: "İşlemde", resolved: "Çözüldü", archived: "Arşiv" } as const;
type TicketStatus = keyof typeof TONE;

const fmt = (v: string) => new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(v));

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tickets = await getAdminSupportTickets();
  const count = (s: TicketStatus) => tickets.filter((t) => t.status === s).length;

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

      <Card className="overflow-hidden hover:translate-y-0">
        <CardHeader
          title="Gelen Talepler"
          tone="blue"
          icon={<MessageSquareText size={18} aria-hidden />}
          action={<span className="shrink-0 text-[12px] font-semibold text-[#475569]">{tickets.length} talep</span>}
        />
        {tickets.length === 0 ? (
          <EmptyState
            className="border-0"
            title="Henüz destek talebi yok"
            description="Kullanıcılar destek formundan mesaj gönderdiğinde burada listelenir."
          />
        ) : (
          <DataTable
            data={tickets}
            getRowKey={(t) => t.id}
            minWidth={760}
            columns={[
              {
                key: "sender",
                header: "Gönderen",
                cell: (t) => (
                  <div className="min-w-0">
                    <p className="text-[13px] font-extrabold text-[#162238]">{t.sender_name}</p>
                    {t.sender_email && <p className="truncate text-[12px] font-semibold text-[#475569]">{t.sender_email}</p>}
                  </div>
                ),
              },
              {
                key: "subject",
                header: "Konu",
                cell: (t) => (
                  <div className="max-w-[320px]">
                    <p className="text-[13px] font-semibold text-[#162238]">{t.subject}</p>
                    <p className="mt-1 line-clamp-1 text-[12px] text-[#475569]">{t.message}</p>
                  </div>
                ),
              },
              {
                key: "status",
                header: "Durum",
                cell: (t) => <StatusBadge tone={TONE[t.status as TicketStatus] ?? "neutral"}>{LABEL[t.status as TicketStatus] ?? t.status}</StatusBadge>,
              },
              { key: "date", header: "Tarih", cell: (t) => <span className="text-[#475569]">{fmt(t.created_at)}</span> },
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
          : "border-[#D4DCEA] text-[#475569] hover:bg-cream")
      }
    >
      {label}
    </button>
  </form>
);
