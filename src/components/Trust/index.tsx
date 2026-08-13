import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import styles from "./styles";

const Trust = () => {
  const t = useTranslations("how");

  return (
    <section className={styles.section} aria-label={t("trustCtaAria")}>
      <Image
        src="/assets/trust-cta-banner.webp"
        alt=""
        fill
        sizes="100vw"
        className={styles.image}
      />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h2 className={styles.title}>
          <span>{t("trustCtaLine1")}</span>
          <span>{t("trustCtaLine2")}</span>
          <span>{t("trustCtaLine3")}</span>
        </h2>
        <div className={styles.actions}>
          <Link href="/register" className={styles.primary}>
            <span>{t("trustCtaPrimary")}</span>
            <ArrowRight size={16} strokeWidth={2.4} className="rtl:rotate-180" aria-hidden />
          </Link>
          <Link href="/explore" className={styles.secondary}>
            <span>{t("trustCtaSecondary")}</span>
            <ArrowRight size={16} strokeWidth={2.4} className="rtl:rotate-180" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Trust;
