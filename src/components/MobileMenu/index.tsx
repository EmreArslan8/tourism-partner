"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { ChevronRight, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Href } from "@/i18n/navigation";
import { signOut } from "@/lib/actions/auth";
import Logo from "@/components/Logo";
import LangSwitcher from "@/components/LocaleSwitcher";
import styles from "./styles";


/* Mobil menü — sadece <900px'te görünür hamburger + tam ekran sheet.
   Sheet kendi üst çubuğunu (logo + kapat) taşır; böylece değişken header
   yüksekliğine bağlı kalmaz ve dengeli bir düzen sunar. */
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

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        className={styles.button}
        aria-label={common("menu")}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className="flex flex-col gap-[5px]">
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </span>
      </button>

      {open && createPortal(
        <div className={styles.sheet} role="dialog" aria-modal="true" aria-label={common("menu")}>
          <div className={styles.top}>
            <span onClick={close}>
              <Logo href="/" height={34} variant="brand" />
            </span>
            <button type="button" className={styles.close} aria-label={common("close")} onClick={close}>
              <X size={20} aria-hidden />
            </button>
          </div>

          <nav className={styles.list}>
            {links.map((l) => (
              <Link key={l.label} href={l.href} scroll={!("hash" in l.href)} className={styles.link} onClick={close}>
                <span>{l.label}</span>
                <ChevronRight size={18} className="text-muted" aria-hidden />
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            <LangSwitcher inline />
            {signedIn ? (
              <>
                {dashboardHref && (
                  <Link href={dashboardHref} className="btn btn-solid w-full" onClick={close}>{t("dashboard")}</Link>
                )}
                <form action={signOut} className="w-full">
                  <button type="submit" className="btn btn-outline w-full text-red-700" onClick={close}>{t("signOut")}</button>
                </form>
              </>
            ) : (
              <>
                <Link href={{ pathname: "/login" }} className="btn btn-outline w-full" onClick={close}>{t("login")}</Link>
                <Link href={{ pathname: "/register" }} className="btn btn-solid w-full" onClick={close}>{t("addBusiness")}</Link>
              </>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
};

export default MobileMenu;
