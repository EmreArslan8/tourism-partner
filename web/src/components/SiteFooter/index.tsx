import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { s } from "./styles";

export default function SiteFooter() {
  const t = useTranslations("footer");
  const tc = useTranslations("cat");
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <div>
          <span className={s.brandType}>
            <span className={s.brandTop}>TOURISM</span>
            <span className={s.brandBottom}>PARTNER</span>
          </span>
          <p className={s.brandText}>{t("tagline")}</p>
        </div>
        <div>
          <h4 className={s.colTitle}>{t("categories")}</h4>
          <Link href="/listeleme?cat=konaklama" className={s.colLink}>{tc("konaklama")}</Link>
          <Link href="/listeleme?cat=acente" className={s.colLink}>{tc("acente")}</Link>
          <Link href="/listeleme?cat=eglence" className={s.colLink}>{tc("eglence")}</Link>
          <Link href="/listeleme?cat=saglik" className={s.colLink}>{tc("saglik")}</Link>
        </div>
        <div>
          <h4 className={s.colTitle}>{t("platform")}</h4>
          <Link href="/#nasil" className={s.colLink}>{t("howShort")}</Link>
          <Link href="/kayit" className={s.colLink}>{t("addCompany")}</Link>
          <Link href="/giris" className={s.colLink}>{t("login")}</Link>
        </div>
        <div>
          <h4 className={s.colTitle}>{t("membership")}</h4>
          <p className={s.noteSm}>{t("membershipNote")}</p>
        </div>
      </div>
      <div className={s.base}>
        <span>{t("note")}</span>
        <span>{t("note2")}</span>
      </div>
    </footer>
  );
}
