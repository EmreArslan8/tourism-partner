"use client";

import { useState } from "react";
import type { FocusEvent, MouseEvent } from "react";
import { Link, usePathname, type Href } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useLinkStatus } from "next/link";
import TopProgressBar from "@/components/TopProgressBar";
import AdminSidebarTooltip, {
  getAdminSidebarTooltip,
  type AdminSidebarTooltipState,
} from "./AdminSidebarTooltip";
import {
  BarChart3,
  BellDot,
  BookOpenText,
  ClipboardList,
  FolderTree,
  Headset,
  Handshake,
  LayoutDashboard,
  Mail,
  Megaphone,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";

type Item = { href: Href; label: string; icon: React.ReactNode };

function AdminNavItem({ icon, label, collapsed, badge = 0 }: { icon: React.ReactNode; label: string; collapsed: boolean; badge?: number }) {
  const { pending } = useLinkStatus();

  return (
    <>
      <TopProgressBar active={pending} />
      <span className={cn("relative shrink-0 transition-opacity", pending && "opacity-55")}>
        {icon}
        {collapsed && badge > 0 && (
          <span className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5 rounded-full border border-paper bg-[#BA1A1A]" aria-hidden />
        )}
      </span>
      {!collapsed && <span className={cn("min-w-0 flex-1 truncate transition-opacity", pending && "opacity-55")}>{label}</span>}
      {!collapsed && badge > 0 && (
        <span className="grid h-[18px] min-w-[18px] shrink-0 place-items-center rounded-full bg-[#BA1A1A] px-1 text-[10px] font-bold leading-none text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
      <span
        aria-hidden
        className={cn(
          "h-2 w-2 shrink-0 rounded-full border-2 border-sapphire/25 border-t-sapphire opacity-0 transition-opacity",
          pending && "animate-spin opacity-100",
        )}
      />
      <span className="sr-only" aria-live="polite">{pending ? "Sayfa yükleniyor" : ""}</span>
    </>
  );
}

const ITEMS: Item[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={17} aria-hidden /> },
  { href: "/admin/tedarikciler", label: "İşletmeler (CRM)", icon: <Store size={17} aria-hidden /> },
  // Hesap düzeyindeki tek görünüm: alıcı (buyer) üyelerin işletme kaydı olmadığı için
  // İşletmeler CRM'inde görünmezler.
  { href: "/admin/uyeler", label: "Üyeler", icon: <Users size={17} aria-hidden /> },
  { href: "/admin/onay", label: "Başvurular", icon: <ShieldCheck size={17} aria-hidden /> },
  { href: "/admin/talepler", label: "Talepler (B2B ilan)", icon: <ClipboardList size={17} aria-hidden /> },
  { href: "/admin/partnerlik", label: "Partnerlik Ağı", icon: <Handshake size={17} aria-hidden /> },
  { href: "/admin/teklifler", label: "Teklifler", icon: <BellDot size={17} aria-hidden /> },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: <FolderTree size={17} aria-hidden /> },
  { href: "/admin/raporlar", label: "Raporlar", icon: <BarChart3 size={17} aria-hidden /> },
  { href: "/admin/reklam", label: "Reklam", icon: <Megaphone size={17} aria-hidden /> },
  { href: "/admin/tanitim", label: "Tanıtım Maili", icon: <Mail size={17} aria-hidden /> },
  { href: "/admin/destek", label: "Destek", icon: <Headset size={17} aria-hidden /> },
  { href: "/admin/icerik", label: "İçerik", icon: <BookOpenText size={17} aria-hidden /> },
  { href: "/admin/guvenlik", label: "Güvenlik & Ayarlar", icon: <ShieldCheck size={17} aria-hidden /> },
];

const AdminNav = ({ collapsed = false, newTicketCount = 0, newRequestCount = 0 }: { collapsed?: boolean; newTicketCount?: number; newRequestCount?: number }) => {
  const pathname = usePathname();
  const [tooltip, setTooltip] = useState<AdminSidebarTooltipState>(null);

  const showTooltip = (label: string, event: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
    if (collapsed) setTooltip(getAdminSidebarTooltip(label, event.currentTarget));
  };

  return (
    <>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3" onScroll={() => setTooltip(null)}>
        {ITEMS.map((item) => {
          const active =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href as string);
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-label={collapsed ? item.label : undefined}
              onMouseEnter={(event) => showTooltip(item.label, event)}
              onMouseLeave={() => setTooltip(null)}
              onFocus={(event) => showTooltip(item.label, event)}
              onBlur={() => setTooltip(null)}
              onClick={() => setTooltip(null)}
              className={cn(
                "group relative flex items-center gap-3 rounded-[8px] py-2.5 text-[13px] font-medium transition-colors",
                collapsed ? "justify-center px-0" : "px-3",
                active
                  ? "bg-cream text-brand"
                  : "text-muted hover:bg-cream/70 hover:text-brand",
              )}
            >
              <AdminNavItem
                icon={item.icon}
                label={item.label}
                collapsed={collapsed}
                badge={
                  item.href === "/admin/destek"
                    ? newTicketCount
                    : item.href === "/admin/talepler"
                      ? newRequestCount
                      : 0
                }
              />
            </Link>
          );
        })}
      </nav>
      <AdminSidebarTooltip tooltip={tooltip} />
    </>
  );
};

export default AdminNav;
