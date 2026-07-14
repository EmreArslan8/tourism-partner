import { PanelSkeletonBlock } from "@/components/Skeleton";
import { PanelPageSkeleton } from "../_loading";

export default function DopingLoading() {
  return (
    <PanelPageSkeleton>
      <div className="grid gap-4">
        <div className="rounded-[10px] border border-[#BFD2F2] bg-[#F8FBFF] p-5 shadow-card">
          <PanelSkeletonBlock className="h-5 w-44" />
          <PanelSkeletonBlock className="mt-4 h-5 w-64 max-w-full bg-[#DCE9FB]" />
        </div>
        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
          {[0, 1].map((item) => (
            <div key={item} className="rounded-[10px] border border-line bg-paper p-4 shadow-card">
              <PanelSkeletonBlock className="h-5 w-40" />
              <PanelSkeletonBlock className="mt-3 h-3 w-full bg-[#EEF3FA]" />
              <PanelSkeletonBlock className="mt-2 h-3 w-5/6 bg-[#EEF3FA]" />
              <PanelSkeletonBlock className="mt-4 h-4 w-32" />
            </div>
          ))}
        </div>
        <PanelSkeletonBlock className="h-20 rounded-[10px] border border-dashed border-[#DDE6F2] bg-[#F8FBFF]" />
      </div>
    </PanelPageSkeleton>
  );
}
