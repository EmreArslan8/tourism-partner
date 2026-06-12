"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { styles } from "./styles";

const AUTOPLAY_MS = 3600;

export default function HowItWorks() {
  const t = useTranslations("how");
  const [active, setActive] = useState(0);
  const steps = useMemo(
    () => [
      { n: "1", t: t("s1t"), d: t("s1d"), image: "/assets/cards/agency-1.jpg", caption: t("visual1") },
      { n: "2", t: t("s2t"), d: t("s2d"), image: "/assets/cards/hotel-1.jpg", caption: t("visual2") },
      { n: "3", t: t("s3t"), d: t("s3d"), image: "/assets/cards/balloon-1.jpg", caption: t("visual3") },
    ],
    [t]
  );
  const faq = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % steps.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [steps.length]);

  const activeStep = steps[active];

  return (
    <>
      <section className={styles.section} id="nasil">
        <div className={styles.headline}>
          <h2 className={styles.title}>{t("title")}</h2>
          <p className={styles.lead}>{t("lead")}</p>
        </div>

        <div className={styles.stage}>
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
            <div className={styles.visualCard}>
              <span className={styles.visualKicker}>{t("visualKicker")}</span>
              <strong className={styles.visualTitle}>{activeStep.caption}</strong>
            </div>
          </div>

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
