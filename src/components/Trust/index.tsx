import { useTranslations } from "next-intl";
import styles from "./styles";

/* Güven rozeti ikonları — bağımlılıksız inline SVG (proje genelinde inline svg deseni). */
const ICONS = {
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  support: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-3M3 16h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4Zm15 0h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-4Z" />
    </svg>
  ),
} as const;

/* Trust — güven rozetleri ("how" namespace'indeki trustTitle / trust1-3). */
const Trust = () => {
  const t = useTranslations("how");
  const items = [
    { t: t("trust1t"), d: t("trust1d"), icon: ICONS.shield },
    { t: t("trust2t"), d: t("trust2d"), icon: ICONS.lock },
    { t: t("trust3t"), d: t("trust3d"), icon: ICONS.support },
  ];

  return (
    <section className={styles.section} aria-label={t("trustTitle")}>
      <h3 className={styles.title}>{t("trustTitle")}</h3>
      <ul className={styles.list}>
        {items.map((b) => (
          <li className={styles.item} key={b.t}>
            <span className={styles.icon}>{b.icon}</span>
            <span className={styles.body}>
              <strong className={styles.itemTitle}>{b.t}</strong>
              <span className={styles.itemDesc}>{b.d}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Trust;
