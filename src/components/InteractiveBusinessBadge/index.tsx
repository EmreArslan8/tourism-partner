import { cn } from "@/lib/utils";

const InteractiveBusinessBadge = ({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <span
    className={cn(
      "group/badge relative z-[2] inline-flex shrink-0 cursor-help items-center justify-center rounded-sm outline-none " +
        "transition-transform duration-200 ease-brand hover:-translate-y-1 hover:scale-105 " +
        "focus-visible:-translate-y-1 focus-visible:scale-105 focus-visible:ring-2 focus-visible:ring-terra/45 " +
        "motion-reduce:transform-none motion-reduce:transition-none",
      className,
    )}
    title={label}
    aria-label={label}
    tabIndex={0}
  >
    {children}
    <span
      className={
        "pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-max max-w-48 -translate-x-1/2 translate-y-1 " +
        "rounded-[8px] bg-brand-deep px-2.5 py-2 text-center text-[11px] font-medium leading-4 text-white opacity-0 " +
        "shadow-[0_12px_28px_-12px_rgba(7,9,42,.65)] transition-all duration-200 " +
        "group-hover/badge:translate-y-0 group-hover/badge:opacity-100 group-focus-visible/badge:translate-y-0 group-focus-visible/badge:opacity-100"
      }
      role="tooltip"
    >
      {label}
    </span>
  </span>
);

export default InteractiveBusinessBadge;
