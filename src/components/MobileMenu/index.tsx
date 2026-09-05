"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronRight, X } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import type { Href } from "@/i18n/navigation";
import SignOutForm from "@/components/auth/SignOutForm";
import Logo from "@/components/Logo";
import LangSwitcher from "@/components/LocaleSwitcher";
import styles from "./styles";


/* Mobil menü — sadece <900px'te görünür hamburger + tam ekran sheet.
   Sheet kendi üst çubuğunu (logo + kapat) taşır; böylece değişken header
   yüksekliğine bağlı kalmaz ve dengeli bir düzen sunar. */
const MobileMenu = ({ signedIn = false, dashboardHref = null, onLight = false }: { signedIn?: boolean; dashboardHref?: Href | null; onLight?: boolean }) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const t = useTranslations("nav");
  const common = useTranslations("common");
  const hero = useTranslations("hero");
  const router = useRouter();

  const links = [
    { href: { pathname: "/" }, label: t("home") },
    { href: { pathname: "/explore" }, label: t("explore") },
    { href: { pathname: "/about" }, label: t("about") },
    { href: { pathname: "/", hash: "nasil" }, label: t("how") },
    { href: { pathname: "/expo" }, label: t("expo") },
    { href: { pathname: "/", hash: "sss" }, label: t("faq") },
  ] as const;

  const close = () => setOpen(false);

  // Boş aramada da /kesfet'e götürür — kullanıcı listeye girip filtreleyebilsin.
  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? { pathname: "/explore", query: { q: term } } : { pathname: "/explore" });
    setQ("");
    close();
  };

  return (
    <>
      <button
        type="button"
        className={`${styles.button} ${onLight ? styles.buttonOnLight : ""}`}
        aria-label={common("menu")}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className="flex flex-col gap-[5px]">
          <span className={`${styles.bar} ${onLight ? styles.barOnLight : ""}`} />
          <span className={`${styles.bar} ${onLight ? styles.barOnLight : ""}`} />
          <span className={`${styles.bar} ${onLight ? styles.barOnLight : ""}`} />
        </span>
      </button>

      {open && (
        <div className={styles.sheet} role="dialog" aria-modal="true" aria-label={common("menu")}>
          <div className={styles.top}>
            <span onClick={close}>
              <Logo href="/" height={34} variant="brand" />
            </span>
            <div className={styles.topActions}>
              <button type="button" className={styles.close} aria-label={common("close")} onClick={close}>
                <X size={20} aria-hidden />
              </button>
            </div>
          </div>

          <div className={styles.searchWrap}>
            <form className={styles.searchForm} onSubmit={search}>
              <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="text"
                className={styles.searchInput}
                placeholder={hero("searchPh")}
                aria-label={hero("searchPh")}
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button type="submit" className={styles.searchSubmit}>
                {hero("searchBtn")}
              </button>
            </form>
          </div>

          <nav className={styles.list}>
            {links.map((l) => (
              <Link key={l.label} href={l.href} scroll={!("hash" in l.href)} className={styles.link} onClick={close}>
                <span>{l.label}</span>
                <ChevronRight size={18} className="text-muted dark:text-white" aria-hidden />
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
                <SignOutForm className="w-full">
                  <button type="submit" className="btn btn-outline w-full text-red-700" onClick={close}>{t("signOut")}</button>
                </SignOutForm>
              </>
            ) : (
              <>
                <Link
                  href={{ pathname: "/login" }}
                  className="btn w-full !border-brand/30 !bg-white !text-brand hover:!border-brand/55 hover:!bg-white/95"
                  onClick={close}
                >
                  {t("login")}
                </Link>
                <Link href={{ pathname: "/register" }} className="btn btn-solid w-full" onClick={close}>{t("addBusiness")}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
