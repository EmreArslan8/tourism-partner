import { KeyRound, ScrollText, ShieldCheck, UserCog } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { getAdminData } from "@/lib/admin";
import { PageHeader, Card, CardHeader } from "../_components";
import { AdminMetric } from "../_ui";
import { DataTable, EmptyState, type Column } from "@/components/common";
import type { AdminAuditLog } from "@/lib/types";

const fmt = (v: string) => new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(v));

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = await getAdminData();

  return (
    <>
      <PageHeader
        eyebrow="Güvenlik"
        title="Sistem Güvenliği ve Ayarlar"
        description="Admin işlemleri, erişim güvenliği ve genel hesap ayarlarını takip edin."
      />

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <AdminMetric icon={<ShieldCheck size={18} aria-hidden />} label="Audit Log" value={data.auditLogs.length} hint="son işlem listeleniyor" />
        <AdminMetric icon={<KeyRound size={18} aria-hidden />} label="2FA" value="Yakında" hint="Admin hesapları için iki faktörlü doğrulama" tone="neutral" />
        <AdminMetric icon={<UserCog size={18} aria-hidden />} label="Yetkiler" value="Yakında" hint="Admin/personel rol yönetimi" tone="neutral" />
      </section>

      <Card className="overflow-hidden hover:translate-y-0">
        <CardHeader title="İşlem Kayıtları" tone="blue" icon={<ScrollText size={18} aria-hidden />} action={<span className="shrink-0 text-[12px] font-semibold text-muted">silinemez</span>} />
        {data.auditLogs.length === 0 ? (
          <EmptyState className="border-0" title="Henüz audit log kaydı yok" description="Admin işlemleri (onay, kara liste, güncelleme…) burada silinemez olarak kaydedilir." />
        ) : (
          <DataTable
            data={data.auditLogs}
            getRowKey={(l) => l.id}
            minWidth={720}
            columns={[
              { key: "action", header: "Aksiyon", cell: (l) => <span className="font-bold text-ink">{l.action}</span> },
              { key: "entity", header: "Varlık", cell: (l) => <span className="text-muted">{l.entityType ?? "-"}</span> },
              { key: "id", header: "ID", cell: (l) => <span className="text-muted">{l.entityId ?? "-"}</span> },
              { key: "ip", header: "IP", cell: (l) => <span className="text-muted">{l.ipAddress ?? "-"}</span> },
              { key: "date", header: "Tarih", cell: (l) => <span className="text-muted">{fmt(l.createdAt)}</span> },
            ] satisfies Column<AdminAuditLog>[]}
          />
        )}
      </Card>
    </>
  );
}
