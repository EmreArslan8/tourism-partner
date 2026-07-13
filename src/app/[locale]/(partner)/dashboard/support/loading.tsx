import { PanelSkeletonBlock } from "@/components/Skeleton";
import { PanelCardSkeleton, PanelListRows, PanelPageSkeleton } from "../_loading";

export default function SupportLoading() {
  return (
    <PanelPageSkeleton>
      <PanelCardSkeleton />
      <section className="mt-6">
        <PanelSkeletonBlock className="mb-3 h-4 w-36" />
        <PanelListRows rows={4} />
      </section>
    </PanelPageSkeleton>
  );
}
