import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CATEGORY_GROUPS } from "@/lib/categories";
import type { Business, GroupKey } from "@/lib/types";
import styles from "./styles";

/* Kategori kapak görselleri. */
const IMG: Record<GroupKey, string> = {
  konaklama: "/assets/cards/hotel-1.jpg",
  acente: "/assets/cards/agency-1.jpg",
  rehber: "/assets/cards/guide-1.jpg",
  eglence: "/assets/cards/balloon-1.jpg",
  saglik: "/assets/cards/clinic-1.jpg",
};

/* Ana sayfa kategori girişi — görsel kapaklı kartlar, /explore'ye yönlendirir. */
const Categories = ({ businesses }: { businesses: Business[] }) => {
  const t = useTranslations("categories");
  const tc = useTranslations("cat");
  const tCommon = useTranslations("common");
  const counts = businesses.reduce<Record<string, number>>((acc, b) => {
    acc[b.group] = (acc[b.group] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className={styles.section} id="kategoriler">
      <div className={styles.head}>
        <div>
          <span className={styles.eyebrow}>{tCommon("categoriesEyebrow")}</span>
          <h2 className={styles.headTitle}>{t("title")}</h2>
        </div>
        <Link href={{ pathname: "/explore" }} className={styles.more}>
          {tCommon("viewAll")}
        </Link>
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
              sizes="(max-width:640px) 180px, (max-width:1100px) 33vw, 18vw"
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
              <p className={styles.count}>{t("count", { count: counts[g.key] ?? 0 })}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
