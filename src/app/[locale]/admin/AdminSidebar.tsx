"use client";

import { useEffect, useState } from "react";
import type { FocusEvent, MouseEvent } from "react";
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { cn } from "@/lib/utils";
import SignOutForm from "@/components/auth/SignOutForm";
import Logo from "@/components/Logo";
import AdminNav from "./AdminNav";
import AdminSidebarTooltip, {
  getAdminSidebarTooltip,
  type AdminSidebarTooltipState,
} from "./AdminSidebarTooltip";

export default function AdminSidebar({ newTicketCount = 0, newRequestCount = 0 }: { newTicketCount?: number; newRequestCount?: number }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tooltip, setTooltip] = useState<AdminSidebarTooltipState>(null);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  const showTooltip = (label: string, event: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
    if (collapsed) setTooltip(getAdminSidebarTooltip(label, event.currentTarget));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-5 top-[15px] z-40 grid h-10 w-10 place-items-center rounded-[8px] border border-line bg-paper text-brand shadow-card transition-colors hover:bg-cream md:hidden"
        aria-label="Menüyü aç"
        aria-expanded={mobileOpen}
        aria-controls="admin-mobile-sidebar"
      >
        <Menu size={20} aria-hidden />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#07112a]/45 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
            aria-label="Menüyü kapat"
          />
          <aside
            id="admin-mobile-sidebar"
            className="relative flex h-full w-[min(86vw,320px)] flex-col border-r border-line bg-paper shadow-[20px_0_60px_-24px_rgba(7,17,42,.65)]"
            aria-label="Admin menüsü"
          >
            <div className="flex h-[76px] items-center justify-between px-5">
              <Logo href="/admin" height={38} priority className="max-w-[158px]" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-[8px] text-muted transition-colors hover:bg-cream hover:text-brand"
                aria-label="Menüyü kapat"
              >
                <X size={20} aria-hidden />
              </button>
            </div>

            <AdminNav
              collapsed={false}
              newTicketCount={newTicketCount}
              newRequestCount={newRequestCount}
              onNavigate={() => setMobileOpen(false)}
            />

            <div className="mt-auto border-t border-line/80 px-5 pb-6 pt-4">
              <SignOutForm>
                <button
                  type="submit"
                  className="group relative flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-[13px] font-medium text-muted transition-colors hover:bg-cream hover:text-brand"
                >
                  <LogOut size={17} aria-hidden />
                  Çıkış Yap
                </button>
              </SignOutForm>
            </div>
          </aside>
        </div>
      )}

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

      <AdminNav collapsed={collapsed} newTicketCount={newTicketCount} newRequestCount={newRequestCount} />

      <div className={cn("mt-auto border-t border-line/80 pb-6 pt-4", collapsed ? "px-3" : "px-5")}>
        <SignOutForm>
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
        </SignOutForm>
      </div>
      <AdminSidebarTooltip tooltip={tooltip} />
      </aside>
    </>
  );
}
