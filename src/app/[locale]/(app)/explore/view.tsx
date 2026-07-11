import { Suspense } from "react";
import styles from "./styles";

/* Liste stream edilirken statik kabuğun ortası boş kalmasın diye
   ListingView düzenini (filtre barı + sol panel + kart grid'i) taklit eden iskelet. */
const ListingSkeleton = () => {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="mb-6 py-2">
        <div className="h-3 w-36 rounded-full bg-white/15" />
        <div className="mt-3 h-12 w-full max-w-[680px] rounded-[10px] bg-white/12" />
      </div>

      <div className="grid grid-cols-[240px_minmax(0,1fr)] items-start gap-5 max-[1120px]:grid-cols-1">
        <div className="h-[680px] rounded-[12px] border border-white/15 bg-white/90 max-[1120px]:hidden" />
        <div>
          <div className="grid h-[52px] grid-cols-[minmax(320px,1.8fr)_repeat(3,minmax(130px,.75fr))] rounded-[12px] border border-white/15 bg-white/90 max-[1280px]:grid-cols-[minmax(260px,1.4fr)_repeat(3,minmax(132px,1fr))]" />
          <div className="my-6 flex items-center justify-between py-3">
            <div className="h-4 w-24 rounded-full bg-white/15" />
            <div className="h-9 w-64 rounded-[9px] bg-white/90" />
          </div>
          <div className="grid grid-cols-3 gap-x-5 gap-y-6 max-[1180px]:grid-cols-2 max-[640px]:grid-cols-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[480px] rounded-[10px] border border-white/15 bg-white/90" />
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
      <div className={styles.inner}>
        <Suspense fallback={<ListingSkeleton />}>
          {children}
        </Suspense>
      </div>
    </main>
  );
};

export default ExploreView;
