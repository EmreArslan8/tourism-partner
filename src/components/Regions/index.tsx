import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Business } from "@/lib/types";
import styles from "./styles";

/* Şehir → kapak görseli (Wikimedia stok, public/assets/regions). */
const CITY_IMG: Record<string, string> = {
  "İstanbul": "/assets/regions/istanbul.jpg",
  "Ankara": "/assets/regions/ankara.jpg",
  "Nevşehir": "/assets/regions/nevsehir.jpg",
  "Muğla": "/assets/regions/mugla.jpg",
  "İzmir": "/assets/regions/izmir.jpg",
  "Antalya": "/assets/regions/antalya.jpg",
  "Tiflis": "/assets/regions/tiflis.jpg",
  "Santorini": "/assets/regions/santorini.jpg",
  "Denizli": "/assets/regions/denizli.jpg",
  "Batum": "/assets/regions/batum.jpg",
};

/* Popüler bölgeler — şehir bazlı yoğunluktan üretilir, görsel kapaklı (SEO + hızlı arama). */
const Regions = ({ businesses }: { businesses: Business[] }) => {
  const t = useTranslations("regions");

  const counts = businesses.reduce<Record<string, number>>((acc, b) => {
    if (b.city) acc[b.city] = (acc[b.city] ?? 0) + 1;
    return acc;
  }, {});
  const top = Object.entries(counts)
    .filter(([city]) => CITY_IMG[city])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  if (top.length === 0) return null;

  return (
    <section className={styles.section} id="bolgeler">
      <div className={styles.head}>
        <span className={styles.eyebrow}>{t("eyebrow")}</span>
        <h2 className={styles.title}>{t("title")}</h2>
        <p className={styles.sub}>{t("sub")}</p>
      </div>

      <div className={styles.grid}>
        {top.map(([city, count]) => (
          <Link
            key={city}
            href={{ pathname: "/explore", query: { city } }}
            className={styles.card}
          >
            <Image
              src={CITY_IMG[city]}
              alt={city}
              fill
              sizes="(max-width:560px) 50vw, (max-width:900px) 33vw, 25vw"
              className={styles.img}
            />
            <div className={styles.shade} />
            <div className={styles.body}>
              <h3 className={styles.city}>{city}</h3>
              <p className={styles.count}>{t("count", { count })}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Regions;
