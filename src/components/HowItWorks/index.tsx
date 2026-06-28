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
      { n: "1", t: t("s1t"), d: t("s1d"), image: "/assets/how-step-1-profile.webp", caption: t("visual1") },
      { n: "2", t: t("s2t"), d: t("s2d"), image: "/assets/how-step-2-verify.webp", caption: t("visual2") },
      { n: "3", t: t("s3t"), d: t("s3d"), image: "/assets/how-step-3-quotes.webp", caption: t("visual3") },
    ],
    [t]
  );
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % steps.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [steps.length]);

  return (
    <section className={styles.section} id="nasil">
      <div className={styles.headline}>
        <span className={styles.eyebrow}>{t("eyebrow")}</span>
        <h2 className={styles.title}>{t("title")}</h2>
        <p className={styles.lead}>{t("lead")}</p>
        <p className={styles.leadMobile}>{t("leadMobile")}</p>
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
  );
};

export default HowItWorks;
