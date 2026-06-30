"use client";

import { Link, usePathname, type Href } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  BellDot,
  BookOpenText,
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
  { href: "/admin/teklifler", label: "Talepler", icon: <BellDot size={17} aria-hidden /> },
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
              "flex items-center gap-3 rounded-[7px] border-l-[3px] px-3 py-2.5 text-[13px] font-semibold transition-colors",
              active
                ? "border-[#2563EB] bg-[#DAE2FD] text-[#3D4B64]"
                : "border-transparent text-[#566178] hover:bg-[#EFF4FF] hover:text-[#0057D9]",
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
