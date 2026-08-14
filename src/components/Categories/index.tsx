"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SectionHeader from "@/components/common/SectionHeader";
import { CATEGORY_GROUPS, groupUrlSlug } from "@/lib/categories";
import type { GroupKey } from "@/lib/types";
import styles from "./styles";

const IMG: Record<GroupKey, string> = {
  konaklama: "/assets/cards/konaklama-1.webp",
  acente: "/assets/cards/acente-1.webp",
  ulasim: "/assets/cards/ulasim-1.webp",
  rehber: "/assets/cards/rehber-2.webp",
  aktivite: "/assets/cards/aktivite-1.webp",
  saglik: "/assets/cards/saglik-2.webp",
  gastronomi: "/assets/cards/gastronomi-1.webp",
};

const ICONS: Record<GroupKey, { src: string; width: number; height: number; className: string }> = {
  konaklama: { src: "/assets/icons/hotels.svg", width: 32, height: 32, className: styles.icon },
  acente: { src: "/assets/icons/agencies.svg", width: 32, height: 32, className: styles.icon },
  ulasim: { src: "/assets/icons/transfers.svg", width: 44, height: 39, className: styles.transferIcon },
  rehber: { src: "/assets/icons/guides.svg", width: 32, height: 32, className: styles.icon },
  aktivite: { src: "/assets/icons/activities.svg", width: 32, height: 32, className: styles.icon },
  gastronomi: { src: "/assets/icons/gastronomy.svg", width: 40, height: 40, className: styles.gastronomyIcon },
  saglik: { src: "/assets/icons/health-tourism.svg", width: 32, height: 32, className: styles.icon },
};

const cardSummary = (
  children: (typeof CATEGORY_GROUPS)[number]["children"],
  translateService: (key: string) => string,
  moreSuffix: string,
) => {
  const labels = children.slice(0, 3).map((child) => translateService(child.slug));
  return `${labels.join(", ")} ${moreSuffix}`;
};

// Yalnız grup başına tedarikçi SAYISI gerekir; tüm business dizisini prop olarak
// taşımak RSC flight payload'ını ~55KB şişiriyordu (döküman kritik yolda). Sunucu
// (view.tsx) sayımları hesaplayıp yalnız bu küçük haritayı geçirir.
const Categories = ({ counts = {} }: { counts?: Partial<Record<GroupKey, number>> }) => {
  const t = useTranslations("categories");
  const tc = useTranslations("cat");
  const ts = useTranslations("service");

  return (
    <section className={styles.section} id="kategoriler" data-tour="supplier-categories">
      <div className={styles.head}>
        <SectionHeader
          className={styles.headCopy}
          eyebrow={t("eyebrow")}
          title={t("title")}
          desc={t("lead")}
          eyebrowClassName={styles.eyebrow}
          titleClassName={styles.headTitle}
          descClassName={styles.lead}
        />
      </div>

      <div className={styles.grid} role="list" aria-label={t("summaryLabel")}>
        {CATEGORY_GROUPS.map((group) => {
          const icon = ICONS[group.key];

          return (
            <Link
              key={group.key}
              href={{ pathname: "/explore", query: { cat: groupUrlSlug(group.key) } }}
              className={styles.card}
              role="listitem"
              aria-label={`${tc(group.key)} ${t("cta")}`}
            >
              <span className={styles.media}>
                <Image
                  src={IMG[group.key]}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1100px) 50vw, 33vw"
                  className={styles.img}
                />
                {counts[group.key] ? (
                  <span className={styles.count}>
                    {counts[group.key]} {t("suppliersShort")}
                  </span>
                ) : null}
              </span>
              <span className={styles.iconBadge}>
                <Image src={icon.src} alt="" width={icon.width} height={icon.height} className={icon.className} />
              </span>
              <span className={styles.cardBody}>
                <span className={styles.name}>{tc(group.key)}</span>
                <span className={styles.desc}>{cardSummary(group.children, ts, t("moreSuffix"))}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Categories;
