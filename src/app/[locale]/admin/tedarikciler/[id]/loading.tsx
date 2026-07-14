const SkeletonBlock = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-[8px] bg-[#E5EBF5] ${className}`} />
);

export default function AdminBusinessDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-[1480px]">
      <SkeletonBlock className="mb-3 h-4 w-28" />
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <SkeletonBlock className="h-8 w-72" />
          <SkeletonBlock className="mt-3 h-4 w-80 max-w-full" />
        </div>
        <div className="flex gap-2">
          <SkeletonBlock className="h-10 w-28" />
          <SkeletonBlock className="h-10 w-28" />
          <SkeletonBlock className="h-10 w-40" />
        </div>
      </div>

      <div className="mb-5 rounded-[10px] border border-line bg-paper p-1.5 shadow-card">
        <div className="flex gap-1 overflow-hidden">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-9 w-24 shrink-0" />
          ))}
        </div>
      </div>

      <div className="mb-5 grid gap-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="rounded-[8px] border border-line bg-paper p-4 shadow-card">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="mt-3 h-7 w-20" />
            <SkeletonBlock className="mt-3 h-4 w-32" />
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-[8px] border border-line bg-paper p-4 shadow-card">
          <SkeletonBlock className="h-9 w-48" />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-14" />
            ))}
          </div>
        </div>
        <div className="rounded-[8px] border border-line bg-paper p-4 shadow-card">
          <SkeletonBlock className="h-9 w-44" />
          <SkeletonBlock className="mt-4 h-10 w-full" />
          <SkeletonBlock className="mt-2 h-10 w-full" />
        </div>
      </div>
    </div>
  );
}
