import { cn } from "@/lib/utils";
import { s } from "./styles";

export default function Pagination({
  page,
  maxPage,
  onPage,
}: {
  page: number;
  maxPage: number;
  onPage: (p: number) => void;
}) {
  if (maxPage <= 1) return null;
  return (
    <nav className={s.pagination} aria-label="Sayfalama">
      <button type="button" className={s.pageBtn} disabled={page === 1} onClick={() => onPage(page - 1)}>←</button>
      {Array.from({ length: maxPage }, (_, i) => i + 1).map((p) => (
        <button key={p} type="button" className={cn(s.pageBtn, p === page && s.pageBtnActive)} onClick={() => onPage(p)}>
          {p}
        </button>
      ))}
      <button type="button" className={s.pageBtn} disabled={page === maxPage} onClick={() => onPage(page + 1)}>→</button>
    </nav>
  );
}
