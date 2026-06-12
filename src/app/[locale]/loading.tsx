/* Segment loading boundary — dinamik sayfa geçişlerinde ham boş ekran yerine
   sade bir iskelet gösterir. */
export default function Loading() {
  return (
    <main className="container-px py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="h-6 w-40 animate-pulse rounded bg-[#e6e1d8]" />
        <div className="h-12 w-full max-w-2xl animate-pulse rounded bg-[#e6e1d8]" />
        <div className="h-5 w-full max-w-xl animate-pulse rounded bg-[#eee9e0]" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-44 animate-pulse rounded-[8px] bg-[#f0ebe3]" />
          <div className="h-44 animate-pulse rounded-[8px] bg-[#f0ebe3]" />
          <div className="h-44 animate-pulse rounded-[8px] bg-[#f0ebe3]" />
        </div>
      </div>
    </main>
  );
}
