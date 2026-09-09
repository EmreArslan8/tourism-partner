import {
  ArrowLeft,
  Building2,
  CalendarClock,
  Eye,
  Layers3,
  MapPin,
  Phone,
  Tag,
  Users,
} from "lucide-react";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { groupLabel, serviceLabel } from "@/lib/categories";
import { moderateB2bDeal } from "@/lib/actions/platform";
import { getAdminB2bDealDetail, type AdminB2bDealDetail } from "@/lib/platform-data";
import { StatusBadge } from "@/components/common";
import type { BadgeTone } from "@/components/common/StatusBadge";
import { Card, CardHeader, Metric, PageHeader } from "../../_components";
import { adminUi } from "../../_ui";

const TONE: Record<AdminB2bDealDetail["status"], BadgeTone> = {
  pending: "amber",
  published: "green",
  archived: "neutral",
  rejected: "red",
};
const LABEL: Record<AdminB2bDealDetail["status"], string> = {
  pending: "Bekliyor",
  published: "Yayında",
  archived: "Arşiv",
  rejected: "Reddedildi",
};

const fmt = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "long", timeStyle: "short" }).format(new Date(value));
const fmtDay = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(new Date(`${value}T12:00:00`));

export default async function AdminB2bDealDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const deal = await getAdminB2bDealDetail(Number(id));
  if (!deal) notFound();

  const validity = [deal.validFrom, deal.validUntil].filter(Boolean).map((d) => fmtDay(d!)).join(" – ");

  return (
    <div className="mx-auto w-full max-w-[1320px]">
      <PageHeader
        title={`Fırsat ilanı #${deal.id}`}
        description="İlanın tüm bilgilerini, yayınlayan işletmeyi ve ilgilenen firmaları tek ekrandan inceleyin."
        action={
          <Link href="/admin/firsatlar" className={adminUi.secondaryButton}>
            <ArrowLeft size={16} aria-hidden />
            Fırsat ilanlarına dön
          </Link>
        }
      />

      <section className="mb-5 grid grid-flow-col auto-cols-[minmax(165px,1fr)] gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid-flow-row md:grid-cols-4 md:overflow-visible md:pb-0">
        <Metric title="Durum" value={LABEL[deal.status]} hint="güncel yayın durumu" />
        <Metric title="Görüntülenme" value={deal.viewCount.toLocaleString("tr-TR")} hint="ilan görüntülenmesi" />
        <Metric title="İlgilenen" value={deal.interests.length} hint="ilgi bildirimi" />
        <Metric title="İlan No" value={`#${deal.id}`} hint={fmt(deal.createdAt)} />
      </section>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="grid gap-5">
          <Card className="hover:translate-y-0">
            <CardHeader
              title="İlan içeriği"
              tone="blue"
              icon={<Tag size={18} aria-hidden />}
              action={<StatusBadge tone={TONE[deal.status]}>{LABEL[deal.status]}</StatusBadge>}
            />
            <div className="p-5 md:p-6">
              <h1 className="text-[24px] font-medium leading-tight text-ink">{deal.title}</h1>
              <div className="mt-4 flex flex-wrap gap-2">
                <InfoChip icon={<MapPin size={13} aria-hidden />} text={deal.region ?? "Bölge belirtilmemiş"} />
                {deal.groupKey && <InfoChip icon={<Layers3 size={13} aria-hidden />} text={groupLabel(deal.groupKey)} />}
                {deal.types.map((type) => (
                  <InfoChip key={type} icon={<Tag size={13} aria-hidden />} text={serviceLabel(type)} />
                ))}
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <TermBox label="Tarife" value={deal.price ?? "Belirtilmemiş"} />
                <TermBox label="Kontenjan" value={deal.capacity ? `${deal.capacity} kişi` : "Belirtilmemiş"} />
                <TermBox label="Geçerlilik" value={validity || "Belirtilmemiş"} />
              </div>
              <div className="mt-6 rounded-[10px] border border-line bg-cream/35 p-5">
                <p className="text-[11px] font-bold uppercase tracking-[.08em] text-muted">İlan detayları</p>
                <p className="mt-3 whitespace-pre-line text-[14px] leading-7 text-ink/85">
                  {deal.description || "Bu ilan için açıklama girilmemiş."}
                </p>
              </div>
              {deal.sourceRequestId && (
                <p className="mt-4 text-[12.5px] text-muted">
                  Bu ilan{" "}
                  <Link
                    href={{ pathname: "/admin/talepler/[id]", params: { id: String(deal.sourceRequestId) } }}
                    className="font-semibold text-sapphire hover:underline"
                  >
                    Talep #{deal.sourceRequestId}
                  </Link>{" "}
                  kaydından taşındı; orijinal metin o talepte duruyor.
                </p>
              )}
            </div>
          </Card>

          <Card className="hover:translate-y-0">
            <CardHeader
              title={`İlgilenen firmalar (${deal.interests.length})`}
              tone="blue"
              icon={<Users size={18} aria-hidden />}
            />
            {deal.interests.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-[14px] font-semibold text-ink">Henüz ilgi gelmedi</p>
                <p className="mt-1 text-[13px] text-muted">Bir üye “İlgileniyorum” dediğinde burada listelenecek.</p>
              </div>
            ) : (
              <ol className="divide-y divide-line/70">
                {deal.interests.map((interest) => (
                  <li key={interest.id} className="p-5 transition-colors hover:bg-cream/25">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        {interest.business ? (
                          <Link
                            href={{ pathname: "/admin/tedarikciler/[id]", params: { id: String(interest.business.id) } }}
                            className="text-[14px] font-bold text-ink transition-colors hover:text-sapphire"
                          >
                            {interest.business.name}
                          </Link>
                        ) : (
                          <p className="text-[14px] font-bold text-ink">İşletme kaydı bulunamadı</p>
                        )}
                        <p className="mt-1 text-[12px] text-muted">
                          {[interest.business ? serviceLabel(interest.business.type) : null, interest.business?.city, fmt(interest.createdAt)]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                      {interest.business?.phone && (
                        <span className="inline-flex items-center gap-1.5 rounded-[8px] border border-line bg-paper px-3 py-1.5 text-[13px] font-semibold text-ink/80">
                          <Phone size={13} aria-hidden />
                          {interest.business.phone}
                        </span>
                      )}
                    </div>
                    {interest.message && (
                      <p className="mt-3 whitespace-pre-line rounded-[8px] bg-cream/55 px-4 py-3 text-[13.5px] leading-6 text-ink/80">
                        {interest.message}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </main>

        <aside className="grid gap-5 xl:sticky xl:top-[90px]">
          <Card className="hover:translate-y-0">
            <CardHeader title="Yayınlayan" tone="blue" icon={<Building2 size={18} aria-hidden />} />
            <div className="p-5">
              {deal.business ? (
                <>
                  <Link
                    href={{ pathname: "/admin/tedarikciler/[id]", params: { id: String(deal.business.id) } }}
                    className="text-[16px] font-bold text-ink transition-colors hover:text-sapphire"
                  >
                    {deal.business.name}
                  </Link>
                  <dl className="mt-4 grid gap-3">
                    <DetailRow label="Kategori" value={`${groupLabel(deal.business.group)} · ${serviceLabel(deal.business.type)}`} />
                    <DetailRow label="Konum" value={[deal.business.district, deal.business.city, deal.business.country].filter(Boolean).join(" / ")} />
                    <DetailRow label="Telefon" value={deal.business.phone ?? "—"} />
                    <DetailRow label="Web sitesi" value={deal.business.website ?? "—"} />
                  </dl>
                </>
              ) : (
                <p className="text-[13px] text-muted">Bu ilana bağlı işletme kaydı bulunamadı.</p>
              )}
            </div>
          </Card>

          <Card className="hover:translate-y-0">
            <CardHeader title="Kayıt bilgileri" tone="blue" icon={<CalendarClock size={18} aria-hidden />} />
            <dl className="grid gap-3 p-5">
              <DetailRow label="Oluşturulma" value={fmt(deal.createdAt)} />
              <DetailRow label="Son güncelleme" value={fmt(deal.updatedAt)} />
              <DetailRow label="Görüntülenme" value={`${deal.viewCount.toLocaleString("tr-TR")} kez`} icon={<Eye size={13} aria-hidden />} />
            </dl>
          </Card>

          <Card className="hover:translate-y-0">
            <CardHeader title="Moderasyon" tone="amber" icon={<Layers3 size={18} aria-hidden />} />
            <form action={moderateB2bDeal} className="grid gap-3 p-5">
              <input type="hidden" name="id" value={deal.id} />
              <input type="hidden" name="locale" value={locale} />
              <label className="grid gap-1.5 text-[12px] font-semibold text-muted">
                Moderasyon notu
                <textarea
                  name="note"
                  rows={4}
                  maxLength={500}
                  defaultValue={deal.moderationNote ?? ""}
                  placeholder="İnceleme notunu yazın…"
                  className={`${adminUi.input} min-h-[104px] resize-y py-2.5 text-[13px] font-normal`}
                />
              </label>
              <button type="submit" name="status" value={deal.status} className={adminUi.secondaryButton}>
                Notu kaydet
              </button>
              <div className="grid grid-cols-3 gap-2 border-t border-line pt-3">
                <ModerationButton status="published" label="Yayınla" active={deal.status === "published"} />
                <ModerationButton status="archived" label="Arşivle" active={deal.status === "archived"} />
                <ModerationButton status="rejected" label="Reddet" active={deal.status === "rejected"} danger />
              </div>
            </form>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function TermBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-line bg-paper px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[.06em] text-muted">{label}</p>
      <p className="mt-1 text-[13.5px] font-semibold text-ink/85">{value}</p>
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
