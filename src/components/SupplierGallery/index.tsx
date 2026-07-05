"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

const SupplierGallery = ({
  images,
  title,
  adLabel,
  sponsored,
}: {
  images: string[];
  title: string;
  eyebrow: string;
  adLabel: string;
  sponsored: boolean;
}) => {
  const hasImages = images.length > 0;
  const visible = useMemo(() => images.slice(0, 5), [images]);
  const main = visible[0];
  const secondary = visible.slice(1, 5);
  const extraCount = Math.max(0, images.length - visible.length);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight") setActive((value) => (value + 1) % images.length);
      if (event.key === "ArrowLeft") setActive((value) => (value - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [images.length, open]);

  const openGallery = (index = 0) => {
    if (!images.length) return;
    setActive(index);
    setOpen(true);
  };

  const goTo = (nextIndex: number) => {
    if (!images.length) return;
    setActive((nextIndex + images.length) % images.length);
  };

  if (!hasImages || !main) {
    return (
      <section className="grid h-[360px] place-items-center rounded-[18px] border border-line bg-[#EEF2F7] max-[900px]:h-[280px]">
        <span className="rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-[13px] font-semibold text-[#64748B]">
          Görsel bekleniyor
        </span>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[18px] border border-line bg-paper shadow-[0_24px_70px_-48px_rgba(7,9,42,.75)]">
        <div className="grid h-[400px] grid-cols-[minmax(0,1.45fr)_minmax(320px,.9fr)] gap-1.5 max-[900px]:h-auto max-[900px]:grid-cols-1">
        <button type="button" onClick={() => openGallery(0)} className="relative block min-h-[320px] w-full overflow-hidden border-0 p-0 bg-[#EEF2F7] max-[900px]:min-h-[260px]">
          <Image
            src={main}
            alt={title}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 980px"
            className="object-cover"
          />
        </button>

        <div className="grid grid-cols-2 gap-1.5 max-[900px]:hidden">
          {secondary.length > 0 ? (
            secondary.map((src, index) => {
              const imageIndex = index + 1;
              const isLastVisible = imageIndex === visible.length - 1 && extraCount > 0;
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => openGallery(imageIndex)}
                  className="relative block overflow-hidden border-0 p-0 bg-[#EEF2F7]"
                >
                <Image
                  src={src}
                  alt={`${title} görsel ${index + 2}`}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
                  {isLastVisible && (
                    <span className="absolute inset-0 grid place-items-center bg-black/45 text-white">
                      <span className="rounded-pill border border-white/25 bg-black/30 px-4 py-2 text-[15px] font-bold backdrop-blur-sm">
                        +{extraCount} fotoğraf
                      </span>
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-[#EEF2F7]" aria-hidden />
            ))
          )}
        </div>
      </div>

      {sponsored && (
        <span className="absolute right-4 top-4 z-[2] rounded-pill bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-[.06em] text-pine shadow-[0_12px_28px_-20px_rgba(7,9,42,.45)]">
          {adLabel}
        </span>
      )}

      {images.length > 1 && (
        <button
          type="button"
          onClick={() => openGallery(0)}
          className="absolute bottom-4 right-4 z-[2] rounded-[10px] border border-[#CBD5E1] bg-white px-3.5 py-2 text-[13px] font-bold text-[#0B102F] shadow-[0_14px_32px_-22px_rgba(7,9,42,.55)] transition hover:border-terra hover:text-terra-deep"
        >
          Tüm görselleri göster
        </button>
      )}

      {open && images[active] && (
        <div className="fixed inset-0 z-[80] bg-black/80 p-4 backdrop-blur-sm">
          <div className="mx-auto flex h-full w-full max-w-[1280px] flex-col">
            <div className="mb-3 flex items-center justify-between text-white">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[.08em] text-white/70">Galeri</p>
                <p className="text-[15px] font-semibold">{title}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-[20px] text-white transition hover:bg-white/20"
                aria-label="Galeri kapat"
              >
                ×
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center">
              <button
                type="button"
                onClick={() => goTo(active - 1)}
                className="absolute left-3 z-[1] grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-[26px] leading-none text-white transition hover:bg-white/20"
                aria-label="Önceki görsel"
              >
                ‹
              </button>
              <div className="relative h-[72vh] w-full overflow-hidden rounded-[18px] bg-black/30">
                <Image
                  src={images[active]}
                  alt={`${title} görsel ${active + 1}`}
                  fill
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-contain"
                />
              </div>
              <button
                type="button"
                onClick={() => goTo(active + 1)}
                className="absolute right-3 z-[1] grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-[26px] leading-none text-white transition hover:bg-white/20"
                aria-label="Sonraki görsel"
              >
                ›
              </button>
            </div>

            <div className="mt-3 grid grid-flow-col auto-cols-[92px] gap-2 overflow-x-auto pb-1">
              {images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-current={active === index}
                  className="relative h-[68px] overflow-hidden rounded-[12px] border border-white/15 bg-black/20 aria-current:border-white aria-current:ring-2 aria-current:ring-white/30"
                >
                  <Image src={src} alt="" fill sizes="92px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SupplierGallery;
