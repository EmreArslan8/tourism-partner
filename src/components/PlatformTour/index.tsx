"use client";

import { ArrowRight, BadgeCheck, Building2, Handshake, Search, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import HomeTourButton from "@/components/ProductTour/HomeTourButton";
import styles from "./styles";

export default function PlatformTour() {
  const t = useTranslations("platformTour");

  return (
    <section className={styles.section} id="platform-turu">
      <div className={styles.copy}>
        <span className={styles.eyebrow}>{t("eyebrow")}</span>
        <h2 className={styles.title}>{t("title")}</h2>
        <p className={styles.lead}>{t("lead")}</p>
        <HomeTourButton />
      </div>

      <div className={styles.visual} data-tour="overview-map">
        <div className={styles.visualTop}>
          <span>{t("flow")}</span>
          <strong>{t("flowTitle")}</strong>
        </div>

        <div className={styles.flow} data-tour="overview-flow">
          <div className={styles.flowNode} data-tour="overview-buyer">
            <span>
              <Users size={22} strokeWidth={2.35} aria-hidden />
            </span>
            <small>{t("buyer")}</small>
            <strong>{t("buyerAction")}</strong>
          </div>

          <span className={styles.connector} aria-hidden>
            <ArrowRight size={20} strokeWidth={2.4} className="rtl:rotate-180" />
          </span>

          <div className={styles.hub} data-tour="overview-platform">
            <span>
              <Handshake size={24} strokeWidth={2.35} aria-hidden />
            </span>
            <small>Tourism Partner</small>
            <strong>{t("match")}</strong>
            <p>{t("matchText")}</p>
          </div>

          <span className={styles.connector} aria-hidden>
            <ArrowRight size={20} strokeWidth={2.4} className="rtl:rotate-180" />
          </span>

          <div className={styles.flowNode} data-tour="overview-supplier">
            <span>
              <Building2 size={22} strokeWidth={2.35} aria-hidden />
            </span>
            <small>{t("supplier")}</small>
            <strong>{t("supplierAction")}</strong>
          </div>
        </div>

        <div className={styles.roles}>
          <div>
            <Search size={17} strokeWidth={2.35} aria-hidden />
            <strong>{t("buyerRole")}</strong>
            <span>{t("buyerRoleText")}</span>
          </div>
          <div>
            <BadgeCheck size={17} strokeWidth={2.35} aria-hidden />
            <strong>{t("supplierRole")}</strong>
            <span>{t("supplierRoleText")}</span>
          </div>
        </div>

        <div className={styles.value} data-tour="overview-value">
          <span>{t("value1")}</span>
          <span>{t("value2")}</span>
          <span>{t("value3")}</span>
        </div>
      </div>
    </section>
  );
}
