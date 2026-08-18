"use client";

import type { LucideIcon } from "lucide-react";
import { Building2, FileText, Headset, Heart, Inbox, LayoutDashboard, LogOut, Rocket, Search, Star, X } from "lucide-react";
import { useLinkStatus } from "next/link";
import { useTranslations } from "next-intl";
import { Link, usePathname, type Href } from "@/i18n/navigation";
import { signOut } from "@/lib/actions/auth";
import TopProgressBar from "@/components/TopProgressBar";
import styles from "./styles";

/* Nav öğesi — link'in navigasyonu beklerken (useLinkStatus.pending) üstteki
   ilerleme çubuğunu tetikler; iş bitince %100'e tamamlanıp kaybolur. Yalnız
   tıklanan link pending olduğundan tek bar görünür. Hook, Link'in çocuğu olmalı. */
function NavItemInner({ Icon, label }: { Icon: LucideIcon; label: string }) {
  const { pending } = useLinkStatus();
  return (
    <>
      <TopProgressBar active={pending} />
      <Icon size={17} aria-hidden />
      <span className={pending ? "opacity-60" : undefined}>{label}</span>
    </>
  );
}

/* Panel sol menüsü — tüm dashboard alt sayfalarında ortak (dashboard/layout.tsx).
   Aktif link, next-intl usePathname (dahili/locale'siz yol) ile belirlenir. */
export default function DashboardSidebar({ email, accountType, open, onClose }: { email: string; accountType: string | null; open: boolean; onClose: () => void }) {
  const t = useTranslations("panel");
  const pathname = usePathname();

  const supplierItems: { href: Href; icon: LucideIcon; label: string; match: string; exact?: boolean }[] = [
    { href: "/dashboard", icon: LayoutDashboard, label: t("overview"), match: "/dashboard", exact: true },
    { href: "/dashboard/businesses", icon: Building2, label: t("businessesNav"), match: "/dashboard/businesses" },
    { href: "/dashboard/requests", icon: FileText, label: t("requestsNav"), match: "/dashboard/requests" },
    { href: "/dashboard/teklifler", icon: Inbox, label: t("quotesInboxNav"), match: "/dashboard/teklifler" },
    { href: "/explore", icon: Search, label: t("searchSuppliers"), match: "/explore" },
    { href: "/dashboard/favorites", icon: Heart, label: t("favoritesNav"), match: "/dashboard/favorites" },
    { href: "/dashboard/reviews", icon: Star, label: t("reviewsNav"), match: "/dashboard/reviews" },
    { href: "/dashboard/doping", icon: Rocket, label: t("dopingNav"), match: "/dashboard/doping" },
    { href: "/dashboard/support", icon: Headset, label: t("supportNav"), match: "/dashboard/support" },
  ];
  const buyerItems: { href: Href; icon: LucideIcon; label: string; match: string; exact?: boolean }[] = [
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
          className="absolute end-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-[10px] border border-line bg-cream/50 text-brand transition-colors hover:bg-cream active:scale-95 min-[900px]:hidden"
        >
          <X size={18} aria-hidden />
        </button>
        <Link href="/" className={styles.brandMark} aria-label="Tourism Partner" onClick={onClose}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.svg" alt="Tourism Partner" className={styles.logoImg} />
        </Link>

        <nav className={styles.sideNav} aria-label={t("partnerWorkspace")}>
          {items.map(({ href, icon, label, match, exact }) => (
            <Link key={match} href={href} className={isActive(match, exact) ? styles.sideNavActive : undefined} onClick={onClose}>
              <NavItemInner Icon={icon} label={label} />
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFoot}>
          <span>{t("signedInAs")}</span>
          <b>{email}</b>
          <form action={signOut} className="mt-3">
            <button type="submit" className="flex w-full items-center gap-2 rounded-[8px] px-2 py-2 text-start text-[12.5px] font-medium text-red-700 transition-colors hover:bg-red-50">
              <LogOut size={15} aria-hidden />
              {t("signOut")}
            </button>
          </form>
        </div>
    </aside>
  );
}
