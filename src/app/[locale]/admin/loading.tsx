const Skeleton = ({ className }: { className: string }) => (
  <div aria-hidden className={`animate-pulse rounded-[8px] bg-[#E4EAF3] ${className}`} />
);

export default function AdminLoading() {
  return (
    <div className="min-h-[620px]" aria-busy="true" aria-label="Admin sayfası yükleniyor">
      <span className="sr-only">Admin sayfası yükleniyor…</span>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <Skeleton className="h-8 w-[min(320px,75%)]" />
          <Skeleton className="mt-3 h-4 w-[min(620px,92%)]" />
        </div>
        <Skeleton className="hidden h-10 w-28 sm:block" />
      </div>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="rounded-[10px] border border-line bg-paper p-4 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-8" />
            </div>
            <Skeleton className="mt-5 h-8 w-16" />
            <Skeleton className="mt-2 h-3 w-32 max-w-full" />
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-[10px] border border-line bg-paper shadow-card">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="grid gap-3 border-b border-line bg-cream/25 p-4 md:grid-cols-[1fr_220px_110px]">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="divide-y divide-line/70 px-5">
          {[0, 1, 2, 3, 4].map((row) => (
            <div key={row} className="grid min-h-[66px] grid-cols-[1.3fr_.8fr_.65fr] items-center gap-5 py-3">
              <div>
                <Skeleton className="h-4 w-[min(230px,82%)]" />
                <Skeleton className="mt-2 h-3 w-[min(160px,60%)]" />
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="ml-auto h-8 w-24" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
