import { PanelSkeletonBlock } from "@/components/Skeleton";
import { PanelListRows, PanelPageSkeleton } from "../_loading";

export default function ReviewsLoading() {
  return (
    <PanelPageSkeleton>
      <div className="grid grid-cols-2 gap-6 max-[900px]:grid-cols-1">
        {[0, 1].map((section) => (
          <div key={section} className="rounded-[10px] border border-line bg-paper p-5 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <PanelSkeletonBlock className="h-4 w-40" />
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <PanelSkeletonBlock key={index} className="h-3.5 w-3.5 rounded-full" />
                ))}
              </div>
            </div>
            <div className="mt-4">
              <PanelListRows rows={3} />
            </div>
          </div>
        ))}
      </div>
    </PanelPageSkeleton>
  );
}
