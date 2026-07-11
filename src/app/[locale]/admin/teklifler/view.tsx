import { Eye, FilePenLine, ShieldAlert, Trash2 } from "lucide-react";
import { updateQuoteStatus } from "@/lib/actions/admin";
import { PageHeader, Card, CardHeader } from "../_components";
import { AdminMetric } from "../_ui";
import { DataTable, type Column } from "@/components/common";
import type { AdminData, AdminQuote } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  data: AdminData;
  locale: string;
}

const AdminQuotesView = ({ data, locale }: Props) => {
  const requests = data.quotes;
  const active = requests.filter((quote) => quote.status !== "lost" && quote.status !== "archived");
  const flagged = requests.filter((quote) => hasExternalContact(quote.message));
  const totalViews = requests.reduce((sum, quote) => sum + requestViews(data, quote), 0);

  return (
    <>
      <PageHeader
        eyebrow="Talepler"
        title="B2B İlan Denetimi"
        description="İşletmeler tarafından oluşturulan talepleri izleyin, görüntülenme metriklerini kontrol edin ve uygunsuz ilanları yayından kaldırın."
      />

      <section className="mb-6 grid gap-3 md:grid-cols-4">
        <AdminMetric label="Toplam Talep" value={requests.length} />
        <AdminMetric label="Aktif" value={active.length} tone="emerald" />
        <AdminMetric label="Görüntülenme" value={totalViews.toLocaleString("tr-TR")} />
        <AdminMetric label="Riskli İçerik" value={flagged.length} tone="amber" />
      </section>

      <Card className="overflow-hidden hover:translate-y-0">
        <CardHeader
          title="Talepler"
          tone="blue"
          icon={<FilePenLine size={18} aria-hidden />}
          action={<span className="shrink-0 text-[12px] font-semibold text-muted">{requests.length} talep</span>}
        />
        <DataTable
          data={requests}
          getRowKey={(q) => q.id}
          empty="Henüz denetlenecek talep yok."
          minWidth={980}
          columns={[
            {
              key: "req",
              header: "Talep / İlan",
              cell: (quote) => (
                <div className="max-w-[280px]">
                  <p className="text-[13px] font-extrabold leading-5 text-ink">{quote.service || quote.name}</p>
                  <p className="mt-1 line-clamp-2 text-[12px] font-medium leading-5 text-muted">{quote.message || "Açıklama girilmemiş."}</p>
                </div>
              ),
            },
            {
              key: "creator",
              header: "Oluşturan",
              cell: (quote) => (
                <div>
                  <p className="text-[13px] font-bold text-ink">{quote.company || quote.name}</p>
                  <p className="mt-1 text-[12px] font-semibold text-muted">{quote.email}</p>
                </div>
              ),
            },
            {
              key: "date",
              header: "Tarih / Kapasite",
              cell: (quote) => (
                <div className="text-[13px] font-semibold leading-5 text-ink">
                  {quote.dateRange || "Tarih yok"}
                  <span className="mt-1 block text-[12px] text-muted">{quote.people ? `${quote.people} kişi` : "Kapasite yok"}</span>
                  {quote.validUntil && <span className="mt-1 block text-[12px] font-bold text-amber-700">Son teklif: {formatDateOnly(quote.validUntil)}</span>}
                </div>
              ),
            },
            {
              key: "views",
              header: "Görüntülenme",
              align: "right",
              cell: (quote) => <span className="font-extrabold text-ink">{requestViews(data, quote).toLocaleString("tr-TR")}</span>,
            },
            { key: "status", header: "Durum", cell: (quote) => <StatusPill value={quote.status} /> },
            {
              key: "check",
              header: "İçerik Kontrolü",
              cell: (quote) =>
                hasExternalContact(quote.message) ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-extrabold text-amber-800">
                    <ShieldAlert size={13} aria-hidden /> Harici iletişim riski
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700">
                    <Eye size={13} aria-hidden /> Temiz
                  </span>
                ),
            },
            {
              key: "action",
              header: "İşlem",
              align: "right",
              cell: (quote) => (
                <div className="flex justify-end gap-2">
                  <form action={updateQuoteStatus}>
                    <input type="hidden" name="id" value={quote.id} />
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="status" value="contacted" />
                    <input type="hidden" name="internalNote" value={quote.internalNote ?? "Admin tarafından incelendi."} />
                    <button type="submit" className="grid h-8 w-8 place-items-center rounded-[7px] border border-line text-brand hover:bg-cream/70" aria-label="İncelendi olarak işaretle">
                      <FilePenLine size={15} aria-hidden />
                    </button>
                  </form>
                  <form action={updateQuoteStatus}>
                    <input type="hidden" name="id" value={quote.id} />
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="status" value="lost" />
                    <input type="hidden" name="internalNote" value="Yayından kaldırıldı." />
                    <button type="submit" className="grid h-8 w-8 place-items-center rounded-[7px] border border-red-200 text-red-600 hover:bg-red-50" aria-label="Yayından kaldır">
                      <Trash2 size={15} aria-hidden />
                    </button>
                  </form>
                </div>
              ),
            },
          ] satisfies Column<AdminQuote>[]}
        />
      </Card>
    </>
  );
};

const StatusPill = ({ value }: { value: string }) => {
  const archived = value === "lost" || value === "archived";
  const active = value === "new" || value === "contacted";
  const label = archived ? "Yayından Kalktı" : active ? "Aktif" : value === "won" ? "Tamamlandı" : value;
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-extrabold", archived ? "bg-red-100 text-red-700" : active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700")}>
      {label}
    </span>
  );
};

const hasExternalContact = (value: string | null) => {
  if (!value) return false;
  return /@|(?:\+?\d[\d\s()-]{7,})|whatsapp|telegram|instagram/i.test(value);
};

const formatDateOnly = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(`${value}T12:00:00`));

const requestViews = (data: AdminData, quote: AdminQuote) => {
  return data.pageViews.filter((view) => view.entityType === "quote" && view.entityId === quote.id).length;
};

export default AdminQuotesView;
