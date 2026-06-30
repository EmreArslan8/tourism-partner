import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Href } from "@/i18n/navigation";
import Logo from "@/components/Logo";
import MobileMenu from "@/components/MobileMenu";
import MobileSearch from "@/components/MobileSearch";
import LangSwitcher from "@/components/LocaleSwitcher";
import NavLinks from "./NavLinks";
import styles from "./styles";

/*
 * Header — server component. Statik yapı sunucuda render edilir; etkileşim parçaları
 * (NavLinks, MobileMenu, MobileSearch, LocaleSwitcher) birer "use client" adasıdır.
 * variant="glass": anasayfa hero görseli üstünde camsı; varsayılan iç sayfalarda opak sapphire.
 */
type HeaderVariant = "glass" | "solid";

type HeaderProps = {
  variant?: HeaderVariant;
  /** @deprecated Use variant="glass" instead. */
  transparent?: boolean;
};

const Header = async ({ variant = "solid", transparent = false }: HeaderProps) => {
  const t = await getTranslations("nav");
  const resolvedVariant: HeaderVariant = transparent ? "glass" : variant;

  const links: { href: Href; label: string }[] = [
    { href: { pathname: "/explore" }, label: t("explore") },
    { href: { pathname: "/", hash: "nasil" }, label: t("how") },
    { href: { pathname: "/quote" }, label: t("quote") },
    { href: { pathname: "/", hash: "sss" }, label: t("faq") },
  ];

  return (
    <header className={`${styles.header} ${resolvedVariant === "glass" ? styles.headerGlass : styles.headerSolid}`}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Logo href="/" height={54} variant="light" priority />
        </div>

        <NavLinks links={links} />

        <div className="col-start-3 flex items-center justify-self-end gap-1">
          <MobileSearch />
          <div className={styles.actions}>
            <Link
              href={{ pathname: "/login" } as any}
              className="rounded-[10px] border border-white/30 px-4 py-2 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t("login")}
            </Link>
            <Link
              href={{ pathname: "/register" } as any}
              className="rounded-[10px] bg-white px-4 py-2 text-[15px] font-semibold text-brand shadow-[0_14px_28px_-20px_rgba(255,255,255,.75)] transition-colors hover:bg-cream"
            >
              {t("addBusiness")}
            </Link>
            <div className={styles.separator} />
            <LangSwitcher light />
          </div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
