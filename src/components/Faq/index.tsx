import { useTranslations } from "next-intl";
import styles from "./styles";

/* Sık sorulan sorular — "how" namespace'indeki q1-q6/a1-a6 metinleri. */
const Faq = () => {
  const t = useTranslations("how");
  const items = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
    { q: t("q6"), a: t("a6") },
  ];

  return (
    <section className={styles.section} id="sss">
      <div className={styles.wrap}>
        <aside className={styles.aside}>
          <h2 className={styles.title}>{t("faqTitle")}</h2>
          <p className={styles.lead}>{t("faqLead")}</p>
        </aside>

        <div className={styles.list}>
          {items.map((f) => (
            <details className={styles.item} key={f.q} name="faq">
              <summary className={styles.summary}>{f.q}</summary>
              <p className={styles.text}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
