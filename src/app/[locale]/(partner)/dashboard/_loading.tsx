import { PanelSkeletonBlock } from "@/components/Skeleton";
import styles from "./styles";

export function PanelPageSkeleton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className="grid gap-2">
            <PanelSkeletonBlock className="h-6 w-56" />
            <PanelSkeletonBlock className="h-3.5 w-36 bg-[#EEF3FA]" />
          </div>
          <PanelSkeletonBlock className="h-9 w-28" />
        </div>
      </div>
      <div className={styles.content} aria-busy="true">
        {children}
      </div>
    </>
  );
}

export function PanelCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-[10px] border border-line bg-paper p-5 shadow-card ${className}`}>
      <PanelSkeletonBlock className="h-4 w-36" />
      <PanelSkeletonBlock className="mt-4 h-10 w-full" />
      <PanelSkeletonBlock className="mt-2.5 h-10 w-full" />
      <PanelSkeletonBlock className="mt-2.5 h-24 w-full" />
    </div>
  );
}

export function PanelListRows({ rows = 4 }: { rows?: number }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="rounded-[10px] border border-line bg-cream/45 p-3.5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <PanelSkeletonBlock className="h-4 w-[min(260px,72%)]" />
              <PanelSkeletonBlock className="mt-2 h-3 w-[min(180px,55%)] bg-[#EEF3FA]" />
            </div>
            <PanelSkeletonBlock className="h-8 w-20" />
          </div>
          <PanelSkeletonBlock className="mt-3 h-3 w-full bg-[#EEF3FA]" />
          <PanelSkeletonBlock className="mt-2 h-3 w-4/5 bg-[#EEF3FA]" />
        </div>
      ))}
    </div>
  );
}
