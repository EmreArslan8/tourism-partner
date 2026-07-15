"use client";

import type { LucideIcon } from "lucide-react";
import { Building2, FileText, Heart, LayoutDashboard, LifeBuoy, LogOut, Rocket, Search, Star } from "lucide-react";
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
export default function DashboardSidebar({ email, open, onClose }: { email: string; open: boolean; onClose: () => void }) {
  const t = useTranslations("panel");
  const pathname = usePathname();

  const items: { href: Href; icon: LucideIcon; label: string; match: string; exact?: boolean }[] = [
    { href: "/dashboard", icon: LayoutDashboard, label: t("overview"), match: "/dashboard", exact: true },
    { href: "/dashboard/listings", icon: Building2, label: t("listingDashboardTitle"), match: "/dashboard/listings" },
    { href: "/dashboard/requests", icon: FileText, label: t("requestsNav"), match: "/dashboard/requests" },
    { href: "/explore", icon: Search, label: t("searchSuppliers"), match: "/explore" },
    { href: "/dashboard/favorites", icon: Heart, label: t("favoritesNav"), match: "/dashboard/favorites" },
    { href: "/dashboard/reviews", icon: Star, label: t("reviewsNav"), match: "/dashboard/reviews" },
    { href: "/dashboard/doping", icon: Rocket, label: t("dopingNav"), match: "/dashboard/doping" },
    { href: "/dashboard/support", icon: LifeBuoy, label: t("supportNav"), match: "/dashboard/support" },
  ];

  const isActive = (match: string, exact?: boolean) =>
    exact ? pathname === match : pathname === match || pathname.startsWith(`${match}/`);

  return (
    <aside id="partner-dashboard-sidebar" className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
        <Link href="/" className={styles.brandMark} aria-label="Tourism Partner" onClick={onClose}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.svg" alt="Tourism Partner" className={styles.logoImg} />
        </Link>

        <nav className={styles.sideNav} aria-label="Partner dashboard">
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
            <button type="submit" className="flex w-full items-center gap-2 rounded-[8px] px-2 py-2 text-left text-[12.5px] font-medium text-red-700 transition-colors hover:bg-red-50">
              <LogOut size={15} aria-hidden />
              {t("signOut")}
            </button>
          </form>
        </div>
    </aside>
  );
}
