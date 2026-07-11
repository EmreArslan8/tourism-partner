 const styles = {
  main: "mx-auto w-full max-w-[1440px] px-20 pb-8 pt-6 max-[1000px]:px-8 max-[560px]:px-4",
  nav: "mb-4 flex flex-wrap items-center gap-2 text-[13px] font-medium text-cream/70",
  navLink: "hover:text-white",
  navStrong: "text-white",
  heroHead: "mb-4 flex flex-wrap items-end justify-between gap-4",
  heroActions: "flex shrink-0 items-center gap-1 max-[560px]:w-full max-[560px]:justify-end",
  eyebrow: "mb-1 text-[12px] font-extrabold uppercase tracking-[.08em] text-terra-deep",
  grid: "mt-6 grid grid-cols-[minmax(0,1fr)_360px] items-start gap-7 max-[900px]:grid-cols-1",
  titleWrap: "flex flex-wrap items-center gap-3",
  title: "heading-page text-white",
  founderBadge:
    "inline-grid h-9 w-9 shrink-0 place-items-center text-terra-deep max-[640px]:h-8 max-[640px]:w-8",
  verified: "text-[12px] font-bold text-group-acente",
  meta: "mt-2 text-[14.5px] font-medium text-cream/75",
  rating: "text-gold",
  h2: "heading-subsection mt-7 text-ink",
  desc: "mt-2 text-[15px] font-medium leading-7 text-[#3f4b67]",
  svcCard: "mt-7 rounded-[12px] border border-line bg-paper p-6 shadow-card max-[560px]:p-4",
  svcTitle: "heading-subsection mb-4 border-b border-line pb-3 text-[19px] text-ink",
  svcWrap: "mt-3 flex flex-wrap gap-2.5",
  svcTag:
    "inline-flex items-center rounded-pill border border-[#D4DCEA] bg-white px-3 py-1.5 text-[12.5px] font-semibold " +
    "text-[#0B102F] shadow-[0_8px_20px_-18px_rgba(7,9,42,.45)]",
  /* Üyelere özel teaser — kilit ikonlu, ortalanmış, kompakt kart. */
  gated:
    "mt-7 flex flex-col items-center rounded-[14px] border border-dashed border-terra/25 bg-[#EDEBFB] px-6 py-6 text-center",
  gatedIcon: "grid h-10 w-10 place-items-center rounded-[10px] bg-white/70 text-[#4b5875]",
  gatedTitle: "mt-2.5 text-[16px] font-extrabold text-ink",
  gatedText: "mt-1 max-w-[440px] text-[13.5px] font-medium leading-6 text-[#4b5875]",
  gatedButton:
    "mt-4 inline-flex items-center rounded-[8px] bg-terra px-5 py-2.5 text-[13.5px] font-bold text-white transition-colors hover:bg-terra-deep",
  gatedLink: "font-semibold text-terra",
  memberContacts: "mt-7 overflow-hidden rounded-[12px] border border-line bg-paper shadow-card",
  memberContactsHead: "border-b border-line bg-cream/40 px-5 py-4 [&>span]:text-[10.5px] [&>span]:font-extrabold [&>span]:uppercase [&>span]:tracking-[.09em] [&>span]:text-emerald-700 [&>h2]:mt-1 [&>h2]:text-[19px] [&>h2]:font-semibold [&>h2]:text-ink [&>p]:mt-1 [&>p]:text-[13px] [&>p]:leading-5 [&>p]:text-[#4b5875]",
  memberContactGrid: "grid gap-3 p-4 min-[640px]:grid-cols-2",
  memberContactCard: "flex min-w-0 items-start gap-3 rounded-[10px] border border-line bg-white p-3.5",
  memberContactAvatar: "grid h-10 w-10 shrink-0 place-items-center rounded-[9px] bg-ink text-[11px] font-extrabold text-paper",
  memberContactBody: "min-w-0 flex-1 [&>h3]:truncate [&>h3]:text-[14px] [&>h3]:font-semibold [&>h3]:text-ink [&>p]:mt-0.5 [&>p]:truncate [&>p]:text-[12px] [&>p]:font-medium [&>p]:text-muted",
  memberContactLinks: "mt-2 grid gap-1 [&>a]:w-fit [&>a]:max-w-full [&>a]:truncate [&>a]:text-[12.5px] [&>a]:font-semibold [&>a]:text-terra [&>a]:hover:underline",
  memberContactsEmpty: "m-4 rounded-[9px] border border-dashed border-line bg-cream/35 px-4 py-3 text-[13px] font-medium text-muted",
  memberContactsLoading: "mt-7 overflow-hidden rounded-[12px] border border-line bg-paper p-5 shadow-card [&>div]:h-5 [&>div]:w-40 [&>div]:animate-pulse [&>div]:rounded-md [&>div]:bg-line/70 [&>span]:mt-3 [&>span]:block [&>span]:h-14 [&>span]:animate-pulse [&>span]:rounded-[9px] [&>span]:bg-cream",
  partners: "mt-7 rounded-[12px] border border-line bg-paper p-6 shadow-card max-[560px]:p-4",
  partnersHead: "mb-4 border-b border-line pb-3",
  partnersEyebrow: "hidden",
  partnersTitle: "heading-subsection text-[19px] text-ink",
  partnersSub: "mt-1 text-[13px] font-medium leading-5 text-[#4b5875]",
  partnersGrid: "grid gap-3 min-[640px]:grid-cols-2",
  partnersEmpty:
    "rounded-[10px] border border-dashed border-line bg-cream/40 px-4 py-3.5 text-[13.5px] font-medium leading-6 text-[#4b5875]",
  partnerItem:
    "flex min-w-0 items-center gap-3 rounded-[10px] border border-line bg-white px-3.5 py-3 transition-all hover:border-terra/45 hover:shadow-card",
  partnerMark:
    "grid h-10 w-10 shrink-0 place-items-center rounded-[9px] bg-[#EDEBFB] text-[12px] font-extrabold text-terra-deep",
  partnerBody: "min-w-0 [&>strong]:block [&>strong]:truncate [&>strong]:text-[14px] [&>strong]:text-ink [&>small]:mt-0.5 [&>small]:block [&>small]:truncate [&>small]:text-[12.5px] [&>small]:font-medium [&>small]:text-[#4b5875]",
  aside: "sticky top-[104px] flex flex-col gap-4 max-[900px]:static",
  card: "rounded-card-lg border border-line bg-paper p-5 shadow-card",
  cardTitle: "heading-subsection text-[18px] text-ink",
  cardSub: "mt-1 text-[13.5px] font-medium text-[#4b5875]",
  socialRow: "mt-3 flex flex-wrap gap-2 border-t border-line pt-3",
  socialLink:
    "grid h-9 w-9 place-items-center rounded-[9px] border border-line bg-cream/40 text-ink/70 transition-colors hover:border-terra/45 hover:bg-cream hover:text-terra",
  row: "flex justify-between gap-3 border-t border-line py-2 text-[13.5px] first:border-t-0",
  rowKey: "font-medium text-[#4b5875]",
  rowVal: "font-medium text-ink",
} as const;

export default styles;
