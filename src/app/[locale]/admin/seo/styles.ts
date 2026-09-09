 const styles = {
  statsGrid: "grid grid-flow-col auto-cols-[minmax(165px,1fr)] gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid-flow-row md:grid-cols-4 md:overflow-visible md:pb-0",
  contentGrid: "mt-6 grid grid-cols-[minmax(0,1fr)_420px] gap-6 max-[1100px]:grid-cols-1",
  sectionTitle: "text-[24px]",
  sectionSub: "mt-1 text-[13.5px] text-muted",
  tableWrap: "mt-4 overflow-x-auto",
  table: "w-full min-w-[760px] border-separate border-spacing-0 text-left text-[13.5px]",
  th: "border-b border-line py-2 pr-3 text-[11px] uppercase tracking-[.06em] text-muted",
  td: "border-b border-line py-3 pr-3",
  name: "font-bold",
} as const;

export default styles;
