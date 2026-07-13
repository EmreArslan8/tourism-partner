import { SkeletonBlock } from "@/components/Skeleton";

export default function BlogLoading() {
  return (
    <main className="container-px mx-auto w-full max-w-[1080px] py-12 max-[640px]:py-8" aria-busy="true">
      <header className="mb-8 max-w-[680px]">
        <SkeletonBlock className="h-3 w-20 bg-white/15" />
        <SkeletonBlock className="mt-3 h-10 w-[min(440px,85%)] bg-white/15" />
        <SkeletonBlock className="mt-3 h-4 w-full max-w-[560px] bg-white/12" />
      </header>
      <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
        {Array.from({ length: 6 }).map((_, index) => (
          <article key={index} className="overflow-hidden rounded-[16px] border border-line bg-paper shadow-card">
            <SkeletonBlock className="aspect-[16/10] rounded-none bg-line/70" />
            <div className="p-4">
              <SkeletonBlock className="h-5 w-24 rounded-full bg-terra/10" />
              <SkeletonBlock className="mt-3 h-5 w-full bg-line/70" />
              <SkeletonBlock className="mt-2 h-5 w-4/5 bg-line/70" />
              <SkeletonBlock className="mt-4 h-3 w-full bg-line/60" />
              <SkeletonBlock className="mt-2 h-3 w-3/4 bg-line/60" />
              <SkeletonBlock className="mt-6 h-4 w-24 bg-line/70" />
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
