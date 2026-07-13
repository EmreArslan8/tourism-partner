import styles from "./styles";
import ExploreSkeleton from "./skeleton";

export default function ExploreLoading() {
  return (
    <main className={styles.main}>
      <div className={styles.inner} aria-busy="true">
        <ExploreSkeleton />
      </div>
    </main>
  );
}
