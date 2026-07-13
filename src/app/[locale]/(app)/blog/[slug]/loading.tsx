import { SkeletonBlock } from "@/components/Skeleton";

export default function BlogPostLoading() {
  return (
    <main className="container-px mx-auto w-full max-w-[760px] py-12 max-[640px]:py-8" aria-busy="true">
      <SkeletonBlock className="mb-6 h-4 w-28 bg-white/15" />
      <article className="rounded-card-lg border border-line bg-paper px-8 py-9 shadow-card max-[640px]:px-5 max-[640px]:py-6">
        <SkeletonBlock className="h-5 w-24 rounded-full bg-terra/10" />
        <SkeletonBlock className="mt-4 h-10 w-full bg-line/70" />
        <SkeletonBlock className="mt-3 h-10 w-4/5 bg-line/70" />
        <SkeletonBlock className="mt-4 h-4 w-36 bg-line/60" />
        <SkeletonBlock className="my-8 aspect-[16/9] w-full rounded-[16px] bg-line/70" />
        <div className="grid gap-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <SkeletonBlock key={index} className={`h-4 bg-line/60 ${index % 3 === 2 ? "w-4/5" : "w-full"}`} />
          ))}
        </div>
      </article>
    </main>
  );
}
