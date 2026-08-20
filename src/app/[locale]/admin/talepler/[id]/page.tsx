import {
  ArrowLeft,
  Building2,
  CalendarClock,
  Eye,
  Layers3,
  MapPin,
  MessageSquareText,
  Tag,
} from "lucide-react";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { groupLabel, serviceLabel } from "@/lib/categories";
import { moderateB2bRequest } from "@/lib/actions/platform";
import { getAdminB2bRequestDetail, type AdminB2bRequestDetail } from "@/lib/platform-data";
import { StatusBadge } from "@/components/common";
import type { BadgeTone } from "@/components/common/StatusBadge";
import { Card, CardHeader, Metric, PageHeader } from "../../_components";
import { adminUi } from "../../_ui";

const TONE: Record<AdminB2bRequestDetail["status"], BadgeTone> = {
  pending: "amber",
  published: "green",
  archived: "neutral",
  rejected: "red",
};

const LABEL: Record<AdminB2bRequestDetail["status"], string> = {
  pending: "Bekliyor",
  published: "Yayında",
  archived: "Arşiv",
  rejected: "Reddedildi",
};

const fmt = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "long", timeStyle: "short" }).format(new Date(value));

export default async function AdminB2bRequestDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const requestId = Number(id);
  const request = await getAdminB2bRequestDetail(requestId);
  if (!request) notFound();

  return (
    <div className="mx-auto w-full max-w-[1320px]">
      <PageHeader
        title={`Talep #${request.id}`}
        description="İlanın tüm bilgilerini, ilan sahibi işletmeyi ve gelen teklifleri tek ekrandan inceleyin."
        action={
          <Link href="/admin/talepler" className={adminUi.secondaryButton}>
            <ArrowLeft size={16} aria-hidden />
            Taleplere dön
          </Link>
        }
      />

      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric title="Durum" value={LABEL[request.status]} hint="güncel yayın durumu" />
        <Metric title="Görüntülenme" value={request.viewCount.toLocaleString("tr-TR")} hint="ilan görüntülenmesi" />
        <Metric title="Gelen Teklif" value={request.offers.length} hint="tedarikçi yanıtı" />
        <Metric title="Talep No" value={`#${request.id}`} hint={fmt(request.createdAt)} />
      </section>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="grid gap-5">
          <Card className="hover:translate-y-0">
            <CardHeader
              title="Talep içeriği"
              tone="blue"
              icon={<MessageSquareText size={18} aria-hidden />}
              action={<StatusBadge tone={TONE[request.status]}>{LABEL[request.status]}</StatusBadge>}
            />
            <div className="p-5 md:p-6">
              <h1 className="text-[24px] font-medium leading-tight text-ink">{request.title}</h1>
              <div className="mt-4 flex flex-wrap gap-2">
                <InfoChip icon={<MapPin size={13} aria-hidden />} text={request.region ?? "Bölge belirtilmemiş"} />
                {request.targetGroup && <InfoChip icon={<Layers3 size={13} aria-hidden />} text={groupLabel(request.targetGroup)} />}
                {request.targetTypes.map((type) => (
                  <InfoChip key={type} icon={<Tag size={13} aria-hidden />} text={serviceLabel(type)} />
                ))}
              </div>
              <div className="mt-6 rounded-[10px] border border-line bg-cream/35 p-5">
                <p className="text-[11px] font-bold uppercase tracking-[.08em] text-muted">Talep detayları</p>
                <p className="mt-3 whitespace-pre-line text-[14px] leading-7 text-ink/85">
                  {request.description || "Bu talep için açıklama girilmemiş."}
                </p>
              </div>
            </div>
          </Card>

          <Card className="hover:translate-y-0">
            <CardHeader
              title={`Gelen teklifler (${request.offers.length})`}
              tone="blue"
              icon={<MessageSquareText size={18} aria-hidden />}
            />
            {request.offers.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-[14px] font-semibold text-ink">Henüz teklif gelmedi</p>
                <p className="mt-1 text-[13px] text-muted">Tedarikçiler bu ilana teklif verdiğinde burada listelenecek.</p>
              </div>
            ) : (
              <ol className="divide-y divide-line/70">
                {request.offers.map((offer) => (
                  <li key={offer.id} className="p-5 transition-colors hover:bg-cream/25">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        {offer.business ? (
                          <Link
                            href={{ pathname: "/admin/tedarikciler/[id]", params: { id: String(offer.business.id) } }}
                            className="text-[14px] font-bold text-ink transition-colors hover:text-sapphire"
                          >
                            {offer.business.name}
                          </Link>
                        ) : (
                          <p className="text-[14px] font-bold text-ink">İşletme kaydı bulunamadı</p>
                        )}
                        <p className="mt-1 text-[12px] text-muted">
                          {[offer.business ? serviceLabel(offer.business.type) : null, offer.business?.city, fmt(offer.createdAt)]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                      {offer.price && (
                        <span className="rounded-[8px] border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[13px] font-bold text-emerald-700">
                          {offer.price}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 whitespace-pre-line rounded-[8px] bg-cream/55 px-4 py-3 text-[13.5px] leading-6 text-ink/80">
                      {offer.message}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </main>

        <aside className="grid gap-5 xl:sticky xl:top-[90px]">
          <Card className="hover:translate-y-0">
            <CardHeader title="İlan sahibi" tone="blue" icon={<Building2 size={18} aria-hidden />} />
            <div className="p-5">
              {request.business ? (
                <>
                  <Link
                    href={{ pathname: "/admin/tedarikciler/[id]", params: { id: String(request.business.id) } }}
                    className="text-[16px] font-bold text-ink transition-colors hover:text-sapphire"
                  >
                    {request.business.name}
                  </Link>
                  <dl className="mt-4 grid gap-3">
                    <DetailRow label="Kategori" value={`${groupLabel(request.business.group)} · ${serviceLabel(request.business.type)}`} />
                    <DetailRow label="Konum" value={[request.business.district, request.business.city, request.business.country].filter(Boolean).join(" / ")} />
                    <DetailRow label="Telefon" value={request.business.phone ?? "—"} />
                    <DetailRow label="Web sitesi" value={request.business.website ?? "—"} />
                  </dl>
                </>
              ) : (
                <p className="text-[13px] text-muted">Bu talebe bağlı işletme kaydı bulunamadı.</p>
              )}
            </div>
          </Card>

          <Card className="hover:translate-y-0">
            <CardHeader title="Kayıt bilgileri" tone="blue" icon={<CalendarClock size={18} aria-hidden />} />
            <dl className="grid gap-3 p-5">
              <DetailRow label="Oluşturulma" value={fmt(request.createdAt)} />
              <DetailRow label="Son güncelleme" value={fmt(request.updatedAt)} />
              <DetailRow label="Görüntülenme" value={`${request.viewCount.toLocaleString("tr-TR")} kez`} icon={<Eye size={13} aria-hidden />} />
            </dl>
          </Card>

          <Card className="hover:translate-y-0">
            <CardHeader title="Moderasyon" tone="amber" icon={<Layers3 size={18} aria-hidden />} />
            <form action={moderateB2bRequest} className="grid gap-3 p-5">
              <input type="hidden" name="id" value={request.id} />
              <input type="hidden" name="locale" value={locale} />
              <label className="grid gap-1.5 text-[12px] font-semibold text-muted">
                Moderasyon notu
                <textarea
                  name="note"
                  rows={4}
                  maxLength={500}
                  defaultValue={request.moderationNote ?? ""}
                  placeholder="İnceleme notunu yazın…"
                  className={`${adminUi.input} min-h-[104px] resize-y py-2.5 text-[13px] font-normal`}
                />
              </label>
              <button type="submit" name="status" value={request.status} className={adminUi.secondaryButton}>
                Notu kaydet
              </button>
              <div className="grid grid-cols-3 gap-2 border-t border-line pt-3">
                <ModerationButton status="published" label="Yayınla" active={request.status === "published"} />
                <ModerationButton status="archived" label="Arşivle" active={request.status === "archived"} />
                <ModerationButton status="rejected" label="Reddet" active={request.status === "rejected"} danger />
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

function ModerationButton({
  status,
  label,
  active,
  danger = false,
}: {
  status: "published" | "archived" | "rejected";
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
        (danger
          ? "border-red-200 text-red-700 hover:bg-red-50"
          : "border-line text-brand hover:bg-cream")
      }
    >
      {active ? "Aktif" : label}
    </button>
  );
}
