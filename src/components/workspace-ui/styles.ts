export type PanelTone = "blue" | "amber" | "emerald" | "red" | "neutral";

export const panelTone: Record<PanelTone, { soft: string; text: string; border: string }> = {
  blue: { soft: "bg-cream", text: "text-brand", border: "border-line" },
  amber: { soft: "bg-gold/20", text: "text-brand", border: "border-gold/40" },
  emerald: { soft: "bg-group-saglik/10", text: "text-group-saglik", border: "border-group-saglik/20" },
  red: { soft: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  neutral: { soft: "bg-cream/70", text: "text-muted", border: "border-line" },
};

export const panelUi = {
  shell: "min-h-screen bg-panel-bg text-ink",
  page: "mx-auto w-full max-w-[1480px]",
  sidebar: "border-line bg-paper/90 text-ink",
  topbar: "border-line/80 bg-panel-bg/90 backdrop-blur",
  panel:
    "rounded-[10px] border border-line bg-paper shadow-card",
  panelHeader: "flex items-center justify-between gap-3 border-b border-line/80 px-5 py-4",
  panelPad: "p-5",
  title: "font-medium tracking-[0] text-ink",
  muted: "font-normal text-muted",
  hero:
    "rounded-[14px] border border-line bg-paper p-6 shadow-card",
  primaryButton:
    "inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-sapphire px-4 text-[13px] font-medium text-paper shadow-card transition-colors hover:bg-sapphire-deep",
  secondaryButton:
    "inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-line bg-paper px-4 text-[13px] font-medium text-brand transition-colors hover:bg-cream",
  input:
    "field min-h-[42px] w-full rounded-[8px] border-line bg-paper normal-case tracking-normal text-ink focus:border-sapphire focus:ring-sapphire/10",
  metric:
    "rounded-[10px] border border-line bg-paper p-5 shadow-card",
  eyebrow: "text-[12px] font-medium uppercase tracking-[.08em] text-brand",
};

export type WorkspaceTone = PanelTone;
export const workspaceTone = panelTone;
export const workspaceUi = panelUi;
