"use client";

import { useState } from "react";
import {
  BadgeCheck,
  ClipboardList,
  Mail,
  MessagesSquare,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Store,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import styles from "./styles";

type Step = { Icon: LucideIcon; title: string; desc: string };

const PathCard = ({
  steps,
  kicker,
  KickerIcon,
  cta,
  ctaHref,
  featured = false,
}: {
  steps: Step[];
  kicker: string;
  KickerIcon: LucideIcon;
  cta: string;
  ctaHref: "/register" | "/explore";
  featured?: boolean;
}) => (
  <article className={featured ? styles.cardFeatured : styles.card}>
    <span className={styles.cardGlow} aria-hidden />
    <div className={styles.cardHead}>
      <span className={featured ? styles.kickerFeatured : styles.kicker}>
        <KickerIcon size={16} aria-hidden />
        {kicker}
      </span>
      <Link href={{ pathname: ctaHref }} className={featured ? styles.ctaFeatured : styles.cta}>
        {cta} →
      </Link>
    </div>

    <ol className={styles.steps}>
      {steps.map((step, index) => (
        <li key={step.title} className={styles.step}>
          <span className={featured ? styles.stepIconFeatured : styles.stepIcon}>
            <step.Icon size={17} aria-hidden />
          </span>
          <span className={styles.stepCopy}>
            <span className={styles.stepNo}>{String(index + 1).padStart(2, "0")}</span>
            <strong className={styles.stepTitle}>{step.title}</strong>
            <span className={styles.stepDesc}>{step.desc}</span>
          </span>
        </li>
      ))}
    </ol>
  </article>
);

const HowItWorks = () => {
  const t = useTranslations("how");
  const [active, setActive] = useState<"supplier" | "buyer">("supplier");

  const supplier: Step[] = [
    { Icon: ClipboardList, title: t("s1t"), desc: t("s1d") },
    { Icon: BadgeCheck, title: t("s2t"), desc: t("s2d") },
    { Icon: Mail, title: t("s3t"), desc: t("s3d") },
  ];
  const buyer: Step[] = [
    { Icon: UserPlus, title: t("b1t"), desc: t("b1d") },
    { Icon: SlidersHorizontal, title: t("b2t"), desc: t("b2d") },
    { Icon: MessagesSquare, title: t("b3t"), desc: t("b3d") },
  ];

  return (
    <section className={styles.section} id="nasil">
      <div className={styles.headline}>
        <span className={styles.eyebrow}>{t("eyebrow")}</span>
        <h2 className={styles.title}>{t("title")}</h2>
        <p className={styles.lead}>{t("lead")}</p>
        <p className={styles.leadMobile}>{t("leadMobile")}</p>
      </div>

      <div className={styles.mobileTabs} role="tablist" aria-label={t("eyebrow")}>
        <button
          type="button"
          role="tab"
          aria-selected={active === "supplier"}
          className={active === "supplier" ? styles.mobileTabActive : styles.mobileTab}
          onClick={() => setActive("supplier")}
        >
          {t("pathSupplier")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={active === "buyer"}
          className={active === "buyer" ? styles.mobileTabActive : styles.mobileTab}
          onClick={() => setActive("buyer")}
        >
          {t("pathBuyer")}
        </button>
      </div>

      <div className={styles.grid}>
        <div className={active === "supplier" ? styles.mobilePanelActive : styles.mobilePanel}>
          <PathCard
            steps={supplier}
            kicker={t("pathSupplier")}
            KickerIcon={Store}
            cta={t("primaryCta")}
            ctaHref="/register"
            featured
          />
        </div>
        <div className={active === "buyer" ? styles.mobilePanelActive : styles.mobilePanel}>
          <PathCard
            steps={buyer}
            kicker={t("pathBuyer")}
            KickerIcon={Search}
            cta={t("secondaryCta")}
            ctaHref="/explore"
          />
        </div>
      </div>

      <div className={styles.trustRow}>
        {[t("chip1"), t("chip2"), t("chip3")].map((chip) => (
          <span key={chip} className={styles.trustChip}>
            <ShieldCheck size={13} aria-hidden />
            {chip}
          </span>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
