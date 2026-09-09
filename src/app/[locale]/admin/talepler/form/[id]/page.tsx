import { REQUEST_STATUS, SUPPLIER_STATUS, supplierStatusLabel, type RequestStatus } from "@/lib/quote-workflow";
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  ShieldAlert,
  Tag,
  Users,
} from "lucide-react";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { groupLabel, serviceLabel } from "@/lib/categories";
import { updateQuoteRequestReview, updateQuoteStatus } from "@/lib/actions/admin";
import { getAdminQuoteDetail } from "@/lib/platform-data";
import type { GroupKey } from "@/lib/types";
import { StatusBadge } from "@/components/common";
import { Card, CardHeader, Metric, PageHeader } from "../../../_components";
import { adminUi } from "../../../_ui";

const MAIL_LABEL: Record<string, string> = {
  pending: "Gönderim bekliyor",
  sent: "İletildi",
  sent_fallback: "Yedek kanaldan iletildi",
  failed: "Gönderilemedi",
};

const fmt = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "long", timeStyle: "short" }).format(new Date(value));

const fmtDateOnly = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(new Date(`${value}T12:00:00`));

/* Platform dışına yönlendirme riski: teklifler admin listesindeki ile aynı kural. */
const hasExternalContact = (value: string | null) =>
  !!value && /@|(?:\+?\d[\d\s()-]{7,})|whatsapp|telegram|instagram/i.test(value);

export default async function AdminQuoteDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const quote = await getAdminQuoteDetail(Number(id));
  if (!quote) notFound();

  const status = quote.reviewStatus;
  const flagged = hasExternalContact(quote.message);

  return (
    <div className="mx-auto w-full max-w-[1320px]">
      <PageHeader
        title={`Form Talebi #${quote.id}`}
        description="Talebin genel incelemesini yönetin; tüm hedef tedarikçilerin süreçlerini ve tekliflerini ayrı takip edin."
        action={
          <Link href="/admin/talepler" className={adminUi.secondaryButton}>
            <ArrowLeft size={16} aria-hidden />
            Taleplere dön
          </Link>
        }
      />

      <section className="mb-5 grid grid-flow-col auto-cols-[minmax(165px,1fr)] gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid-flow-row md:grid-cols-4 md:overflow-visible md:pb-0">
        <Metric title="Yönetim durumu" value={REQUEST_STATUS[status].label} hint="tüm gönderim için admin incelemesi" />
        <Metric title="Gelen Teklif" value={quote.responses.length} hint="tedarikçi yanıtı" />
        <Metric title="Kişi" value={quote.people ?? "—"} hint={quote.dateRange ?? "tarih belirtilmemiş"} />
        <Metric title="Talep No" value={`#${quote.id}`} hint={fmt(quote.createdAt)} />
      </section>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="grid gap-5">
          <Card className="hover:translate-y-0">
            <CardHeader
              title="Talep içeriği"
              tone="blue"
              icon={<MessageSquareText size={18} aria-hidden />}
              action={<StatusBadge tone={REQUEST_STATUS[status].tone}>{REQUEST_STATUS[status].label}</StatusBadge>}
            />
            <div className="p-5 md:p-6">
              <h1 className="text-[24px] font-medium leading-tight text-ink">
                {quote.service || quote.name}
              </h1>
              <div className="mt-4 flex flex-wrap gap-2">
                <InfoChip
                  icon={<MapPin size={13} aria-hidden />}
                  text={
                    [quote.district, quote.city, quote.country].filter(Boolean).join(" / ") ||
                    "Konum belirtilmemiş"
                  }
                />
                {quote.categoryGroup && (
                  <InfoChip icon={<Tag size={13} aria-hidden />} text={groupLabel(quote.categoryGroup as GroupKey)} />
                )}
                {quote.categoryType && (
                  <InfoChip icon={<Tag size={13} aria-hidden />} text={serviceLabel(quote.categoryType)} />
                )}
                {quote.people && <InfoChip icon={<Users size={13} aria-hidden />} text={`${quote.people} kişi`} />}
                {quote.dateRange && <InfoChip icon={<CalendarClock size={13} aria-hidden />} text={quote.dateRange} />}
              </div>

              {flagged && (
                <p className="mt-4 inline-flex items-center gap-1.5 rounded-[8px] border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] font-bold text-amber-800">
                  <ShieldAlert size={14} aria-hidden />
                  Mesajda harici iletişim bilgisi olabilir — platform dışına yönlendirme riski.
                </p>
              )}

              <div className="mt-6 rounded-[10px] border border-line bg-cream/35 p-5">
                <p className="text-[11px] font-bold uppercase tracking-[.08em] text-muted">Talep mesajı</p>
                <p className="mt-3 whitespace-pre-line text-[14px] leading-7 text-ink/85">
                  {quote.message || "Bu talep için açıklama girilmemiş."}
                </p>
              </div>
            </div>
          </Card>

          <Card className="hover:translate-y-0">
            <CardHeader title={`Tedarikçi süreçleri (${quote.targets.length})`} tone="blue" icon={<Users size={18} aria-hidden />} />
            <p className="px-5 pt-4 text-[12px] leading-5 text-muted">
              Her tedarikçinin iletişim ve teklif süreci ayrıdır. Buradaki değişiklikler talebin genel inceleme durumunu değiştirmez.
            </p>
            <div className="divide-y divide-line/70">
              {quote.targets.map((target) => (
                <form key={target.quoteId} action={updateQuoteStatus} className="grid gap-3 p-5">
                  <input type="hidden" name="id" value={target.quoteId} />
                  <input type="hidden" name="locale" value={locale} />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {target.business ? (
                      <Link href={{ pathname: "/admin/tedarikciler/[id]", params: { id: String(target.business.id) } }} className="text-[14px] font-semibold text-sapphire hover:underline">
                        {target.business.name}
                      </Link>
                    ) : <span className="text-[14px] font-semibold">Hedef işletme bulunamadı</span>}
                    <StatusBadge tone={target.responseCount > 0 ? "green" : "neutral"}>{target.responseCount} teklif</StatusBadge>
                  </div>
                  <p className="text-[12px] text-muted">{supplierStatusLabel(target.status)} · Kayıt #{target.quoteId}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-1.5 text-[12px] font-medium text-muted">
                      Tedarikçi süreci
                      <select name="status" defaultValue={target.status} className={adminUi.input}>
                        {Object.entries(SUPPLIER_STATUS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                    </label>
                    <label className="grid gap-1.5 text-[12px] font-medium text-muted">
                      Tedarikçiye özel iç not
                      <input name="internalNote" maxLength={1000} defaultValue={target.internalNote ?? ""} className={adminUi.input} />
                    </label>
                  </div>
                  <button type="submit" className={`${adminUi.secondaryButton} justify-self-end`}>Tedarikçi sürecini kaydet</button>
                </form>
              ))}
            </div>
          </Card>

          <Card className="hover:translate-y-0">
            <CardHeader
              title={`Gelen teklifler (${quote.responses.length})`}
              tone="blue"
              icon={<MessageSquareText size={18} aria-hidden />}
            />
            {quote.responses.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-[14px] font-semibold text-ink">Henüz teklif gelmedi</p>
                <p className="mt-1 text-[13px] text-muted">
                  Tedarikçiler bu talebe teklif verdiğinde burada listelenecek.
                </p>
              </div>
            ) : (
              <ol className="divide-y divide-line/70">
                {quote.responses.map((response) => (
                  <li key={response.id} className="p-5 transition-colors hover:bg-cream/25">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        {response.business ? (
                          <Link
                            href={{
                              pathname: "/admin/tedarikciler/[id]",
                              params: { id: String(response.business.id) },
                            }}
                            className="text-[14px] font-bold text-ink transition-colors hover:text-sapphire"
                          >
                            {response.business.name}
                          </Link>
                        ) : (
                          <p className="text-[14px] font-bold text-ink">İşletme kaydı bulunamadı</p>
                        )}
                        <p className="mt-1 text-[12px] text-muted">
                          {[
                            response.business ? serviceLabel(response.business.type) : null,
                            response.business?.city,
                            fmt(response.createdAt),
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                      <span
                        className={
                          "rounded-[8px] border px-3 py-1.5 text-[12px] font-bold " +
                          (response.emailStatus === "failed"
                            ? "border-red-200 bg-red-50 text-red-700"
                            : response.emailStatus === "pending"
                              ? "border-amber-200 bg-amber-50 text-amber-800"
                              : "border-emerald-200 bg-emerald-50 text-emerald-700")
                        }
                      >
                        {MAIL_LABEL[response.emailStatus] ?? response.emailStatus}
                      </span>
                    </div>
                    <p className="mt-3 whitespace-pre-line rounded-[8px] bg-cream/55 px-4 py-3 text-[13.5px] leading-6 text-ink/80">
                      {response.message}
                    </p>
                    {response.lastError && (
                      <p className="mt-2 text-[12px] font-semibold text-red-700">E-posta hatası: {response.lastError}</p>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </main>

        <aside className="grid gap-5 xl:sticky xl:top-[90px]">
          <Card className="hover:translate-y-0">
            <CardHeader title="Talep sahibi" tone="blue" icon={<Building2 size={18} aria-hidden />} />
            <dl className="grid gap-3 p-5">
              <DetailRow label="Ad Soyad" value={quote.name} />
              <DetailRow label="Firma" value={quote.company ?? "—"} />
              <DetailRow label="E-posta" value={quote.email} icon={<Mail size={13} aria-hidden />} />
              <DetailRow label="Telefon" value={quote.phone ?? "—"} icon={<Phone size={13} aria-hidden />} />
            </dl>
          </Card>

          <Card className="hover:translate-y-0">
            <CardHeader title="Kayıt bilgileri" tone="blue" icon={<CalendarClock size={18} aria-hidden />} />
            <dl className="grid gap-3 p-5">
              <DetailRow label="Oluşturulma" value={fmt(quote.createdAt)} />
              <DetailRow label="Tarih aralığı" value={quote.dateRange ?? "—"} />
              <DetailRow
                label="Teklif son tarihi"
                value={quote.validUntil ? fmtDateOnly(quote.validUntil) : "—"}
              />
            </dl>
          </Card>

          <Card className="hover:translate-y-0">
            <CardHeader title="Talep incelemesi" tone="amber" icon={<ShieldAlert size={18} aria-hidden />} />
            <form action={updateQuoteRequestReview} className="grid gap-3 p-5">
              <input type="hidden" name="id" value={quote.id} />
              <input type="hidden" name="locale" value={locale} />
              <p className="text-[12px] leading-5 text-muted">Bu durum ve not tüm talebe aittir. “Yayına al” düğmesi talebi “Yayında” olarak işaretler; talebi açmak durumu değiştirmez. Bu işaretleme görünürlüğü veya teklif verme izinlerini değiştirmez. Kapatma ve arşivleme admin takibi içindir; tedarikçilerin teklif vermesini engellemez.</p>
              {quote.reviewUpdatedAt && <p className="text-[11px] text-muted">Son güncelleme: {fmt(quote.reviewUpdatedAt)}</p>}
              <label className="grid gap-1.5 text-[12px] font-semibold text-muted">
                Genel inceleme notu
                <textarea
                  name="internalNote"
                  rows={4}
                  maxLength={1000}
                  defaultValue={quote.reviewNote ?? ""}
                  placeholder="İnceleme notunu yazın…"
                  className={`${adminUi.input} min-h-[104px] resize-y py-2.5 text-[13px] font-normal`}
                />
              </label>
              <button type="submit" name="status" value={status} className={adminUi.secondaryButton}>
                Notu kaydet
              </button>
              <div className="grid grid-cols-2 gap-2 border-t border-line pt-3">
                <StatusButton status="reviewed" label="Yayına al" active={status === "reviewed"} />
                <StatusButton status="new" label="Yeniden aç" active={status === "new"} />
                <StatusButton status="closed" label="Kapat" active={status === "closed"} />
                <StatusButton status="archived" label="Arşivle" active={status === "archived"} />
              </div>
            </form>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function InfoChip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-[12px] font-semibold text-muted">
      {icon}
      {text}
    </span>
  );
}

function DetailRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[105px_minmax(0,1fr)] gap-3 border-b border-line/70 pb-3 last:border-0 last:pb-0">
      <dt className="text-[12px] font-medium text-muted">{label}</dt>
      <dd className="flex min-w-0 items-center justify-end gap-1.5 break-words text-right text-[12.5px] font-semibold text-ink/85">
        {icon}
        {value || "—"}
      </dd>
    </div>
  );
}

function StatusButton({
  status,
  label,
  active,
  danger = false,
}: {
  status: RequestStatus;
  label: string;
  active: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="submit"
      name="status"
      value={status}
      disabled={active}
      className={
        "rounded-[8px] border px-2 py-2 text-[11.5px] font-semibold transition-colors disabled:cursor-default disabled:opacity-45 " +
        (danger ? "border-red-200 text-red-700 hover:bg-red-50" : "border-line text-brand hover:bg-cream")
      }
    >
      {active ? `${REQUEST_STATUS[status].label} ✓` : label}
    </button>
  );
}
