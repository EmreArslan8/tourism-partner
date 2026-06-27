import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import styles from "./styles";

/* Hazır arama rotaları — kategori panelinin ikinci bileşeni.
   Her chip /explore'a önceden kurulmuş filtrelerle (kategori + şehir/arama) gider. */
type Intent = {
  key: string;
  query: { cat?: string; city?: string; q?: string };
};

const INTENTS: Intent[] = [
  { key: "intentIstanbulHotels", query: { cat: "konaklama", city: "İstanbul" } },
  { key: "intentCappadociaGuides", query: { cat: "rehber", city: "Nevşehir" } },
  { key: "intentAntalyaAgencies", query: { cat: "acente", city: "Antalya" } },
  { key: "intentHealthClinics", query: { cat: "saglik" } },
  { key: "intentActivities", query: { cat: "eglence" } },
];

const SearchIntents = () => {
  const t = useTranslations("categories");

  return (
    <section className={styles.section} aria-label={t("intentTitle")}>
      <div className={styles.copy}>
        <span className={styles.eyebrow}>{t("spotlightKicker")}</span>
        <h3 className={styles.title}>{t("intentTitle")}</h3>
        <p className={styles.sub}>{t("intentSub")}</p>
      </div>

      <div className={styles.chips}>
        {INTENTS.map((it) => (
          <Link
            key={it.key}
            href={{ pathname: "/explore", query: it.query }}
            className={styles.chip}
          >
            {t(it.key)}
            <svg className={styles.chipArrow} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SearchIntents;
