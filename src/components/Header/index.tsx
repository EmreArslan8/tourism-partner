import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Href } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import Logo from "@/components/Logo";
import MobileMenu from "@/components/MobileMenu";
import MobileSearch from "@/components/MobileSearch";
import LangSwitcher from "@/components/LocaleSwitcher";
import AccountMenu from "./AccountMenu";
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

  const loginHref: Href = { pathname: "/login" };
  const registerHref: Href = { pathname: "/register" };
  const links: { href: Extract<Href, { pathname: string }>; label: string }[] = [
    { href: { pathname: "/" }, label: t("home") },
    { href: { pathname: "/explore" }, label: t("explore") },
    { href: { pathname: "/", hash: "nasil" }, label: t("how") },
    { href: { pathname: "/blog" }, label: t("blog") },
    { href: { pathname: "/", hash: "sss" }, label: t("faq") },
  ];

  return (
    <header className={`${styles.header} ${resolvedVariant === "glass" ? styles.headerGlass : styles.headerSolid}`}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Logo href="/" height={54} variant="light" priority className="ltr:origin-left rtl:origin-right min-[1440px]:scale-110 min-[1800px]:scale-[1.18]" />
        </div>

        <NavLinks links={links} />

        <div className="col-start-3 flex items-center justify-self-end gap-1">
          <MobileSearch />
          <div className={styles.actions}>
            {auth.signedIn ? (
              <AccountMenu dashboardHref={auth.dashboardHref} />
            ) : (
              <>
                <Link
                  href={loginHref}
                  className="rounded-[10px] border border-white/30 px-4 py-2 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 min-[1440px]:px-5 min-[1440px]:py-2.5 min-[1440px]:text-[16px] min-[1800px]:text-[17px]"
                >
                  {t("login")}
                </Link>
                <Link
                  href={registerHref}
                  className="rounded-[10px] bg-white px-4 py-2 text-[15px] font-semibold text-brand shadow-[0_14px_28px_-20px_rgba(255,255,255,.75)] transition-colors hover:bg-cream min-[1440px]:px-5 min-[1440px]:py-2.5 min-[1440px]:text-[16px] min-[1800px]:text-[17px]"
                >
                  {t("addBusiness")}
                </Link>
              </>
            )}
            <div className={styles.separator} />
            <LangSwitcher light />
          </div>
          <MobileMenu signedIn={auth.signedIn} dashboardHref={auth.dashboardHref} />
        </div>
      </div>
    </header>
  );
};

export default Header;
