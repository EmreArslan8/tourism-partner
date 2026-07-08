import styles from "./styles";

/* Panel içeriği yüklenirken (route geçişi/sunucu render) anında görünen iskelet.
   Layout (sidebar) kalıcı olduğundan yalnız workspace alanını doldurur. */
export default function DashboardLoading() {
  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className="grid gap-2">
            <div className="h-6 w-56 animate-pulse rounded-md bg-[#E7EDF6]" />
            <div className="h-3.5 w-36 animate-pulse rounded bg-[#EEF3FA]" />
          </div>
          <div className="h-9 w-28 animate-pulse rounded-[8px] bg-[#E7EDF6]" />
        </div>
      </div>
      <div className={styles.content}>
        <div className="h-4 w-24 animate-pulse rounded bg-[#EEF3FA]" />
        <div className="mt-3 h-9 w-72 max-w-full animate-pulse rounded-md bg-[#E7EDF6]" />
        <div className="mt-3 h-4 w-[36ch] max-w-full animate-pulse rounded bg-[#EEF3FA]" />
        <div className="mt-7 grid gap-4 min-[980px]:grid-cols-[minmax(0,1fr)_340px]">
          <div className="h-[260px] animate-pulse rounded-[10px] border border-[#DDE6F2] bg-white" />
          <div className="grid gap-4">
            <div className="h-[120px] animate-pulse rounded-[10px] border border-[#DDE6F2] bg-white" />
            <div className="h-[120px] animate-pulse rounded-[10px] border border-[#DDE6F2] bg-white" />
          </div>
        </div>
      </div>
    </>
  );
}
