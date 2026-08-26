import { Activity, LogIn, PencilLine, ShieldAlert } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { getAdminActivity, type ActivityActorKind, type RecordChangeItem, type SessionEventItem } from "@/lib/admin-activity";
import { PageHeader, Card, CardHeader } from "../_components";
import { AdminMetric } from "../_ui";
import { DataTable, StatusBadge, EmptyState, type Column } from "@/components/common";
import type { BadgeTone } from "@/components/common/StatusBadge";

/* İşletme hareketleri — giriş/çıkış ve veri değişiklikleri.
   Admin işlemleri burada değil, Güvenlik & Ayarlar > İşlem Kayıtları'nda (audit_logs). */

const fmt = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

const EVENT: Record<SessionEventItem["event"], { label: string; tone: BadgeTone }> = {
  login: { label: "Giriş", tone: "green" },
  logout: { label: "Çıkış", tone: "neutral" },
  login_failed: { label: "Başarısız giriş", tone: "red" },
  mfa_failed: { label: "2FA hatası", tone: "amber" },
};

const OP: Record<RecordChangeItem["op"], { label: string; tone: BadgeTone }> = {
  INSERT: { label: "Ekleme", tone: "green" },
  UPDATE: { label: "Güncelleme", tone: "blue" },
  DELETE: { label: "Silme", tone: "red" },
};

const ACTOR: Record<ActivityActorKind, { label: string; tone: BadgeTone }> = {
  owner: { label: "İşletme", tone: "blue" },
  admin: { label: "Admin", tone: "violet" },
  system: { label: "Sistem", tone: "neutral" },
};

/* DB tablo adlarının panel karşılıkları. */
const TABLE_LABEL: Record<string, string> = {
  businesses: "İşletme profili",
  business_contacts: "İletişim kişileri",
  business_services: "Hizmetler",
  business_memberships: "Üyelik / paket",
  business_partners: "Partnerlik",
  business_partner_requests: "Partnerlik talebi",
  profiles: "Hesap bilgileri",
  quotes: "Teklif talebi",
  quote_responses: "Teklif yanıtı",
};

/* Kolon adlarının panel karşılıkları — teknik ad kullanıcıya gösterilmez. */
const FIELD_LABEL: Record<string, string> = {
  name: "ad",
  description: "açıklama",
  phone: "telefon",
  website: "web sitesi",
  images: "galeri",
  image: "kapak görseli",
  status: "durum",
  city: "şehir",
  district: "ilçe",
  country: "ülke",
  address: "adres",
  type: "tür",
  attributes: "özellikler",
  seo_title: "SEO başlık",
  seo_description: "SEO açıklama",
  verified: "doğrulama",
  sponsored: "öne çıkarma",
  owner_id: "sahiplik",
  full_name: "ad soyad",
  role: "rol",
  plan: "paket",
  ends_at: "bitiş tarihi",
};

const fieldsText = (fields: string[]) => {
  if (fields.length === 0) return "—";
  const shown = fields.slice(0, 4).map((f) => FIELD_LABEL[f] ?? f);
  return fields.length > 4 ? `${shown.join(", ")} +${fields.length - 4}` : shown.join(", ");
};

export default async function AdminActivityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const data = await getAdminActivity();

  return (
    <>
      <PageHeader
        eyebrow="Hareketler"
        title="İşletme Hareketleri"
        description="Üyelerin giriş/çıkışları ve panelde yaptıkları veri değişiklikleri. Kayıtlar silinemez."
      />

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <AdminMetric icon={<LogIn size={18} aria-hidden />} label="Bugün giriş yapan" value={data.activeToday} hint="son 24 saatte farklı üye" tone="emerald" />
        <AdminMetric icon={<ShieldAlert size={18} aria-hidden />} label="Başarısız giriş" value={data.failedWeek} hint="son 7 gün" tone={data.failedWeek > 0 ? "amber" : "neutral"} />
        <AdminMetric icon={<Activity size={18} aria-hidden />} label="Değişiklik" value={data.changes.length} hint="son kayıtlar listeleniyor" tone="blue" />
      </section>

      <Card className="mb-6 overflow-hidden hover:translate-y-0">
        <CardHeader
          title="Giriş / Çıkış"
          tone="blue"
          icon={<LogIn size={18} aria-hidden />}
          action={<span className="shrink-0 text-[12px] font-semibold text-muted">son {data.sessions.length} kayıt</span>}
        />
        {data.sessions.length === 0 ? (
          <EmptyState
            className="border-0"
            title="Henüz oturum kaydı yok"
            description="Üye girişleri, çıkışları ve başarısız giriş denemeleri burada listelenir."
          />
        ) : (
          <DataTable
            data={data.sessions}
            getRowKey={(s) => s.id}
            minWidth={820}
            columns={[
              {
                key: "event",
                header: "Olay",
                cell: (s) => <StatusBadge tone={EVENT[s.event].tone}>{EVENT[s.event].label}</StatusBadge>,
              },
              {
                key: "member",
                header: "Üye",
                cell: (s) => (
                  <div className="min-w-0">
                    <div className="truncate font-bold text-ink">{s.userName || s.email || "—"}</div>
                    {s.userName && s.email && <div className="truncate text-[12px] text-muted">{s.email}</div>}
                  </div>
                ),
              },
              { key: "business", header: "İşletme", cell: (s) => <span className="text-muted">{s.businessName ?? "—"}</span> },
              { key: "ip", header: "IP", cell: (s) => <span className="text-muted">{s.ipAddress ?? "—"}</span> },
              { key: "date", header: "Tarih", cell: (s) => <span className="text-muted">{fmt(s.createdAt)}</span> },
            ] satisfies Column<SessionEventItem>[]}
          />
        )}
      </Card>

      <Card className="overflow-hidden hover:translate-y-0">
        <CardHeader
          title="Veri Değişiklikleri"
          tone="blue"
          icon={<PencilLine size={18} aria-hidden />}
          action={<span className="shrink-0 text-[12px] font-semibold text-muted">silinemez</span>}
        />
        {data.changes.length === 0 ? (
          <EmptyState
            className="border-0"
            title="Henüz değişiklik kaydı yok"
            description="İşletmelerin panelden yaptığı her düzenleme (profil, iletişim, hizmet, teklif…) burada tutulur."
          />
        ) : (
          <DataTable
            data={data.changes}
            getRowKey={(c) => c.id}
            minWidth={980}
            columns={[
              { key: "op", header: "İşlem", cell: (c) => <StatusBadge tone={OP[c.op].tone}>{OP[c.op].label}</StatusBadge> },
              {
                key: "what",
                header: "Nerede",
                cell: (c) => (
                  <div className="min-w-0">
                    <div className="truncate font-bold text-ink">{TABLE_LABEL[c.tableName] ?? c.tableName}</div>
                    <div className="truncate text-[12px] text-muted">#{c.recordId}</div>
                  </div>
                ),
              },
              { key: "fields", header: "Değişen alanlar", cell: (c) => <span className="text-muted">{fieldsText(c.changedFields)}</span> },
              { key: "business", header: "İşletme", cell: (c) => <span className="text-muted">{c.businessName ?? "—"}</span> },
              {
                key: "actor",
                header: "Kim",
                cell: (c) => (
                  <div className="flex min-w-0 items-center gap-2">
                    <StatusBadge tone={ACTOR[c.actorKind].tone}>{ACTOR[c.actorKind].label}</StatusBadge>
                    <span className="truncate text-muted">{c.actorName || "—"}</span>
                  </div>
                ),
              },
              { key: "date", header: "Tarih", cell: (c) => <span className="text-muted">{fmt(c.createdAt)}</span> },
            ] satisfies Column<RecordChangeItem>[]}
          />
        )}
      </Card>
    </>
  );
}
