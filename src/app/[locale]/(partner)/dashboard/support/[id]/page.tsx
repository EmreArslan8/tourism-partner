import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, Send, CheckCircle2, Archive } from "lucide-react";
import { Link, redirect } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPanelSession, getPanelBusiness } from "@/lib/panel-auth";
import { replyToOwnTicket, resolveOwnTicket, archiveOwnTicket } from "@/lib/actions/support";
import DashboardTopbar from "../../Topbar";
import styles from "../../styles";
import { PartnerPanelButton, PartnerPanelCard, PartnerPanelTextarea } from "../../_ui";

const STATUS_CLS: Record<string, string> = {
  new: "bg-sapphire/10 text-sapphire-deep",
  in_progress: "bg-amber-100 text-amber-700",
  resolved: "bg-emerald-100 text-emerald-700",
  archived: "bg-line/60 text-muted",
};

type Ticket = { id: number; subject: string; message: string; status: string; created_at: string; business_id: number | null };
type TicketMessage = { id: number; author_name: string | null; body: string; created_at: string };

export default async function SupportDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("panel");
  const fmt = (v: string) => new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(v));
  const statusLabel = (status: string) => {
    const key = `supportStatus_${status}` as "supportStatus_new" | "supportStatus_in_progress" | "supportStatus_resolved" | "supportStatus_archived";
    return ["new", "in_progress", "resolved", "archived"].includes(status) ? t(key) : status;
  };
  const isTeamMsg = (m: TicketMessage) => m.author_name === "Destek Ekibi";

  const session = await getPanelSession();
  if (!session) return redirect({ href: "/login", locale });
  const biz = await getPanelBusiness();

  const ticketId = Number(id);
  if (!ticketId) notFound();

  const supabase = await createClient();
  const { data: ticketRaw } = await supabase
    .from("support_tickets")
    .select("id,subject,message,status,created_at,business_id")
    .eq("id", ticketId)
    .maybeSingle();
  const ticket = ticketRaw as Ticket | null;
  // Sahiplik kontrolü: RLS zaten yabancı talebi döndürmez; yine de güvenli olalım.
  if (!ticket || !biz || ticket.business_id !== biz.id) notFound();

  const { data: msgRaw } = await supabase
    .from("support_ticket_messages")
    .select("id,author_name,body,created_at")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });
  const messages = (msgRaw ?? []) as TicketMessage[];

  const thread = [
    { key: `t-${ticket.id}`, me: true, name: t("supportYou"), at: ticket.created_at, body: ticket.message },
    ...messages.map((m) => ({
      key: `m-${m.id}`,
      me: !isTeamMsg(m),
      name: isTeamMsg(m) ? t("supportTeam") : t("supportYou"),
      at: m.created_at,
      body: m.body,
    })),
  ];

  const isArchived = ticket.status === "archived";
  const isResolved = ticket.status === "resolved";

  return (
    <>
      <DashboardTopbar title={t("supportNav")} />
      <div className={styles.content}>
        <Link href={{ pathname: "/dashboard/support" }} className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted transition-colors hover:text-brand">
          <ArrowLeft size={16} aria-hidden /> {t("supportBack")}
        </Link>

        <PartnerPanelCard bodyClassName="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-[17px] font-semibold text-[#172033]">{ticket.subject}</h1>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_CLS[ticket.status] ?? STATUS_CLS.archived}`}>{statusLabel(ticket.status)}</span>
          </div>

          {/* İşlemler: çözüldü olarak kapat / arşivle */}
          {!isArchived && (
            <div className="mt-3 flex flex-wrap gap-2 border-b border-line/70 pb-4">
              {!isResolved && (
                <form action={resolveOwnTicket}>
                  <input type="hidden" name="ticket_id" value={ticket.id} />
                  <button type="submit" className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-emerald-300 px-3 text-[12.5px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-50">
                    <CheckCircle2 size={15} aria-hidden /> {t("supportResolveAction")}
                  </button>
                </form>
              )}
              <form action={archiveOwnTicket}>
                <input type="hidden" name="ticket_id" value={ticket.id} />
                <button type="submit" className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line px-3 text-[12.5px] font-semibold text-muted transition-colors hover:bg-cream">
                  <Archive size={15} aria-hidden /> {t("supportArchiveAction")}
                </button>
              </form>
            </div>
          )}

          <div className="mt-4 flex flex-col gap-2.5">
            {thread.map((b) => (
              <div key={b.key} className={b.me ? "flex justify-end" : "flex justify-start"}>
                <div className={"max-w-[78%] rounded-2xl px-3.5 py-2 " + (b.me ? "bg-sapphire text-white" : "bg-cream text-ink")}>
                  <div className={"mb-0.5 flex items-center gap-1.5 text-[11px] " + (b.me ? "text-white/80" : "text-muted")}>
                    <span className="font-semibold">{b.name}</span>
                    <span>·</span>
                    <span>{fmt(b.at)}</span>
                  </div>
                  <p className="whitespace-pre-wrap break-words text-[13px] leading-5">{b.body}</p>
                </div>
              </div>
            ))}
          </div>

          {isArchived ? (
            <p className="mt-4 border-t border-line/70 pt-4 text-[12.5px] text-muted">{t("supportArchivedNote")}</p>
          ) : (
            <div className="mt-4 border-t border-line/70 pt-4">
              {isResolved && (
                <p className="mb-2.5 rounded-lg bg-emerald-50 px-3 py-2 text-[12.5px] text-emerald-800">{t("supportResolvedNote")}</p>
              )}
              <form action={replyToOwnTicket} className="flex items-end gap-2">
                <input type="hidden" name="ticket_id" value={ticket.id} />
                <PartnerPanelTextarea name="message" required rows={2} maxLength={4000} placeholder={t("supportReplyPlaceholder")} className="flex-1" />
                <PartnerPanelButton type="submit" className="h-9 shrink-0 px-3.5"><Send size={15} aria-hidden /> {t("supportReplySubmit")}</PartnerPanelButton>
              </form>
            </div>
          )}
        </PartnerPanelCard>
      </div>
    </>
  );
}
