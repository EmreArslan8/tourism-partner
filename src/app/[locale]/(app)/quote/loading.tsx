import { DarkSkeletonBlock } from "@/components/Skeleton";
import styles from "./styles";

export default function QuoteLoading() {
  return (
    <main className={styles.main}>
      <div className={styles.inner} aria-busy="true">
        <div className="mx-auto max-w-[760px] rounded-[18px] border border-line bg-paper p-6 shadow-card">
          <DarkSkeletonBlock className="h-8 w-72 max-w-full bg-line/70" />
          <DarkSkeletonBlock className="mt-3 h-4 w-full max-w-[520px] bg-line/60" />
          <div className="mt-7 grid gap-4">
            <div className="grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">
              <DarkSkeletonBlock className="h-12 bg-line/60" />
              <DarkSkeletonBlock className="h-12 bg-line/60" />
            </div>
            <DarkSkeletonBlock className="h-12 bg-line/60" />
            <DarkSkeletonBlock className="h-12 bg-line/60" />
            <div className="grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">
              <DarkSkeletonBlock className="h-12 bg-line/60" />
              <DarkSkeletonBlock className="h-12 bg-line/60" />
            </div>
            <div className="grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">
              <DarkSkeletonBlock className="h-12 bg-line/60" />
              <DarkSkeletonBlock className="h-12 bg-line/60" />
            </div>
            <DarkSkeletonBlock className="h-28 bg-line/60" />
            <DarkSkeletonBlock className="h-12 bg-sapphire/20" />
          </div>
        </div>
      </div>
    </main>
  );
}
