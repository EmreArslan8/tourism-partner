import { getTranslations, setRequestLocale } from "next-intl/server";
import { Headset, Send, ChevronRight } from "lucide-react";
import { Link, redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPanelSession, getPanelBusiness } from "@/lib/panel-auth";
import { createSupportTicket } from "@/lib/actions/support";
import DashboardTopbar from "../Topbar";
import styles from "../styles";
import { PartnerPanelButton, PartnerPanelCard, PartnerPanelEmptyState, PartnerPanelField, PartnerPanelTextarea } from "../_ui";
import NewTicketModal from "./NewTicketModal";

const STATUS_CLS: Record<string, string> = {
  new: "bg-sapphire/10 text-sapphire-deep",
  in_progress: "bg-amber-100 text-amber-700",
  resolved: "bg-emerald-100 text-emerald-700",
  archived: "bg-line/60 text-muted",
};

type Ticket = { id: number; subject: string; message: string; status: string; created_at: string };
type LastMsg = { ticket_id: number; body: string; created_at: string };

export default async function SupportPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { locale } = await params;
  const { tab } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("panel");
  const archivedView = tab === "archived";
  const fmt = (v: string) => new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(v));
  const statusLabel = (status: string) => {
    const key = `supportStatus_${status}` as "supportStatus_new" | "supportStatus_in_progress" | "supportStatus_resolved" | "supportStatus_archived";
    return ["new", "in_progress", "resolved", "archived"].includes(status) ? t(key) : status;
  };

  const session = await getPanelSession();
  if (!session) return redirect({ href: "/login", locale });
  const biz = await getPanelBusiness();

  const supabase = await createClient();
  const { data: ticketRaw } = biz
    ? await supabase
        .from("support_tickets")
        .select("id,subject,message,status,created_at")
        .eq("business_id", biz.id)
        .order("created_at", { ascending: false })
    : { data: [] as Ticket[] };
  const allTickets = (ticketRaw ?? []) as Ticket[];
  const activeCount = allTickets.filter((tk) => tk.status !== "archived").length;
  const archivedCount = allTickets.length - activeCount;
  const tickets = allTickets.filter((tk) => (archivedView ? tk.status === "archived" : tk.status !== "archived"));

  // Her talebin son mesajını önizleme için çek (yoksa talebin kendi mesajı).
  const { data: msgRaw } = tickets.length
    ? await supabase
        .from("support_ticket_messages")
        .select("ticket_id,body,created_at")
        .in("ticket_id", tickets.map((tk) => tk.id))
        .order("created_at", { ascending: true })
    : { data: [] as LastMsg[] };
  const lastByTicket = ((msgRaw ?? []) as LastMsg[]).reduce<Record<number, LastMsg>>((acc, m) => {
    acc[m.ticket_id] = m; // asc sıralı → son yazılan üstüne biner
    return acc;
  }, {});

  const tabCls = (active: boolean) =>
    "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors " +
    (active ? "bg-brand text-white" : "text-muted hover:bg-cream");

  return (
    <>
      <DashboardTopbar title={t("supportNav")} />
      <div className={styles.content}>
        {allTickets.length === 0 && (
          <PartnerPanelCard bodyClassName="p-5">
            <h2 className="mb-3 inline-flex items-center gap-2 text-[15px] font-medium text-[#172033]"><Headset size={17} className="text-[#1557C2]" aria-hidden /> {t("supportNew")}</h2>
            <form action={createSupportTicket} className="grid gap-2.5">
              <PartnerPanelField name="subject" required maxLength={200} placeholder={t("supportSubjectPlaceholder")} />
              <PartnerPanelTextarea name="message" required rows={4} maxLength={4000} placeholder={t("supportMessagePlaceholder")} />
              <PartnerPanelButton type="submit" className="h-9 w-fit px-3.5"><Send size={15} aria-hidden /> {t("supportSubmit")}</PartnerPanelButton>
            </form>
          </PartnerPanelCard>
        )}

        {allTickets.length > 0 && (
          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-[15px] font-medium text-[#172033]">{t("supportMine", { count: activeCount })}</h2>
              <NewTicketModal />
            </div>

            <div className="mb-4 flex items-center gap-1.5">
              <Link href={{ pathname: "/dashboard/support" }} className={tabCls(!archivedView)}>
                {t("supportTabActive")} ({activeCount})
              </Link>
              <Link href={{ pathname: "/dashboard/support", query: { tab: "archived" } }} className={tabCls(archivedView)}>
                {t("supportTabArchived")} ({archivedCount})
              </Link>
            </div>

            {tickets.length === 0 ? (
              <PartnerPanelEmptyState className="py-10" description={archivedView ? t("supportArchivedEmpty") : t("supportEmpty")} />
            ) : (
              <ul className="grid gap-2.5">
                {tickets.map((tk) => {
                  const last = lastByTicket[tk.id];
                  const preview = last?.body ?? tk.message;
                  const when = last?.created_at ?? tk.created_at;
                  return (
                    <PartnerPanelCard as="li" key={tk.id} bodyClassName="p-0">
                      <Link
                        href={{ pathname: "/dashboard/support/[id]", params: { id: String(tk.id) } }}
                        className="flex items-center gap-3 p-4 transition-colors hover:bg-cream/50"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-[14.5px] font-medium text-[#172033]">{tk.subject}</p>
                            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_CLS[tk.status] ?? STATUS_CLS.archived}`}>{statusLabel(tk.status)}</span>
                          </div>
                          <p className="mt-1 truncate text-[13px] text-muted">{preview}</p>
                          <p className="mt-1 text-[11.5px] font-medium text-muted/80">{fmt(when)}</p>
                        </div>
                        <ChevronRight size={18} className="shrink-0 text-muted" aria-hidden />
                      </Link>
                    </PartnerPanelCard>
                  );
                })}
              </ul>
            )}
          </section>
        )}
      </div>
    </>
  );
}
