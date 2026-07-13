import { getTranslations, setRequestLocale } from "next-intl/server";
import { LifeBuoy, Send } from "lucide-react";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPanelSession, getPanelBusiness } from "@/lib/panel-auth";
import { createSupportTicket } from "@/lib/actions/support";
import DashboardTopbar from "../Topbar";
import styles from "../styles";
import { PartnerPanelButton, PartnerPanelCard, PartnerPanelEmptyState, PartnerPanelField, PartnerPanelTextarea } from "../_ui";

const STATUS_CLS: Record<string, string> = {
  new: "bg-sapphire/10 text-sapphire-deep",
  in_progress: "bg-amber-100 text-amber-700",
  resolved: "bg-emerald-100 text-emerald-700",
  archived: "bg-line/60 text-muted",
};

type Ticket = { id: number; subject: string; message: string; status: string; created_at: string };

export default async function SupportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("panel");
  const fmt = (v: string) => new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(v));
  const statusLabel = (status: string) => {
    const key = `supportStatus_${status}` as "supportStatus_new" | "supportStatus_in_progress" | "supportStatus_resolved" | "supportStatus_archived";
    return ["new", "in_progress", "resolved", "archived"].includes(status) ? t(key) : status;
  };

  const session = await getPanelSession();
  if (!session) redirect({ href: "/login", locale });
  const biz = await getPanelBusiness();

  const supabase = await createClient();
  const { data: ticketRaw } = biz
    ? await supabase
        .from("support_tickets")
        .select("id,subject,message,status,created_at")
        .eq("business_id", biz.id)
        .order("created_at", { ascending: false })
    : { data: [] as Ticket[] };
  const tickets = (ticketRaw ?? []) as Ticket[];

  return (
    <>
      <DashboardTopbar title={t("supportNav")} />
      <div className={styles.content}>
      <PartnerPanelCard bodyClassName="p-5">
        <h2 className="mb-3 inline-flex items-center gap-2 text-[15px] font-medium text-[#172033]"><LifeBuoy size={17} className="text-[#1557C2]" aria-hidden /> {t("supportNew")}</h2>
        <form action={createSupportTicket} className="grid gap-2.5">
          <PartnerPanelField name="subject" required maxLength={200} placeholder={t("supportSubjectPlaceholder")} />
          <PartnerPanelTextarea name="message" required rows={4} maxLength={4000} placeholder={t("supportMessagePlaceholder")} />
          <PartnerPanelButton type="submit" className="h-9 w-fit px-3.5"><Send size={15} aria-hidden /> {t("supportSubmit")}</PartnerPanelButton>
        </form>
      </PartnerPanelCard>

      <section className="mt-6">
        <h2 className="mb-3 text-[15px] font-medium text-[#172033]">{t("supportMine", { count: tickets.length })}</h2>
        {tickets.length === 0 ? (
          <PartnerPanelEmptyState className="py-10" description={t("supportEmpty")} />
        ) : (
          <ul className="grid gap-3">
            {tickets.map((tk) => (
              <PartnerPanelCard as="li" key={tk.id} bodyClassName="p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[14.5px] font-medium text-[#172033]">{tk.subject}</p>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_CLS[tk.status] ?? STATUS_CLS.archived}`}>{statusLabel(tk.status)}</span>
                </div>
                <p className="mt-1.5 whitespace-pre-wrap text-[13px] leading-5 text-ink/80">{tk.message}</p>
                <p className="mt-1.5 text-[11.5px] font-medium text-muted">{fmt(tk.created_at)}</p>
              </PartnerPanelCard>
            ))}
          </ul>
        )}
      </section>
      </div>
    </>
  );
}
