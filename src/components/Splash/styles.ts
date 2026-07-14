/* Splash — Tailwind sınıf token'ları. Animasyonlar tailwind.config keyframes/animation'dan. */
 const styles= {
  overlay:
    "fixed inset-0 z-[200] grid place-items-center animate-splash-in " +
    "bg-[radial-gradient(120%_120%_at_72%_36%,#3542ee_0%,#12237f_58%,#01082f_100%)]",
  leaving: "animate-splash-out",
  inner: "flex flex-col items-center gap-3.5 text-center",
  logoImage: "h-28 w-28 rounded-[20px] object-cover shadow-[0_26px_70px_-28px_rgba(0,0,0,.8)]",
  tag: "text-[13px] tracking-[.06em] text-cream/70",
} as const;

export default styles;
