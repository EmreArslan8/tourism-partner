"use client";

import { useTranslations } from "next-intl";
import { BarChart } from "@tremor/react";
import { AlertCircle, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Link, type Href } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import styles from "./styles";
import type { PanelBusiness, PanelQuote } from "./view";

/* Panel genel bakış — KPI'lar, görüntülenme trendi, profil checklist'i ve son talepler.
   Görüntülenme verisi server'da (data.tsx) hesaplanıp props ile gelir; RLS policy'si
   henüz uygulanmadıysa sorgu boş döner ve tüm sayılar 0 görünür (hata üretmez). */

export type PanelViewDay = { label: string; impressions: number; details: number };
export type PanelViewStats = {
  /** Son 7 gün toplam görüntülenme (impression + profil ziyareti). */
  current: number;
  /** Önceki 7 gün toplamı — delta hesabı için. */
  previous: number;
  days: PanelViewDay[];
};

/* Profil doluluk kontrolleri — skor ve checklist aynı kaynaktan beslenir. */
export function getProfileChecklist(b: PanelBusiness | null, cover: string) {
  return [
    { key: "name", done: Boolean(b?.name) },
    { key: "type", done: Boolean(b?.type) },
    { key: "address", done: Boolean(b?.country && b?.city && b?.district) },
    { key: "description", done: Boolean(b?.description) },
    { key: "phone", done: Boolean(b?.phone) },
    { key: "website", done: Boolean(b?.website) },
    { key: "cover", done: Boolean(cover) },
    { key: "attributes", done: Boolean(b?.attributes?.length) },
    { key: "contacts", done: Boolean((b?.contactCount ?? 0) > 0) },
    { key: "partners", done: Boolean((b?.partnerActionCount ?? 0) > 0) },
  ] as const;
}

export function getProfileScore(b: PanelBusiness | null, cover: string) {
  const checks = getProfileChecklist(b, cover);
  return Math.round((checks.filter((c) => c.done).length / checks.length) * 100);
}

const QUOTE_STATUS_KEY: Record<string, string> = {
  new: "quoteStatusNew",
  in_progress: "quoteStatusInProgress",
  quoted: "quoteStatusQuoted",
  won: "quoteStatusWon",
  closed: "quoteStatusClosed",
  lost: "quoteStatusLost",
  rejected: "quoteStatusRejected",
};

export const OverviewDashboard = ({
  business,
  cover,
  statusKey,
  profileScore,
  newQuoteCount,
  editHref,
  viewStats,
  quotes,
  isAgency,
}: {
  business: PanelBusiness | null;
  cover: string;
  statusKey: "pending" | "approved" | "rejected";
  profileScore: number;
  newQuoteCount: number;
  editHref: Href;
  viewStats: PanelViewStats;
  quotes: PanelQuote[];
  isAgency: boolean;
}) => {
  const t = useTranslations("panel");
  const delta = viewStats.previous > 0 ? ((viewStats.current - viewStats.previous) / viewStats.previous) * 100 : null;
  const checklist = getProfileChecklist(business, cover);
  const missing = checklist.filter((c) => !c.done);
  const recentQuotes = quotes.slice(0, 3);

  return (
    <div className={styles.overviewStack}>
      <section className={styles.overviewHero}>
        <div>
          <span className={styles.eyebrow}>{t("overviewLabel")}</span>
          <h2>{business ? t("overviewReadyTitle") : t("overviewSetupTitle")}</h2>
          <p>{business ? t("panelReadySub") : t("panelSetupSub")}</p>
        </div>
        <div className="min-[820px]:justify-self-end">
          <Link href={editHref} className={styles.compactPrimaryButton}>
            {business ? t("editListing") : t("completeProfile")}
          </Link>
        </div>
      </section>

      {/* KPI satırı */}
      <section className={cn(styles.statsGrid, "mb-0")}>
        <div className={styles.metricCard}>
          <span>{t("viewsTitle")}</span>
          <strong>
            {viewStats.current.toLocaleString("tr-TR")}
            <DeltaBadge delta={delta} />
          </strong>
          <small>{t("viewsSub")}</small>
        </div>
        <div className={styles.metricCard}>
          <span>{isAgency ? t("openRequests") : t("newQuotes")}</span>
          <strong>{isAgency ? 0 : newQuoteCount}</strong>
          <small>{isAgency ? t("openRequestsSub") : t("quotesAwaiting", { count: newQuoteCount })}</small>
        </div>
        <div className={styles.metricCard}>
          <span>{t("statusLabel")}</span>
          <strong>
            <b className={cn(styles.statusBadge, styles.statusColors[statusKey])}>{t(`status_${statusKey}`)}</b>
          </strong>
          <small>{t("profileScore")} %{profileScore}</small>
        </div>
      </section>

      {/* Trend + checklist */}
      <div className="grid items-start gap-4 min-[980px]:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <article className={styles.section}>
          <h3 className={styles.sectionTitle}>{t("viewsTrendTitle")}</h3>
          <p className={styles.sectionSub}>{t("viewsSub")}</p>
          {business ? (
            <>
              <BarChart
                data={viewStats.days.map((d) => ({
                  gün: d.label,
                  [t("viewsImpressions")]: d.impressions,
                  [t("viewsDetails")]: d.details,
                }))}
                index="gün"
                categories={[t("viewsImpressions"), t("viewsDetails")]}
                colors={["sapphire", "gold"]}
                valueFormatter={(v: number) => v.toLocaleString("tr-TR")}
                yAxisWidth={40}
                showAnimation={false}
                className="h-56"
              />
              <Link href="/dashboard/doping" className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-sapphire hover:underline">
                {t("dopingCta")} <ArrowUpRight size={14} aria-hidden />
              </Link>
            </>
          ) : (
            <div className="grid place-items-center gap-3 rounded-[10px] border border-dashed border-line bg-cream/40 px-6 py-12 text-center">
              <p className="text-[14px] font-medium text-ink">{t("viewsEmptyTitle")}</p>
              <p className="max-w-[36ch] text-[13px] text-muted">{t("viewsEmptyText")}</p>
              <Link href={editHref} className={styles.compactPrimaryButton}>
                {t("completeProfile")}
              </Link>
            </div>
          )}
        </article>

        <article className={styles.section}>
          <h3 className={styles.sectionTitle}>{t("checklistTitle")}</h3>
          <p className={styles.sectionSub}>
            {t("profileScore")}: %{profileScore}
            {missing.length > 0 ? ` · ${t("checklistMissing", { count: missing.length })}` : ""}
          </p>
          <ul className="grid gap-2">
            {checklist.map((item) => (
              <li key={item.key} className="flex items-center justify-between gap-3 text-[13px]">
                <span className={cn("inline-flex items-center gap-2", item.done ? "text-muted line-through" : "font-semibold text-ink")}>
                  {item.done ? (
                    <CheckCircle2 size={15} className="shrink-0 text-group-saglik" aria-hidden />
                  ) : (
                    <AlertCircle size={15} className="shrink-0 text-amber-500" aria-hidden />
                  )}
                  {t(`check_${item.key}`)}
                </span>
                {!item.done && (
                  <Link href={editHref} className="shrink-0 text-[12px] font-bold text-sapphire hover:underline">
                    {t("checkFix")}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </article>
      </div>

      {/* Son talepler */}
      <section className={styles.section}>
        <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
          <h3 className={styles.sectionTitle}>{t("recentQuotesTitle")}</h3>
          <Link href="/dashboard/requests" className="text-[13px] font-semibold text-sapphire hover:underline">
            {t("viewAll")} →
          </Link>
        </div>
        {isAgency ? (
          <div className="grid justify-items-start gap-3 pt-2">
            <p className={styles.sectionSub}>{t("noAgencyRequests")}</p>
            <Link href="/quote" className={styles.compactSecondaryButton}>{t("createRequest")}</Link>
          </div>
        ) : recentQuotes.length === 0 ? (
          <p className={cn(styles.sectionSub, "pt-1")}>{t("noQuotes")}</p>
        ) : (
          <ul className="mt-3 grid gap-2">
            {recentQuotes.map((q) => {
              const statusLabelKey = QUOTE_STATUS_KEY[q.status];
              return (
                <li key={q.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-line/80 bg-cream/40 px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-ink">
                      {q.name}
                      {q.company ? ` · ${q.company}` : ""}
                    </p>
                    <p className="truncate text-[12.5px] text-muted">
                      {[q.service, new Date(q.created_at).toLocaleDateString("tr-TR")].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-bold",
                      q.status === "new" ? "bg-sapphire/15 text-sapphire" : "bg-cream text-ink/70",
                    )}
                  >
                    {statusLabelKey ? t(statusLabelKey) : q.status}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

const DeltaBadge = ({ delta }: { delta: number | null }) => {
  if (delta === null) {
    return <span className="ms-2 inline-flex rounded-full bg-cream/70 px-2 py-0.5 align-middle text-[11.5px] font-bold text-muted">—</span>;
  }
  const up = delta > 0;
  const flat = delta === 0;
  return (
    <span
      className={cn(
        "ms-2 inline-flex rounded-full px-2 py-0.5 align-middle text-[11.5px] font-bold",
        flat ? "bg-cream/70 text-muted" : up ? "bg-group-saglik/15 text-group-saglik" : "bg-red-50 text-red-700",
      )}
    >
      {flat ? "%0" : `${up ? "▲" : "▼"} %${Math.abs(delta).toLocaleString("tr-TR", { maximumFractionDigits: 1 })}`}
    </span>
  );
};
