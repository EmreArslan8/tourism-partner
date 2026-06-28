/* Cta — Showcase sonrası kompakt ağ özeti. */
const styles = {
  section: "w-full",
  panel:
    "grid w-full grid-cols-[minmax(0,1fr)_minmax(560px,.85fr)] items-center gap-8 border-y border-line/80 py-6 " +
    "max-[980px]:grid-cols-1 max-[980px]:gap-4 " +
    "min-[641px]:rounded-[18px] min-[641px]:border min-[641px]:border-line/80 min-[641px]:bg-white/72 " +
    "min-[641px]:px-6 min-[641px]:py-4 min-[641px]:shadow-[0_18px_54px_-48px_rgba(7,9,42,.65)] " +
    "min-[641px]:max-[980px]:gap-3 min-[641px]:max-[980px]:px-5 min-[641px]:max-[980px]:py-4 " +
    "max-[560px]:border-x-0 max-[560px]:border-b-0 max-[560px]:border-t max-[560px]:border-line/70 " +
    "max-[560px]:bg-transparent max-[560px]:px-0 max-[560px]:py-2 max-[560px]:shadow-none max-[560px]:gap-2 " +
    "[@media(max-height:720px)]:py-3 [@media(max-height:720px)]:gap-[9.6px]",
  content: "section-copy min-w-0",
  title:
    "max-w-[18ch] font-display text-[28px] font-semibold leading-[1.08] text-ink " +
    "max-[980px]:max-w-none max-[980px]:text-[23px] max-[560px]:hidden",
  sub:
    "mt-2 max-w-[56ch] text-[14px] leading-[1.55] text-muted " +
    "max-[980px]:mt-2 max-[980px]:max-w-[66ch] max-[980px]:text-[13.5px] max-[980px]:leading-[1.45] max-[560px]:hidden",
  metrics:
    "grid min-w-0 grid-cols-3 gap-2.5 " +
    "max-[560px]:gap-0 max-[560px]:divide-x max-[560px]:divide-line/70",
  metric:
    "group flex min-w-0 items-center gap-2.5 rounded-[14px] border border-line/75 bg-[#fbfcff] px-3.5 py-3 shadow-[0_14px_34px_-32px_rgba(7,9,42,.55)] " +
    "transition-transform duration-200 ease-brand hover:-translate-y-0.5 " +
    "min-[641px]:max-[980px]:rounded-[14px] min-[641px]:max-[980px]:px-3 min-[641px]:max-[980px]:py-3 " +
    "max-[560px]:block max-[560px]:rounded-none max-[560px]:border-0 max-[560px]:bg-transparent max-[560px]:px-2 max-[560px]:py-0.5 max-[560px]:shadow-none",
  metricIcon:
    "grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-brand/[.08] text-brand " +
    "min-[641px]:max-[980px]:h-9 min-[641px]:max-[980px]:w-9 " +
    "max-[560px]:hidden",
  metricCopy: "block min-w-0",
  metricValue:
    "block font-display text-[20px] font-semibold leading-none text-ink " +
    "min-[641px]:max-[980px]:text-[20px] " +
    "max-[560px]:text-center max-[560px]:text-[14px]",
  metricLabel:
    "mt-1 block text-[12px] font-semibold leading-tight text-muted " +
    "min-[641px]:max-[980px]:text-[11.5px] " +
    "max-[560px]:mt-1 max-[560px]:text-center max-[560px]:text-[10.5px]",
} as const;

export default styles;
