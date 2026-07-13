import { PanelSkeletonBlock } from "@/components/Skeleton";
import { PanelPageSkeleton } from "../_loading";

export default function FavoritesLoading() {
  return (
    <PanelPageSkeleton>
      <ul className="grid grid-cols-2 gap-3.5 max-[720px]:grid-cols-1">
        {Array.from({ length: 6 }).map((_, index) => (
          <li key={index} className="flex items-start justify-between gap-3 rounded-[10px] border border-line bg-paper p-4 shadow-card">
            <div className="min-w-0 flex-1">
              <PanelSkeletonBlock className="h-5 w-24 rounded-full bg-[#EEF3FA]" />
              <PanelSkeletonBlock className="mt-2 h-5 w-[min(260px,78%)]" />
              <PanelSkeletonBlock className="mt-2 h-3 w-[min(150px,45%)] bg-[#EEF3FA]" />
            </div>
            <PanelSkeletonBlock className="h-8 w-8" />
          </li>
        ))}
      </ul>
    </PanelPageSkeleton>
  );
}
