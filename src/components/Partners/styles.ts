/* Partners — modern güvenilen markalar şeridi (kenar fade maskeli marquee). */
const styles = {
  section: "flex flex-col items-center gap-6 overflow-hidden py-10 max-[640px]:py-8",
  label:
    "px-6 text-center text-[12.5px] font-semibold uppercase tracking-[.16em] text-muted max-[560px]:text-[11px]",
  viewport:
    "relative w-full " +
    "[mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)] " +
    "[-webkit-mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)]",
  track: "flex w-max shrink-0 items-center animate-scroll-linear",
  item:
    "inline-flex items-center whitespace-nowrap text-[28px] font-semibold tracking-tight text-ink/45 " +
    "transition-colors duration-200 hover:text-terra " +
    "before:mx-9 before:text-[9px] before:text-terra/40 before:content-['●'] " +
    "max-[640px]:text-[20px] max-[640px]:before:mx-6",
} as const;

export default styles;
