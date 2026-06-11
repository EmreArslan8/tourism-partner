/* Splash — Tailwind sınıf token'ları. Animasyonlar tailwind.config keyframes/animation'dan. */
export const s = {
  overlay:
    "fixed inset-0 z-[200] grid place-items-center animate-splash-in " +
    "bg-[radial-gradient(120%_120%_at_50%_30%,#1f3558,#101828)]",
  leaving: "animate-splash-out",
  inner: "flex flex-col items-center gap-3.5 text-center",
  mark: "h-auto w-[74px] fill-gold animate-splash-mark",
  type: "flex flex-col leading-none",
  typeTop: "font-display text-[34px] font-semibold tracking-[.16em] text-cream",
  typeBottom: "mt-1 text-[14px] tracking-[.42em] text-gold",
  tag: "text-[13px] tracking-[.06em] text-cream/70",
} as const;
