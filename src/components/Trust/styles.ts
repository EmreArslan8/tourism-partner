/* Trust - SSS altındaki yatay dönüşüm bandı. */
const styles = {
  section:
    "relative left-1/2 isolate min-h-[190px] w-screen -translate-x-1/2 overflow-hidden bg-sapphire-deep " +
    "max-[760px]:min-h-[300px]",
  image: "object-cover object-center",
  overlay:
    "absolute inset-0 -z-0 bg-[linear-gradient(90deg,rgba(36,17,63,.92)_0%,rgba(76,29,149,.76)_46%,rgba(36,17,63,.34)_100%)]",
  content:
    "container-px relative z-[1] mx-auto grid min-h-[190px] grid-cols-[minmax(0,1fr)_auto] items-center gap-8 py-8 " +
    "max-[900px]:gap-5 max-[900px]:px-6 max-[760px]:min-h-[300px] max-[760px]:grid-cols-1 max-[760px]:content-center max-[760px]:items-start max-[760px]:py-9",
  title:
    "grid max-w-[520px] gap-0.5 font-display text-[24px] font-semibold leading-[1.08] tracking-normal text-white " +
    "min-[1440px]:text-[28px] max-[760px]:text-[25px] max-[420px]:text-[22px]",
  actions:
    "flex min-w-[360px] items-center justify-end gap-5 max-[900px]:min-w-0 max-[900px]:gap-3 max-[760px]:w-full max-[760px]:flex-wrap max-[760px]:justify-start",
  primary:
    "group inline-flex h-12 min-w-[190px] items-center justify-center gap-2 rounded-[6px] bg-white px-6 text-[13px] font-bold text-sapphire-deep " +
    "shadow-[0_16px_34px_-22px_rgba(0,0,0,.75)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-cream " +
    "[&>svg]:transition-transform group-hover:[&>svg]:translate-x-0.5 rtl:group-hover:[&>svg]:-translate-x-0.5 max-[520px]:w-full",
  secondary:
    "group inline-flex h-12 min-w-[190px] items-center justify-center gap-2 rounded-[6px] border border-white/35 bg-white/5 px-6 text-[13px] font-bold text-white " +
    "backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/12 " +
    "[&>svg]:transition-transform group-hover:[&>svg]:translate-x-0.5 rtl:group-hover:[&>svg]:-translate-x-0.5 max-[520px]:w-full",
} as const;

export default styles;
