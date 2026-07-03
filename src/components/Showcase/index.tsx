"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SectionHeader from "@/components/common/SectionHeader";
import { GROUP_COLORS } from "@/lib/categories";
import { realBusinessImages } from "@/lib/business-images";
import { FACETS } from "@/lib/facets";
import type { Business } from "@/lib/types";
import Button from "@/components/common/Button";
import styles from "./styles";

/* facet slug → etiket (hizmet/koşul çiplerini göstermek için). */
const FACET_LABEL = new Map<string, string>();
FACETS.forEach((f) => f.options.forEach((o) => FACET_LABEL.set(o.slug, o.label)));

const galleryFor = (b: Business): string[] => realBusinessImages(b.image, b.images).slice(0, 4);

/* Tek slide: solda galeri (kendi aktif görsel state'i), sağda bilgiler. */
const Slide = ({ business }: { business: Business }) => {
  const tc = useTranslations("cat");
  const tv = useTranslations("common");
  const ts = useTranslations("supplier");
  const imgs = galleryFor(business);
  const [act, setAct] = useState(0);
  const touchX = useRef<number | null>(null);

  /* Mobilde galeriyi yatay kaydırarak görsel değiştir (thumbnail'e basmaya gerek yok). */
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) {
      const n = imgs.length;
      setAct((p) => (dx < 0 ? (p + 1) % n : (p - 1 + n) % n));
    }
    touchX.current = null;
  };
  const services = (business.attributes ?? [])
    .map((s) => FACET_LABEL.get(s))
    .filter(Boolean)
    .slice(0, 6) as string[];

  return (
    <div className={styles.slide}>
      <div className={styles.panel}>
        {/* SOL — galeri */}
        <div
          className={styles.gallery}
          style={{ backgroundColor: GROUP_COLORS[business.group] }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {imgs[act] ? (
            <Image src={imgs[act]} alt={business.name} fill sizes="(max-width:860px) 100vw, 55vw" className={styles.galleryImg} />
          ) : (
            <div className={styles.placeholder}>Görsel bekleniyor</div>
          )}
          {/* Masaüstü/tablet: tıklanabilir thumbnail'ler */}
          <div className={styles.thumbs}>
            {imgs.map((src, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Görsel ${i + 1}`}
                onClick={() => setAct(i)}
                className={i === act ? styles.thumbActive : styles.thumb}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
          {/* Mobil: kaydırma göstergesi (nokta) */}
          <div className={styles.galleryDots} aria-hidden>
            {imgs.map((_, i) => (
              <span key={i} className={i === act ? styles.galleryDotActive : styles.galleryDot} />
            ))}
          </div>
        </div>

        {/* SAĞ — bilgiler */}
        <div className={styles.info}>
          <div className={styles.infoTop}>
            <span className={styles.cat}>{tc(business.group)} · {business.type}</span>
            {business.verified && (
              <span className={styles.verified}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                {tv("verified")}
              </span>
            )}
          </div>

          <h3 className={styles.name}>{business.name}</h3>

          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-4.5-7-10a7 7 0 0 1 14 0c0 5.5-7 10-7 10Z" /><circle cx="12" cy="11" r="2.5" /></svg>
              {business.district}, {business.city}
            </span>
            <span className={styles.metaDot} />
            <span className={styles.metaItem}>
              <span className={styles.stars}>★</span>
              <strong className={styles.ratingNum}>{business.rating.toFixed(1)}</strong>
              <span className={styles.reviews}>({business.reviews})</span>
            </span>
          </div>

          <p className={styles.desc}>{business.desc}</p>

          {services.length > 0 && (
            <div className={styles.services}>
              <span className={styles.servicesLabel}>{ts("services")}</span>
              <div className={styles.chips}>
                {services.map((s) => <span key={s} className={styles.chip}>{s}</span>)}
              </div>
            </div>
          )}

          <div className={styles.foot}>
            <Button href="/login" variant="solid" size="sm" className="btn-compact-sm">{tv("detailLogin")}</Button>
            <Link href={{ pathname: "/quote" }} className={styles.quote}>{tv("requestQuote")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Öne çıkan iş ortakları — tam genişlikte, tek tek kayan carousel. */
const Showcase = ({ businesses }: { businesses: Business[] }) => {
  const t = useTranslations("showcase");
  const items = businesses.filter((b) => b.sponsored && galleryFor(b).length > 0).slice(0, 5);
  const [i, setI] = useState(0);

  if (items.length === 0) return null;
  const go = (d: number) => setI((p) => (p + d + items.length) % items.length);

  return (
    <section id="vitrin">
      <div className={styles.head}>
        <SectionHeader
          className={styles.copy}
          eyebrow={t("eyebrow")}
          title={t("title")}
          desc={t("sub")}
          eyebrowClassName={styles.eyebrow}
          titleClassName={styles.title}
          descClassName={styles.sub}
        />
        <div className={styles.nav}>
          <button type="button" aria-label="Önceki" className={styles.arrow} onClick={() => go(-1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
          </button>
          <button type="button" aria-label="Sonraki" className={styles.arrow} onClick={() => go(1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>

      <div className={styles.viewport}>
        <div className={styles.track} style={{ transform: `translateX(-${i * 100}%)` }}>
          {items.map((b) => <Slide key={b.id} business={b} />)}
        </div>
      </div>

      <div className={styles.dots}>
        {items.map((b, idx) => (
          <button key={b.id} type="button" aria-label={`Slide ${idx + 1}`} onClick={() => setI(idx)} className={idx === i ? styles.dotActive : styles.dot} />
        ))}
      </div>
    </section>
  );
};

export default Showcase;
