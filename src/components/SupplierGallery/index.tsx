"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import PremiumPartnerBadge from "@/components/PremiumPartnerBadge";
import { cn } from "@/lib/utils";

/* Izgara görsel sayısına göre kurulur: sabit 1+2x2 düzeni, 2-3 görselli
   ilanlarda sağ tarafta boş hücreler bırakıyordu. */
const SECONDARY_GRID = ["", "grid-rows-1", "grid-rows-2", "grid-cols-2 grid-rows-2", "grid-cols-2 grid-rows-2"];

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
  const t = useTranslations("supplier");
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
      const isRtl = document.documentElement.dir === "rtl";
      const forward = isRtl ? "ArrowLeft" : "ArrowRight";
      const backward = isRtl ? "ArrowRight" : "ArrowLeft";
      if (event.key === forward) setActive((value) => (value + 1) % images.length);
      if (event.key === backward) setActive((value) => (value - 1 + images.length) % images.length);
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
          {t("galleryImagePending")}
        </span>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[18px] border border-line bg-paper shadow-[0_1px_2px_rgba(2,6,23,.45)]">
        <div
        className={cn(
          "grid h-[480px] gap-1.5 max-[1100px]:h-[440px] max-[900px]:h-auto max-[900px]:grid-cols-1",
          secondary.length > 0 ? "grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" : "grid-cols-1",
        )}
      >
        <button type="button" onClick={() => openGallery(0)} className="relative block min-h-[320px] w-full overflow-hidden border-0 p-0 bg-[#EEF2F7] max-[900px]:min-h-[260px]">
          <Image
            src={main}
            alt={title}
            fill
            priority
            sizes={secondary.length > 0 ? "(max-width: 900px) 100vw, 50vw" : "100vw"}
            className="object-cover"
          />
        </button>

        {secondary.length > 0 && (
          <div className={cn("grid gap-1.5 max-[900px]:hidden", SECONDARY_GRID[secondary.length])}>
            {secondary.map((src, index) => {
              const imageIndex = index + 1;
              const isLastVisible = imageIndex === visible.length - 1 && extraCount > 0;
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => openGallery(imageIndex)}
                  className={cn(
                    "relative block overflow-hidden border-0 p-0 bg-[#EEF2F7]",
                    // 3 küçük görselde ilki sol sütunu tam kaplar, ızgarada boşluk kalmaz.
                    secondary.length === 3 && index === 0 && "row-span-2",
                  )}
                >
                <Image
                  src={src}
                  alt={t("galleryImageAlt", { title, number: index + 2 })}
                  fill
                  sizes={secondary.length > 2 ? "(max-width: 900px) 0px, 25vw" : "(max-width: 900px) 0px, 50vw"}
                  className="object-cover"
                />
                  {isLastVisible && (
                    <span className="absolute inset-0 grid place-items-center bg-black/45 text-white">
                      <span className="rounded-pill border border-white/25 bg-black/30 px-4 py-2 text-[15px] font-bold backdrop-blur-sm">
                        {t("galleryExtraPhotos", { count: extraCount })}
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {sponsored && (
        <PremiumPartnerBadge label={adLabel} className="absolute end-4 top-4 z-[2]" />
      )}

      {images.length > 1 && (
        <button
          type="button"
          onClick={() => openGallery(0)}
          className="absolute bottom-4 end-4 z-[2] rounded-[10px] border border-[#CBD5E1] bg-white px-3.5 py-2 text-[13px] font-bold text-[#0B102F] transition hover:border-terra hover:text-terra-deep"
        >
          {t("galleryShowAll")}
        </button>
      )}

      {open && images[active] && (
        <div className="fixed inset-0 z-[80] bg-black/80 p-4 backdrop-blur-sm">
          <div className="mx-auto flex h-full w-full max-w-[1280px] flex-col">
            <div className="mb-3 flex items-center justify-between text-white">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[.08em] text-white/70">{t("galleryTitle")}</p>
                <p className="text-[15px] font-semibold">{title}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-[20px] text-white transition hover:bg-white/20"
                aria-label={t("galleryClose")}
              >
                ×
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center">
              <button
                type="button"
                onClick={() => goTo(active - 1)}
                className="absolute start-3 z-[1] grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-[26px] leading-none text-white transition hover:bg-white/20"
                aria-label={t("galleryPrevious")}
              >
                <span className="inline-block rtl:rotate-180">‹</span>
              </button>
              <div className="relative h-[72vh] w-full overflow-hidden rounded-[18px] bg-black/30">
                <Image
                  src={images[active]}
                  alt={t("galleryImageAlt", { title, number: active + 1 })}
                  fill
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-contain"
                />
              </div>
              <button
                type="button"
                onClick={() => goTo(active + 1)}
                className="absolute end-3 z-[1] grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-[26px] leading-none text-white transition hover:bg-white/20"
                aria-label={t("galleryNext")}
              >
                <span className="inline-block rtl:rotate-180">›</span>
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
