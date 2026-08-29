const styles = {
  base:
    "group relative z-[2] inline-flex h-7 w-[25px] shrink-0 cursor-help items-center justify-center " +
    "drop-shadow-[0_3px_5px_rgba(128,77,8,.18)] outline-none " +
    "transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-terra/45 " +
    "[&_svg]:h-full [&_svg]:w-full",
  tooltip:
    "pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-max max-w-48 -translate-x-1/2 rounded-[8px] " +
    "bg-brand-deep px-2.5 py-2 text-center text-[11px] font-medium leading-4 text-white opacity-0 " +
    "shadow-[0_12px_28px_-12px_rgba(7,9,42,.65)] transition-opacity " +
    "group-hover:opacity-100 group-focus-visible:opacity-100",
} as const;

export default styles;
