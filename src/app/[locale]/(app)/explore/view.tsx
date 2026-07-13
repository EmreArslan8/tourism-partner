import styles from "./styles";

const ExploreView = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className={styles.main}>
      <div className={styles.inner}>
        {children}
      </div>
    </main>
  );
};

export default ExploreView;
