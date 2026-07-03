import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SectionHeader from "@/components/common/SectionHeader";
import type { Business } from "@/lib/types";
import styles from "./styles";

const REGION_IMAGES: Record<string, string> = {
  ankara: "/assets/regions/ankara.webp",
  antalya: "/assets/regions/antalya.webp",
  batum: "/assets/regions/batum.webp",
  denizli: "/assets/regions/denizli.webp",
  istanbul: "/assets/regions/istanbul.webp",
  izmir: "/assets/regions/izmir.webp",
  mugla: "/assets/regions/mugla.webp",
  muğla: "/assets/regions/mugla.webp",
  nevsehir: "/assets/regions/nevsehir.webp",
  nevşehir: "/assets/regions/nevsehir.webp",
  santorini: "/assets/regions/santorini.webp",
  tiflis: "/assets/regions/tiflis.webp",
};

const regionImage = (city: string) =>
  REGION_IMAGES[city.trim().toLocaleLowerCase("tr-TR")];

/* Popüler bölgeler — şehir bazlı yoğunluktan üretilir. */
const Regions = ({ businesses }: { businesses: Business[] }) => {
  const t = useTranslations("regions");

  const counts = businesses.reduce<Record<string, number>>((acc, b) => {
    if (b.city) acc[b.city] = (acc[b.city] ?? 0) + 1;
    return acc;
  }, {});
  const top = Object.entries(counts)
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
        {top.map(([city, count]) => {
          const image = regionImage(city);

          return (
            <Link
              key={city}
              href={{ pathname: "/explore", query: { city } }}
              className={styles.card}
            >
              {image ? (
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(max-width: 560px) 50vw, (max-width: 1024px) 50vw, 33vw"
                  className={styles.img}
                />
              ) : (
                <div className={styles.regionMark} aria-hidden>{city.slice(0, 2).toLocaleUpperCase("tr-TR")}</div>
              )}
              <div className={styles.shade} />
              <div className={styles.body}>
                <h3 className={styles.city}>{city}</h3>
                <p className={styles.count}>{t("count", { count })}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Regions;
