 const styles = {
  statsGrid: "grid gap-3 md:grid-cols-5",
  contentGrid: "mt-6 grid grid-cols-[minmax(0,1fr)_340px] gap-6 max-[1040px]:grid-cols-1",
  sectionTitle: "text-[24px]",
  sectionSub: "text-[13.5px] text-muted",
  aside: "grid content-start gap-4",
  asideTitle: "text-[22px]",
  badge: "rounded-[999px] bg-[#f3f6f2] px-3 py-1 text-[11px] font-bold uppercase tracking-[.06em] text-muted",
  list: "mt-4 grid gap-3",
  bullets: "mt-3 space-y-2 text-[13.5px] text-muted",
  quickLink: "flex items-center justify-between rounded-[8px] border border-[#d8ded7] bg-[#f3f6f2] px-4 py-3 transition hover:border-terra hover:bg-white",
  quickLinkTitle: "text-[14px] font-bold",
  quickLinkValue: "rounded-[999px] bg-white px-3 py-1 text-[12px] font-bold text-terra",
} as const;

export default styles;
