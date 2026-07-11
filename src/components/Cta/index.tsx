import { useTranslations } from "next-intl";
import { ArrowRight, Crown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import styles from "./styles";

const Cta = () => {
  const t = useTranslations("cta");

  return (
    <section className={styles.section}>
      <div className={styles.panel}>
        <div className={styles.content}>
          <span className={styles.badge}>
            <Crown size={14} strokeWidth={2.4} aria-hidden />
            Premium Partner
          </span>
          <h2 className={styles.title}>{t("title")}</h2>
          <p className={styles.sub}>{t("sub")}</p>
        </div>
        <div className={styles.actions}>
          <Link href="/register" className={styles.primary}>
            <span>{t("button")}</span>
            <ArrowRight size={17} strokeWidth={2.4} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Cta;
