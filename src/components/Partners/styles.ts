/* Partners — modern güvenilen markalar şeridi (kenar fade maskeli marquee). */
const styles = {
  section: "flex flex-col items-center gap-3 overflow-hidden py-2.5 max-[640px]:py-2",
  label:
    "px-6 text-center text-[12.5px] font-semibold uppercase tracking-[.16em] text-muted max-[560px]:text-[11px]",
  viewport:
    "relative w-full " +
    "[mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)] " +
    "[-webkit-mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)]",
  track: "flex w-max shrink-0 items-center animate-scroll-linear",
  item:
    "inline-flex items-center whitespace-nowrap text-[20px] font-semibold tracking-tight text-white " +
    "transition-colors duration-200 hover:text-white " +
    "before:mx-9 before:text-[9px] before:text-white before:content-['●'] " +
    "max-[640px]:text-[16px] max-[640px]:before:mx-6",
} as const;

export default styles;
