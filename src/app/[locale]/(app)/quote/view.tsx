import { Suspense } from "react";
import QuoteForm from "@/components/QuoteForm";
import styles from "./styles";

const QuoteView = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className={styles.main}>
      <Suspense fallback={<QuoteForm business={null} />}>
        {children}
      </Suspense>
    </main>
  );
};

export default QuoteView;
