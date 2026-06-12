"use client";

import { useCallback, useState } from "react";
import Image from "next/image";

export default function SupplierGallery({
  images,
  title,
  eyebrow,
  color,
  adLabel,
  sponsored,
}: {
  images: string[];
  title: string;
  eyebrow: string;
  color: string;
  adLabel: string;
  sponsored: boolean;
}) {
  const [active, setActive] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const hasMultiple = images.length > 1;

  const goTo = useCallback(
    (nextIndex: number) => {
      setActive((nextIndex + images.length) % images.length);
    },
    [images.length]
  );

  const handleTouchEnd = (x: number) => {
    if (touchStart === null) return;
    const delta = touchStart - x;
    if (Math.abs(delta) > 40) goTo(active + (delta > 0 ? 1 : -1));
    setTouchStart(null);
  };

  return (
    <section className="rounded-[18px]">
      <div
        className="relative overflow-hidden rounded-[18px] border border-line bg-paper shadow-[0_24px_70px_-48px_rgba(7,9,42,.75)]"
        style={{ backgroundColor: color }}
        onTouchStart={(event) => setTouchStart(event.changedTouches[0]?.clientX ?? null)}
        onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
      >
        <div
          className="flex transition-transform duration-500 ease-brand"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {images.map((src, index) => (
            <figure
              key={src}
              className="relative h-[min(60vw,560px)] min-h-[320px] w-full shrink-0"
            >
              <Image
                src={src}
                alt={index === 0 ? title : `${title} görsel ${index + 1}`}
                fill
                priority={index === 0}
                sizes="(max-width: 900px) 100vw, 1480px"
                className="object-contain"
              />
            </figure>
          ))}
        </div>

        <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent" aria-hidden />
        {sponsored && (
          <span className="absolute right-4 top-4 z-[2] rounded-pill bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-[.06em] text-pine">
            {adLabel}
          </span>
        )}

        {hasMultiple && (
          <>
            <button
              type="button"
              aria-label="Önceki görsel"
              onClick={() => goTo(active - 1)}
              className="absolute left-4 top-1/2 z-[2] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/35 text-[28px] leading-none text-white shadow-[0_10px_30px_-18px_rgba(0,0,0,.8)] backdrop-blur-sm transition hover:bg-black/50"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Sonraki görsel"
              onClick={() => goTo(active + 1)}
              className="absolute right-4 top-1/2 z-[2] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/35 text-[28px] leading-none text-white shadow-[0_10px_30px_-18px_rgba(0,0,0,.8)] backdrop-blur-sm transition hover:bg-black/50"
            >
              ›
            </button>
          </>
        )}

        <div className="absolute inset-x-0 bottom-0 z-[1] p-5 text-white">
          <span className="inline-flex rounded-pill border border-white/25 bg-black/25 px-3 py-1 text-[12px] font-bold uppercase tracking-[.08em] backdrop-blur-sm">
            {eyebrow}
          </span>
          <h1 className="mt-3 max-w-[980px] text-[clamp(32px,5vw,62px)] leading-[.98] text-white drop-shadow-[0_14px_35px_rgba(0,0,0,.45)]">
            {title}
          </h1>
        </div>
      </div>

      {hasMultiple && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              aria-label={`${index + 1}. görseli göster`}
              aria-current={active === index}
              onClick={() => goTo(index)}
              className="relative h-[86px] w-[132px] shrink-0 overflow-hidden rounded-[12px] border bg-paper transition hover:-translate-y-px aria-current:border-terra aria-current:ring-2 aria-current:ring-terra/20"
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="132px"
                className="object-cover"
              />
              <span
                className={`absolute inset-0 ${active === index ? "bg-transparent" : "bg-black/10"}`}
                aria-hidden
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
