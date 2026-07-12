import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  Activity,
  Ban,
  BarChart3,
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
import type { AdminBusiness } from "@/lib/types";
import { businessSlug } from "@/lib/businesses";
import { businessImageUrl } from "@/lib/business-images";
import { isPublicBusinessStatus } from "@/lib/business-visibility";
import { cn } from "@/lib/utils";
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

      {activeTab === "ozet" && <OverviewTab business={business} data={data} />}
      {activeTab === "profil" && <ProfileTab locale={locale} business={business} data={data} />}
      {activeTab === "belgeler" && <DocumentsTab business={business} />}
      {activeTab === "icerik-seo" && <ContentSeoTab business={business} />}
      {activeTab === "talepler" && <QuoteList quotes={data.quotes} locale={locale} />}
      {activeTab === "gecmis" && <HistoryTab data={data} />}
    </div>
  );
}

const OverviewTab = ({ business, data }: { business: AdminBusiness; data: CrmBusinessDetailData }) => (
  <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
    <div className="grid gap-4">
      <section className={detailPanel}>
        <div className="px-5 py-4">
        <SectionTitle icon={<Activity size={18} aria-hidden />} title="Operasyon Özeti" />
        <div className="mt-4 grid gap-2.5 md:grid-cols-2">
          <InfoRow label="Firma" value={business.name} />
          <InfoRow label="Kategori" value={`${business.group} / ${business.type}`} />
          <InfoRow label="Konum" value={`${business.city}, ${business.district}, ${business.country}`} />
          <InfoRow label="İletişim" value={[business.phone, business.website].filter(Boolean).join(" · ") || "Eksik"} />
          <InfoRow label="Doğrulama" value={business.verified ? "Doğrulanmış" : "Doğrulanmamış"} />
          <InfoRow label="Sponsor" value={business.sponsored ? "Sponsor / premium" : "Organik"} />
        </div>
        </div>
      </section>

      <PerformancePanel data={data} />

      <RecentSystemLog data={data} />
    </div>

    <aside className="grid content-start gap-4">
      <MembershipPanel business={business} data={data} />
      <AdminNotesPanel data={data} />
    </aside>
  </div>
);

const ProfileTab = ({ locale, business, data }: { locale: string; business: AdminBusiness; data: CrmBusinessDetailData }) => (
  <BusinessForm
    locale={locale}
    business={business}
    mainExtra={<MembershipPanel business={business} data={data} />}
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

const ContentSeoTab = ({ business }: { business: AdminBusiness }) => (
  <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
    <section className={panel}>
      <SectionTitle icon={<GalleryHorizontal size={18} aria-hidden />} title="İçerik & Galeri" />
      <div className="mt-4 grid gap-4">
        <div className="rounded-[8px] border border-line bg-cream/35 p-4">
          <p className="text-[12px] font-bold uppercase tracking-[.06em] text-muted">Açıklama</p>
          <p className="mt-2 text-[14px] leading-6 text-ink">{business.desc || "Açıklama girilmemiş."}</p>
        </div>
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

const PerformancePanel = ({ data }: { data: CrmBusinessDetailData }) => {
  const views = data.pageViews.filter((view) => view.entityType === "business");
  const impressions = data.pageViews.filter((view) => view.entityType === "impression");
  const visitors = new Set(data.pageViews.map((view) => view.visitorId).filter(Boolean)).size;
  return (
    <section className={detailPanel}>
      <div className="flex items-center justify-between border-b border-[#D8DFEA] px-5 py-3.5">
        <h3 className="text-[17px] font-extrabold text-ink">Performans Metrikleri</h3>
        <span className="text-[12px] font-semibold text-muted">Son 30 gün</span>
      </div>
      <div className="grid md:grid-cols-4">
        <MetricCell icon={<Star size={13} aria-hidden />} label="Avg Rating" value="4.8" detail="+0.2" />
        <MetricCell icon={<MessageSquareText size={13} aria-hidden />} label="Reviews" value={data.business?.reviews.toLocaleString("tr-TR") ?? "0"} detail="toplam" />
        <MetricCell icon={<Eye size={13} aria-hidden />} label="Profile Views" value={views.length.toLocaleString("tr-TR")} detail={`${impressions.length} gösterim`} />
        <MetricCell icon={<FileCheck2 size={13} aria-hidden />} label="Quotes" value={data.quotes.length.toLocaleString("tr-TR")} detail="talep" />
      </div>
    </section>
  );
};

const RecentSystemLog = ({ data }: { data: CrmBusinessDetailData }) => (
  <section className={detailPanel}>
    <div className="flex items-center justify-between border-b border-[#D8DFEA] px-5 py-3.5">
      <h3 className="text-[14px] font-extrabold uppercase tracking-[.08em] text-ink">Recent System Log</h3>
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

const MembershipPanel = ({ business, data }: { business: AdminBusiness; data: CrmBusinessDetailData }) => (
  <section className={detailPanel}>
    <div className="border-b border-[#D8DFEA] px-5 py-3.5">
      <h3 className="text-[17px] font-extrabold text-ink">Membership Plan</h3>
    </div>
    <div className="p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-[6px] bg-ink text-paper">
          <BarChart3 size={20} aria-hidden />
        </span>
        <div>
          <p className="text-[18px] font-extrabold text-ink">{business.sponsored ? "Premium Partner" : data.membership?.plan ?? "Standart Profil"}</p>
          <span className={cn("mt-1 inline-flex rounded-[4px] px-2 py-1 text-[12px] font-bold", business.sponsored ? "bg-emerald-100 text-emerald-700" : "bg-cream text-muted")}>
            {business.sponsored ? "Active" : statusLabel(business.status)}
          </span>
        </div>
      </div>
    </div>
    <div className="divide-y divide-[#D8DFEA] border-t border-[#D8DFEA] text-[13px]">
      <InfoLine label="Paket Durumu" value={data.membership?.status ?? "Yok"} />
      <InfoLine label="Doping Bitiş" value={business.dopingUntil ? formatDateTime(business.dopingUntil) : "Yok"} />
      <InfoLine label="Kurucu Partner" value={business.founderPartner ? "Aktif" : "Yok"} />
    </div>
  </section>
);

const AdminNotesPanel = ({ data }: { data: CrmBusinessDetailData }) => (
  <section className={detailPanel}>
    <div className="border-b border-[#D8DFEA] px-5 py-3.5">
      <h3 className="text-[17px] font-extrabold text-ink">Admin Notes</h3>
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

const ContactsList = ({ data }: { data: CrmBusinessDetailData }) => {
  if (data.contacts.length === 0) return <Empty text="Bu işletme için yetkili kişi kaydı yok." />;
  return (
    <div className="mt-4 grid gap-2 md:grid-cols-2">
      {data.contacts.map((contact) => (
        <div key={contact.id} className="rounded-[8px] border border-line bg-cream/45 px-3 py-2">
          <p className="text-[13px] font-extrabold text-ink">
            {contact.fullName}
            {contact.title && <span className="font-semibold text-muted"> · {contact.title}</span>}
          </p>
          <p className="mt-1 text-[12px] font-semibold text-muted">
            {[contact.phone, contact.email].filter(Boolean).join(" · ") || "İletişim bilgisi yok"}
          </p>
        </div>
      ))}
    </div>
  );
};

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
  <div className="border-[#D8DFEA] px-5 py-4 md:border-r md:last:border-r-0">
    <p className="inline-flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-[.08em] text-muted">{icon}{label}</p>
    <strong className="mt-2 block text-[30px] font-extrabold leading-none text-ink">{value}</strong>
    <p className="mt-1 text-[12px] font-semibold text-emerald-700">{detail}</p>
  </div>
);

const InfoLine = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-4 px-5 py-3">
    <span className="font-semibold text-muted">{label}</span>
    <strong className="text-right font-bold text-ink">{value}</strong>
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
