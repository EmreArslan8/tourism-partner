import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import styles from "./styles";


const Pagination = ({
  page,
  maxPage,
  onPage,
}: {
  page: number;
  maxPage: number;
  onPage: (p: number) => void;
}) => {
  const t = useTranslations("common");
  if (maxPage <= 1) return null;
  return (
    <nav className={styles.pagination} aria-label={t("pagination")}>
      <button type="button" className={styles.pageBtn} disabled={page === 1} onClick={() => onPage(page - 1)}>←</button>
      {Array.from({ length: maxPage }, (_, i) => i + 1).map((p) => (
        <button key={p} type="button" className={cn(styles.pageBtn, p === page && styles.pageBtnActive)} onClick={() => onPage(p)}>
          {p}
        </button>
      ))}
      <button type="button" className={styles.pageBtn} disabled={page === maxPage} onClick={() => onPage(page + 1)}>→</button>
    </nav>
  );
};

export default Pagination;
