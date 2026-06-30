import { KeyRound, ScrollText, ShieldCheck, UserCog } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { getAdminData } from "@/lib/admin";
import { PageHeader, Card, CardHeader } from "../_components";
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
        <InfoCard icon={<ShieldCheck size={18} aria-hidden />} title="Audit Log" text={`${data.auditLogs.length} son işlem listeleniyor`} />
        <InfoCard icon={<KeyRound size={18} aria-hidden />} title="2FA" text="Admin hesapları için iki faktörlü doğrulama (yakında)" />
        <InfoCard icon={<UserCog size={18} aria-hidden />} title="Yetkiler" text="Admin/personel rol yönetimi (yakında)" />
      </section>

      <Card className="overflow-hidden hover:translate-y-0">
        <CardHeader title="İşlem Kayıtları" tone="blue" icon={<ScrollText size={18} aria-hidden />} action={<span className="shrink-0 text-[12px] font-semibold text-[#566178]">silinemez</span>} />
        {data.auditLogs.length === 0 ? (
          <EmptyState className="border-0" title="Henüz audit log kaydı yok" description="Admin işlemleri (onay, kara liste, güncelleme…) burada silinemez olarak kaydedilir." />
        ) : (
          <DataTable
            data={data.auditLogs}
            getRowKey={(l) => l.id}
            minWidth={720}
            columns={[
              { key: "action", header: "Aksiyon", cell: (l) => <span className="font-bold text-[#162238]">{l.action}</span> },
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

const InfoCard = ({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) => (
  <Card className="hover:translate-y-0">
    <div className="p-5">
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-[8px] bg-[#EEF4FF] text-[#0057D9]">{icon}</div>
      <h3 className="text-[16px] font-extrabold text-[#162238]">{title}</h3>
      <p className="mt-1.5 text-[13px] font-medium leading-5 text-[#64748B]">{text}</p>
    </div>
  </Card>
);
