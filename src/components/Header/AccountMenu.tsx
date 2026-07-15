"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Href } from "@/i18n/navigation";
import { signOut } from "@/lib/actions/auth";

export default function AccountMenu({ dashboardHref }: { dashboardHref: Href | null }) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const triggerLabel = dashboardHref ? t("dashboard") : t("account");

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-white px-3.5 text-[15px] font-semibold text-brand shadow-[0_14px_28px_-20px_rgba(255,255,255,.75)] transition-colors hover:bg-cream min-[1440px]:h-11 min-[1440px]:px-4 min-[1440px]:text-[16px] min-[1800px]:text-[17px]"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <UserRound size={17} aria-hidden />
        <span>{triggerLabel}</span>
        <ChevronDown size={15} className={open ? "rotate-180 transition-transform" : "transition-transform"} aria-hidden />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute end-0 top-[calc(100%+10px)] z-50 grid min-w-[190px] gap-1 rounded-[10px] border border-white/15 bg-white p-1.5 text-ink shadow-[0_22px_60px_-28px_rgba(3,12,26,.55)]"
        >
          {dashboardHref && (
            <Link
              href={dashboardHref}
              role="menuitem"
              className="inline-flex items-center gap-2 rounded-[8px] px-3 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:bg-cream"
              onClick={() => setOpen(false)}
            >
              <LayoutDashboard size={16} aria-hidden />
              {t("dashboard")}
            </Link>
          )}
          <form action={signOut}>
            <button
              type="submit"
              role="menuitem"
              className="inline-flex w-full items-center gap-2 rounded-[8px] px-3 py-2.5 text-start text-[13.5px] font-semibold text-red-700 transition-colors hover:bg-red-50"
            >
              <LogOut size={16} aria-hidden />
              {t("signOut")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
