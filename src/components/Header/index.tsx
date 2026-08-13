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
    { href: { pathname: "/about" }, label: t("about") },
    { href: { pathname: "/", hash: "nasil" }, label: t("how") },
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
            variant={onLight ? "brand" : "light"}
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
                  className={`rounded-[10px] border px-4 py-2 text-[15px] font-semibold transition-colors min-[1440px]:px-5 min-[1440px]:py-2.5 min-[1440px]:text-[16px] min-[1800px]:text-[17px] ${onLight ? "border-brand/25 text-brand hover:bg-brand/5 dark:border-white/30 dark:text-white dark:hover:bg-white/10" : "border-white/30 text-white hover:bg-white/10"}`}
                >
                  {t("login")}
                </Link>
                <Link
                  href={registerHref}
                  className={`rounded-[10px] px-4 py-2 text-[15px] font-semibold transition-colors min-[1440px]:px-5 min-[1440px]:py-2.5 min-[1440px]:text-[16px] min-[1800px]:text-[17px] ${onLight ? "bg-brand text-white shadow-[0_14px_30px_-18px_rgba(74,26,151,.65)] hover:bg-brand-deep" : "bg-white text-brand shadow-[0_14px_28px_-20px_rgba(255,255,255,.75)] hover:bg-cream"}`}
                >
                  {t("addBusiness")}
                </Link>
              </>
            )}
            <ThemeToggle />
            <div className={`${styles.separator} ${onLight ? styles.separatorOnLight : ""}`} />
            <LangSwitcher light={!onLight} />
          </div>
          <div className={styles.mobileAccount}>
            {auth.signedIn ? (
              <AccountMenu dashboardHref={auth.dashboardHref} onLight={onLight} />
            ) : (
              <Link
                href={loginHref}
                  className={`inline-flex h-10 items-center justify-center rounded-[10px] border px-2.5 text-[11px] font-bold leading-none transition-colors ${onLight ? "border-brand/25 text-brand active:bg-brand/5 dark:border-white/35 dark:text-white dark:active:bg-white/15" : "border-white/35 text-white active:bg-white/15"}`}
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
