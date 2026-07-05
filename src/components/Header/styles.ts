const styles = {
  header: "inset-x-0 top-0 z-50 w-full",
  // Anasayfa (hero görseli üstü): şeffaf zemin + ince alt çizgi, doğrudan görselin üzerinde.
  headerGlass: "absolute border-b border-white/15 bg-transparent",
  headerSolid: "relative border-b border-white/10 bg-sapphire-deep shadow-[0_18px_55px_-36px_rgba(12,38,34,.75)]",
  inner: "container-px grid h-[80px] grid-cols-[auto_1fr_auto] items-center gap-4 max-[640px]:h-[72px]",
  left: "flex items-center justify-self-start",
  nav: "flex items-center justify-center gap-7 justify-self-stretch max-[900px]:hidden",
  navLink: "flex items-center leading-none text-[18px] font-medium text-white transition-opacity hover:opacity-80",
  navLinkActive: "text-white",
  actions: "flex items-center justify-self-end gap-3 max-[900px]:hidden",
  separator: "h-4 w-px bg-white/20",
} as const;

export default styles;
