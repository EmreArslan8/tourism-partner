/* MapPanel — Tailwind sınıf token'ları (stilize pin haritası).
   Not: gerçek OSM/Leaflet karoları bu sandbox'ta bloke; deploy'da takılacak. */
export const s = {
  wrap: "relative h-[560px] overflow-hidden rounded-[16px] border border-line shadow-card max-[1000px]:h-[360px]",
  canvas:
    "absolute inset-0 bg-[linear-gradient(135deg,#eef1f5,#e3e8ef)] " +
    "[background-image:linear-gradient(#d9dee8_1px,transparent_1px),linear-gradient(90deg,#d9dee8_1px,transparent_1px)] " +
    "[background-size:38px_38px]",
  label:
    "absolute left-3 top-3 z-[2] rounded-pill bg-paper/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[.12em] text-muted",
  note: "absolute bottom-3 left-3 z-[2] text-[10.5px] text-muted/80",
  pin: "group absolute z-[3] -translate-x-1/2 -translate-y-full cursor-pointer",
  dot: "block h-3.5 w-3.5 rounded-full border-2 border-white shadow-[0_2px_6px_rgba(16,24,40,.4)] transition-transform group-hover:scale-125",
  tip:
    "pointer-events-none absolute bottom-[18px] left-1/2 z-[4] -translate-x-1/2 whitespace-nowrap rounded-md " +
    "bg-pine px-2 py-1 text-[11px] font-medium text-cream opacity-0 transition-opacity group-hover:opacity-100",
  empty: "absolute inset-0 grid place-items-center text-[13px] text-muted",
} as const;
