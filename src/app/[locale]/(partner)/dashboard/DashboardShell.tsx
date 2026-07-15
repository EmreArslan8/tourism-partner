"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Logo from "@/components/Logo";
import DashboardSidebar from "./Sidebar";
import styles from "./styles";

export default function DashboardShell({ email, accountType, children }: { email: string; accountType: string | null; children: React.ReactNode }) {
  const t = useTranslations("panel");
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className={styles.mobileHeader}>
        <Logo href="/" height={38} variant="brand" priority />
        <div className={styles.mobileHeaderMeta}>
          <span>{t("partnerWorkspace")}</span>
          <button
            type="button"
            className={styles.mobileMenuButton}
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
            aria-controls="partner-dashboard-sidebar"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </header>

      {open && <button type="button" className={styles.mobileBackdrop} aria-label={t("closeMenu")} onClick={() => setOpen(false)} />}
      <DashboardSidebar email={email} accountType={accountType} open={open} onClose={() => setOpen(false)} />
      <section className={styles.workspace}>{children}</section>
    </>
  );
}
