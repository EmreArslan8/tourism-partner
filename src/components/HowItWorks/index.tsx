"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./styles";

const AUTOPLAY_MS = 5600;

const HowItWorks = () => {
  const t = useTranslations("how");
  const [active, setActive] = useState(0);
  const steps = useMemo(
    () => [
      { n: "1", t: t("s1t"), d: t("s1d"), image: "/assets/how-step-1-profile.png", caption: t("visual1") },
      { n: "2", t: t("s2t"), d: t("s2d"), image: "/assets/how-step-2-verify.png", caption: t("visual2") },
      { n: "3", t: t("s3t"), d: t("s3d"), image: "/assets/how-step-3-quotes.png", caption: t("visual3") },
    ],
    [t]
  );
  const faq = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
    { q: t("q6"), a: t("a6") },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % steps.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [steps.length]);

  return (
    <>
      <section className={styles.section} id="nasil">
        <div className={styles.headline}>
          <h2 className={styles.title}>{t("title")}</h2>
          <p className={styles.lead}>{t("lead")}</p>
        </div>

        <div className={styles.stage}>
          <div className={styles.steps} role="tablist" aria-label={t("stripLabel")}>
            {steps.map((step, index) => {
              const isActive = index === active;
              return (
                <button
                  key={step.n}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={isActive ? styles.stepActive : styles.step}
                  onClick={() => setActive(index)}
                >
                  <span className={styles.stepNum}>{step.n}</span>
                  <span className={styles.stepText}>
                    <strong className={styles.stepTitle}>{step.t}</strong>
                    <span className={styles.stepDesc}>{step.d}</span>
                  </span>
                  <span className={isActive ? styles.progressActive : styles.progress} aria-hidden />
                </button>
              );
            })}
          </div>

          <div className={styles.visual}>
            {steps.map((step, index) => (
              <Image
                key={step.image}
                src={step.image}
                alt={step.caption}
                fill
                sizes="(max-width: 920px) 100vw, 48vw"
                loading="lazy"
                className={index === active ? styles.imageActive : styles.image}
              />
            ))}
            <div className={styles.visualWash} />
          </div>
        </div>
      </section>

      <section className={styles.section} id="sss">
        <div className={styles.faqWrap}>
          <aside className={styles.faqAside}>
            <h2 className={styles.headTitle}>{t("faqTitle")}</h2>
            <p className={styles.faqLead}>{t("faqLead")}</p>
          </aside>

          <div className={styles.faqList}>
            {faq.map((f) => (
              <details className={styles.faqItem} key={f.q}>
                <summary className={styles.faqSummary}>{f.q}</summary>
                <p className={styles.faqText}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;
