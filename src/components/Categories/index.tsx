"use client";

import { useRef } from "react";
import Image from "next/image";
import type { ReactNode } from "react";
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

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* Gruba özel ikonlar (inline SVG — ek bağımlılık yok). */
const ICONS: Record<GroupKey, ReactNode> = {
  konaklama: (
    <svg {...iconProps} className={styles.icon}>
      <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  acente: (
    <svg {...iconProps} className={styles.icon}>
      <path d="M4 7h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M2 13h20" />
    </svg>
  ),
  rehber: (
    <svg {...iconProps} className={styles.icon}>
      <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM3 20a6 6 0 0 1 12 0" />
      <path d="M17 6a4 4 0 0 1 0 8M19 4a7 7 0 0 1 0 12" />
    </svg>
  ),
  eglence: (
    <svg {...iconProps} className={styles.icon}>
      <path d="M12 14a6 6 0 0 0 6-6 6 6 0 1 0-12 0 6 6 0 0 0 6 6ZM10.5 14l-1 3.5h5l-1-3.5M9 21h6" />
    </svg>
  ),
  saglik: (
    <svg {...iconProps} className={styles.icon}>
      <path d="M3 12h4l2-5 4 10 2-5h6" />
    </svg>
  ),
};

/* Ana sayfa kategori girişi — görsel + rozet + ikon + açıklama + İncele.
   Mobilde yatay kaydırmalı tek satır, tablet/desktop'ta panele grid olarak yerleşir. */
const Categories = () => {
  const t = useTranslations("categories");
  const tc = useTranslations("cat");
  const trackRef = useRef<HTMLDivElement>(null);

  /* Mobil yatay karuselini bir kart kadar kaydır. */
  const scrollByCard = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 14 : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className={styles.section} id="kategoriler">
      <div className={styles.head}>
        <div className={styles.headCopy}>
          <span className={styles.eyebrow}>{t("eyebrow")}</span>
          <h2 className={styles.headTitle}>{t("title")}</h2>
          <p className={styles.lead}>{t("lead")}</p>
        </div>
        <div className={styles.navBtns}>
          <button type="button" aria-label={t("prev")} className={styles.navBtn} onClick={() => scrollByCard(-1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
          </button>
          <button type="button" aria-label={t("next")} className={styles.navBtn} onClick={() => scrollByCard(1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      <div ref={trackRef} className={styles.track}>
        {/* Ana sayfada 4 kart gösterilir; Sağlık Turizmi'ne alttaki arama rotaları chip'inden erişilir. */}
        {CATEGORY_GROUPS.filter((g) => g.key !== "saglik").map((g) => (
          <Link
            key={g.key}
            href={{ pathname: "/explore", query: { cat: g.key } }}
            className={styles.card}
          >
            <div className={styles.media}>
              <Image
                src={IMG[g.key]}
                alt=""
                fill
                sizes="(max-width:640px) 78vw, (max-width:1024px) 33vw, 20vw"
                className={styles.img}
              />
              <span className={styles.badge}>
                <span className={styles.badgeDot} aria-hidden="true" />
                {t(`cards.${g.key}.badge`)}
              </span>
            </div>

            <div className={styles.body}>
              <div className={styles.titleRow}>
                {ICONS[g.key]}
                <h3 className={styles.name}>{tc(g.key)}</h3>
              </div>
              <p className={styles.desc}>{t(`cards.${g.key}.desc`)}</p>
              <span className={styles.cta}>
                {t("cta")}
                <svg className={styles.ctaArrow} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
