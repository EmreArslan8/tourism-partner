"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { styles } from "./styles";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E\")";

export default function Cta() {
  const t = useTranslations("cta");

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          {/* Decorative Effects */}
          <div className={styles.bgEffect1} />
          <div className={styles.bgEffect2} />
          <div className={styles.grain} style={{ backgroundImage: GRAIN }} />

          <div className={styles.content}>
            <span className={styles.eyebrow}>
              🚀 {t("button")}
            </span>
            <h2 className={styles.title}>{t("title")}</h2>
            <p className={styles.sub}>{t("sub")}</p>
          </div>

          <div className={styles.actions}>
            <div className={styles.offerBadge}>
              <div className={styles.offerIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 12V8H4v12h16v-4" />
                  <path d="M2 12h20" />
                  <path d="M12 2v20" />
                  <path d="M12 7l5 5-5 5" />
                </svg>
              </div>
              <div className={styles.offerText}>
                Hediye Doping
                <span className={styles.offerEm}>İlk 24 Saat</span>
              </div>
            </div>

            <Link href="/kayit" className={styles.button}>
              {t("button")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
