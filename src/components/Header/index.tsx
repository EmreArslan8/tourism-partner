import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Href } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import Logo from "@/components/Logo";
import MobileMenu from "@/components/MobileMenu";
import LangSwitcher from "@/components/LocaleSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import AccountMenu from "./AccountMenu";
import NavLinks from "./NavLinks";
import styles from "./styles";

/*
 * Header — server component. Statik yapı sunucuda render edilir; etkileşim parçaları
 * (NavLinks, MobileMenu, AccountMenu, LocaleSwitcher) birer "use client" adasıdır.
 * variant="glass": anasayfa hero görseli üstünde camsı; varsayılan iç sayfalarda opak sapphire.
 */
type HeaderVariant = "glass" | "solid";

type HeaderProps = {
  variant?: HeaderVariant;
  /** @deprecated Use variant="glass" instead. */
  transparent?: boolean;
};

async function getHeaderAuth() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { signedIn: false, dashboardHref: null as Href | null };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { signedIn: false, dashboardHref: null as Href | null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role,account_type")
    .eq("id", user.id)
    .maybeSingle();

  const dashboardHref: Href | null =
    profile?.role === "admin"
      ? "/admin"
      : "/dashboard";

  return { signedIn: true, dashboardHref };
}

const Header = async ({ variant = "solid", transparent = false }: HeaderProps) => {
  const [t, auth] = await Promise.all([getTranslations("nav"), getHeaderAuth()]);
  const resolvedVariant: HeaderVariant = transparent ? "glass" : variant;
  const onLight = resolvedVariant === "glass";

  const loginHref: Href = { pathname: "/login" };
  const registerHref: Href = { pathname: "/register" };
  const links: { href: Extract<Href, { pathname: string }>; label: string }[] = [
    { href: { pathname: "/" }, label: t("home") },
    { href: { pathname: "/explore" }, label: t("explore") },
    { href: { pathname: "/", hash: "nasil" }, label: t("how") },
    { href: { pathname: "/about" }, label: t("about") },
    { href: { pathname: "/blog" }, label: t("blog") },
    { href: { pathname: "/", hash: "sss" }, label: t("faq") },
  ];

  return (
    <header className={`${styles.header} ${resolvedVariant === "glass" ? styles.headerGlass : styles.headerSolid}`}>
      <div className={styles.inner}>
        <div className={styles.mobileMenu}>
          <MobileMenu signedIn={auth.signedIn} dashboardHref={auth.dashboardHref} onLight={onLight} />
        </div>

        <div className={styles.left}>
          <Logo
            href="/"
            height={54}
            variant="brand"
            priority
            className="ltr:origin-left rtl:origin-right min-[1440px]:scale-110 min-[1800px]:scale-[1.18] max-[900px]:origin-center max-[900px]:scale-[.72]"
          />
        </div>

        <NavLinks links={links} onLight={onLight} />

        <div className={styles.right}>
          <div className={styles.actions}>
            {auth.signedIn ? (
              <AccountMenu dashboardHref={auth.dashboardHref} onLight={onLight} />
            ) : (
              <>
                <Link
                  href={loginHref}
                  className={`${styles.loginButton} ${onLight ? styles.loginButtonOnHero : ""}`}
                >
                  {t("login")}
                </Link>
                <Link
                  href={registerHref}
                  className={styles.registerButton}
                >
                  {t("addBusiness")}
                </Link>
              </>
            )}
            <div className={`${styles.separator} ${onLight ? styles.separatorOnHero : ""}`} />
            <ThemeToggle />
            <LangSwitcher light={onLight} />
          </div>
          <div className={styles.mobileAccount}>
            {auth.signedIn ? (
              <AccountMenu dashboardHref={auth.dashboardHref} onLight={onLight} />
            ) : (
              <Link
                href={loginHref}
                  className={`${styles.mobileLogin} ${onLight ? styles.mobileLoginOnHero : ""}`}
              >
                {t("loginOrJoin")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
