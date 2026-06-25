"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./styles";

/* Sponsorlu banner slider — gelir modeli (landing reklam).
   Production: her banner admin panelinden yüklenen görsel + URL + tarih aralığı.
   Brief: sıra sabit değil, her oturumda shuffle (impression dengesi).
   Aşağıdaki img'ler demo placeholder; gerçekte reklam kreatifi (~1200×300) gelecek. */
type Banner = {
  id: string;
  title: string;
  sub: string;
  href: string;
  img: string;
};

const BANNERS: Banner[] = [
  { id: "a1", title: "Antalya'da grup konaklama", sub: "Sezon öncesi kontrat fırsatları", href: "/explore?city=Antalya&cat=konaklama", img: "/assets/cards/resort-1.jpg" },
  { id: "a2", title: "Kapadokya balon & tur", sub: "Acentelere özel toptan teklifler", href: "/explore?city=Nevşehir&cat=eglence", img: "/assets/cards/balloon-1.jpg" },
  { id: "a3", title: "VIP transfer & acente ağı", sub: "81 il operasyon kapasitesiyle", href: "/explore?cat=acente", img: "/assets/cards/agency-1.jpg" },
  { id: "a4", title: "Sağlık turizmi klinikleri", sub: "Doğrulanmış, yetki belgeli", href: "/explore?cat=saglik", img: "/assets/cards/clinic-1.jpg" },
];

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const AdSlider = () => {
  const t = useTranslations("ads");
  // SSR ile aynı sırayla render; mount sonrası client'ta shuffle (impression dengesi, hydration-safe).
  const [banners, setBanners] = useState<Banner[]>(BANNERS);
  const [i, setI] = useState(0);

  useEffect(() => {
    setBanners(shuffle(BANNERS));
  }, []);

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % banners.length), 5000);
    return () => clearInterval(id);
  }, [banners.length]);

  return (
    <section className={styles.section} aria-label="Sponsored">
      <div className={styles.viewport}>
        <div className={styles.track} style={{ transform: `translateX(-${i * 100}%)` }}>
          {banners.map((b) => (
            <a key={b.id} href={b.href} className={styles.slide}>
              <Image src={b.img} alt="" fill sizes="100vw" className={styles.img} />
              <div className={styles.shade} />
              <span className={styles.tag}>{t("label")}</span>
              <div className={styles.body}>
                <h3 className={styles.title}>{b.title}</h3>
                <p className={styles.sub}>{b.sub}</p>
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
