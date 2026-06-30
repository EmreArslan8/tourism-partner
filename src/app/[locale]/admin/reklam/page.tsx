import { BadgePlus, Megaphone, TimerReset } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { getAdminData } from "@/lib/admin";
import { getAdminAdData } from "@/lib/platform-data";
import { createAdBanner, deleteAdBanner } from "@/lib/actions/platform";
import { PageHeader, Card, CardHeader, Metric } from "../_components";
import { Field, DataTable, StatusBadge, EmptyState, ConfirmAction, type Column } from "@/components/common";
import type { AdBannerRow } from "@/lib/supabase/database.types";

const input = "field min-h-[42px] w-full rounded-lg border-[#E2E8F0] bg-white normal-case tracking-normal text-[#0B1C30]";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [data, ads] = await Promise.all([getAdminData(), getAdminAdData()]);
  const premium = data.businesses.filter((b) => b.sponsored);
  const fresh = [...data.businesses]
    .filter((b) => b.dopingUntil)
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    .slice(0, 10);

  return (
    <>
      <PageHeader
        eyebrow="Reklam"
        title="Gelir ve Görünürlük Yönetimi"
        description="Banner alanları, Premium Partner dopingi ve yeni işletme görünürlüğünü yönetin."
      />

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <Metric title="Aktif Banner" value={ads.activeBanners.length} hint="yayında" />
        <Metric title="Premium Partner" value={premium.length} hint="kalıcı doping" />
        <Metric title="Süreli Yeni Doping" value={fresh.length} hint="24 saat / paket" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="hover:translate-y-0">
          <CardHeader title="Banner Reklam Yönetimi" tone="blue" icon={<Megaphone size={18} aria-hidden />} />
          <form action={createAdBanner} className="p-5">
            <input type="hidden" name="locale" value={locale} />
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Banner başlığı" required><input name="title" required className={input} placeholder="Yaz sezonu kampanyası" /></Field>
              <Field label="Yönlendirme URL" required><input name="target_url" required className={input} placeholder="https://..." /></Field>
              <Field label="Başlangıç tarihi"><input name="starts_at" type="date" className={input} /></Field>
              <Field label="Bitiş tarihi"><input name="ends_at" type="date" className={input} /></Field>
              <Field label="Görsel yolu" required className="md:col-span-2"><input name="image_url" required className={input} placeholder="/assets/banner.webp" /></Field>
            </div>
            <button type="submit" className="mt-4 h-10 rounded-lg bg-[#0057D9] px-5 text-[13px] font-extrabold text-white hover:bg-[#0047B8]">
              Banner Kaydet
            </button>
          </form>
        </Card>

        <aside className="grid gap-6">
          <DopingCard title="Premium Partner" tone="amber" icon={<BadgePlus size={18} aria-hidden />} items={premium.map((b) => b.name)} empty="Premium partner yok." />
          <DopingCard title="Yeni İşletme Dopingi" tone="emerald" icon={<TimerReset size={18} aria-hidden />} items={fresh.map((b) => b.name)} empty="Süreli doping yok." />
        </aside>
      </div>

      {/* Mevcut bannerlar — listele + sil */}
      <Card className="mt-6 overflow-hidden hover:translate-y-0">
        <CardHeader
          title="Mevcut Bannerlar"
          tone="blue"
          icon={<Megaphone size={18} aria-hidden />}
          action={<span className="shrink-0 text-[12px] font-semibold text-[#566178]">{ads.banners.length} banner</span>}
        />
        {ads.banners.length === 0 ? (
          <EmptyState className="border-0" title="Henüz banner yok" description="Yukarıdaki formdan ilk banner'ı ekleyin." />
        ) : (
          <DataTable
            data={ads.banners}
            getRowKey={(b) => b.id}
            minWidth={720}
            columns={[
              { key: "title", header: "Başlık", cell: (b) => <span className="font-bold text-[#162238]">{b.title}</span> },
              { key: "placement", header: "Yerleşim", cell: (b) => <span className="text-muted">{b.placement}</span> },
              { key: "status", header: "Durum", cell: (b) => <StatusBadge tone={BANNER_TONE[b.status] ?? "neutral"}>{b.status}</StatusBadge> },
              {
                key: "date",
                header: "Tarih",
                cell: (b) => <span className="text-muted">{bannerRange(b.starts_at, b.ends_at)}</span>,
              },
              {
                key: "action",
                header: "İşlem",
                align: "right",
                cell: (b) => (
                  <ConfirmAction
                    action={deleteAdBanner}
                    fields={{ id: String(b.id), locale }}
                    title="Banner sil"
                    description={`"${b.title}" banner'ı kalıcı olarak silinecek.`}
                    confirmLabel="Sil"
                    danger
                    trigger={
                      <button type="button" className="rounded-lg border border-red-200 px-3 py-1.5 text-[12px] font-semibold text-red-600 hover:bg-red-50">
                        Sil
                      </button>
                    }
                  />
                ),
              },
            ] satisfies Column<AdBannerRow>[]}
          />
        )}
      </Card>
    </>
  );
}

const BANNER_TONE: Record<string, "green" | "amber" | "neutral"> = {
  active: "green",
  paused: "amber",
  draft: "neutral",
  archived: "neutral",
};

const bannerRange = (s: string | null, e: string | null) => {
  const f = (v: string | null) => (v ? new Date(v).toLocaleDateString("tr-TR") : "—");
  if (!s && !e) return "Süresiz";
  return `${f(s)} – ${f(e)}`;
};

const DopingCard = ({
  title,
  tone,
  icon,
  items,
  empty,
}: {
  title: string;
  tone: "blue" | "amber" | "emerald";
  icon: React.ReactNode;
  items: string[];
  empty: string;
}) => (
  <Card className="hover:translate-y-0">
    <CardHeader title={title} tone={tone} icon={icon} action={<span className="shrink-0 text-[12px] font-semibold text-[#566178]">{items.length}</span>} />
    <div className="p-4">
      {items.length === 0 ? (
        <p className="px-1 py-3 text-[13px] font-semibold text-[#64748B]">{empty}</p>
      ) : (
        <div className="grid gap-2">
          {items.map((item) => (
            <div key={item} className="rounded-lg border border-line bg-[#FBFCFF] px-3 py-2 text-[13px] font-bold text-[#3D4B64]">
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  </Card>
);
