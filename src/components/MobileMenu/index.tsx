"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LangSwitcher from "@/components/LocaleSwitcher";
import { styles } from "./styles";


/* Mobil menü — sadece <900px'te görünür hamburger + açılır panel. */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");

  const links = [
    { href: "/", label: t("home") },
    { href: "/kesfet", label: t("explore") },
    { href: "/#nasil", label: t("how") },
    { href: "/teklif", label: t("quote") },
    { href: "/#sss", label: t("faq") },
  ] as const;

  return (
    <>
      <button
        type="button"
        className={styles.button}
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex flex-col gap-[5px]">
          <span className={`${styles.bar} ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`${styles.bar} ${open ? "opacity-0" : ""}`} />
          <span className={`${styles.bar} ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </span>
      </button>

      {open && (
        <div className={styles.panel}>
          <nav className={styles.list}>
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={styles.link} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className={styles.actions}>
            <LangSwitcher />
            <Link href="/giris" className="btn btn-outline" onClick={() => setOpen(false)}>{t("login")}</Link>
            <Link href="/kayit" className="btn btn-solid" onClick={() => setOpen(false)}>{t("addBusiness")}</Link>
          </div>
        </div>
      )}
    </>
  );
}
