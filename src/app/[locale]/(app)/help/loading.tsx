import { SkeletonBlock } from "@/components/Skeleton";
import styles from "./styles";

export default function HelpLoading() {
  return (
    <main className={styles.main} aria-busy="true">
      <header className={styles.head}>
        <SkeletonBlock className="h-3 w-24 bg-white/15" />
        <SkeletonBlock className="mt-3 h-10 w-[min(460px,90%)] bg-white/15" />
        <SkeletonBlock className="mt-3 h-4 w-full max-w-[620px] bg-white/12" />
      </header>
      <div className={styles.grid}>
        <section className={styles.formCard}>
          <SkeletonBlock className="h-6 w-36 bg-line/70" />
          <div className="mt-5 grid gap-3">
            <SkeletonBlock className="h-12 bg-line/60" />
            <SkeletonBlock className="h-12 bg-line/60" />
            <SkeletonBlock className="h-32 bg-line/60" />
            <SkeletonBlock className="h-11 w-36 bg-sapphire/20" />
          </div>
        </section>
        <aside className={styles.asideCard}>
          <SkeletonBlock className="h-6 w-40 bg-line/70" />
          <div className="mt-5 grid gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index}>
                <SkeletonBlock className="h-4 w-32 bg-line/70" />
                <SkeletonBlock className="mt-2 h-3 w-full bg-line/60" />
                <SkeletonBlock className="mt-2 h-3 w-3/4 bg-line/60" />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
