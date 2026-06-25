import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import styles from "./styles";
import Button from "../common/Button";

const Cta = () => {
  const t = useTranslations("cta");

  return (
    <section className={styles.section}>
      <div className={styles.panel}>
        <div className={styles.glow} aria-hidden />

        <div className={styles.content}>
          <h2 className={styles.title}>{t("title")}</h2>
          <p className={styles.sub}>{t("sub")}</p>
        </div>

        <div className={styles.actions}>
          <Button href={{ pathname: "/register" } as any} variant="cream" size="lg" className="!rounded-xl">
            {t("button")}
          </Button>
          <Link href={{ pathname: "/login" } as any} className={styles.secondary}>
            {t("secondary")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Cta;
