import { PanelSkeletonBlock } from "@/components/Skeleton";
import { PanelCardSkeleton, PanelListRows, PanelPageSkeleton } from "../_loading";

export default function RequestsLoading() {
  return (
    <PanelPageSkeleton>
      <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(360px,.85fr)] gap-6 max-[1200px]:grid-cols-1">
        <section className="grid gap-5">
          <PanelCardSkeleton />
          <div className="rounded-[10px] border border-line bg-paper p-5 shadow-card">
            <PanelSkeletonBlock className="h-4 w-32" />
            <div className="mt-4">
              <PanelListRows rows={3} />
            </div>
          </div>
        </section>
        <div className="rounded-[10px] border border-line bg-paper p-5 shadow-card">
          <PanelSkeletonBlock className="h-4 w-44" />
          <div className="mt-4">
            <PanelListRows rows={4} />
          </div>
        </div>
      </div>
    </PanelPageSkeleton>
  );
}
