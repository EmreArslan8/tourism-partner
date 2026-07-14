/* ReelDeck — Reels tarzı tam-sayfa (100dvh) panel geçiş motoru. */
const styles = {
  root: "relative h-[100dvh] w-full overflow-hidden",
  track: "flex w-full flex-col will-change-transform",
  panel: "relative h-[100dvh] w-full shrink-0 overflow-hidden",
} as const;

export default styles;
