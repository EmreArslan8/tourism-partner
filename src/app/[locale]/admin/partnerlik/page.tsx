import { ArrowRight, Handshake, Network, ShieldAlert } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { moderatePartnerRequest } from "@/lib/actions/admin";
import { getAdminPartnerRequests, type AdminPartnerRequest } from "@/lib/admin-partner-requests";
import { ConfirmAction, DataTable, EmptyState, StatusBadge, type Column } from "@/components/common";
import type { BadgeTone } from "@/components/common/StatusBadge";
import { Card, CardHeader, PageHeader } from "../_components";
import { AdminMetric, adminUi } from "../_ui";

const STATUS_LABEL: Record<AdminPartnerRequest["status"], string> = {
  pending: "Bekliyor",
  accepted: "Kabul edildi",
  rejected: "Reddedildi",
};

const STATUS_TONE: Record<AdminPartnerRequest["status"], BadgeTone> = {
  pending: "amber",
  accepted: "green",
  rejected: "red",
};

const fmt = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);

  const requests = await getAdminPartnerRequests();
  const status = query.status === "pending" || query.status === "accepted" || query.status === "rejected"
    ? query.status
    : "";
  const search = String(query.q ?? "").trim();
  const normalizedSearch = search.toLocaleLowerCase("tr-TR");
  const filtered = requests.filter((request) => {
    const matchesStatus = !status || request.status === status;
    const matchesSearch = !normalizedSearch || [
      request.requester.name,
      request.requester.type,
      request.requester.city,
      request.receiver.name,
      request.receiver.type,
      request.receiver.city,
    ].some((value) => value.toLocaleLowerCase("tr-TR").includes(normalizedSearch));
    return matchesStatus && matchesSearch;
  });

  const count = (value: AdminPartnerRequest["status"]) => requests.filter((request) => request.status === value).length;

  return (
    <>
      <PageHeader
        title="Partnerlik Ağı"
        description="İşletmeler arasındaki bağlantı isteklerini izleyin. Müdahale işlemleri onay ister ve güvenlik kaydına yazılır."
      />

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminMetric icon={<Network size={19} aria-hidden />} label="Toplam Kayıt" value={requests.length} hint="tüm partnerlik hareketleri" />
        <AdminMetric icon={<ShieldAlert size={19} aria-hidden />} label="Bekleyen" value={count("pending")} hint="firma yanıtı bekliyor" tone="amber" />
        <AdminMetric icon={<Handshake size={19} aria-hidden />} label="Aktif Bağlantı" value={count("accepted")} hint="profillerde görünür" tone="emerald" />
        <AdminMetric label="Reddedilen" value={count("rejected")} hint="geçmiş kayıt" tone="neutral" />
      </section>

      <Card className="overflow-hidden hover:translate-y-0">
        <CardHeader
          title="Bağlantı Hareketleri"
          tone="blue"
          icon={<Handshake size={18} aria-hidden />}
          action={<span className="shrink-0 text-[12px] font-semibold text-muted">{filtered.length} kayıt</span>}
        />

        <form method="get" className="grid gap-3 border-b border-line/80 bg-cream/30 p-4 md:grid-cols-[minmax(220px,1fr)_220px_auto]">
          <input
            name="q"
            defaultValue={search}
            placeholder="Firma, tür veya şehir ara…"
            className={adminUi.input}
          />
          <select name="status" defaultValue={status} className={adminUi.input}>
            <option value="">Tüm durumlar</option>
            <option value="pending">Bekleyen</option>
            <option value="accepted">Kabul edilen</option>
            <option value="rejected">Reddedilen</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" className={adminUi.sapphireButton}>Filtrele</button>
            {(search || status) && <Link href="/admin/partnerlik" className={adminUi.secondaryButton}>Temizle</Link>}
          </div>
        </form>

        {filtered.length === 0 ? (
          <EmptyState
            className="border-0"
            title={requests.length === 0 ? "Henüz partnerlik hareketi yok" : "Eşleşen kayıt bulunamadı"}
            description={requests.length === 0
              ? "İşletmeler bağlantı isteği gönderdiğinde hareketler burada izlenir."
              : "Arama metnini veya durum filtresini değiştirin."}
          />
        ) : (
          <DataTable
            data={filtered}
            getRowKey={(request) => request.id}
            minWidth={1120}
            columns={[
              {
                key: "requester",
                header: "İstek Gönderen",
                cell: (request) => <BusinessCell business={request.requester} />,
              },
              {
                key: "direction",
                header: "",
                align: "center",
                className: "w-10",
                cell: () => <ArrowRight size={16} aria-label="şu firmaya" className="mx-auto text-muted" />,
              },
              {
                key: "receiver",
                header: "İsteği Alan",
                cell: (request) => <BusinessCell business={request.receiver} />,
              },
              {
                key: "status",
                header: "Durum",
                cell: (request) => <StatusBadge tone={STATUS_TONE[request.status]}>{STATUS_LABEL[request.status]}</StatusBadge>,
              },
              {
                key: "date",
                header: "Oluşturulma",
                cell: (request) => <span className="whitespace-nowrap text-[12px] text-muted">{fmt(request.createdAt)}</span>,
              },
              {
                key: "action",
                header: "Müdahale",
                align: "right",
                cell: (request) => <ModerationActions request={request} />,
              },
            ] satisfies Column<AdminPartnerRequest>[]}
          />
        )}
      </Card>
    </>
  );
}

function BusinessCell({ business }: { business: AdminPartnerRequest["requester"] }) {
  return (
    <div className="max-w-[260px]">
      <Link
        href={{ pathname: "/admin/tedarikciler/[id]", params: { id: String(business.id) } }}
        className="font-semibold text-ink hover:text-brand hover:underline"
      >
        {business.name}
      </Link>
      <p className="mt-0.5 truncate text-[12px] text-muted">{[business.type, business.city].filter(Boolean).join(" · ")}</p>
    </div>
  );
}

function ModerationActions({ request }: { request: AdminPartnerRequest }) {
  const triggerClass = "rounded-[7px] border px-2.5 py-1.5 text-[11.5px] font-semibold transition-colors";
  const fields = (operation: string) => ({ id: String(request.id), operation });

  if (request.status === "pending") {
    return (
      <div className="flex min-w-[250px] flex-wrap justify-end gap-1.5">
        <ConfirmAction
          action={moderatePartnerRequest}
          fields={fields("approve")}
          title="Partnerliği admin olarak onayla"
          description={`${request.requester.name} ile ${request.receiver.name} arasındaki bağlantı iki firmanın profilinde görünür olur. Bu işlem audit log’a yazılır.`}
          confirmLabel="Admin olarak onayla"
          trigger={<button type="button" className={`${triggerClass} border-emerald-300 text-emerald-700 hover:bg-emerald-50`}>Onayla</button>}
        />
        <ConfirmAction
          action={moderatePartnerRequest}
          fields={fields("reject")}
          title="Partnerlik isteğini reddet"
          description="İstek reddedilmiş olarak saklanır ve firmalar aynı eşleşme için yeniden istek gönderemez."
          confirmLabel="Reddet"
          danger
          trigger={<button type="button" className={`${triggerClass} border-red-300 text-red-700 hover:bg-red-50`}>Reddet</button>}
        />
        <ConfirmAction
          action={moderatePartnerRequest}
          fields={fields("cancel")}
          title="Partnerlik isteğini iptal et"
          description="Bekleyen istek silinir. Firmalar daha sonra yeniden bağlantı isteği gönderebilir."
          confirmLabel="İsteği iptal et"
          danger
          trigger={<button type="button" className={`${triggerClass} border-line text-muted hover:bg-cream`}>İptal et</button>}
        />
      </div>
    );
  }

  if (request.status === "accepted") {
    return (
      <ConfirmAction
        action={moderatePartnerRequest}
        fields={fields("remove")}
        title="Aktif partnerliği kaldır"
        description={`${request.requester.name} ile ${request.receiver.name} artık birbirinin profilinde iş ortağı olarak görünmeyecek.`}
        confirmLabel="Bağlantıyı kaldır"
        danger
        trigger={<button type="button" className={`${triggerClass} border-red-300 text-red-700 hover:bg-red-50`}>Bağlantıyı kaldır</button>}
      />
    );
  }

  return (
    <ConfirmAction
      action={moderatePartnerRequest}
      fields={fields("reset")}
      title="İsteği yeniden beklemeye al"
      description="Reddedilmiş istek tekrar gelen istek olarak firmaya gösterilir ve firma yeniden karar verebilir."
      confirmLabel="Beklemeye al"
      trigger={<button type="button" className={`${triggerClass} border-sapphire/40 text-brand hover:bg-cream`}>Yeniden aç</button>}
    />
  );
}
