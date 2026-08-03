"use client";

import { useState } from "react";
import type { FocusEvent, MouseEvent } from "react";
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/actions/auth";
import Logo from "@/components/Logo";
import AdminNav from "./AdminNav";
import AdminSidebarTooltip, {
  getAdminSidebarTooltip,
  type AdminSidebarTooltipState,
} from "./AdminSidebarTooltip";

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [tooltip, setTooltip] = useState<AdminSidebarTooltipState>(null);

  const showTooltip = (label: string, event: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
    if (collapsed) setTooltip(getAdminSidebarTooltip(label, event.currentTarget));
  };

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-line bg-paper/90 transition-[width] duration-200 md:flex",
        collapsed ? "w-[84px]" : "w-[264px]",
      )}
    >
      <div className={cn("flex h-[92px] items-center", collapsed ? "justify-center gap-1 px-1" : "justify-between px-6")}>
        <Logo href="/admin" height={collapsed ? 32 : 42} priority className={collapsed ? "max-w-[42px] overflow-hidden" : "max-w-[165px]"} />
        <button
          type="button"
          onClick={() => {
            setTooltip(null);
            setCollapsed((value) => !value);
          }}
          onMouseEnter={(event) => showTooltip("Menüyü genişlet", event)}
          onMouseLeave={() => setTooltip(null)}
          onFocus={(event) => showTooltip("Menüyü genişlet", event)}
          onBlur={() => setTooltip(null)}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] text-muted transition-colors hover:bg-cream hover:text-brand"
          aria-label={collapsed ? "Menüyü genişlet" : "Menüyü daralt"}
        >
          {collapsed ? <PanelLeftOpen size={16} aria-hidden /> : <PanelLeftClose size={16} aria-hidden />}
        </button>
      </div>

      <AdminNav collapsed={collapsed} />

      <div className={cn("mt-auto border-t border-line/80 pb-6 pt-4", collapsed ? "px-3" : "px-5")}>
        <form action={signOut}>
          <button
            type="submit"
            onMouseEnter={(event) => showTooltip("Çıkış Yap", event)}
            onMouseLeave={() => setTooltip(null)}
            onFocus={(event) => showTooltip("Çıkış Yap", event)}
            onBlur={() => setTooltip(null)}
            className={cn("group relative flex w-full items-center gap-3 rounded-[8px] py-2.5 text-[13px] font-medium text-muted transition-colors hover:bg-cream hover:text-brand", collapsed ? "justify-center px-0" : "px-3")}
          >
            <LogOut size={17} aria-hidden />
            {!collapsed && "Çıkış Yap"}
          </button>
        </form>
      </div>
      <AdminSidebarTooltip tooltip={tooltip} />
    </aside>
  );
}
