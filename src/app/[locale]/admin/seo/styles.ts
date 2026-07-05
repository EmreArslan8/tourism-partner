 const styles = {
  statsGrid: "grid gap-3 md:grid-cols-4",
  contentGrid: "mt-6 grid grid-cols-[minmax(0,1fr)_420px] gap-6 max-[1100px]:grid-cols-1",
  sectionTitle: "text-[24px]",
  sectionSub: "mt-1 text-[13.5px] text-[#475569]",
  tableWrap: "mt-4 overflow-x-auto",
  table: "w-full min-w-[760px] border-separate border-spacing-0 text-left text-[13.5px]",
  th: "border-b border-line py-2 pr-3 text-[11px] uppercase tracking-[.06em] text-[#475569]",
  td: "border-b border-line py-3 pr-3",
  name: "font-bold",
} as const;

export default styles;
