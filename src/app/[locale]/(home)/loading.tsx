export default function HomeLoading() {
  return (
    <main
      className="relative h-[100dvh] min-h-[620px] overflow-hidden bg-pine"
      aria-busy="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_38%,rgba(0,79,230,.22),transparent_42%),linear-gradient(160deg,rgba(1,8,47,.9),rgba(1,11,58,.98))]" />

      <div className="container-px relative z-10 flex h-full flex-col">
        <div className="flex h-[88px] items-center justify-between border-b border-white/10">
          <div className="h-11 w-32 animate-pulse rounded-[10px] bg-white/15" />
          <div className="flex items-center gap-3 max-[760px]:hidden">
            <div className="h-4 w-16 animate-pulse rounded-full bg-white/10" />
            <div className="h-4 w-20 animate-pulse rounded-full bg-white/10" />
            <div className="h-10 w-24 animate-pulse rounded-[9px] bg-white/15" />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 items-center pb-16">
          <div className="w-full max-w-[760px]">
            <div className="h-3 w-40 animate-pulse rounded-full bg-white/15" />
            <div className="mt-5 h-14 w-full animate-pulse rounded-[12px] bg-white/15 max-[640px]:h-11" />
            <div className="mt-3 h-14 w-4/5 animate-pulse rounded-[12px] bg-white/12 max-[640px]:h-11" />
            <div className="mt-6 h-5 w-full max-w-[560px] animate-pulse rounded-full bg-white/10" />
            <div className="mt-9 h-14 w-full max-w-[620px] animate-pulse rounded-[12px] bg-white/90" />
          </div>
        </div>
      </div>
    </main>
  );
}
