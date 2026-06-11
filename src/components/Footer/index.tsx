import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "@/components/Logo";
import { styles } from "./styles";


export default function SiteFooter() {
  const t = useTranslations("footer");
  const tc = useTranslations("cat");
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <Logo href="/" height={54} variant="light" className={styles.logo} />
          <p className={styles.brandText}>{t("tagline")}</p>
        </div>
        <div>
          <h4 className={styles.colTitle}>{t("categories")}</h4>
          <Link href="/kesfet?cat=konaklama" className={styles.colLink}>{tc("konaklama")}</Link>
          <Link href="/kesfet?cat=acente" className={styles.colLink}>{tc("acente")}</Link>
          <Link href="/kesfet?cat=eglence" className={styles.colLink}>{tc("eglence")}</Link>
          <Link href="/kesfet?cat=saglik" className={styles.colLink}>{tc("saglik")}</Link>
        </div>
        <div>
          <h4 className={styles.colTitle}>{t("platform")}</h4>
          <Link href="/#nasil" className={styles.colLink}>{t("howShort")}</Link>
          <Link href="/kayit" className={styles.colLink}>{t("addCompany")}</Link>
          <Link href="/giris" className={styles.colLink}>{t("login")}</Link>
        </div>
        <div>
          <h4 className={styles.colTitle}>{t("membership")}</h4>
          <p className={styles.noteSm}>{t("membershipNote")}</p>
        </div>
      </div>
      <div className={styles.base}>
        <span>{t("note")}</span>
        <span>{t("note2")}</span>
      </div>
    </footer>
  );
}
