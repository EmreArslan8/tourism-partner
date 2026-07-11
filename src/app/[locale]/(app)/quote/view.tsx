import { Suspense } from "react";
import QuoteForm from "@/components/QuoteForm";
import styles from "./styles";

const QuoteView = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className={styles.main}>
      <div className={styles.inner}>
        <Suspense fallback={<QuoteForm business={null} />}>
          {children}
        </Suspense>
      </div>
    </main>
  );
};

export default QuoteView;
