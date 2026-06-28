import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SectionHeader from "@/components/common/SectionHeader";
import type { Business } from "@/lib/types";
import styles from "./styles";

/* Şehir → kapak görseli (Wikimedia stok, public/assets/regions). */
const CITY_IMG: Record<string, string> = {
  "İstanbul": "/assets/regions/istanbul.webp",
  "Ankara": "/assets/regions/ankara.webp",
  "Nevşehir": "/assets/regions/nevsehir.webp",
  "Muğla": "/assets/regions/mugla.webp",
  "İzmir": "/assets/regions/izmir.webp",
  "Antalya": "/assets/regions/antalya.webp",
  "Tiflis": "/assets/regions/tiflis.webp",
  "Santorini": "/assets/regions/santorini.webp",
  "Denizli": "/assets/regions/denizli.webp",
  "Batum": "/assets/regions/batum.webp",
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
    .slice(0, 6);

  if (top.length === 0) return null;

  return (
    <section className={styles.section} id="bolgeler">
      <SectionHeader
        className={styles.head}
        eyebrow={t("eyebrow")}
        title={t("title")}
        desc={t("sub")}
        eyebrowClassName={styles.eyebrow}
        titleClassName={styles.title}
        descClassName={styles.sub}
      />

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
