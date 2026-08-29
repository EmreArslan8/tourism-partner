/* Partners — modern güvenilen markalar şeridi (kenar fade maskeli marquee). */
const styles = {
  // Dikey nefes: yazının alt uzantıları (ğ, ş, y) şeridin kenarına dayanmasın.
  section: "flex flex-col items-center gap-3 overflow-hidden py-3.5 max-[640px]:py-3",
  label:
    "px-6 text-center text-[12.5px] font-semibold uppercase tracking-[.16em] text-muted dark:text-white/60 max-[560px]:text-[11px]",
  viewport:
    // RTL sayfada şerit sağa yaslanıp translateX(-50%) ile görünümden çıkıyordu;
    // marquee içeriği Latince olduğundan her zaman LTR akıtıyoruz.
    "relative w-full [direction:ltr] " +
    "[mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)] " +
    "[-webkit-mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)]",
  track: "flex w-max shrink-0 items-center animate-scroll-linear motion-reduce:animate-none",
  item:
    "inline-flex items-center whitespace-nowrap text-[20px] leading-[1.5] font-semibold tracking-tight text-brand/75 dark:text-white " +
    "transition-colors duration-200 hover:text-brand dark:hover:text-white " +
    "before:mx-9 before:text-[9px] before:text-border-purple/55 before:content-['●'] dark:before:text-white/45 " +
    "max-[640px]:text-[15px] max-[640px]:before:mx-6",
} as const;

export default styles;
