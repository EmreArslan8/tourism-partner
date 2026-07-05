import { ClipboardList, Eye } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { getAdminB2bRequests, type AdminB2bRequest } from "@/lib/platform-data";
import { moderateB2bRequest } from "@/lib/actions/platform";
import { PageHeader, Card, CardHeader, Metric } from "../_components";
import { DataTable, StatusBadge, EmptyState, type Column } from "@/components/common";
import type { BadgeTone } from "@/components/common/StatusBadge";

const TONE: Record<AdminB2bRequest["status"], BadgeTone> = {
  pending: "amber",
  published: "green",
  archived: "neutral",
  rejected: "red",
};
const LABEL: Record<AdminB2bRequest["status"], string> = {
  pending: "Bekliyor",
  published: "Yayında",
  archived: "Arşiv",
  rejected: "Reddedildi",
};

const fmt = (v: string) => new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(v));

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const requests = await getAdminB2bRequests();
  const count = (s: AdminB2bRequest["status"]) => requests.filter((r) => r.status === s).length;
  const totalViews = requests.reduce((sum, r) => sum + r.viewCount, 0);

  return (
    <>
      <PageHeader
        eyebrow="Talepler"
        title="B2B İlan Denetimi"
        description="İşletmelerin açtığı talep/ilanları izleyin; hatalı veya platform dışına yönlendiren içerikleri yayından kaldırın."
      />

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <Metric title="Yayında" value={count("published")} hint="aktif ilan" />
        <Metric title="Onay Bekleyen" value={count("pending")} hint="incelenmedi" />
        <Metric title="Toplam Görüntülenme" value={totalViews} hint="tüm talepler" />
      </section>

      <Card className="overflow-hidden hover:translate-y-0">
        <CardHeader
          title="Tüm Talepler"
          tone="blue"
          icon={<ClipboardList size={18} aria-hidden />}
          action={<span className="shrink-0 text-[12px] font-semibold text-[#475569]">{requests.length} talep</span>}
        />
        {requests.length === 0 ? (
          <EmptyState
            className="border-0"
            title="Henüz talep yok"
            description="Acenteler bölgeleri için talep/ilan oluşturduğunda burada listelenir ve moderasyon yapılır."
          />
        ) : (
          <DataTable
            data={requests}
            getRowKey={(r) => r.id}
            minWidth={860}
            columns={[
              {
                key: "title",
                header: "Talep",
                cell: (r) => (
                  <div className="max-w-[340px]">
                    <p className="text-[13px] font-extrabold text-[#162238]">{r.title}</p>
                    {r.businessName && <p className="truncate text-[12px] font-semibold text-[#475569]">{r.businessName}</p>}
                    {r.description && <p className="mt-0.5 line-clamp-1 text-[12px] text-[#475569]">{r.description}</p>}
                  </div>
                ),
              },
              { key: "region", header: "Bölge", cell: (r) => <span className="text-[13px] font-semibold text-[#3D4B64]">{r.region ?? "—"}</span> },
              {
                key: "views",
                header: "Görüntülenme",
                cell: (r) => (
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#162238]">
                    <Eye size={14} aria-hidden className="text-[#64748B]" />
                    {r.viewCount.toLocaleString("tr-TR")}
                  </span>
                ),
              },
              { key: "status", header: "Durum", cell: (r) => <StatusBadge tone={TONE[r.status]}>{LABEL[r.status]}</StatusBadge> },
              { key: "date", header: "Tarih", cell: (r) => <span className="text-[#475569]">{fmt(r.createdAt)}</span> },
              {
                key: "action",
                header: "İşlem",
                align: "right",
                cell: (r) => (
                  <div className="flex justify-end gap-1.5">
                    {r.status !== "published" && <ModBtn id={r.id} locale={locale} status="published" label="Yayınla" tone="green" />}
                    {r.status !== "archived" && <ModBtn id={r.id} locale={locale} status="archived" label="Arşivle" />}
                    {r.status !== "rejected" && <ModBtn id={r.id} locale={locale} status="rejected" label="Reddet" tone="red" />}
                  </div>
                ),
              },
            ] satisfies Column<AdminB2bRequest>[]}
          />
        )}
      </Card>
    </>
  );
}

const ModBtn = ({
  id,
  locale,
  status,
  label,
  tone = "neutral",
}: {
  id: number;
  locale: string;
  status: "published" | "archived" | "rejected";
  label: string;
  tone?: "green" | "red" | "neutral";
}) => (
  <form action={moderateB2bRequest}>
    <input type="hidden" name="id" value={id} />
    <input type="hidden" name="locale" value={locale} />
    <input type="hidden" name="status" value={status} />
    <button
      type="submit"
      className={
        "rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition-colors " +
        (tone === "green"
          ? "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          : tone === "red"
            ? "border-red-300 text-red-700 hover:bg-red-50"
            : "border-[#D4DCEA] text-[#475569] hover:bg-cream")
      }
    >
      {label}
    </button>
  </form>
);
