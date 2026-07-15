import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  Ban,
  Eye,
  FileCheck2,
  GalleryHorizontal,
  History,
  MessageSquareText,
  Search,
  Star,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BusinessForm, Empty, QuoteList, panel } from "../../_components";
import { getCrmBusinessDetail, type CrmBusinessDetailData } from "@/lib/admin-crm-data";
import type { AdminBusiness, AdminMembership } from "@/lib/types";
import { businessSlug } from "@/lib/businesses";
import { businessImageUrl } from "@/lib/business-images";
import { isPublicBusinessStatus } from "@/lib/business-visibility";
import { membershipDaysLeft, membershipState } from "@/lib/membership";
import { extendMembership } from "@/lib/actions/membership";
import { translateBusinessProfile } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";
import { adminUi } from "../../_ui";
import BusinessDetailTabs from "./BusinessDetailTabs";
import SupplierHeader from "./SupplierHeader";

type TabKey =
  | "ozet"
  | "profil"
  | "belgeler"
  | "icerik-seo"
  | "talepler"
  | "gecmis";

const TAB_KEYS: TabKey[] = ["ozet", "profil", "icerik-seo", "belgeler", "talepler", "gecmis"];
const detailPanel = "overflow-hidden rounded-[8px] border border-[#D8DFEA] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]";

export default async function AdminBusinessDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale, id } = await params;
  const query = await searchParams;
  setRequestLocale(locale);

  const data = await getCrmBusinessDetail(Number(id));
  const business = data.business;
  if (!business) notFound();

  const requestedTab = Array.isArray(query.tab) ? query.tab[0] : query.tab;
  const activeTab = normalizeTab(requestedTab);
  const publicHref = { pathname: "/supplier/[id]" as const, params: { id: businessSlug(business) } };

  const cover = businessImageUrl(business.image);
  const joined = business.createdAt
    ? new Intl.DateTimeFormat("tr-TR", { month: "short", year: "numeric" }).format(new Date(business.createdAt))
    : "Tarih yok";

  return (
    <div className="mx-auto w-full max-w-[1320px]">
      <SupplierHeader
        id={business.id}
        name={business.name}
        type={business.type}
        city={business.city}
        country={business.country}
        cover={cover}
        joined={joined}
        status={business.status}
        founderPartner={Boolean(business.founderPartner)}
        sponsored={Boolean(business.sponsored)}
        locale={locale}
        publicHref={publicHref}
      />

      <div className="sticky top-[70px] z-20 mb-5 border-b border-[#D8DFEA] bg-[#F6F8FC]/95 backdrop-blur">
        <BusinessDetailTabs activeTab={activeTab} />
      </div>

      {activeTab === "ozet" && <OverviewTab locale={locale} business={business} data={data} />}
      {activeTab === "profil" && <ProfileTab locale={locale} business={business} />}
      {activeTab === "belgeler" && <DocumentsTab business={business} />}
      {activeTab === "icerik-seo" && <ContentSeoTab locale={locale} business={business} />}
      {activeTab === "talepler" && <QuoteList quotes={data.quotes} locale={locale} />}
      {activeTab === "gecmis" && <HistoryTab data={data} />}
    </div>
  );
}

const OverviewTab = ({ locale, business, data }: { locale: string; business: AdminBusiness; data: CrmBusinessDetailData }) => (
  <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
    <div className="grid content-start gap-4">
      <PerformancePanel data={data} />

      <RecentSystemLog data={data} />
    </div>

    <aside className="grid content-start gap-4">
      <MembershipPanel locale={locale} business={business} data={data} />
      <AdminNotesPanel data={data} />
    </aside>
  </div>
);

const ProfileTab = ({ locale, business }: { locale: string; business: AdminBusiness }) => (
  <BusinessForm
    locale={locale}
    business={business}
    sideExtra={<ModerationPanel business={business} />}
  />
);

const DocumentsTab = ({ business }: { business: AdminBusiness }) => {
  const documents = business.documents ?? [];
  return (
    <section className={panel}>
      <SectionTitle icon={<FileCheck2 size={18} aria-hidden />} title="Belgeler / Doğrulama" />
      {documents.length === 0 ? (
        <Empty text="Bu işletme için belge kaydı yok. Kategoriye göre vergi levhası, faaliyet belgesi, TÜRSAB belgesi, ruhsat veya rehber kokartı burada yönetilmeli." />
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {documents.map((document) => (
            <div key={`${document.kind}-${document.name}`} className="rounded-[8px] border border-line bg-cream/40 p-4">
              <p className="text-[13px] font-extrabold text-ink">{document.kind}</p>
              <p className="mt-1 text-[12px] font-semibold text-muted">{document.name}</p>
              {document.url && <a href={document.url} className="mt-3 inline-flex text-[12px] font-bold text-brand hover:underline">Dosyayı görüntüle</a>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

const ContentSeoTab = ({ locale, business }: { locale: string; business: AdminBusiness }) => (
  <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
    <section className={panel}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle icon={<GalleryHorizontal size={18} aria-hidden />} title="İçerik & Galeri" />
        <form action={translateBusinessProfile}>
          <input type="hidden" name="id" value={business.id} />
          <input type="hidden" name="locale" value={locale} />
          <button type="submit" className={cn(adminUi.sapphireButton, "h-9 rounded-[8px] px-3 text-[12.5px]")}>
            Eksik çevirileri üret
          </button>
        </form>
      </div>
      <div className="mt-4 grid gap-4">
        <div className="rounded-[8px] border border-line bg-cream/35 p-4">
          <p className="text-[12px] font-bold uppercase tracking-[.06em] text-muted">Açıklama</p>
          <p className="mt-2 text-[14px] leading-6 text-ink">{business.desc || "Açıklama girilmemiş."}</p>
        </div>
        <TranslationState details={business.details as unknown} />
        <div className="grid gap-3 md:grid-cols-3">
          <InfoRow label="Kapak Görseli" value={business.image ? "Var" : "Eksik"} />
          <InfoRow label="Galeri" value={`${business.images?.length ?? 0} görsel`} />
          <InfoRow label="Etiket" value={business.tag || "Eksik"} />
        </div>
      </div>
    </section>

    <section className={panel}>
      <SectionTitle icon={<Search size={18} aria-hidden />} title="SEO" />
      <div className="mt-4 grid gap-3">
        <InfoRow label="SEO Başlık" value={business.seoTitle || "Eksik"} />
        <InfoRow label="Meta Açıklama" value={business.seoDescription || "Eksik"} />
        <InfoRow label="Anahtar Kelimeler" value={(business.seoKeywords ?? []).join(", ") || "Eksik"} />
        <InfoRow label="Canonical" value={business.canonicalPath || "Otomatik"} />
        <InfoRow label="OG Görsel" value={business.ogImage || "Eksik"} />
      </div>
    </section>
  </div>
);

const TranslationState = ({ details }: { details?: unknown }) => {
  const record = details && typeof details === "object" && !Array.isArray(details) ? details as Record<string, unknown> : {};
  const translations = record.translations && typeof record.translations === "object" && !Array.isArray(record.translations)
    ? record.translations as Record<string, unknown>
    : {};
  return (
    <div className="grid gap-2 rounded-[8px] border border-line bg-paper p-3 md:grid-cols-4">
      {(["tr", "en", "ru", "ar"] as const).map((locale) => {
        const item = translations[locale];
        const hasDescription = Boolean(item && typeof item === "object" && !Array.isArray(item) && String((item as Record<string, unknown>).description ?? "").trim());
        return (
          <div key={locale} className="rounded-[7px] bg-cream/50 px-3 py-2">
            <p className="text-[11px] font-bold uppercase tracking-[.06em] text-muted">{locale}</p>
            <p className={cn("mt-1 text-[12px] font-extrabold", hasDescription ? "text-emerald-700" : "text-amber-700")}>
              {hasDescription ? "Hazır" : "Eksik"}
            </p>
          </div>
        );
      })}
    </div>
  );
};

const PerformancePanel = ({ data }: { data: CrmBusinessDetailData }) => {
  const views = data.pageViews.filter((view) => view.entityType === "business");
  const impressions = data.pageViews.filter((view) => view.entityType === "impression");
  return (
    <section className={detailPanel}>
      <div className="flex items-center justify-between border-b border-[#D8DFEA] px-5 py-3.5">
        <h3 className="text-[17px] font-extrabold text-ink">Performans Metrikleri</h3>
        <span className="text-[12px] font-semibold text-muted">Son 30 gün</span>
      </div>
      <div className="grid md:grid-cols-4">
        <MetricCell icon={<Star size={13} aria-hidden />} label="Puan" value="4.8" detail="+0.2" />
        <MetricCell icon={<MessageSquareText size={13} aria-hidden />} label="Yorum" value={data.business?.reviews.toLocaleString("tr-TR") ?? "0"} detail="toplam" />
        <MetricCell icon={<Eye size={13} aria-hidden />} label="Profil Ziyareti" value={views.length.toLocaleString("tr-TR")} detail={`${impressions.length} gösterim`} />
        <MetricCell icon={<FileCheck2 size={13} aria-hidden />} label="Teklif" value={data.quotes.length.toLocaleString("tr-TR")} detail="talep" />
      </div>
    </section>
  );
};

const RecentSystemLog = ({ data }: { data: CrmBusinessDetailData }) => (
  <section className={detailPanel}>
    <div className="flex items-center justify-between border-b border-[#D8DFEA] px-5 py-3.5">
      <h3 className="text-[14px] font-extrabold uppercase tracking-[.08em] text-ink">Son Sistem Kaydı</h3>
      <Link href={{ pathname: "/admin/tedarikciler/[id]", params: { id: data.business ? String(data.business.id) : "0" }, query: { tab: "gecmis" } }} className="text-[13px] font-bold text-brand hover:underline">Tümünü gör</Link>
    </div>
    {data.auditLogs.length === 0 ? (
      <Empty text="Bu işletme için audit kaydı yok." />
    ) : (
      <div className="divide-y divide-[#D8DFEA]">
        {data.auditLogs.slice(0, 3).map((log) => (
          <div key={log.id} className="flex gap-3 px-5 py-3">
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sapphire/10 text-brand">
              <History size={15} aria-hidden />
            </span>
            <div>
              <p className="text-[13px] font-bold text-ink">{log.action}</p>
              <p className="mt-0.5 text-[12px] font-semibold text-muted">{formatDateTime(log.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
);

const MembershipPanel = ({
  locale,
  business,
  data,
  showExtendForm = true,
}: {
  locale: string;
  business: AdminBusiness;
  data: CrmBusinessDetailData;
  showExtendForm?: boolean;
}) => {
  const membership = data.membership;
  const planName = membership ? membershipPlanLabel(membership.plan) : "Standart";
  const daysLeft = membership ? membershipDaysLeft(membership.endsAt) : null;
  const state = membership ? membershipState(membership) : null;
  const remainingLabel =
    daysLeft === null
      ? "Üyelik kaydı yok"
      : daysLeft < 0
        ? `${Math.abs(daysLeft)} gün önce doldu`
        : daysLeft === 0
          ? "Bugün doluyor"
          : `${daysLeft} gün kaldı`;
  const remainingTone =
    state === "expired" ? "text-red-600" : state === "expiring" ? "text-amber-700" : "text-emerald-700";

  return (
    <section className={cn(detailPanel, "bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FBFF_100%)]")}>
      <div className="flex items-center justify-between border-b border-[#D8DFEA] px-4 py-3.5">
        <h3 className="text-[16px] font-extrabold text-ink">Üyelik Planı</h3>
        <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-extrabold", business.sponsored ? "bg-emerald-100 text-emerald-700" : "bg-[#E8EEFB] text-[#4D5A7A]")}>
          {business.sponsored ? "Premium" : membership ? membershipPlanLabel(membership.plan) : "Standart"}
        </span>
      </div>
      <div className="px-4 py-4">
        <div className="flex items-start">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[18px] font-extrabold leading-tight text-ink">{business.sponsored ? "Premium Partner" : planName}</p>
            <span className={cn("mt-2 inline-flex rounded-full px-2.5 py-1 text-[11.5px] font-extrabold", business.sponsored ? "bg-emerald-100 text-emerald-700" : "bg-[#E8EEFB] text-[#5B6683]")}>
              {business.sponsored ? "Aktif" : membership ? membershipStatusLabel(membership.status) : statusLabel(business.status)}
            </span>
          </div>
        </div>
      </div>
      <div className="border-y border-[#D8DFEA] bg-white/62 px-4 py-2">
        <MembershipLine label="Paket Durumu" value={membership ? membershipStatusLabel(membership.status) : "Yok"} />
        <MembershipLine label="Üyelik Bitiş" value={membership ? formatDateTime(membership.endsAt) : "Yok"} />
        <MembershipLine label="Kalan Süre" value={remainingLabel} valueClassName={remainingTone} />
        <MembershipLine label="Doping Bitiş" value={business.dopingUntil ? formatDateTime(business.dopingUntil) : "Yok"} />
        <MembershipLine label="Kurucu Üye" value={business.founderPartner ? "Aktif" : "Yok"} />
      </div>
      {showExtendForm && (
        <form action={extendMembership} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 p-4">
          <input type="hidden" name="businessId" value={business.id} />
          <input type="hidden" name="locale" value={locale} />
          <select name="months" defaultValue="12" className={cn(adminUi.input, "h-10 rounded-[8px] text-[13px]")} aria-label="Uzatma süresi">
            <option value="1">1 ay</option>
            <option value="3">3 ay</option>
            <option value="6">6 ay</option>
            <option value="12">12 ay</option>
          </select>
          <button type="submit" className={cn(adminUi.sapphireButton, "h-10 shrink-0 rounded-[8px] px-3.5 text-[13px]")}>Uzat</button>
        </form>
      )}
    </section>
  );
};

const AdminNotesPanel = ({ data }: { data: CrmBusinessDetailData }) => (
  <section className={detailPanel}>
    <div className="border-b border-[#D8DFEA] px-5 py-3.5">
      <h3 className="text-[17px] font-extrabold text-ink">Admin Notları</h3>
    </div>
    <div className="grid gap-3 p-4">
      {data.auditLogs.length === 0 ? (
        <p className="rounded-[8px] bg-cream/50 p-3 text-[13px] font-semibold text-muted">Henüz admin notu veya audit kaydı yok.</p>
      ) : (
        data.auditLogs.slice(0, 2).map((log) => (
          <div key={log.id} className="rounded-[8px] border border-line bg-cream/40 p-3">
            <div className="flex items-center justify-between gap-3">
              <strong className="text-[13px] text-ink">{log.action}</strong>
              <span className="shrink-0 text-[12px] font-semibold text-muted">{formatDateTime(log.createdAt)}</span>
            </div>
            <p className="mt-2 text-[12.5px] font-medium leading-5 text-muted">Sistem tarafından kaydedilen işlem.</p>
          </div>
        ))
      )}
      <div className="rounded-[8px] border border-line bg-paper px-3 py-2 text-[13px] font-medium text-muted">İç not yazma alanı sonraki adımda bağlanacak.</div>
    </div>
  </section>
);

const ModerationPanel = ({ business }: { business: AdminBusiness }) => (
  <section className={panel}>
    <SectionTitle icon={<Ban size={18} aria-hidden />} title="Moderasyon" />
    <div className="mt-4 grid gap-3">
      <InfoRow label="Durum" value={statusLabel(business.status)} />
      <InfoRow label="Public Görünürlük" value={isLive(business) ? "Açık" : "Kapalı"} />
      <InfoRow label="Risk Durumu" value={business.status === "blacklisted" ? "Blacklist" : business.status === "suspended" ? "Askıda" : "Normal"} />
      <Empty text="Şikayetler, revizyon istekleri, blacklist nedeni ve admin iç notları bu modüle bağlanmalı." />
    </div>
  </section>
);

const HistoryTab = ({ data }: { data: CrmBusinessDetailData }) => (
  <section className={panel}>
    <SectionTitle icon={<History size={18} aria-hidden />} title="Geçmiş / Audit Log" />
    {data.auditLogs.length === 0 ? (
      <Empty text="Bu işletme için audit kaydı yok." />
    ) : (
      <div className="mt-4 grid gap-2">
        {data.auditLogs.map((log) => (
          <div key={log.id} className="rounded-[8px] border border-line bg-cream/45 px-3 py-2">
            <p className="text-[12px] font-extrabold text-ink">{log.action}</p>
            <p className="mt-1 text-[11px] font-semibold text-muted">{formatDateTime(log.createdAt)}</p>
          </div>
        ))}
      </div>
    )}
  </section>
);

const SectionTitle = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center gap-2">
    <span className="grid h-9 w-9 place-items-center rounded-[8px] bg-cream text-brand">{icon}</span>
    <h3 className="text-[18px] font-medium text-ink">{title}</h3>
  </div>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-[8px] border border-line bg-paper px-3 py-2">
    <p className="text-[11px] font-bold uppercase tracking-[.06em] text-muted">{label}</p>
    <p className="mt-1 break-words text-[13px] font-semibold leading-5 text-ink">{value}</p>
  </div>
);

const MetricCell = ({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) => (
  <div className="flex min-h-[122px] flex-col border-[#D8DFEA] px-5 py-4 md:border-r md:last:border-r-0">
    <p className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11.5px] font-bold uppercase tracking-[.08em] text-muted [&_svg]:shrink-0">{icon}{label}</p>
    <strong className="mt-2 block text-[30px] font-extrabold leading-none text-ink">{value}</strong>
    <p className="mt-auto pt-2 text-[12px] font-semibold text-emerald-700">{detail}</p>
  </div>
);

const MembershipLine = ({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) => (
  <div className="flex min-h-[38px] items-center justify-between gap-3 border-b border-[#E5EAF3] last:border-b-0">
    <span className="text-[12.5px] font-semibold text-[#68748F]">{label}</span>
    <strong className={cn("min-w-0 text-right text-[12.5px] font-extrabold text-ink", valueClassName)}>{value}</strong>
  </div>
);

function isLive(business: AdminBusiness) {
  return isPublicBusinessStatus(business.status);
}

function statusLabel(status: string) {
  if (status === "approved" || status === "active") return "Yayında";
  if (status === "pending") return "Beklemede";
  if (status === "suspended") return "Askıda";
  if (status === "blacklisted") return "Blacklist";
  if (status === "rejected") return "Reddedildi";
  if (status === "expired") return "Pasif";
  return "Taslak";
}

function membershipPlanLabel(plan: string) {
  if (plan === "standard") return "Standart";
  if (plan === "premium") return "Premium";
  if (plan === "trial") return "Deneme";
  return plan;
}

function membershipStatusLabel(status: AdminMembership["status"]) {
  if (status === "trial") return "Deneme";
  if (status === "active") return "Aktif";
  if (status === "expired") return "Süresi doldu";
  if (status === "cancelled") return "İptal edildi";
  return status;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

function normalizeTab(value: string | undefined): TabKey {
  if (value === "genel" || value === "uyelik" || value === "moderasyon") return "profil";
  if (value === "icerik" || value === "seo") return "icerik-seo";
  if (value === "performans") return "ozet";
  if (TAB_KEYS.includes(value as TabKey)) return value as TabKey;
  return "ozet";
}
