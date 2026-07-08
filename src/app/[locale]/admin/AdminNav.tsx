"use client";

import { Link, usePathname, type Href } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  BellDot,
  BookOpenText,
  ClipboardList,
  FolderTree,
  HelpCircle,
  LayoutDashboard,
  Megaphone,
  ShieldCheck,
  Store,
} from "lucide-react";

type Item = { href: Href; label: string; icon: React.ReactNode };

const ITEMS: Item[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={17} aria-hidden /> },
  { href: "/admin/tedarikciler", label: "İşletmeler (CRM)", icon: <Store size={17} aria-hidden /> },
  { href: "/admin/onay", label: "Başvurular", icon: <ShieldCheck size={17} aria-hidden /> },
  { href: "/admin/talepler", label: "Talepler (B2B ilan)", icon: <ClipboardList size={17} aria-hidden /> },
  { href: "/admin/teklifler", label: "Teklifler", icon: <BellDot size={17} aria-hidden /> },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: <FolderTree size={17} aria-hidden /> },
  { href: "/admin/raporlar", label: "Raporlar", icon: <BarChart3 size={17} aria-hidden /> },
  { href: "/admin/reklam", label: "Reklam", icon: <Megaphone size={17} aria-hidden /> },
  { href: "/admin/destek", label: "Destek", icon: <HelpCircle size={17} aria-hidden /> },
  { href: "/admin/icerik", label: "İçerik", icon: <BookOpenText size={17} aria-hidden /> },
  { href: "/admin/guvenlik", label: "Güvenlik & Ayarlar", icon: <ShieldCheck size={17} aria-hidden /> },
];

const AdminNav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3">
      {ITEMS.map((item) => {
        const active =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href as string);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-[13px] font-medium transition-colors",
              active
                ? "bg-cream text-brand"
                : "text-muted hover:bg-cream/70 hover:text-brand",
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default AdminNav;
