import { Handshake, LockKeyhole, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "./styles";

const Cta = () => {
  const t = useTranslations("cta");
  const metrics = [
    { value: t("verifiedValue"), label: t("verifiedLabel"), Icon: ShieldCheck },
    { value: t("quoteValue"), label: t("quoteLabel"), Icon: Handshake },
    { value: t("memberValue"), label: t("memberLabel"), Icon: LockKeyhole },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.panel}>
        <div className={styles.content}>
          <h2 className={styles.title}>{t("title")}</h2>
          <p className={styles.sub}>{t("sub")}</p>
        </div>

        <div className={styles.metrics}>
          {metrics.map((metric) => (
            <div className={styles.metric} key={metric.label}>
              <span className={styles.metricIcon}>
                <metric.Icon size={18} strokeWidth={2.3} />
              </span>
              <span className={styles.metricCopy}>
                <strong className={styles.metricValue}>{metric.value}</strong>
                <span className={styles.metricLabel}>{metric.label}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Cta;
