import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "@/components/Logo";
import { SOCIAL_ICONS } from "@/components/SocialIcons";
import { PLATFORM_SOCIALS } from "@/lib/site";
import { SOCIAL_PLATFORMS } from "@/lib/types";
import styles from "./styles";


const Footer = ({ seamless = false }: { seamless?: boolean }) => {
  const t = useTranslations("footer");
  const tc = useTranslations("cat");
  return (
    <footer className={`${styles.footer} ${seamless ? styles.footerSeamless : ""}`}>
      <div className={styles.inner}>
        <div>
          <Logo href="/" height={54} variant="light" className={styles.logo} />
          <p className={styles.brandText}>{t("tagline")}</p>
          <div className={styles.socialRow}>
            {SOCIAL_PLATFORMS.map((platform) => {
              const url = PLATFORM_SOCIALS[platform];
              if (!url) return null;
              const Icon = SOCIAL_ICONS[platform];
              return (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={platform}
                  title={platform}
                  className={styles.socialLink}
                >
                  <Icon size={16} aria-hidden />
                </a>
              );
            })}
          </div>
        </div>
        <div>
          <h4 className={styles.colTitle}>{t("categories")}</h4>
          <Link href={{ pathname: "/explore", query: { cat: "konaklama" } }} className={styles.colLink}>{tc("konaklama")}</Link>
          <Link href={{ pathname: "/explore", query: { cat: "acente" } }} className={styles.colLink}>{tc("acente")}</Link>
          <Link href={{ pathname: "/explore", query: { cat: "aktivite" } }} className={styles.colLink}>{tc("aktivite")}</Link>
          <Link href={{ pathname: "/explore", query: { cat: "saglik" } }} className={styles.colLink}>{tc("saglik")}</Link>
        </div>
        <div>
          <h4 className={styles.colTitle}>{t("platform")}</h4>
          <Link href={{ pathname: "/", hash: "nasil" }} scroll={false} className={styles.colLink}>{t("howShort")}</Link>
          <Link href={{ pathname: "/register" }} className={styles.colLink}>{t("addCompany")}</Link>
          <Link href={{ pathname: "/login" }} className={styles.colLink}>{t("login")}</Link>
        </div>
        <div>
          <h4 className={styles.colTitle}>{t("contact")}</h4>
          <Link href={{ pathname: "/help" }} className={styles.colLink}>{t("helpLink")}</Link>
          <a href="mailto:info@tourismpartner.world" className={styles.colLink}>info@tourismpartner.world</a>
          <a href="tel:+905384848790" className={styles.colLink} dir="ltr">+90 538 484 87 90</a>
          <Link href={{ pathname: "/", hash: "sss" }} scroll={false} className={styles.colLink}>{t("faqShort")}</Link>
        </div>
      </div>
      <div className={styles.base}>
        <span>{t("note")}</span>
        <span className={styles.legalLinks}>
          <Link href={{ pathname: "/terms" }} className={styles.baseLink}>{t("termsLink")}</Link>
          <Link href={{ pathname: "/privacy" }} className={styles.baseLink}>{t("privacyLink")}</Link>
          <Link href={{ pathname: "/kvkk" }} className={styles.baseLink}>{t("kvkkLink")}</Link>
        </span>
        <span>{t("note2")}</span>
      </div>
    </footer>
  );
};

export default Footer;
