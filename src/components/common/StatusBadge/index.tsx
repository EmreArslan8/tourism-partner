import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const TONES = {
  neutral: "bg-slate-100 text-slate-700",
  blue: "bg-[#DAE2FD] text-[#1E3A8A]",
  green: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-red-100 text-red-700",
  violet: "bg-violet-100 text-violet-700",
  solidRed: "bg-[#BA1A1A] text-white",
} as const;

export type BadgeTone = keyof typeof TONES;

/* Durum/etiket rozeti — tutarlı pill görünümü. */
export default function StatusBadge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-semibold", TONES[tone], className)}>
      {children}
    </span>
  );
}
