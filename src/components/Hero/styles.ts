/* Hero — statik marketing görseli + sola hizalı içerik. */
 const styles= {
  section: "relative isolate h-full w-full overflow-hidden bg-pine",
  picture: "absolute inset-0 -z-10 block",
  image: "h-full w-full object-cover object-center min-[1440px]:object-[44%_center] min-[1800px]:object-[40%_center]",
  overlay:
    "pointer-events-none absolute inset-0 -z-10 " +
    "bg-[linear-gradient(90deg,rgba(1,8,47,.82)_0%,rgba(1,8,47,.42)_42%,rgba(1,8,47,.05)_72%,rgba(1,8,47,0)_100%)]",
  // Etkileşimli küre (yalnız masaüstü ≥1025px; mobil/tablet statik fotoğrafla kalır).
  // Sağ tarafa demirli; içerik (sol) DOM'da sonra geldiği için üstte kalır.
  globeWrap:
    "pointer-events-none absolute right-[-20vw] top-[88%] z-0 hidden aspect-square " +
    "w-[min(72vw,720px)] -translate-y-1/2 min-[1025px]:block " +
    "min-[1440px]:right-[-20vw] min-[1600px]:right-[-16vw]",
  // Fotoğraftaki statik küreyi yumuşakça maskeler + kürenin arkasına gece-mavi halo verir.
  globeHalo:
    "absolute inset-[-10%] rounded-full " +
    "bg-[radial-gradient(closest-side,#01082f_46%,rgba(1,8,47,.78)_64%,rgba(1,8,47,0)_100%)]",
  globeCanvas: "pointer-events-auto relative h-full w-full",
  inner:
    "container-px flex h-full min-h-[520px] flex-col items-start justify-center  text-left " +
    "min-[1440px]:-translate-y-6 min-[1800px]:-translate-y-10 " +
    "min-[641px]:max-[1024px]:justify-start min-[641px]:max-[1024px]:pt-[15vh] " +
    "max-[640px]:justify-start max-[640px]:pt-[112px] max-[640px]:pb-8",
  title:
    "heading-hero max-w-[17ch] text-white max-[640px]:max-w-[12ch] max-[640px]:text-[38px] max-[640px]:leading-[1.06] max-[640px]:tracking-[-.025em] max-[640px]:[&_em]:block " +
    "min-[641px]:max-[1024px]:!text-[4.25rem] min-[641px]:max-[1024px]:!leading-[1.04] min-[641px]:max-[1024px]:!tracking-[-.02em] " +
    "min-[1440px]:!text-[88px] min-[1440px]:!leading-[.98] min-[1800px]:!text-[96px] " +
    "[text-shadow:0_2px_28px_rgba(1,8,47,.55)] [&_em]:not-italic [&_em]:text-[#9db4ff]",
  mobileIntro:
    "mt-4 hidden max-w-[34ch] text-[13.5px] font-medium leading-5 text-white/75 max-[640px]:block",
  categories:
    "mt-8 flex items-start gap-8 text-white max-[1100px]:gap-5 max-[640px]:hidden min-[1440px]:mt-10 min-[1440px]:gap-10 min-[1800px]:gap-11",
  categoryLink:
    "group flex min-w-[68px] flex-col items-center gap-2 !text-white text-[13px] font-semibold transition-opacity hover:opacity-80 min-[1440px]:min-w-[78px] min-[1440px]:text-[14px] min-[1800px]:text-[15px]",
  categoryIcon:
    "h-8 w-8 text-white stroke-white stroke-[1.55] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110 min-[1440px]:h-9 min-[1440px]:w-9 min-[1800px]:h-10 min-[1800px]:w-10",
  gastronomyIcon:
    "-my-1 h-10 w-10 text-white stroke-white transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110 min-[1440px]:h-11 min-[1440px]:w-11 min-[1800px]:h-12 min-[1800px]:w-12",
  transferIcon:
    "h-8 w-11 object-contain text-white transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110 min-[1440px]:h-9 min-[1440px]:w-[50px] min-[1800px]:h-10 min-[1800px]:w-[55px]",
  searchWrap: "mt-7 w-full max-w-[760px] max-[640px]:hidden min-[641px]:max-[1024px]:mt-8 min-[641px]:max-[1024px]:w-fit min-[641px]:max-[1024px]:max-w-full min-[1440px]:mt-8 min-[1440px]:max-w-[860px] min-[1800px]:max-w-[940px]",
  ctaBlock:
    "relative mt-8 flex w-full max-w-[760px] flex-col items-start gap-4 pt-5 max-[640px]:hidden " +
    "min-[1440px]:mt-9 min-[1440px]:max-w-[860px] min-[1440px]:gap-5 min-[1440px]:pt-6 min-[1800px]:max-w-[940px] " +
    "before:absolute before:inset-x-0 before:top-0 before:h-px before:content-[''] " +
    "before:bg-[linear-gradient(90deg,rgba(157,180,255,.58),rgba(157,180,255,.16)_58%,transparent)]",
  ctaCopy: "min-w-0 max-w-[560px]",
  ctaPrompt:
    "font-display text-[25px] font-medium leading-[1.15] tracking-[-.01em] text-white [text-shadow:0_2px_18px_rgba(0,0,0,.35)] min-[1440px]:text-[28px] min-[1800px]:text-[31px]",
  ctaSub: "mt-2.5 max-w-[58ch] text-[14.5px] font-medium leading-6 !text-white min-[1440px]:text-[15.5px] min-[1800px]:text-[16.5px]",
  ctaPrimary:
    "group/quote relative inline-flex min-h-[50px] min-w-[300px] shrink-0 items-center justify-center gap-3 overflow-hidden rounded-[12px] " +
    "border border-white/15 bg-sapphire-top px-8 text-[15px] font-bold text-white " +
    "shadow-[0_14px_34px_-16px_rgba(0,79,230,.85)] ring-1 ring-[#8eb0ff]/15 transition-all duration-200 " +
    "before:absolute before:inset-y-0 before:left-[-45%] before:w-[38%] before:skew-x-[-18deg] before:bg-white/12 before:content-[''] before:transition-[left] before:duration-500 " +
    "hover:-translate-y-0.5 hover:border-white/25 hover:bg-sapphire hover:shadow-[0_18px_38px_-15px_rgba(0,79,230,.95)] hover:before:left-[120%] " +
    "min-[1440px]:min-h-[56px] min-[1440px]:min-w-[340px] min-[1440px]:px-10 min-[1440px]:text-[16px] min-[1800px]:min-h-[60px] min-[1800px]:min-w-[360px] min-[1800px]:text-[17px] " +
    "[&>span]:relative [&>svg]:relative [&_svg]:h-4 [&_svg]:w-4 [&_svg]:transition-transform group-hover/quote:[&_svg]:translate-x-1",
  mobileCtas: "mt-5 hidden w-full flex-col gap-2.5 max-[640px]:flex",
  mobileCtaRow: "flex w-full",
  mobileCtaPrimary:
    "flex h-[52px] w-full items-center justify-center rounded-xl bg-white px-4 text-[14.5px] font-bold text-brand " +
    "shadow-[0_18px_38px_-18px_rgba(0,0,0,.55)] transition-transform active:scale-[.97]",
  mobileCtaGhost:
    "flex h-[48px] w-full items-center justify-center rounded-xl border border-white/25 bg-white/[.12] px-4 " +
    "text-[14px] font-bold text-white backdrop-blur-md transition-colors active:bg-white/20",
  mobileCategories:
    "mt-5 hidden w-full flex-wrap gap-2 max-[640px]:flex",
  mobileCategoryLink:
    "flex min-w-0 flex-[1_1_30%] items-center justify-center gap-1.5 rounded-[10px] border border-white/15 bg-[#071a52]/75 px-2 py-2 text-center text-[10.5px] font-bold leading-tight text-white backdrop-blur-md " +
    "[&_img]:h-4 [&_img]:w-4 [&_img]:shrink-0",
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
