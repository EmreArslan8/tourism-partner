import { useTranslations } from "next-intl";
import { s } from "./styles";

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
      <section className={s.section} id="nasil">
        <div className={s.head}>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className={s.headTitle}>{t("title")}</h2>
        </div>
        <div className={s.grid}>
          {steps.map((step) => (
            <div className={s.card} key={step.n}>
              <span className={s.num}>{step.n}</span>
              <h3 className={s.cardTitle}>{step.t}</h3>
              <p className={s.cardText}>{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={s.section} id="sss">
        <div className={s.head}>
          <p className="eyebrow">{t("faqEyebrow")}</p>
          <h2 className={s.headTitle}>{t("faqTitle")}</h2>
        </div>
        <div className={s.faqList}>
          {faq.map((f) => (
            <details className={s.faqItem} key={f.q}>
              <summary className={s.faqSummary}>{f.q}</summary>
              <p className={s.faqText}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
