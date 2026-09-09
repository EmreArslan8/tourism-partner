import { ArrowUpRight, Eye, Tag, Users } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { moderateB2bDeal } from "@/lib/actions/platform";
import { getAdminB2bDeals, type AdminB2bDeal } from "@/lib/platform-data";
import { DataTable, StatusBadge, EmptyState, type Column } from "@/components/common";
import type { BadgeTone } from "@/components/common/StatusBadge";
import { PageHeader, Card, CardHeader, Metric } from "../_components";

/* Fırsat ilanları — üyelerin yayımladığı tarife/kontenjan ilanları. Talep panosunun
   aynası: orada "müşterim var", burada "müşteri arıyorum". Yalnız üyeler görür,
   admin buradan yayından kaldırır/reddeder. */

const TONE: Record<AdminB2bDeal["status"], BadgeTone> = {
  pending: "amber",
  published: "green",
  archived: "neutral",
  rejected: "red",
};
const LABEL: Record<AdminB2bDeal["status"], string> = {
  pending: "Bekliyor",
  published: "Yayında",
  archived: "Arşiv",
  rejected: "Reddedildi",
};

const fmt = (v: string) => new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(v));

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const deals = await getAdminB2bDeals();
  const live = deals.filter((d) => d.status === "published");
  const totalViews = deals.reduce((sum, d) => sum + d.viewCount, 0);
  const totalInterest = deals.reduce((sum, d) => sum + d.interestCount, 0);

  return (
    <>
      <PageHeader
        eyebrow="Fırsat İlanları"
        title="Üye Fırsat İlanları"
        description="Üyelerin yayımladığı tarife, kontenjan ve paketler. Talep panosuna yanlış düşen ilanlar buraya taşınır."
      />

      <section className="mb-6 grid grid-flow-col auto-cols-[minmax(160px,1fr)] gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid-flow-row md:grid-cols-4 md:overflow-visible md:pb-0">
        <Metric title="Toplam İlan" value={deals.length} hint="tüm durumlar" />
        <Metric title="Yayında" value={live.length} hint="üyelere görünen" />
        <Metric title="İlgilenen" value={totalInterest} hint="ilgi bildirimi" />
        <Metric title="Görüntülenme" value={totalViews.toLocaleString("tr-TR")} hint="ilan görüntülenmesi" />
      </section>

      <Card className="overflow-hidden hover:translate-y-0">
        <CardHeader
          title="Tüm Fırsat İlanları"
          tone="blue"
          icon={<Tag size={18} aria-hidden />}
          action={<span className="text-right text-[12px] font-medium leading-5 text-muted">{deals.length} ilan · {totalInterest} ilgi</span>}
        />
        {deals.length === 0 ? (
          <EmptyState
            className="border-0"
            title="Henüz fırsat ilanı yok"
            description="Bir üye panelinden ilan yayınladığında veya bir talep buraya taşındığında listelenir."
          />
        ) : (
          <DataTable
            data={deals}
            getRowKey={(row) => String(row.id)}
            minWidth={1120}
            className="[&_table]:table-fixed [&_th]:px-3 [&_td]:px-3 [&_th:first-child]:pl-5 [&_td:first-child]:pl-5 [&_th:last-child]:pr-5 [&_td:last-child]:pr-5 [&_td]:border-b [&_td]:border-line/60 [&_td]:py-4 [&_tr:last-child_td]:border-b-0"
            columns={[
              {
                key: "title",
                header: "İlan",
                headerClassName: "w-[26%]",
                cell: (row) => (
                  <div className="min-w-0">
                    <Link
                      href={{ pathname: "/admin/firsatlar/[id]", params: { id: String(row.id) } }}
                      title={row.title}
                      className="line-clamp-2 break-words rounded text-[13px] font-semibold leading-5 text-ink transition-colors hover:text-sapphire focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sapphire"
                    >
                      {row.title}
                    </Link>
                    <div className="mt-2 flex min-w-0 items-center gap-2">
                      {row.sourceRequestId && (
                        <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                          Talep #{row.sourceRequestId}&apos;den taşındı
                        </span>
                      )}
                      {row.description && <p title={row.description} className="min-w-0 truncate text-[12px] text-muted">{row.description}</p>}
                    </div>
                  </div>
                ),
              },
              {
                key: "from",
                header: "Yayınlayan",
                headerClassName: "w-[16%]",
                cell: (row) => (
                  <div className="min-w-0">
                    <p title={row.businessName ?? undefined} className="truncate text-[13px] font-semibold text-ink">{row.businessName ?? "İşletme kaydı yok"}</p>
                    <p className="mt-1 truncate text-[12px] text-muted">{row.region ?? "Bölge belirtilmemiş"}</p>
                  </div>
                ),
              },
              {
                key: "terms",
                header: "Tarife",
                headerClassName: "w-[13%]",
                cell: (row) => (
                  <div className="space-y-1 text-[12px] text-muted">
                    <p className="font-semibold text-ink">{row.price ?? "—"}</p>
                    <p>{row.capacity ? `${row.capacity} kontenjan` : "kontenjan yok"}</p>
                    {row.validUntil && <p>son: {fmt(`${row.validUntil}T12:00:00`)}</p>}
                  </div>
                ),
              },
              {
                key: "activity",
                header: "Etkileşim",
                headerClassName: "w-[12%]",
                cell: (row) => (
                  <div className="space-y-1.5 whitespace-nowrap text-[12px] text-muted">
                    <span className="flex items-center gap-1.5">
                      <Eye size={14} aria-hidden className="shrink-0" />
                      <span className="font-semibold tabular-nums text-ink">{row.viewCount.toLocaleString("tr-TR")}</span> görüntülenme
                    </span>
                    <span className={"flex items-center gap-1.5 " + (row.interestCount > 0 ? "text-emerald-700" : "text-muted")}>
                      <Users size={13} aria-hidden className="shrink-0" />
                      <span className="font-semibold tabular-nums">{row.interestCount}</span> ilgi
                    </span>
                  </div>
                ),
              },
              {
                key: "status",
                header: "Durum",
                headerClassName: "w-[10%]",
                className: "whitespace-nowrap",
                cell: (row) => <StatusBadge tone={TONE[row.status]}>{LABEL[row.status]}</StatusBadge>,
              },
              {
                key: "action",
                header: "İşlem",
                align: "right",
                headerClassName: "w-[23%]",
                cell: (row) => (
                  <div className="flex flex-wrap items-center justify-end gap-1.5">
                    <Link
                      href={{ pathname: "/admin/firsatlar/[id]", params: { id: String(row.id) } }}
                      aria-label={`${row.title} — Detay`}
                      className="inline-flex min-h-9 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-2 text-[12px] font-semibold text-sapphire transition-colors hover:bg-sapphire/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sapphire"
                    >
                      Detay <ArrowUpRight size={14} aria-hidden />
                    </Link>
                    <form action={moderateB2bDeal} className="flex flex-wrap items-center justify-end gap-1.5">
                    <input type="hidden" name="id" value={row.id} />
                    <input type="hidden" name="locale" value={locale} />
                    <button
                      type="submit"
                      name="status"
                      value="published"
                      disabled={row.status === "published"}
                      className="shrink-0 whitespace-nowrap rounded-lg border border-line px-2 py-1.5 text-[11.5px] font-semibold text-brand transition-colors hover:bg-cream disabled:cursor-default disabled:opacity-45"
                    >
                      Yayınla
                    </button>
                    <button
                      type="submit"
                      name="status"
                      value="archived"
                      disabled={row.status === "archived"}
                      className="shrink-0 whitespace-nowrap rounded-lg border border-line px-2 py-1.5 text-[11.5px] font-semibold text-muted transition-colors hover:bg-cream disabled:cursor-default disabled:opacity-45"
                    >
                      Arşivle
                    </button>
                    <button
                      type="submit"
                      name="status"
                      value="rejected"
                      disabled={row.status === "rejected"}
                      className="shrink-0 whitespace-nowrap rounded-lg border border-red-200 px-2 py-1.5 text-[11.5px] font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-default disabled:opacity-45"
                    >
                      Reddet
                    </button>
                    </form>
                  </div>
                ),
              },
            ] satisfies Column<AdminB2bDeal>[]}
          />
        )}
      </Card>
    </>
  );
}
