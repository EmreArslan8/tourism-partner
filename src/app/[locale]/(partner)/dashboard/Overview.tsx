"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Activity, ArrowRight, ArrowUpRight, Building2, Bus, ChefHat, Globe2,
  Heart, MapPin, Plane, Star, Users,
} from "lucide-react";
import { Link, type Href } from "@/i18n/navigation";
import { serviceTranslationKey, groupUrlSlug } from "@/lib/categories";
import styles from "./styles";
import type { PanelBusiness, PanelQuote } from "./view";

export type PanelViewDay = { label: string; impressions: number; details: number };
export type PanelViewStats = { current: number; previous: number; days: PanelViewDay[] };
export type PanelFeaturedBusiness = { id: number; slug: string; name: string; type: string; city: string; country: string; rating: number; reviews: number; sponsored: boolean; image: string };
export type PanelAnnouncement = { id: number; title: string; createdAt: string };
export type PanelOverviewStats = { businesses: number; countries: number; categories: number; categoryCounts: Record<string, number> };

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
  ] as const;
}

export function getProfileScore(b: PanelBusiness | null, cover: string) {
  const checks = getProfileChecklist(b, cover);
  return Math.round((checks.filter((c) => c.done).length / checks.length) * 100);
}

const QUOTE_STATUS_KEY: Record<string, string> = {
  new: "quoteStatusNew", in_progress: "quoteStatusInProgress", quoted: "quoteStatusQuoted",
  won: "quoteStatusWon", closed: "quoteStatusClosed", lost: "quoteStatusLost", rejected: "quoteStatusRejected",
};

const categories = [
  { key: "konaklama", Icon: Building2 },
  { key: "acente", Icon: Plane },
  { key: "ulasim", Icon: Bus },
  { key: "rehber", Icon: Users },
  { key: "gastronomi", Icon: ChefHat },
  { key: "saglik", Icon: Heart },
  { key: "aktivite", Icon: Activity },
] as const;

export const OverviewDashboard = ({ business, newQuoteCount, quotes, isAgency, featuredBusinesses, announcements, overviewStats }: {
  business: PanelBusiness | null; cover: string; statusKey: "pending" | "approved" | "rejected";
  profileScore: number; newQuoteCount: number; editHref: Href; viewStats: PanelViewStats;
  quotes: PanelQuote[]; isAgency: boolean; featuredBusinesses: PanelFeaturedBusiness[];
  announcements: PanelAnnouncement[]; overviewStats: PanelOverviewStats;
}) => {
  const t = useTranslations("panel");
  const tc = useTranslations("cat");
  const ts = useTranslations("service");
  const serviceName = (value: string) => {
    const key = serviceTranslationKey(value);
    return key ? ts(key) : value;
  };
  const locale = useLocale();
  const steps = t.raw("hub.steps") as { title: string; desc: string }[];
  const recentQuotes = quotes.slice(0, 3);

  return (
    <div className={styles.dashboardOverview}>
      <div className={styles.dashboardMainColumn}>
        <section className={styles.dashboardHero}>
          <div className={styles.dashboardHeroShade} />
          <div className={styles.dashboardHeroContent}>
            <h2>{t("dashboardHeroTitle")}</h2>
            <p>{business ? t("dashboardHeroBusiness", { name: business.name }) : t("hub.heroText")}</p>
            <div className={styles.dashboardHeroActions}>
              <Link href="/explore" className={styles.dashboardHeroPrimary}>{t("hub.start")}</Link>
              <a href="#how-it-works" className={styles.dashboardHeroSecondary}>{t("hub.learn")}</a>
            </div>
          </div>
          <div className={styles.dashboardHeroStats}>
            <div><Building2 aria-hidden /><span><strong>{overviewStats.businesses.toLocaleString(locale)}</strong>{t("businessesNav")}</span></div>
            <div><Globe2 aria-hidden /><span><strong>{overviewStats.countries.toLocaleString(locale)}</strong>{t("hub.country")}</span></div>
            <div><Users aria-hidden /><span><strong>{overviewStats.categories.toLocaleString(locale)}</strong>{t("hub.category")}</span></div>
          </div>
        </section>

        <section>
          <SectionHead title={t("hub.categories")} label={t("hub.all")} href="/explore" />
          <div className={styles.dashboardCategoryGrid}>
            {categories.map(({ key, Icon }) => <Link href={{ pathname: "/explore", query: { cat: groupUrlSlug(key) } }} className={styles.dashboardCategoryCard} key={key}><span><Icon aria-hidden /></span><strong>{tc(key)}</strong><small>{overviewStats.categoryCounts[key]?.toLocaleString(locale) ?? "0"}</small></Link>)}
          </div>
        </section>

        <section>
          <SectionHead title={t("hub.featured")} label={t("hub.all")} href="/explore" />
          <div className={styles.dashboardFeaturedGrid}>
            {featuredBusinesses.map((item) => (
              <Link href={{ pathname: "/supplier/[id]", params: { id: item.slug } }} className={styles.dashboardBusinessCard} key={item.id}>
                <div className={styles.dashboardBusinessImage}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" />
                  <span>{serviceName(item.type)}</span><i><Heart aria-hidden /></i>
                </div>
                <div className={styles.dashboardBusinessBody}>
                  <strong>{item.name}</strong><small><MapPin aria-hidden />{[item.city, item.country].filter(Boolean).join(", ")}</small>
                  {(item.reviews > 0 || item.sponsored) && <div>{item.reviews > 0 ? <span><Star aria-hidden /> {item.rating.toLocaleString(locale, { maximumFractionDigits: 1 })} <small>({item.reviews.toLocaleString(locale)})</small></span> : <span />}{item.sponsored && <em>{t("hub.premium")}</em>}</div>}
                </div>
              </Link>
            ))}
            {featuredBusinesses.length === 0 && <div className={styles.dashboardEmptyState}>{t("hub.empty")}</div>}
          </div>
        </section>
      </div>

      <aside className={styles.dashboardRail}>
        <section className={`${styles.dashboardRailCard} ${styles.dashboardQuotePanel}`}>
          <div className={styles.dashboardRailHead}><div><span>{t("recentQuotesTitle")}</span><small>{t("quotesAwaiting", { count: newQuoteCount })}</small></div><Link href="/dashboard/requests">{t("hub.all")} <ArrowRight aria-hidden /></Link></div>
          {isAgency ? <div className={styles.dashboardRailEmpty}><p>{t("noAgencyRequests")}</p><Link href="/quote">{t("createRequest")}</Link></div> : recentQuotes.length === 0 ? <div className={styles.dashboardRailEmpty}><p>{t("noQuotes")}</p></div> : (
            <ul className={styles.dashboardQuoteList}>{recentQuotes.map((quote) => <li key={quote.id}><div><strong>{quote.name}</strong><span>{quote.service || quote.company || "—"}</span></div><small className={quote.status === "new" ? styles.dashboardQuoteNew : undefined}>{QUOTE_STATUS_KEY[quote.status] ? t(QUOTE_STATUS_KEY[quote.status]) : quote.status}</small></li>)}</ul>
          )}
        </section>

        <section className={styles.dashboardPromo}>
          <div><h3>{t("hub.promoTitle")}</h3><p>{t("hub.promoText")}</p><Link href="/dashboard/doping">{t("hub.promoCta")} <ArrowUpRight aria-hidden /></Link></div>
        </section>

        <section className={styles.dashboardRailCard}>
          <div className={styles.dashboardRailHead}><div><span>{t("hub.announcements")}</span></div><Link href="/dashboard/support">{t("hub.all")} <ArrowRight aria-hidden /></Link></div>
          {announcements.length > 0 ? <ul className={styles.dashboardAnnouncementList}>{announcements.map((item) => <li key={item.id}><i /><span>{item.title}<small>{new Date(item.createdAt).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}</small></span></li>)}</ul> : <div className={styles.dashboardRailEmpty}><p>{t("hub.empty")}</p></div>}
        </section>
      </aside>

      <section id="how-it-works" className={styles.dashboardHow}>
        <h3>{t("hub.how")}</h3>
        <div>{steps.map(({ title, desc }, index) => <article key={title}><span>{index + 1}</span><p><strong>{title}</strong><small>{desc}</small></p>{index < steps.length - 1 && <ArrowRight aria-hidden />}</article>)}</div>
      </section>
    </div>
  );
};

function SectionHead({ title, label, href }: { title: string; label: string; href: Href }) {
  return <div className={styles.dashboardSectionHead}><h3>{title}</h3><Link href={href}>{label} <ArrowRight aria-hidden /></Link></div>;
}
