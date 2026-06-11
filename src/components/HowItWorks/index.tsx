import { useTranslations } from "next-intl";
import { styles } from "./styles";


export default function HowItWorks() {
  const t = useTranslations("how");
  const steps = [
    { n: "1", t: t("s1t"), d: t("s1d") },
    { n: "2", t: t("s2t"), d: t("s2d") },
    { n: "3", t: t("s3t"), d: t("s3d") },
  ];
  const faq = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
  ];

  return (
    <>
      <section className={styles.section} id="nasil">
        <div className={styles.head}>
          <h2 className={styles.headTitle}>{t("title")}</h2>
        </div>
        <div className={styles.grid}>
          {steps.map((step) => (
            <div className={styles.card} key={step.n}>
              <span className={styles.num}>{step.n}</span>
              <h3 className={styles.cardTitle}>{step.t}</h3>
              <p className={styles.cardText}>{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} id="sss">
        <div className={styles.head}>
          <h2 className={styles.headTitle}>{t("faqTitle")}</h2>
        </div>
        <div className={styles.faqList}>
          {faq.map((f) => (
            <details className={styles.faqItem} key={f.q}>
              <summary className={styles.faqSummary}>{f.q}</summary>
              <p className={styles.faqText}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
