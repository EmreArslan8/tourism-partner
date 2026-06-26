import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CATEGORY_GROUPS } from "@/lib/categories";
import type { GroupKey } from "@/lib/types";
import styles from "./styles";

/* Kategori kapak görselleri. */
const IMG: Record<GroupKey, string> = {
  konaklama: "/assets/cards/hotel-1.jpg",
  acente: "/assets/cards/agency-1.jpg",
  rehber: "/assets/cards/guide-1.jpg",
  eglence: "/assets/cards/balloon-1.jpg",
  saglik: "/assets/cards/clinic-1.jpg",
};

const SEARCH_INTENTS = [
  { key: "intentIstanbulHotels", query: { cat: "konaklama", city: "İstanbul" } },
  { key: "intentCappadociaGuides", query: { cat: "rehber", city: "Nevşehir" } },
  { key: "intentAntalyaAgencies", query: { cat: "acente", city: "Antalya" } },
  { key: "intentHealthClinics", query: { cat: "saglik" } },
] as const;

/* Ana sayfa kategori girişi — görsel kapaklı kartlar, /explore'ye yönlendirir. */
const Categories = () => {
  const t = useTranslations("categories");
  const tc = useTranslations("cat");
  const tCommon = useTranslations("common");

  return (
    <section className={styles.section} id="kategoriler">
      <div className={styles.topGroup}>
        <div className={styles.head}>
          <div className={styles.headCopy}>
            <span className={styles.eyebrow}>{tCommon("categoriesEyebrow")}</span>
            <h2 className={styles.headTitle}>{t("title")}</h2>
            <p className={styles.lead}>{t("lead")}</p>
          </div>
        </div>

        <div className={styles.grid}>
          {CATEGORY_GROUPS.map((g) => (
            <Link
              key={g.key}
              href={{ pathname: "/explore", query: { cat: g.key } }}
              className={styles.card}
            >
              <Image
                src={IMG[g.key]}
                alt=""
                fill
                sizes="(max-width:640px) 230px, (max-width:1100px) 33vw, 21vw"
                className={styles.img}
              />
              <div className={styles.shade} />
              <span className={styles.arrow}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
              <div className={styles.body}>
                <h3 className={styles.name}>{tc(g.key)}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <aside className={styles.sidePanel}>
        <div>
          <h3 className={styles.panelTitle}>{t("intentTitle")}</h3>
        </div>
        <div className={styles.panelIntentList}>
          {SEARCH_INTENTS.map((item) => (
            <Link
              key={item.key}
              href={{ pathname: "/explore", query: item.query }}
              className={styles.panelIntentItem}
            >
              <span>{t(item.key)}</span>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </aside>
    </section>
  );
};

export default Categories;
