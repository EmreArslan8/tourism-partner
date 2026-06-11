"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import Logo from "@/components/Logo";
import MobileMenu from "@/components/MobileMenu";
import LangSwitcher from "@/components/LocaleSwitcher";
import { s } from "./styles";

export default function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const links = [
    { href: "/", label: t("home") },
    { href: "/kesfet", label: t("explore") },
    { href: "/#nasil", label: t("how") },
    { href: "/teklif", label: t("quote") },
    { href: "/#sss", label: t("faq") },
  ];

  return (
    <header className={s.header}>
      <div className={s.inner}>
        <div className={s.left}>
          <Logo href="/" height={60} priority />
        </div>

        <nav className={s.nav}>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${s.navLink} ${isActive ? s.navLinkActive : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="col-start-3 flex items-center justify-self-end">
          <div className={s.actions}>
            <LangSwitcher />
            <div className={s.separator} />
            <Link href="/giris" className="text-[14px] font-semibold text-muted hover:text-ink transition-colors">
              {t("login")}
            </Link>
            <Link href="/kayit" className="btn btn-solid btn-sm !rounded-xl">
              {t("addBusiness")}
            </Link>
          </div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
