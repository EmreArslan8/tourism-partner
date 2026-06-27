/* Trust — FAQ'ın altında 3 büyük güven rozeti; kenarlıksız, yumuşak yüzey. */
const styles = {
  section: "w-full",
  title: "heading-section mb-6 text-ink max-[700px]:mb-3 max-[700px]:text-[19px]",
  list:
    "grid grid-cols-3 gap-6 " +
    "max-[700px]:grid-cols-1 max-[700px]:gap-2.5",
  item:
    "flex items-center gap-5 rounded-card-lg bg-paper px-8 py-9 " +
    "shadow-[0_28px_70px_-46px_rgba(7,9,42,.5)] " +
    "max-[700px]:gap-3.5 max-[700px]:px-4 max-[700px]:py-3.5",
  icon:
    "grid h-[68px] w-[68px] shrink-0 place-items-center rounded-full bg-terra/10 text-terra [&_svg]:h-[32px] [&_svg]:w-[32px] " +
    "max-[700px]:h-11 max-[700px]:w-11 max-[700px]:[&_svg]:h-[20px] max-[700px]:[&_svg]:w-[20px]",
  body: "flex min-w-0 flex-col",
  itemTitle: "text-[19px] font-semibold leading-tight text-ink max-[700px]:text-[14.5px]",
  itemDesc: "mt-1.5 text-[14.5px] leading-snug text-muted max-[700px]:mt-0.5 max-[700px]:text-[12.5px]",
} as const;

export default styles;
