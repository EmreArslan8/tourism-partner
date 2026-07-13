import { SkeletonBlock } from "@/components/Skeleton";
import styles from "./styles";

export default function SupplierLoading() {
  return (
    <main className={styles.main} aria-busy="true">
      <nav className={styles.nav}>
        <SkeletonBlock className="h-3 w-20 bg-white/15" />
        <SkeletonBlock className="h-3 w-24 bg-white/15" />
        <SkeletonBlock className="h-3 w-28 bg-white/15" />
      </nav>

      <header className={styles.heroHead}>
        <div className="min-w-0 flex-1">
          <SkeletonBlock className="h-10 w-[min(420px,82%)] bg-white/18" />
          <SkeletonBlock className="mt-3 h-4 w-64 max-w-full bg-white/12" />
        </div>
        <div className={styles.heroActions}>
          <SkeletonBlock className="h-10 w-24 bg-white/15" />
          <SkeletonBlock className="h-10 w-28 bg-white/15" />
        </div>
      </header>

      <section className="grid min-h-[360px] overflow-hidden rounded-[18px] border border-white/15 bg-white/10 min-[860px]:grid-cols-[minmax(0,1.5fr)_minmax(260px,.8fr)]">
        <SkeletonBlock className="min-h-[360px] rounded-none bg-white/14" />
        <div className="grid gap-3 p-3">
          <SkeletonBlock className="rounded-[12px] bg-white/12" />
          <SkeletonBlock className="rounded-[12px] bg-white/12" />
        </div>
      </section>

      <div className={styles.grid}>
        <article>
          {[0, 1, 2, 3].map((item) => (
            <section key={item} className={styles.svcCard}>
              <SkeletonBlock className="h-6 w-44 bg-line/70" />
              <SkeletonBlock className="mt-4 h-4 w-full bg-line/60" />
              <SkeletonBlock className="mt-2 h-4 w-5/6 bg-line/60" />
              <SkeletonBlock className="mt-2 h-4 w-2/3 bg-line/60" />
            </section>
          ))}
        </article>

        <aside className={styles.aside}>
          {[0, 1, 2].map((item) => (
            <div key={item} className={styles.card}>
              <SkeletonBlock className="h-5 w-36 bg-line/70" />
              <SkeletonBlock className="mt-4 h-4 w-full bg-line/60" />
              <SkeletonBlock className="mt-2 h-4 w-4/5 bg-line/60" />
              <SkeletonBlock className="mt-5 h-10 w-full bg-line/70" />
            </div>
          ))}
        </aside>
      </div>
    </main>
  );
}
