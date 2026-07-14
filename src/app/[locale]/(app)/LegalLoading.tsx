import { SkeletonBlock } from "@/components/Skeleton";
import styles from "@/components/LegalPage/styles";

export default function LegalLoading() {
  return (
    <main className={styles.main} aria-busy="true">
      <article className={styles.article}>
        <SkeletonBlock className="h-10 w-[min(420px,88%)] bg-line/70" />
        <SkeletonBlock className="mt-3 h-3 w-36 bg-line/60" />
        <SkeletonBlock className="mt-7 h-4 w-full bg-line/60" />
        <SkeletonBlock className="mt-3 h-4 w-11/12 bg-line/60" />
        {Array.from({ length: 4 }).map((_, section) => (
          <section key={section} className="mt-10">
            <SkeletonBlock className="h-6 w-[min(280px,70%)] bg-line/70" />
            <SkeletonBlock className="mt-4 h-4 w-full bg-line/60" />
            <SkeletonBlock className="mt-3 h-4 w-11/12 bg-line/60" />
            <SkeletonBlock className="mt-3 h-4 w-4/5 bg-line/60" />
          </section>
        ))}
      </article>
    </main>
  );
}
