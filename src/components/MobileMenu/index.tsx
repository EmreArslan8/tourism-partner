"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LangSwitcher from "@/components/LocaleSwitcher";
import styles from "./styles";


/* Mobil menü — sadece <900px'te görünür hamburger + açılır panel. */
const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");

  const links = [
    { href: { pathname: "/" }, label: t("home") },
    { href: { pathname: "/explore" }, label: t("explore") },
    { href: { pathname: "/", hash: "nasil" }, label: t("how") },
    { href: { pathname: "/quote" }, label: t("quote") },
    { href: { pathname: "/", hash: "sss" }, label: t("faq") },
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
              <Link key={l.label} href={l.href} scroll={!("hash" in l.href)} className={styles.link} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className={styles.actions}>
            <LangSwitcher />
            <Link href={{ pathname: "/login" }} className="btn btn-outline" onClick={() => setOpen(false)}>{t("login")}</Link>
            <Link href={{ pathname: "/register" }} className="btn btn-solid" onClick={() => setOpen(false)}>{t("addBusiness")}</Link>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
