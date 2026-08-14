"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Href } from "@/i18n/navigation";
import { signOut } from "@/lib/actions/auth";
import styles from "./accountStyles";

export default function AccountMenu({ dashboardHref, onLight = false }: { dashboardHref: Href | null; onLight?: boolean }) {
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
    <div ref={rootRef} className={styles.root}>
      <button
        type="button"
        className={`${styles.trigger} ${onLight ? styles.triggerOnHero : ""}`}
        aria-label={triggerLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.icon}>
          <UserRound size={17} strokeWidth={2.4} aria-hidden />
        </span>
        <span className={styles.desktopLabel}>{triggerLabel}</span>
        <span className={styles.mobileLabel}>{t("account")}</span>
        <ChevronDown size={15} className={`${open ? "rotate-180 " : ""}${styles.chevron}`} aria-hidden />
      </button>

      {open && (
        <div
          role="menu"
          className={styles.menu}
        >
          {dashboardHref && (
            <Link
              href={dashboardHref}
              role="menuitem"
              className={styles.menuLink}
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
              className={styles.signOut}
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
