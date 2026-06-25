/* MapPanel — gerçek Leaflet/OSM haritası için Tailwind sınıf token'ları. */
 const styles = {
  wrap: "relative h-[560px] overflow-hidden rounded-[16px] border border-line shadow-card max-[1000px]:h-[360px]",
  map: "absolute inset-0 z-0 bg-[#e7ecff]",
  label:
    "pointer-events-none absolute left-3 top-3 z-[500] rounded-pill bg-paper/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[.12em] text-muted shadow-card",
  empty:
    "absolute inset-0 z-[500] grid place-items-center bg-paper/70 text-[13px] text-muted backdrop-blur-sm",
} as const;

export default styles;
