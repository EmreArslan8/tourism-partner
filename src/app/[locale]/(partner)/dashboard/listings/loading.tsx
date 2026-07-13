import { PanelSkeletonBlock } from "@/components/Skeleton";
import { PanelPageSkeleton } from "../_loading";

export default function ListingsLoading() {
  return (
    <PanelPageSkeleton>
      <div className="grid gap-5">
        <div className="grid gap-4 overflow-hidden rounded-[12px] border border-line bg-cream/45 p-3 min-[680px]:grid-cols-[140px_minmax(0,1fr)]">
          <PanelSkeletonBlock className="aspect-[4/3] min-h-[105px] rounded-[9px]" />
          <div className="self-center">
            <PanelSkeletonBlock className="h-3 w-24 bg-[#EEF3FA]" />
            <PanelSkeletonBlock className="mt-2 h-7 w-72 max-w-full" />
            <PanelSkeletonBlock className="mt-2 h-4 w-80 max-w-full bg-[#EEF3FA]" />
            <div className="mt-4 flex flex-wrap gap-2">
              <PanelSkeletonBlock className="h-8 w-24 rounded-full" />
              <PanelSkeletonBlock className="h-8 w-28 rounded-full" />
              <PanelSkeletonBlock className="h-8 w-20 rounded-full" />
            </div>
          </div>
        </div>
        <div className="grid gap-5 min-[1120px]:grid-cols-[minmax(0,1fr)_260px]">
          <div className="rounded-[10px] border border-line bg-paper p-5 shadow-card">
            <PanelSkeletonBlock className="h-5 w-40" />
            <div className="mt-5 grid grid-cols-2 gap-3 max-[620px]:grid-cols-1">
              {Array.from({ length: 8 }).map((_, index) => (
                <PanelSkeletonBlock key={index} className="h-11" />
              ))}
            </div>
          </div>
          <div className="rounded-[10px] border border-line bg-paper p-4 shadow-card">
            <PanelSkeletonBlock className="h-5 w-32" />
            <div className="mt-4 grid gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <PanelSkeletonBlock key={index} className="h-9" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PanelPageSkeleton>
  );
}
