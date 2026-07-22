"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Href } from "@/i18n/navigation";
import { signOut } from "@/lib/actions/auth";
import LangSwitcher from "@/components/LocaleSwitcher";
import styles from "./styles";


/* Mobil menü — sadece <900px'te görünür hamburger + açılır panel. */
const MobileMenu = ({ signedIn = false, dashboardHref = null }: { signedIn?: boolean; dashboardHref?: Href | null }) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const common = useTranslations("common");

  const links = [
    { href: { pathname: "/" }, label: t("home") },
    { href: { pathname: "/explore" }, label: t("explore") },
    { href: { pathname: "/about" }, label: t("about") },
    { href: { pathname: "/", hash: "nasil" }, label: t("how") },
    { href: { pathname: "/blog" }, label: t("blog") },
    { href: { pathname: "/", hash: "sss" }, label: t("faq") },
  ] as const;

  return (
    <>
      <button
        type="button"
        className={styles.button}
        aria-label={common("menu")}
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
            {signedIn ? (
              <>
                {dashboardHref && (
                  <Link href={dashboardHref} className="btn btn-outline" onClick={() => setOpen(false)}>{t("dashboard")}</Link>
                )}
                <form action={signOut}>
                  <button type="submit" className="btn btn-outline text-red-700" onClick={() => setOpen(false)}>{t("signOut")}</button>
                </form>
              </>
            ) : (
              <>
                <Link href={{ pathname: "/login" }} className="btn btn-outline" onClick={() => setOpen(false)}>{t("login")}</Link>
                <Link href={{ pathname: "/register" }} className="btn btn-solid" onClick={() => setOpen(false)}>{t("addBusiness")}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
