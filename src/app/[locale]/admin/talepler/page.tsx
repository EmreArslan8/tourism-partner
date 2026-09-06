import { REQUEST_STATUS, isAwaitingQuote } from "@/lib/quote-workflow";
import { ArrowUpRight, ClipboardList, Eye, Mail, Send, Users } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  getAdminB2bRequests,
  getAdminQuoteRequests,
  type AdminB2bRequest,
  type AdminQuoteRequest,
} from "@/lib/platform-data";
import { PageHeader, Card, CardHeader, Metric } from "../_components";
import { DataTable, StatusBadge, EmptyState, type Column } from "@/components/common";
import type { BadgeTone } from "@/components/common/StatusBadge";

/* Alıcı tarafından girilen HER talep burada toplanır. İki kaynak var:
   - "form": ziyaretçinin teklif formu (quotes). Bir gönderim hedeflenen her
     tedarikçiye ayrı satır yazar; getAdminQuoteRequests bunları tek talepte birleştirir.
   - "b2b":  üye acentenin havuza açtığı ilan (b2b_requests).
   Tedarikçinin verdiği yanıtlar talep değil TEKLİF'tir; /admin/teklifler'de listelenir. */
type Row =
  | { kind: "b2b"; sortKey: string; data: AdminB2bRequest }
  | { kind: "form"; sortKey: string; data: AdminQuoteRequest };

const B2B_TONE: Record<AdminB2bRequest["status"], BadgeTone> = {
  pending: "amber",
  published: "green",
  archived: "neutral",
  rejected: "red",
};
const B2B_LABEL: Record<AdminB2bRequest["status"], string> = {
  pending: "Bekliyor",
  published: "Yayında",
  archived: "Arşiv",
  rejected: "Reddedildi",
};

const fmt = (v: string) => new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(v));

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [b2bRequests, formRequests] = await Promise.all([getAdminB2bRequests(), getAdminQuoteRequests()]);

  const rows: Row[] = [
    ...b2bRequests.map((data) => ({ kind: "b2b" as const, sortKey: data.createdAt, data })),
    ...formRequests.map((data) => ({ kind: "form" as const, sortKey: data.createdAt, data })),
  ].sort((a, b) => b.sortKey.localeCompare(a.sortKey));

  const totalViews = b2bRequests.reduce((sum, r) => sum + r.viewCount, 0);
  const totalOffers = formRequests.reduce((sum, r) => sum + r.responseCount, 0);
  const awaiting = formRequests.filter((row) => isAwaitingQuote(row.reviewStatus, row.responseCount)).length;

  return (
    <>
      <PageHeader
        eyebrow="Talepler"
        title="Gelen Talepler"
        description="Form taleplerini ve B2B ilanlarını takip edin. İnceleme ve durum değişiklikleri için talep detayını açın."
      />

      <section className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Metric title="Toplam Talep" value={rows.length} hint="her iki kaynak" />
        <Metric title="Form Talebi" value={formRequests.length} hint="teklif formundan" />
        <Metric title="B2B İlan" value={b2bRequests.length} hint="üye acenteden" />
        <Metric title="Yanıt Bekleyen" value={awaiting} hint="açık form talepleri · teklif yok" />
      </section>

      <Card className="overflow-hidden hover:translate-y-0">
        <CardHeader
          title="Tüm Talepler"
          tone="blue"
          icon={<ClipboardList size={18} aria-hidden />}
          action={
            <span className="text-right text-[12px] font-medium leading-5 text-muted">
              {rows.length} talep · {totalOffers} teklif · {totalViews.toLocaleString("tr-TR")} görüntülenme
            </span>
          }
        />
        {rows.length === 0 ? (
          <EmptyState
            className="border-0"
            title="Henüz talep yok"
            description="Teklif formu doldurulduğunda veya bir acente ilan açtığında burada listelenir."
          />
        ) : (
          <DataTable
            data={rows}
            getRowKey={(row) => `${row.kind}-${row.kind === "b2b" ? row.data.id : row.data.key}`}
            minWidth={960}
            className="[&_table]:table-fixed [&_th]:px-3 [&_td]:px-3 [&_th:first-child]:pl-5 [&_td:first-child]:pl-5 [&_th:last-child]:pr-5 [&_td:last-child]:pr-5 [&_td]:border-b [&_td]:border-line/60 [&_td]:py-4 [&_tr:last-child_td]:border-b-0"
            columns={[
              {
                key: "title",
                header: "Talep",
                headerClassName: "w-[27%]",
                cell: (row) => {
                  const title = row.kind === "b2b" ? row.data.title : row.data.service || row.data.name;
                  const description = row.kind === "b2b" ? row.data.description : row.data.message;
                  return (
                    <div className="min-w-0">
                      <Link
                        href={row.kind === "b2b"
                          ? { pathname: "/admin/talepler/[id]", params: { id: String(row.data.id) } }
                          : { pathname: "/admin/talepler/form/[id]", params: { id: String(row.data.primaryId) } }}
                        title={title}
                        className="line-clamp-2 break-words rounded text-[13px] font-semibold leading-5 text-ink transition-colors hover:text-sapphire focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sapphire"
                      >
                        {title}
                      </Link>
                      <div className="mt-2 flex min-w-0 items-center gap-2">
                        <span className={
                          "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-semibold " +
                          (row.kind === "b2b" ? "bg-violet-50 text-violet-700" : "bg-blue-50 text-blue-700")
                        }>
                          {row.kind === "b2b" ? <ClipboardList size={11} aria-hidden /> : <Mail size={11} aria-hidden />}
                          {row.kind === "b2b" ? "B2B ilan" : "Form talebi"}
                        </span>
                        {description && <p title={description} className="min-w-0 truncate text-[12px] text-muted">{description}</p>}
                      </div>
                    </div>
                  );
                },
              },
              {
                key: "from",
                header: "Gönderen",
                headerClassName: "w-[20%]",
                cell: (row) => (
                  <div className="min-w-0">
                    <p title={row.kind === "b2b" ? row.data.businessName ?? undefined : row.data.company || row.data.name} className="truncate text-[13px] font-semibold text-ink">
                      {row.kind === "b2b"
                        ? row.data.businessName ?? "İşletme kaydı yok"
                        : row.data.company || row.data.name}
                    </p>
                    <p title={row.kind === "b2b" ? row.data.region ?? undefined : row.data.email} className="mt-1 truncate text-[12px] text-muted">
                      {row.kind === "b2b" ? row.data.region ?? "Bölge belirtilmemiş" : row.data.email}
                    </p>
                  </div>
                ),
              },
              {
                key: "activity",
                header: "Etkileşim",
                headerClassName: "w-[17%]",
                cell: (row) => (
                  <div className="space-y-1.5 whitespace-nowrap text-[12px] text-muted">
                    {row.kind === "b2b" ? (
                      <span className="flex items-center gap-1.5">
                        <Eye size={14} aria-hidden className="shrink-0" />
                        <span className="font-semibold tabular-nums text-ink">{row.data.viewCount.toLocaleString("tr-TR")}</span> görüntülenme
                      </span>
                    ) : (
                      <>
                        <span className="flex items-center gap-1.5" title={row.data.targets.map((t) => t.name).join(", ")}>
                          <Users size={14} aria-hidden className="shrink-0" />
                          <span className="font-semibold tabular-nums text-ink">{row.data.targets.length}</span> tedarikçi
                        </span>
                        <span className={"flex items-center gap-1.5 " + (row.data.responseCount > 0 ? "text-emerald-700" : "text-muted")}>
                          <Send size={13} aria-hidden className="shrink-0" />
                          <span className="font-semibold tabular-nums">{row.data.responseCount}</span> teklif
                        </span>
                      </>
                    )}
                  </div>
                ),
              },
              {
                key: "status",
                header: "Yönetim durumu",
                headerClassName: "w-[16%]",
                className: "whitespace-nowrap",
                cell: (row) => {
                  if (row.kind === "b2b") {
                    return <StatusBadge tone={B2B_TONE[row.data.status]}>{B2B_LABEL[row.data.status]}</StatusBadge>;
                  }
                  const status = REQUEST_STATUS[row.data.reviewStatus];
                  return <StatusBadge tone={status.tone}>{status.label}</StatusBadge>;
                },
              },
              {
                key: "date",
                header: "Tarih",
                headerClassName: "w-[11%]",
                cell: (row) => <time dateTime={row.data.createdAt} className="whitespace-nowrap text-[12px] tabular-nums text-muted">{fmt(row.data.createdAt)}</time>,
              },
              {
                key: "action",
                header: "İşlem",
                align: "right",
                headerClassName: "w-[9%]",
                cell: (row) => (
                  <Link
                    href={row.kind === "b2b"
                      ? { pathname: "/admin/talepler/[id]", params: { id: String(row.data.id) } }
                      : { pathname: "/admin/talepler/form/[id]", params: { id: String(row.data.primaryId) } }}
                    aria-label={`${row.kind === "b2b" ? row.data.title : row.data.service || row.data.name} — Detay`}
                    className="inline-flex min-h-9 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-2 text-[12px] font-semibold text-sapphire transition-colors hover:bg-sapphire/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sapphire"
                  >
                    Detay <ArrowUpRight size={14} aria-hidden />
                  </Link>
                ),
              },
            ] satisfies Column<Row>[]}
          />
        )}
      </Card>
    </>
  );
}
