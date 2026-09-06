import { BellDot, ClipboardList, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { AdminOffer } from "@/lib/platform-data";
import { PageHeader, Card, CardHeader } from "../_components";
import { AdminMetric } from "../_ui";
import { DataTable, EmptyState, type Column } from "@/components/common";

interface Props {
  offers: AdminOffer[];
}

const MAIL_LABEL: Record<string, string> = {
  pending: "Gönderim bekliyor",
  sent: "İletildi",
  sent_fallback: "Yedek kanaldan iletildi",
  failed: "Gönderilemedi",
};

const fmt = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

/* Tedarikçilerin verdiği teklifler. Alıcının girdiği kayıtlar TALEP'tir ve
   /admin/talepler'de listelenir — burada yalnızca yanıtlar görünür. */
const AdminOffersView = ({ offers }: Props) => {
  const fromForm = offers.filter((offer) => offer.source === "quote");
  const fromB2b = offers.filter((offer) => offer.source === "b2b");
  const failed = fromForm.filter((offer) => offer.emailStatus === "failed").length;

  return (
    <>
      <PageHeader
        eyebrow="Teklifler"
        title="Tedarikçi Teklifleri"
        description="Tedarikçilerin gelen taleplere verdiği yanıtlar. Alıcıların girdiği talepler Talepler ekranındadır."
      />

      <section className="mb-6 grid gap-3 md:grid-cols-4">
        <AdminMetric label="Toplam Teklif" value={offers.length} />
        <AdminMetric label="Form Talebine" value={fromForm.length} tone="emerald" />
        <AdminMetric label="B2B İlana" value={fromB2b.length} />
        <AdminMetric label="E-posta Hatası" value={failed} tone="amber" />
      </section>

      <Card className="overflow-hidden hover:translate-y-0">
        <CardHeader
          title="Tüm Teklifler"
          tone="blue"
          icon={<BellDot size={18} aria-hidden />}
          action={<span className="shrink-0 text-[12px] font-semibold text-muted">{offers.length} teklif</span>}
        />
        {offers.length === 0 ? (
          <EmptyState
            className="border-0"
            title="Henüz teklif yok"
            description="Tedarikçiler gelen taleplere yanıt verdiğinde teklifler burada listelenir."
          />
        ) : (
          <DataTable
            data={offers}
            getRowKey={(offer) => `${offer.source}-${offer.id}`}
            minWidth={1000}
            columns={[
              {
                key: "business",
                header: "Teklifi Veren",
                cell: (offer) =>
                  offer.business ? (
                    <Link
                      href={{ pathname: "/admin/tedarikciler/[id]", params: { id: String(offer.business.id) } }}
                      className="text-[13px] font-extrabold text-ink transition-colors hover:text-sapphire"
                    >
                      {offer.business.name}
                    </Link>
                  ) : (
                    <span className="text-[13px] font-bold text-muted">İşletme kaydı yok</span>
                  ),
              },
              {
                key: "request",
                header: "Hangi Talebe",
                cell: (offer) => (
                  <div className="max-w-[260px]">
                    <Link
                      href={
                        offer.source === "b2b"
                          ? { pathname: "/admin/talepler/[id]", params: { id: String(offer.requestId) } }
                          : { pathname: "/admin/talepler/form/[id]", params: { id: String(offer.requestId) } }
                      }
                      className="truncate text-[13px] font-semibold text-ink transition-colors hover:text-sapphire"
                    >
                      {offer.requestLabel}
                    </Link>
                    <span className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-extrabold text-muted">
                      {offer.source === "b2b" ? (
                        <>
                          <ClipboardList size={11} aria-hidden /> B2B ilan
                        </>
                      ) : (
                        <>
                          <Mail size={11} aria-hidden /> Form talebi
                        </>
                      )}
                    </span>
                  </div>
                ),
              },
              {
                key: "message",
                header: "Teklif",
                cell: (offer) => (
                  <p className="line-clamp-2 max-w-[320px] text-[12px] font-medium leading-5 text-muted">
                    {offer.message}
                  </p>
                ),
              },
              {
                key: "price",
                header: "Fiyat",
                cell: (offer) =>
                  offer.price ? (
                    <span className="rounded-[8px] border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[12px] font-bold text-emerald-700">
                      {offer.price}
                    </span>
                  ) : (
                    <span className="text-[12px] text-muted">—</span>
                  ),
              },
              {
                key: "delivery",
                header: "İletim",
                cell: (offer) =>
                  offer.emailStatus ? (
                    <span
                      className={
                        "inline-flex rounded-full px-2.5 py-1 text-[11px] font-extrabold " +
                        (offer.emailStatus === "failed"
                          ? "bg-red-100 text-red-700"
                          : offer.emailStatus === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-700")
                      }
                    >
                      {MAIL_LABEL[offer.emailStatus] ?? offer.emailStatus}
                    </span>
                  ) : (
                    <span className="text-[12px] text-muted">Panelde görünür</span>
                  ),
              },
              {
                key: "date",
                header: "Tarih",
                align: "right",
                cell: (offer) => <span className="text-muted">{fmt(offer.createdAt)}</span>,
              },
            ] satisfies Column<AdminOffer>[]}
          />
        )}
      </Card>
    </>
  );
};

export default AdminOffersView;
