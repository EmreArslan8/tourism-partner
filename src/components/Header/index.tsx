"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import Logo from "@/components/Logo";
import MobileMenu from "@/components/MobileMenu";
import MobileSearch from "@/components/MobileSearch";
import LangSwitcher from "@/components/LocaleSwitcher";
import styles from "./styles";


const Header = () => {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const links = [
    { href: { pathname: "/" }, label: t("home") },
    { href: { pathname: "/explore" }, label: t("explore") },
    { href: { pathname: "/", hash: "nasil" }, label: t("how") },
    { href: { pathname: "/quote" }, label: t("quote") },
    { href: { pathname: "/", hash: "sss" }, label: t("faq") },
  ] as const;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Logo href="/" height={60} variant="light" priority />
        </div>

        <nav className={styles.nav}>
          {links.map((link) => {
            const hrefObj = link.href as any;
            const isActive = pathname === hrefObj.pathname && !hrefObj.hash;
            
            return (
              <Link
                key={hrefObj.pathname + (hrefObj.hash || "")}
                href={link.href as any}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="col-start-3 flex items-center justify-self-end gap-1">
          <MobileSearch />
          <div className={styles.actions}>
            <LangSwitcher light />
            <div className={styles.separator} />
            <Link
              href={{ pathname: "/login" } as any}
              className="text-[15px] font-semibold text-white/90 hover:text-white transition-colors"
            >
              {t("agencyLogin")}
            </Link>
            <Link
              href={{ pathname: "/login" } as any}
              className="rounded-[10px] bg-white px-4 py-2.5 text-[15px] font-semibold text-brand shadow-[0_14px_28px_-20px_rgba(255,255,255,.75)] transition-colors hover:bg-cream"
            >
              {t("supplierLogin")}
            </Link>
          </div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
