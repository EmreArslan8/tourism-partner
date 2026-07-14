"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { PublicAdBanner } from "@/lib/platform-data";
import styles from "./styles";

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const AdSlider = ({ banners: inputBanners }: { banners: PublicAdBanner[] }) => {
  const t = useTranslations("ads");
  const [banners, setBanners] = useState(inputBanners);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (inputBanners.length < 2) return;
    const id = window.setTimeout(() => setBanners(shuffle(inputBanners)), 0);
    return () => window.clearTimeout(id);
  }, [inputBanners]);

  useEffect(() => {
    if (banners.length < 2) return;
    const id = setInterval(() => setI((p) => (p + 1) % banners.length), 5000);
    return () => clearInterval(id);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <section className={styles.section} aria-label="Sponsored">
      <div className={styles.viewport}>
        <div className={styles.track} style={{ transform: `translateX(-${i * 100}%)` }}>
          {banners.map((b) => (
            <a key={b.id} href={b.target_url} className={styles.slide}>
              <Image src={b.image_url} alt="" fill sizes="100vw" className={styles.img} />
              <div className={styles.shade} />
              <span className={styles.tag}>{t("label")}</span>
              <div className={styles.body}>
                <h3 className={styles.title}>{b.title}</h3>
                <p className={styles.sub}>{b.placement}</p>
              </div>
              <span className={styles.cta}>
                {t("cta")}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className={styles.dots}>
        {banners.map((b, idx) => (
          <button
            key={b.id}
            type="button"
            aria-label={`Banner ${idx + 1}`}
            onClick={() => setI(idx)}
            className={idx === i ? styles.dotActive : styles.dot}
          />
        ))}
      </div>
    </section>
  );
};

export default AdSlider;
