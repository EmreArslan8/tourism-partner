/* Cta — sade, şık sapphire kapanış bandı. */
const styles = {
  section: "container-px",
  panel:
    "bg-sapphire-deep relative isolate flex flex-col gap-8 overflow-hidden rounded-[28px] px-9 py-12 sm:px-14 sm:py-14 " +
    "shadow-[0_40px_90px_-50px_rgba(12,33,86,.8)] " +
    "md:flex-row md:items-center md:justify-between " +
    "max-[560px]:gap-4 max-[560px]:rounded-[20px] max-[560px]:px-6 max-[560px]:py-7",
  glow:
    "pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full blur-3xl " +
    "bg-[radial-gradient(circle,rgba(43,80,216,.45),transparent_70%)]",
  content: "max-w-xl",
  title: "text-[clamp(24px,3.2vw,38px)] font-semibold leading-tight tracking-[-0.02em] text-white max-[560px]:text-[20px]",
  sub: "mt-3 text-[15px] leading-relaxed text-white/70 sm:text-[16px] max-[560px]:mt-2 max-[560px]:text-[13.5px]",
  actions: "flex shrink-0 items-center gap-5 max-[560px]:w-full max-[560px]:gap-4",
  secondary: "text-[14.5px] font-semibold text-white/75 transition-colors hover:text-white",
} as const;

export default styles;
