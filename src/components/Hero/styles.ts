/* Hero — koyu uzay/glob görseli + sola hizalı içerik + degrade + grain. */
 const styles= {
  section: "relative isolate h-full w-full overflow-hidden bg-pine",
  picture: "absolute inset-0 -z-10 block",
  image: "h-full w-full object-cover object-center",
  overlay:
    "pointer-events-none absolute inset-0 -z-10 " +
    "bg-[linear-gradient(90deg,rgba(5,8,30,.82)_0%,rgba(5,8,30,.42)_42%,rgba(5,8,30,.05)_72%,rgba(5,8,30,0)_100%)]",
  inner:
    "container-px flex h-full min-h-[520px] flex-col items-start justify-center pt-[150px] text-left " +
    "min-[641px]:max-[1024px]:justify-start min-[641px]:max-[1024px]:pt-[15vh] " +
    "max-[640px]:justify-start max-[640px]:pt-[164px] max-[640px]:pb-14",
  title:
    "heading-hero max-w-[18ch] text-white max-[640px]:text-[42px] " +
    "min-[641px]:max-[1024px]:!text-[4.25rem] min-[641px]:max-[1024px]:!leading-[1.04] min-[641px]:max-[1024px]:!tracking-[-.02em] " +
    "[text-shadow:0_2px_28px_rgba(5,8,30,.55)] [&_em]:not-italic [&_em]:text-[#9db4ff]",
  sub:
    "body-lead mt-6 max-w-[50ch] font-medium !text-[#f4f7ff] [text-shadow:0_2px_18px_rgba(0,0,0,.75)] " +
    "min-[641px]:max-[1024px]:mt-8 min-[641px]:max-[1024px]:!text-[1.2rem]",
  searchWrap: "mt-9 w-full max-w-[700px] max-[640px]:hidden min-[641px]:max-[1024px]:mt-11 min-[641px]:max-[1024px]:w-fit min-[641px]:max-[1024px]:max-w-full",
  mobileCtas: "mt-7 hidden w-full gap-2.5 max-[640px]:flex",
  mobileCtaPrimary:
    "flex flex-1 items-center justify-center rounded-xl bg-white px-4 py-3 text-[14.5px] font-bold text-brand " +
    "shadow-[0_18px_38px_-18px_rgba(0,0,0,.55)] transition-transform active:scale-[.97]",
  mobileCtaGhost:
    "flex flex-1 items-center justify-center rounded-xl border border-white/25 bg-white/[.12] px-4 py-3 " +
    "text-[14.5px] font-bold text-white backdrop-blur-md transition-colors active:bg-white/20",
  stats:
    "mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 max-[640px]:hidden " +
    "min-[641px]:max-[1024px]:mt-14 min-[641px]:max-[1024px]:flex-nowrap min-[641px]:max-[1024px]:items-baseline min-[641px]:max-[1024px]:gap-x-9 min-[641px]:max-[1024px]:pl-[28px]",
  stat:
    "flex items-baseline gap-1.5 " +
    "before:mr-5 before:hidden before:h-1 before:w-1 before:rounded-full before:bg-white/30 before:content-[''] " +
    "[&:not(:first-child)]:before:inline-block " +
    "min-[641px]:max-[1024px]:flex-col min-[641px]:max-[1024px]:items-start min-[641px]:max-[1024px]:gap-0.5 " +
    "min-[641px]:max-[1024px]:[&:not(:first-child)]:before:!hidden",
  statNum: "font-display text-[23px] font-semibold tracking-tight text-white min-[641px]:max-[1024px]:text-[32px] min-[641px]:max-[1024px]:leading-none",
  statLabel: "text-[13px] font-medium text-white/60 min-[641px]:max-[1024px]:text-[14px]",
} as const;

export default styles;
