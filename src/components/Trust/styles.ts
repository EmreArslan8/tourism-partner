/* Trust — FAQ altındaki güven rozetleri. Modern/lüks: gradient ikon kapsülü,
   köşede index, hover'da yükselme + safir glow, hairline border, derin yumuşak gölge. */
const styles = {
  section: "w-full",
  title: "heading-section mb-6 text-ink max-[700px]:mb-4 max-[700px]:text-[19px]",
  list:
    "grid grid-cols-3 gap-5 " +
    "max-[700px]:grid-cols-1 max-[700px]:gap-3.5",
  item:
    "group relative isolate flex flex-col items-start gap-4 overflow-hidden rounded-[22px] " +
    "border border-line/70 bg-gradient-to-b from-white to-cream px-6 py-6 " +
    "shadow-[0_24px_60px_-44px_rgba(7,9,42,.5)] transition-all duration-300 ease-brand " +
    "hover:-translate-y-1.5 hover:border-sapphire/35 hover:shadow-[0_44px_84px_-44px_rgba(15,59,176,.5)] " +
    "min-[701px]:max-[1024px]:gap-4 min-[701px]:max-[1024px]:px-6 min-[701px]:max-[1024px]:py-7 " +
    "max-[700px]:flex-row max-[700px]:items-center max-[700px]:gap-3.5 max-[700px]:rounded-2xl max-[700px]:px-4 max-[700px]:py-3.5",
  glow:
    "pointer-events-none absolute -right-16 -top-16 -z-10 h-44 w-44 rounded-full bg-sapphire/15 blur-3xl " +
    "opacity-0 transition-opacity duration-300 group-hover:opacity-100",
  index:
    "absolute right-6 top-6 font-display text-[14px] font-bold tracking-[.32em] text-sapphire/25 " +
    "transition-colors duration-300 group-hover:text-sapphire/45 " +
    "min-[701px]:max-[1024px]:right-5 min-[701px]:max-[1024px]:top-5 max-[700px]:hidden",
  icon:
    "relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white " +
    "bg-gradient-to-br from-sapphire-top to-sapphire-deep ring-1 ring-white/25 " +
    "shadow-[0_18px_34px_-14px_rgba(15,59,176,.75)] [&_svg]:h-[26px] [&_svg]:w-[26px] " +
    "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/25 before:to-transparent before:opacity-60 " +
    "transition-transform duration-300 group-hover:scale-[1.06] " +
    "min-[701px]:max-[1024px]:h-14 min-[701px]:max-[1024px]:w-14 min-[701px]:max-[1024px]:[&_svg]:h-[26px] min-[701px]:max-[1024px]:[&_svg]:w-[26px] " +
    "max-[700px]:h-12 max-[700px]:w-12 max-[700px]:rounded-xl max-[700px]:[&_svg]:h-[22px] max-[700px]:[&_svg]:w-[22px]",
  body: "flex min-w-0 flex-col",
  itemTitle:
    "text-[17px] font-semibold leading-tight tracking-[-.01em] text-ink " +
    "min-[701px]:max-[1024px]:text-[16.5px] max-[700px]:text-[14.5px]",
  rule:
    "mt-2.5 mb-2.5 h-px w-9 bg-gradient-to-r from-sapphire/60 to-transparent " +
    "transition-all duration-300 group-hover:w-14 " +
    "min-[701px]:max-[1024px]:my-2.5 max-[700px]:hidden",
  itemDesc:
    "text-[14.5px] leading-relaxed text-muted " +
    "min-[701px]:max-[1024px]:text-[13.5px] max-[700px]:mt-1 max-[700px]:text-[13.5px] max-[700px]:leading-snug",
} as const;

export default styles;
