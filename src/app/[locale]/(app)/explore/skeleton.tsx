import { DarkSkeletonBlock } from "@/components/Skeleton";

const filterItems = [0, 1, 2, 3, 4, 5, 6];
const cards = [0, 1, 2, 3, 4, 5];

function FilterSkeleton() {
  return (
    <aside className="self-start rounded-[12px] border border-[#e9ecf3] bg-paper px-3.5 py-2.5 shadow-[0_1px_2px_rgba(11,16,47,.04)] max-[1120px]:hidden">
      <div className="flex min-h-[40px] items-center justify-between border-b border-[#edf0f6] py-2">
        <DarkSkeletonBlock className="h-4 w-28 bg-[#dfe6f2]" />
        <DarkSkeletonBlock className="h-5 w-7 rounded-full bg-[#edf2fb]" />
      </div>
      <DarkSkeletonBlock className="my-2 h-8 w-full bg-[#f1f4f9]" />
      <div className="grid gap-2 py-1">
        {filterItems.map((item) => (
          <div key={item} className="flex h-[30px] items-center gap-2.5">
            <DarkSkeletonBlock className="h-[17px] w-[17px] rounded-[5px] bg-[#d9e1ee]" />
            <DarkSkeletonBlock className="h-3.5 flex-1 bg-[#e7edf6]" />
            <DarkSkeletonBlock className="h-5 w-8 rounded-full bg-[#edf2fb]" />
          </div>
        ))}
      </div>
      <div className="mt-3 border-t border-[#edf0f6] pt-2">
        <DarkSkeletonBlock className="h-4 w-32 bg-[#dfe6f2]" />
        <div className="mt-2 grid gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex h-7 items-center gap-2">
              <DarkSkeletonBlock className="h-[17px] w-[17px] rounded-[5px] bg-[#d9e1ee]" />
              <DarkSkeletonBlock className="h-3 w-[72%] bg-[#e7edf6]" />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function SearchBarSkeleton() {
  return (
    <>
      <div className="mb-5 grid grid-cols-[minmax(320px,1.8fr)_minmax(130px,.75fr)_minmax(130px,.75fr)_minmax(146px,.8fr)] items-center rounded-[12px] border border-line bg-paper/95 px-3 py-0 shadow-[0_18px_46px_-38px_rgba(7,9,42,.55)] max-[1280px]:grid-cols-[minmax(260px,1.4fr)_repeat(3,minmax(132px,1fr))] max-[1120px]:hidden">
        <div className="py-1 pe-3">
          <DarkSkeletonBlock className="h-[50px] w-full bg-[#edf2fa]" />
        </div>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border-s border-[#e1e6ef] py-1 ps-3">
            <DarkSkeletonBlock className="h-[50px] w-full bg-[#edf2fa]" />
          </div>
        ))}
      </div>
      <div className="mb-4 hidden grid-cols-2 gap-2.5 max-[1120px]:grid max-[640px]:mb-2.5">
        <DarkSkeletonBlock className="col-span-2 h-[42px] bg-paper/92 max-[640px]:hidden" />
        <DarkSkeletonBlock className="h-11 bg-paper/92 max-[640px]:h-[38px]" />
        <DarkSkeletonBlock className="h-11 bg-paper/92 max-[640px]:h-[38px]" />
      </div>
    </>
  );
}

function SupplierCardSkeleton() {
  return (
    <article className="flex h-[480px] flex-col overflow-hidden rounded-[10px] border border-line bg-paper shadow-[0_10px_26px_-20px_rgba(0,0,0,.5)] min-[1440px]:h-[540px] min-[1800px]:h-[580px] max-[640px]:h-[460px]">
      <div className="relative h-[240px] shrink-0 overflow-hidden bg-[linear-gradient(135deg,#e8edf6,#f7f9fc_48%,#dfe7f5)] min-[1440px]:h-[280px] min-[1800px]:h-[305px] max-[640px]:h-[230px]">
        <DarkSkeletonBlock className="absolute start-3 top-3 h-6 w-24 rounded-full bg-white/50" />
        <DarkSkeletonBlock className="absolute end-3 top-3 h-9 w-9 rounded-full bg-white/55" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2 p-4 min-[1440px]:p-5 min-[1800px]:p-6">
        <DarkSkeletonBlock className="h-3 w-32 bg-[#dfe7f5]" />
        <div className="grid gap-2 py-1">
          <DarkSkeletonBlock className="h-6 w-4/5 bg-[#d8e1ee]" />
          <DarkSkeletonBlock className="h-6 w-3/5 bg-[#d8e1ee]" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <DarkSkeletonBlock className="h-3.5 w-44 max-w-[68%] bg-[#e2e8f2]" />
          <DarkSkeletonBlock className="h-6 w-14 rounded-full bg-[#eef3fa]" />
        </div>
        <div className="mt-2 grid gap-2">
          <DarkSkeletonBlock className="h-3.5 w-full bg-[#e7edf6]" />
          <DarkSkeletonBlock className="h-3.5 w-4/5 bg-[#e7edf6]" />
        </div>
        <div className="mt-auto flex items-center justify-end gap-2 border-t border-line/80 pt-3">
          <DarkSkeletonBlock className="h-10 w-24 bg-[#eef3fa]" />
          <DarkSkeletonBlock className="h-10 w-28 bg-[#dfe7f5]" />
        </div>
      </div>
    </article>
  );
}

export default function ExploreSkeleton() {
  return (
    <div aria-hidden>
      <div className="mb-6 py-2 max-[1120px]:mb-4 max-[640px]:mb-3">
        <DarkSkeletonBlock className="mb-2 h-3 w-24 bg-white/18" />
        <DarkSkeletonBlock className="h-12 w-[min(620px,82vw)] bg-white/14 max-[640px]:h-8 max-[640px]:w-[86vw]" />
      </div>

      <div className="grid grid-cols-[240px_minmax(0,1fr)] items-start gap-5 min-[1440px]:grid-cols-[280px_minmax(0,1fr)] min-[1440px]:gap-7 min-[1800px]:grid-cols-[310px_minmax(0,1fr)] min-[1800px]:gap-8 max-[1120px]:grid-cols-1 max-[1120px]:gap-0">
        <FilterSkeleton />
        <section className="min-w-0">
          <SearchBarSkeleton />
          <div className="mb-5 mt-6 flex flex-wrap items-center justify-between gap-4 py-3 max-[1120px]:mb-4 max-[1120px]:mt-4 max-[640px]:mb-3 max-[640px]:mt-3">
            <DarkSkeletonBlock className="h-4 w-44 bg-white/18" />
            <div className="flex items-center gap-2.5">
              <DarkSkeletonBlock className="h-9 w-32 bg-[#edf2fc]" />
              <DarkSkeletonBlock className="h-9 w-[106px] bg-paper/95" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-x-5 gap-y-6 max-[1180px]:grid-cols-2 max-[640px]:grid-cols-1 min-[1600px]:grid-cols-4 min-[1600px]:gap-x-6 min-[1800px]:gap-x-7 min-[1800px]:gap-y-8">
            {cards.map((card) => (
              <SupplierCardSkeleton key={card} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
