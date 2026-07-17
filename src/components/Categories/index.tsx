"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SectionHeader from "@/components/common/SectionHeader";
import { CATEGORY_GROUPS } from "@/lib/categories";
import type { Business, GroupKey } from "@/lib/types";
import styles from "./styles";

const IMG: Record<GroupKey, string> = {
  konaklama: "/assets/cards/konaklama-1.jpeg",
  acente: "/assets/cards/acente-1.jpeg",
  ulasim: "/assets/cards/ulasim-1.jpeg",
  rehber: "/assets/cards/rehber-2.jpeg",
  aktivite: "/assets/cards/aktivite-1.jpeg",
  saglik: "/assets/cards/saglik-2.jpeg",
  gastronomi: "/assets/cards/gastronomi-1.jpeg",
};

const DISPLAY_GROUPS = CATEGORY_GROUPS;
const AUTO_ROTATE_MS = 3500;

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
  ulasim: (
    <svg {...iconProps} className={styles.icon}>
      <path d="M6 17h12M7 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM17 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
      <path d="M5 17V8a3 3 0 0 1 3-3h6l5 5v7M14 5v5h5" />
    </svg>
  ),
  rehber: (
    <svg {...iconProps} className={styles.icon}>
      <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM3 20a6 6 0 0 1 12 0" />
      <path d="M17 6a4 4 0 0 1 0 8M19 4a7 7 0 0 1 0 12" />
    </svg>
  ),
  aktivite: (
    <svg {...iconProps} className={styles.icon}>
      <path d="M12 14a6 6 0 0 0 6-6 6 6 0 1 0-12 0 6 6 0 0 0 6 6ZM10.5 14l-1 3.5h5l-1-3.5M9 21h6" />
    </svg>
  ),
  saglik: (
    <svg {...iconProps} className={styles.icon}>
      <path d="M3 12h4l2-5 4 10 2-5h6" />
    </svg>
  ),
  gastronomi: (
    <svg {...iconProps} className={styles.icon}>
      <path d="M3 3v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V3M5 3v18M18 3c-1.7 0-3 2-3 5s1.3 4 3 4v9" />
    </svg>
  ),
};

/* Ana sayfa kategori girişi — görsel + rozet + ikon + açıklama + İncele.
   Mobilde yatay kaydırmalı tek satır, tablet/desktop'ta panele grid olarak yerleşir. */
const Categories = ({ businesses = [] }: { businesses?: Business[] }) => {
  const t = useTranslations("categories");
  const tc = useTranslations("cat");
  const ts = useTranslations("service");
  const groups = DISPLAY_GROUPS;
  const [activeKey, setActiveKey] = useState<GroupKey>(groups[0].key);
  const [rotationPaused, setRotationPaused] = useState(false);
  const activeGroup = groups.find((g) => g.key === activeKey) ?? groups[0];

  useEffect(() => {
    if (rotationPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setActiveKey((current) => {
        const currentIndex = groups.findIndex((group) => group.key === current);
        return groups[(currentIndex + 1) % groups.length].key;
      });
    }, AUTO_ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [groups, rotationPaused]);

  // Kategori başına tedarikçi sayısı + kapsanan şehir (gerçek veriden — dekor yerine bilgi).
  const stats = businesses.reduce<Record<string, { n: number; cities: Set<string> }>>((acc, b) => {
    const s = (acc[b.group] ??= { n: 0, cities: new Set() });
    s.n += 1;
    if (b.city) s.cities.add(b.city);
    return acc;
  }, {});
  const activeStat = stats[activeGroup.key] ?? { n: 0, cities: new Set<string>() };

  return (
    <section
      className={styles.section}
      id="kategoriler"
      data-tour="supplier-categories"
      onMouseEnter={() => setRotationPaused(true)}
      onMouseLeave={() => setRotationPaused(false)}
      onFocusCapture={() => setRotationPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setRotationPaused(false);
      }}
    >
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

      <div className={styles.panel}>
        <div className={styles.list} role="list" aria-label={t("summaryLabel")}>
          {groups.map((g, index) => {
            const active = g.key === activeKey;

            return (
              <Link
                key={g.key}
                href={{ pathname: "/explore", query: { cat: g.key } }}
                className={active ? `${styles.item} ${styles.itemActive}` : styles.item}
                role="listitem"
                onMouseEnter={() => setActiveKey(g.key)}
                onFocus={() => setActiveKey(g.key)}
                aria-current={active ? "true" : undefined}
              >
                <span className={styles.mobileMedia} aria-hidden="true">
                  <Image src={IMG[g.key]} alt="" fill sizes="(max-width: 640px) 100vw, 50vw" className={styles.img} />
                </span>
                <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.itemCopy}>
                  <span className={styles.titleRow}>
                    <span className={styles.name}>{tc(g.key)}</span>
                    <span className={styles.badge}>{t(`cards.${g.key}.badge`)}</span>
                  </span>
                  <span className={styles.desc}>{t(`cards.${g.key}.desc`)}</span>
                </span>
                <span className={styles.mobileCta}>
                  {t("cta")}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>

        <Link href={{ pathname: "/explore", query: { cat: activeGroup.key } }} className={styles.visual} aria-label={`${tc(activeGroup.key)} ${t("cta")}`}>
          {/* Küçültülmüş görsel şeridi — marka hissi kalsın, alan bilgiye açılsın */}
          <span className={styles.visualMedia} aria-hidden="true">
            <Image
              key={activeGroup.key}
              src={IMG[activeGroup.key]}
              alt=""
              fill
              sizes="(max-width: 760px) 100vw, (max-width: 1200px) 48vw, 560px"
              className={styles.img}
              priority
            />
            <span className={styles.visualShade} />
          </span>

          {/* Bilgi katmanı: tedarikçi sayısı + birkaç alt kategori çipi + CTA (sade) */}
          <span className={styles.visualInfo}>
            <span className={styles.visualStatRow}>
              <strong className={styles.visualName}>{tc(activeGroup.key)}</strong>
              {activeStat.n > 0 && (
                <span className={styles.visualCount}>
                  {activeStat.n} {t("suppliersShort")}{activeStat.cities.size > 0 ? ` · ${activeStat.cities.size} ${t("citiesShort")}` : ""}
                </span>
              )}
            </span>
            <span className={styles.visualChips}>
              {activeGroup.children.slice(0, 4).map((c) => (
                <span key={c.slug} className={styles.chip}>{ts(c.slug)}</span>
              ))}
            </span>
            <span className={styles.visualCta}>
              {t("cta")}
              <svg className={styles.ctaArrow} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </span>
        </Link>
      </div>

      <div className={styles.mobileIcons} aria-hidden="true">
        {groups.map((g) => (
          <span key={g.key} className={g.key === activeKey ? `${styles.mobileIcon} ${styles.mobileIconActive}` : styles.mobileIcon}>
            {ICONS[g.key]}
          </span>
        ))}
      </div>
    </section>
  );
};

export default Categories;
