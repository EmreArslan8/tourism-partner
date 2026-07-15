const styles = {
  section:
    "grid w-full grid-cols-[minmax(330px,.68fr)_minmax(620px,1.32fr)] items-center gap-10 " +
    "min-[1440px]:grid-cols-[minmax(420px,.68fr)_minmax(760px,1.32fr)] min-[1440px]:gap-14 min-[1800px]:grid-cols-[minmax(500px,.68fr)_minmax(860px,1.32fr)] min-[1800px]:gap-16 " +
    "max-[1120px]:grid-cols-1 max-[1120px]:gap-7",
  copy: "max-w-[560px] min-[1440px]:max-w-[660px] min-[1800px]:max-w-[720px] max-[1120px]:max-w-[760px]",
  eyebrow: "eyebrow mb-3 text-[#2563EB]",
  title:
    "font-display text-[clamp(34px,4vw,58px)] font-semibold leading-[1] tracking-normal text-[#0B1C30]",
  lead:
    "mt-5 max-w-[56ch] text-[16px] font-medium leading-7 text-[#566178] " +
    "max-[640px]:mt-3 max-[640px]:text-[14px] max-[640px]:leading-6",
  visual:
    "relative min-w-0 overflow-hidden rounded-[28px] border border-[#DCE6F2] bg-white " +
    "px-8 py-7 shadow-[0_30px_86px_-58px_rgba(7,9,42,.56)] " +
    "before:pointer-events-none before:absolute before:inset-x-8 before:top-[118px] before:h-px before:bg-[#D8E3F0] " +
    "min-[1440px]:px-10 min-[1440px]:py-9 min-[1440px]:before:top-[136px] min-[1800px]:px-12 min-[1800px]:py-10 min-[1800px]:before:top-[148px] " +
    "max-[760px]:px-5 max-[760px]:py-5 max-[760px]:before:hidden",
  visualTop:
    "relative z-10 mb-8 flex items-start justify-between gap-6 " +
    "max-[760px]:mb-6 max-[760px]:flex-col max-[760px]:gap-2 " +
    "[&_span]:text-[11px] [&_span]:font-extrabold [&_span]:uppercase [&_span]:tracking-[.16em] [&_span]:text-[#2563EB] " +
    "[&_strong]:max-w-[39ch] [&_strong]:text-end [&_strong]:text-[15px] [&_strong]:font-extrabold [&_strong]:leading-6 [&_strong]:text-[#0B1C30] " +
    "max-[760px]:[&_strong]:text-start",
  flow:
    "relative z-10 grid grid-cols-[minmax(150px,1fr)_44px_minmax(210px,.9fr)_44px_minmax(150px,1fr)] items-center gap-3 " +
    "min-[1440px]:grid-cols-[minmax(190px,1fr)_52px_minmax(260px,.9fr)_52px_minmax(190px,1fr)] min-[1440px]:gap-4 min-[1800px]:grid-cols-[minmax(220px,1fr)_56px_minmax(300px,.9fr)_56px_minmax(220px,1fr)] " +
    "max-[760px]:grid-cols-1 max-[760px]:gap-3",
  flowNode:
    "min-h-[152px] rounded-[20px] border border-[#DCE6F2] bg-[#FBFCFF] p-5 " +
    "min-[1440px]:min-h-[180px] min-[1440px]:p-6 min-[1800px]:min-h-[204px] min-[1800px]:p-7 " +
    "max-[760px]:min-h-0 " +
    "[&_span]:grid [&_span]:h-11 [&_span]:w-11 [&_span]:place-items-center [&_span]:rounded-[14px] [&_span]:bg-[#EEF4FF] [&_span]:text-[#0057D9] " +
    "[&_small]:mt-6 [&_small]:block [&_small]:text-[12px] [&_small]:font-extrabold [&_small]:uppercase [&_small]:tracking-[.11em] [&_small]:text-[#64748B] " +
    "[&_strong]:mt-2 [&_strong]:block [&_strong]:text-[22px] [&_strong]:font-extrabold [&_strong]:leading-tight [&_strong]:text-[#0B1C30] " +
    "max-[760px]:[&_small]:mt-4",
  connector:
    "grid h-11 w-11 place-items-center rounded-full bg-white text-[#0057D9] ring-1 ring-[#DCE6F2] " +
    "shadow-[0_18px_38px_-26px_rgba(9,17,38,.9)] max-[760px]:mx-auto max-[760px]:rotate-90",
  hub:
    "rounded-[22px] bg-[#0057D9] p-6 text-white shadow-[0_28px_58px_-38px_rgba(0,87,217,.9)] " +
    "[&_span]:grid [&_span]:h-12 [&_span]:w-12 [&_span]:place-items-center [&_span]:rounded-[15px] [&_span]:bg-white/14 [&_span]:ring-1 [&_span]:ring-white/18 " +
    "[&_small]:mt-5 [&_small]:block [&_small]:text-[12px] [&_small]:font-extrabold [&_small]:uppercase [&_small]:tracking-[.12em] [&_small]:text-white/70 " +
    "[&_strong]:mt-2 [&_strong]:block [&_strong]:text-[25px] [&_strong]:font-extrabold [&_strong]:leading-tight " +
    "[&_p]:mt-3 [&_p]:max-w-[28ch] [&_p]:text-[13.5px] [&_p]:font-bold [&_p]:leading-6 [&_p]:text-white/78",
  roles:
    "mt-7 grid grid-cols-2 gap-3 max-[760px]:grid-cols-1 " +
    "[&_div]:flex [&_div]:items-start [&_div]:gap-3 [&_div]:rounded-[16px] [&_div]:bg-[#F3F7FC] [&_div]:px-4 [&_div]:py-4 " +
    "[&_svg]:mt-0.5 [&_svg]:shrink-0 [&_svg]:text-[#0057D9] " +
    "[&_strong]:block [&_strong]:text-[13.5px] [&_strong]:font-extrabold [&_strong]:text-[#0B1C30] " +
    "[&_span]:mt-1 [&_span]:block [&_span]:text-[13px] [&_span]:font-semibold [&_span]:leading-5 [&_span]:text-[#64748B]",
  value:
    "mt-4 flex flex-wrap gap-2 text-[12px] font-extrabold text-[#35527C] " +
    "[&_span]:rounded-full [&_span]:border [&_span]:border-[#DCE6F2] [&_span]:bg-white [&_span]:px-3 [&_span]:py-2",
} as const;

export default styles;
