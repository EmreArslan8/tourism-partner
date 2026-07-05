const styles = {
  statsGrid: "grid gap-3 min-[760px]:grid-cols-2 min-[1240px]:grid-cols-4",
  actionGrid: "mt-6 grid gap-4 min-[900px]:grid-cols-3",
  actionCard:
    "relative grid min-h-[190px] content-between overflow-hidden rounded-[8px] border border-[#d9ded7] bg-paper p-5 text-ink shadow-[0_20px_60px_-50px_rgba(16,24,40,.5)] transition hover:border-terra hover:shadow-[0_24px_70px_-50px_rgba(16,24,40,.65)] [&>b]:absolute [&>b]:right-5 [&>b]:top-5 [&>b]:text-[44px] [&>b]:leading-none [&>b]:text-pine [&>span:nth-child(3)]:max-w-[240px] [&>span:nth-child(3)]:text-[13.5px] [&>span:nth-child(3)]:text-[#475569] [&>strong]:mt-9 [&>strong]:block [&>strong]:max-w-[240px] [&>strong]:text-[24px] [&>strong]:leading-tight",
  actionLabel:
    "w-fit rounded-[999px] bg-cream px-3 py-1 text-[11px] font-bold uppercase tracking-[.08em] text-terra",
} as const;

export default styles;
