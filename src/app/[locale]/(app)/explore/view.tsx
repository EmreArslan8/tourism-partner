import { Suspense } from "react";
import styles from "./styles";

/* Liste stream edilirken statik kabuğun ortası boş kalmasın diye
   ListingView düzenini (filtre barı + sol panel + kart grid'i) taklit eden iskelet. */
const ListingSkeleton = () => {
  return (
    <div aria-hidden>
      <div className="grid grid-cols-[repeat(4,minmax(128px,1fr))_minmax(160px,.8fr)] gap-2 max-[1120px]:grid-cols-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-[42px] animate-pulse rounded-[10px] bg-slate-200" />
        ))}
      </div>
      <div className="mt-6 grid grid-cols-[260px_minmax(0,1fr)] items-start gap-5 max-[1120px]:grid-cols-1">
        <div className="h-[420px] animate-pulse rounded-[15px] bg-slate-100 max-[1120px]:hidden" />
        <div>
          <div className="mb-4 h-5 w-44 animate-pulse rounded bg-slate-200" />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[260px] animate-pulse rounded-[15px] bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ExploreView = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className={styles.main}>
      <Suspense fallback={<ListingSkeleton />}>
        {children}
      </Suspense>
    </main>
  );
};

export default ExploreView;
