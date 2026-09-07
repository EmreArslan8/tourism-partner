"use client";

import type { LucideIcon } from "lucide-react";
import { Building2, FileText, Headset, Heart, Inbox, LayoutDashboard, LogOut, Rocket, Search, Star, Tag, TrendingUp, X } from "lucide-react";
import { useEffect } from "react";
import { useLinkStatus } from "next/link";
import { useTranslations } from "next-intl";
import { Link, usePathname, type Href } from "@/i18n/navigation";
import SignOutForm from "@/components/auth/SignOutForm";
import TopProgressBar from "@/components/TopProgressBar";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import styles from "./styles";
import { DEALS_BADGE_KEY, DEALS_FEATURE_KEY, markFeatureSeen, startBadgeWindow, useBadgeActive } from "./whats-new";

/* Nav öğesi — link'in navigasyonu beklerken (useLinkStatus.pending) üstteki
   ilerleme çubuğunu tetikler; iş bitince %100'e tamamlanıp kaybolur. Yalnız
   tıklanan link pending olduğundan tek bar görünür. Hook, Link'in çocuğu olmalı. */
function NavItemInner({ Icon, label, badge }: { Icon: LucideIcon; label: string; badge?: string }) {
  const { pending } = useLinkStatus();
  return (
    <>
      <TopProgressBar active={pending} />
      <Icon size={17} aria-hidden />
      <span className={pending ? "opacity-60" : undefined}>{label}</span>
      {badge && (
        <span className="ms-auto shrink-0 rounded-pill bg-[#ffd88a] px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[.04em] text-[#4b2d00]">
          {badge}
        </span>
      )}
    </>
  );
}

/* Panel sol menüsü — tüm dashboard alt sayfalarında ortak (dashboard/layout.tsx).
   Aktif link, next-intl usePathname (dahili/locale'siz yol) ile belirlenir. */
export default function DashboardSidebar({ email, accountType, open, onClose }: { email: string; accountType: string | null; open: boolean; onClose: () => void }) {
  const t = useTranslations("panel");
  const pathname = usePathname();
  const dealsBadge = useBadgeActive(DEALS_BADGE_KEY);

  // Rozet penceresi paneli ilk açışta başlar ve 3 gün sürer.
  useEffect(() => {
    startBadgeWindow(DEALS_BADGE_KEY);
  }, []);

  // Sayfaya girildiyse duyuru modalı bir daha açılmaz (rozet zamanla söner).
  useEffect(() => {
    if (pathname === "/dashboard/firsatlar" || pathname.startsWith("/dashboard/firsatlar/")) {
      markFeatureSeen(DEALS_FEATURE_KEY);
    }
  }, [pathname]);

  const supplierItems: { href: Href; icon: LucideIcon; label: string; match: string; exact?: boolean; featured?: boolean; badge?: string }[] = [
    { href: "/dashboard", icon: LayoutDashboard, label: t("overview"), match: "/dashboard", exact: true },
    { href: "/dashboard/businesses", icon: Building2, label: t("businessesNav"), match: "/dashboard/businesses" },
    { href: "/dashboard/requests", icon: FileText, label: t("requestsNav"), match: "/dashboard/requests" },
    { href: "/dashboard/firsatlar", icon: Tag, label: t("dealsNav"), match: "/dashboard/firsatlar", badge: dealsBadge ? t("navNewBadge") : undefined },
    { href: "/dashboard/teklifler", icon: Inbox, label: t("quotesInboxNav"), match: "/dashboard/teklifler" },
    { href: "/dashboard/favorites", icon: Heart, label: t("favoritesNav"), match: "/dashboard/favorites" },
    { href: "/dashboard/reviews", icon: Star, label: t("reviewsNav"), match: "/dashboard/reviews" },
    { href: "/dashboard/doping", icon: Rocket, label: t("dopingNav"), match: "/dashboard/doping", featured: true },
    { href: "/dashboard/support", icon: Headset, label: t("supportNav"), match: "/dashboard/support" },
  ];
  const buyerItems: { href: Href; icon: LucideIcon; label: string; match: string; exact?: boolean; featured?: boolean; badge?: string }[] = [
    { href: "/dashboard", icon: LayoutDashboard, label: t("overview"), match: "/dashboard", exact: true },
    { href: "/explore", icon: Search, label: t("searchSuppliers"), match: "/explore" },
    { href: "/dashboard/requests", icon: FileText, label: t("requestsMineNav"), match: "/dashboard/requests" },
    { href: "/dashboard/favorites", icon: Heart, label: t("favoritesNav"), match: "/dashboard/favorites" },
    { href: "/dashboard/support", icon: Headset, label: t("supportNav"), match: "/dashboard/support" },
  ];
  const items = accountType === "buyer" ? buyerItems : supplierItems;

  const isActive = (match: string, exact?: boolean) =>
    exact ? pathname === match : pathname === match || pathname.startsWith(`${match}/`);

  return (
    <aside id="partner-dashboard-sidebar" className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("closeMenu")}
          className="absolute end-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-[10px] border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/15 active:scale-95 min-[900px]:hidden"
        >
          <X size={18} aria-hidden />
        </button>
        <Link href="/" className={styles.brandMark} aria-label="Tourism Partner" onClick={onClose}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo-white.svg" alt="Tourism Partner" className={styles.logoImg} />
        </Link>

        <nav className={styles.sideNav} aria-label={t("partnerWorkspace")}>
          {items.map(({ href, icon, label, match, exact, featured, badge }) => (
            <Link
              key={match}
              href={href}
              className={featured
                ? `${styles.sideNavBoost} ${isActive(match, exact) ? styles.sideNavBoostActive : ""}`
                : isActive(match, exact) ? styles.sideNavActive : undefined}
              onClick={onClose}
            >
              <NavItemInner Icon={icon} label={label} badge={badge} />
            </Link>
          ))}
        </nav>

        <div className={`${styles.sidebarPromo} tp-sidebar-boost`}>
          {/* İkon, altın zeminde kaybolmasın diye koyu bir rozetin içinde durur;
              ince çizgili elmas yerine silueti net "yükseliş" ikonu. */}
          <div className="tp-sidebar-boost-icon grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#ffe7a0]/45 bg-[#3d2503] shadow-[inset_0_1px_0_rgba(255,244,199,.25)]">
            <TrendingUp className="h-[22px] w-[22px] text-[#ffdc86]" strokeWidth={2.6} aria-hidden />
          </div>
          <div>
            <strong>{t("visibilityPromoTitle")}</strong>
            <span>{t("visibilityPromoText")}</span>
          </div>
          <Link href="/dashboard/doping" onClick={onClose}>{t("dopingCta")}</Link>
        </div>

        <LocaleSwitcher sidebar />

        <div className={styles.sidebarFoot}>
          <span>{t("signedInAs")}</span>
          <b>{email}</b>
          <SignOutForm className="mt-3">
            <button type="submit" className="flex w-full items-center gap-2 rounded-[8px] px-2 py-2 text-start text-[12.5px] font-medium text-red-700 transition-colors hover:bg-red-50">
              <LogOut size={15} aria-hidden />
              {t("signOut")}
            </button>
          </SignOutForm>
        </div>
    </aside>
  );
}
