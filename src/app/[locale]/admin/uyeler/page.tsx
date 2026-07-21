import { AlertTriangle, Users } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAdminMembers, type AdminMember, type MemberKind } from "@/lib/admin-members";
import { cn } from "@/lib/utils";
import { PageHeader, Card, CardHeader, Metric } from "../_components";
import { DataTable, StatusBadge, EmptyState, type Column } from "@/components/common";
import type { BadgeTone } from "@/components/common/StatusBadge";

/* Üye (hesap) listesi. Panelin geri kalanı işletme düzeyinde çalıştığı için alıcı
   (buyer) üyeler hiçbir yerde görünmüyordu; burası hesap düzeyindeki tek görünüm.
   Ayrıca "tedarikçi hesabı var ama işletmesi yok" durumunu ilk bakışta gösterir. */

type Filter = MemberKind | "all";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "supplier", label: "Tedarikçi" },
  { value: "buyer", label: "Alıcı" },
];

const KIND: Record<MemberKind, { label: string; tone: BadgeTone }> = {
  supplier: { label: "Tedarikçi", tone: "blue" },
  buyer: { label: "Alıcı", tone: "violet" },
};

const STATUS_TONE: Record<string, BadgeTone> = {
  approved: "green",
  active: "green",
  pending: "amber",
  rejected: "red",
  suspended: "red",
  blacklisted: "solidRed",
  expired: "neutral",
  draft: "neutral",
};

const fmtDate = (value: string | null) =>
  value ? new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(value)) : "—";

function parseFilter(value: unknown): Filter {
  return value === "supplier" || value === "buyer" ? value : "all";
}

export default async function AdminMembersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(locale);

  const data = await getAdminMembers();
  const filter = parseFilter(query.tip);
  const rows = filter === "all" ? data.members : data.members.filter((m) => m.kind === filter);

  return (
    <>
      <PageHeader
        eyebrow="Üyeler"
        title="Üye Hesapları"
        description="Tedarikçi, alıcı hesaplarını tek listede görün. Alıcıların işletme kaydı olmaz; tedarikçide işletme eksikse kayıt yarım kalmış demektir."
      />

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <Metric title="Toplam Üye" value={data.counts.all} hint="tüm hesaplar" />
        <Metric title="Tedarikçi" value={data.counts.supplier} hint="listelenen firmalar" />
        <Metric title="Alıcı" value={data.counts.buyer} hint="yalnızca arayan firmalar" />
        <Metric title="İşletmesi Yok" value={data.missingBusiness} hint="tedarikçi, kayıt yarım" />
      </section>

      {data.missingBusiness > 0 && (
        <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
          <AlertTriangle size={17} aria-hidden className="mt-0.5 shrink-0" />
          <span>
            <b>{data.missingBusiness} tedarikçi hesabının işletme kaydı yok.</b> Kayıt akışı yarım kalmış
            olabilir; otomatik tamamlama her gece çalışır. Kendi admin hesabınız da bu sayıya dahil olabilir.
          </span>
        </div>
      )}

      {data.authUnavailable && (
        <div className="mb-6 rounded-xl border border-line bg-cream/60 px-4 py-3 text-[13px] text-muted">
          E-posta ve son giriş bilgisi okunamadı (service_role anahtarı yok). Diğer alanlar etkilenmedi.
        </div>
      )}

      <Card className="overflow-hidden hover:translate-y-0">
        <CardHeader
          title="Tüm Üyeler"
          tone="blue"
          icon={<Users size={18} aria-hidden />}
          action={<span className="shrink-0 text-[12px] font-semibold text-muted">{rows.length} üye</span>}
        />

        <div className="flex flex-wrap gap-2 border-b border-line px-5 py-3">
          {FILTERS.map((item) => (
            <Link
              key={item.value}
              href={{ pathname: "/admin/uyeler", query: item.value === "all" ? {} : { tip: item.value } }}
              className={cn(
                "inline-flex h-8 items-center rounded-[7px] border px-3 text-[12px] font-medium transition-colors",
                item.value === filter
                  ? "border-brand bg-brand text-white"
                  : "border-line bg-paper text-ink/75 hover:bg-cream/60",
              )}
            >
              {item.label}
              <span className={cn("ml-1.5", item.value === filter ? "text-white/75" : "text-muted")}>
                {data.counts[item.value]}
              </span>
            </Link>
          ))}
        </div>

        {rows.length === 0 ? (
          <EmptyState
            className="border-0"
            title="Bu filtrede üye yok"
            description="Farklı bir üye tipi seçin."
          />
        ) : (
          <DataTable
            data={rows}
            getRowKey={(m) => m.id}
            minWidth={900}
            columns={[
              {
                key: "member",
                header: "Üye",
                cell: (m) => (
                  <div className="max-w-[280px]">
                    <p className="truncate text-[13px] font-extrabold text-ink">{m.fullName || "—"}</p>
                    <p className="truncate text-[12px] font-semibold text-muted">{m.email || "—"}</p>
                  </div>
                ),
              },
              {
                key: "kind",
                header: "Tip",
                cell: (m) => (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <StatusBadge tone={KIND[m.kind].tone}>{KIND[m.kind].label}</StatusBadge>
                    {m.sector && <span className="text-[12px] font-semibold text-muted">{m.sector}</span>}
                  </div>
                ),
              },
              {
                key: "business",
                header: "İşletme",
                cell: (m) => <BusinessCell member={m} />,
              },
              {
                key: "quotes",
                header: "Talep",
                cell: (m) => (
                  <span className="text-[13px] font-bold text-ink/80">{m.quoteCount > 0 ? m.quoteCount : "—"}</span>
                ),
              },
              {
                key: "created",
                header: "Kayıt",
                cell: (m) => <span className="text-[13px] font-semibold text-muted">{fmtDate(m.createdAt)}</span>,
              },
              {
                key: "lastSignIn",
                header: "Son Giriş",
                cell: (m) => (
                  <span className="text-[13px] font-semibold text-muted">
                    {m.lastSignInAt ? fmtDate(m.lastSignInAt) : m.emailConfirmed ? "hiç girmedi" : "doğrulanmadı"}
                  </span>
                ),
              },
            ] satisfies Column<AdminMember>[]}
          />
        )}
      </Card>
    </>
  );
}

/* Tedarikçide işletme bağlantısı; alıcıda işletme beklenmez, tedarikçide yoksa uyarı. */
function BusinessCell({ member }: { member: AdminMember }) {
  if (member.business) {
    const tone = STATUS_TONE[member.business.status] ?? "neutral";
    return (
      <Link
        href={{ pathname: "/admin/tedarikciler/[id]", params: { id: String(member.business.id) } }}
        className="group inline-flex max-w-[240px] items-center gap-2"
      >
        <span className="truncate text-[13px] font-bold text-ink group-hover:underline">{member.business.name}</span>
        <StatusBadge tone={tone}>{member.business.status}</StatusBadge>
      </Link>
    );
  }
  if (member.kind === "supplier") {
    return <StatusBadge tone="amber">işletme yok</StatusBadge>;
  }
  return <span className="text-[13px] font-semibold text-muted">—</span>;
}
