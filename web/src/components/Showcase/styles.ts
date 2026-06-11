/* Showcase — Tailwind sınıf token'ları (kart görünümü SupplierCard'da). */
export const s = {
  head: "mb-[18px] flex items-end justify-between gap-4",
  title: "text-[clamp(24px,3vw,36px)]",
  sub: "mt-1 text-[12.5px] font-semibold uppercase tracking-[.04em] text-muted",
  more: "text-[14px] font-semibold text-terra hover:text-terra-deep",
  rail: "grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2 max-[640px]:grid-cols-1",
} as const;
