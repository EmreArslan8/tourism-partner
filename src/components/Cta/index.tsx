import { useTranslations } from "next-intl";
import styles from "./styles";
import Button from "../common/Button";

const Cta = () => {
  const t = useTranslations("cta");

  return (
    <section className={styles.section}>
      <div className={styles.panel}>
        <div className={styles.content}>
          <h2 className={styles.title}>{t("title")}</h2>
          <p className={styles.sub}>{t("sub")}</p>
        </div>

        <div className={styles.actions}>
          <Button href={{ pathname: "/register" } as any} variant="prominent" size="lg" className="btn-compact-sm">
            {t("button")}
          </Button>
          <Button href={{ pathname: "/login" } as any} variant="secondary" size="lg" className="btn-compact-sm">
            {t("secondary")}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Cta;
