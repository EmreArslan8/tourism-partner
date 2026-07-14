"use client";

import { useMemo, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SectionHeader from "@/components/common/SectionHeader";
import { GROUP_COLORS } from "@/lib/categories";
import type { Business, GroupKey } from "@/lib/types";
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

const regionImage = (city: string) => REGION_IMAGES[city.trim().toLocaleLowerCase("tr-TR")];

type RegionCard = {
  city: string;
  count: number;
  group: GroupKey;
  topGroups: Array<{ key: GroupKey; count: number }>;
  image?: string;
};

const Regions = ({ businesses }: { businesses: Business[] }) => {
  const t = useTranslations("regions");
  const common = useTranslations("common");
  const tc = useTranslations("cat");
  const railRef = useRef<HTMLDivElement>(null);

  const regions = useMemo<RegionCard[]>(() => {
    const counts = new Map<string, { count: number; groups: Record<GroupKey, number> }>();

    for (const business of businesses) {
      if (!business.city) continue;
      const current = counts.get(business.city) ?? { count: 0, groups: { konaklama: 0, acente: 0, ulasim: 0, rehber: 0, aktivite: 0, saglik: 0, gastronomi: 0 } };
      current.count += 1;
      current.groups[business.group] = (current.groups[business.group] ?? 0) + 1;
      counts.set(business.city, current);
    }

    return [...counts.entries()]
      .map(([city, info]) => {
        const topGroups = Object.entries(info.groups)
          .filter(([, count]) => count > 0)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([key, count]) => ({ key: key as GroupKey, count }));
        const group = topGroups[0]?.key ?? "konaklama";
        return {
          city,
          count: info.count,
          group,
          topGroups,
          image: regionImage(city),
        };
      })
      .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city, "tr"))
      .slice(0, 6);
  }, [businesses]);

  if (regions.length === 0) return null;

  const scrollByCards = (direction: number) => {
    const node = railRef.current;
    if (!node) return;
    const cardWidth = Math.min(node.clientWidth * 0.82, 380);
    node.scrollBy({ left: direction * (cardWidth + 16), behavior: "smooth" });
  };

  return (
    <section className={styles.section} id="bolgeler">
      <div className={styles.top}>
        <SectionHeader
          className={styles.head}
          eyebrow={t("eyebrow")}
          title={t("title")}
          desc={t("sub")}
          eyebrowClassName={styles.eyebrow}
          titleClassName={styles.title}
          descClassName={styles.sub}
        />

        <div className={styles.topActions}>
          <div className={styles.summaryPill} aria-label={t("summary", { cityCount: regions.length, supplierCount: businesses.length })}>
            <span>
              <strong>{regions.length}</strong>
              {" "}
              {t("cities")}
            </span>
            <span className={styles.summaryDivider} />
            <span>
              <strong>{businesses.length}</strong>
              {" "}
              {t("suppliers")}
            </span>
          </div>
          <Link href={{ pathname: "/explore" }} className={styles.primaryLink}>
            {common("viewAll")}
          </Link>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.railWrap}>
          <button type="button" aria-label="Önceki şehirler" onClick={() => scrollByCards(-1)} className={`${styles.navButton} ${styles.navPrev}`}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button type="button" aria-label="Sonraki şehirler" onClick={() => scrollByCards(1)} className={`${styles.navButton} ${styles.navNext}`}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>

          <div ref={railRef} className={styles.rail}>
            {regions.map((region) => {
              const image = region.image;
              const groupLabel = tc(region.group);

              return (
                <Link
                  key={region.city}
                  href={{ pathname: "/explore", query: { city: region.city } }}
                  className={styles.card}
                  style={{ backgroundColor: GROUP_COLORS[region.group] }}
                >
                  {image ? (
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 72vw, (max-width: 1100px) 38vw, 28vw"
                      className={styles.img}
                    />
                  ) : (
                    <div className={styles.regionMark} aria-hidden>
                      {region.city.slice(0, 2).toLocaleUpperCase("tr-TR")}
                    </div>
                  )}
                  <div className={styles.shade} />
                  <div className={styles.body}>
                    <h3 className={styles.city}>{region.city}</h3>
                    <p className={styles.cardInfoText}>
                      {groupLabel} ağırlıklı · {t("count", { count: region.count }).toLocaleLowerCase("tr-TR")}
                    </p>
                    <div className={styles.chips}>
                      {region.topGroups.map((item) => (
                        <span key={item.key} className={styles.chip}>
                          {tc(item.key)} <b>{item.count}</b>
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Regions;
