/* Hero — eski HTML'deki tam-genişlik görsel + degrade + grain + güven şeridi. */
export const styles= {
  section: "relative isolate overflow-hidden",
  image: "object-cover object-top",
  overlay:
    "absolute inset-0 -z-10 " +
    "bg-[radial-gradient(ellipse_58%_72%_at_50%_42%,rgba(255,255,255,.95)_0%,rgba(255,255,255,.84)_48%,rgba(246,248,255,.42)_74%,rgba(246,248,255,.1)_100%),linear-gradient(180deg,rgba(255,255,255,.26)_0%,rgba(255,255,255,.02)_46%,rgba(246,248,255,.97)_100%)]",
  grain: "pointer-events-none absolute inset-0 -z-10 opacity-[.07] mix-blend-multiply",
  inner:
    "container-px flex min-h-[min(760px,100vh)] flex-col items-center justify-center pb-[88px] pt-[160px] text-center max-[560px]:min-h-[560px] max-[560px]:pb-16 max-[560px]:pt-[120px]",
  eyebrow: "mb-2.5 text-xs font-bold uppercase tracking-[.16em] text-terra",
  title:
    "mx-auto max-w-[17ch] text-balance text-[clamp(24px,6.2vw,68px)] [text-shadow:0_1px_12px_rgba(255,255,255,.5)]",
  sub: "mx-auto mt-4 max-w-[58ch] text-[15px] sm:text-[17px] text-[#47516f] [text-shadow:0_1px_14px_rgba(255,255,255,.78)]",
  searchWrap: "mt-8 w-full",
  pop: "mt-5 flex flex-wrap items-center justify-center gap-2",
  popLabel: "text-[12.5px] font-semibold uppercase tracking-[.08em] text-ink/60",
  popLink:
    "rounded-pill border border-ink/25 bg-white/85 px-3.5 py-1.5 text-[12.5px] font-semibold text-ink " +
    "shadow-[0_8px_20px_-16px_rgba(23,33,120,.42)] transition-colors hover:border-pine hover:bg-pine hover:text-white",
  stats:
    "mt-9 flex flex-wrap items-center justify-center rounded-pill border border-ink/15 bg-white/75 " +
    "px-2.5 py-3 shadow-[0_16px_40px_-28px_rgba(23,33,120,.42)] backdrop-blur",
  stat: "flex items-baseline gap-1.5 border-r border-ink/10 px-[22px] last:border-r-0 max-[560px]:px-3.5 max-[560px]:py-1",
  statNum: "font-display text-[21px] font-semibold text-pine",
  statLabel: "text-[12.5px] font-semibold text-muted",
} as const;
