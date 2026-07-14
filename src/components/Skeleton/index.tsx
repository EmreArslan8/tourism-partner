import { cn } from "@/lib/utils";

export function SkeletonBlock({ className }: { className?: string }) {
  return <div aria-hidden className={cn("tp-skeleton rounded-[8px] bg-line/70", className)} />;
}

export function PanelSkeletonBlock({ className }: { className?: string }) {
  return <SkeletonBlock className={cn("bg-[#E7EDF6]", className)} />;
}

export function DarkSkeletonBlock({ className }: { className?: string }) {
  return <SkeletonBlock className={cn("bg-white/12", className)} />;
}
