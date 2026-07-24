import { Inbox } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPanelSession, getPanelBusiness } from "@/lib/panel-auth";
import { serviceTranslationKey } from "@/lib/categories";
import DashboardTopbar from "../Topbar";
import styles from "../styles";
import { PartnerPanelCard, PartnerPanelEmptyState } from "../_ui";
import QuoteReplyForm from "./QuoteReplyForm";

type IncomingQuote = {
  id: number;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  service: string | null;
  category_type: string | null;
  city: string | null;
  district: string | null;
  date_range: string | null;
  valid_until: string | null;
  people: number | null;
  message: string | null;
  status: string;
  created_at: string;
};

type QuoteResponse = {
  id: number;
  quote_id: number;
  message: string;
  email_status: string;
  created_at: string;
};

export default async function IncomingQuotesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getPanelSession();
  if (!session) return redirect({ href: "/login", locale });
  if (session.accountType === "buyer") return redirect({ href: "/dashboard", locale });

  const [t, ts] = await Promise.all([
    getTranslations("panel"),
    getTranslations("service"),
  ]);

  const biz = await getPanelBusiness();
  if (!biz) {
    return (
      <>
        <DashboardTopbar title={t("quotesInboxNav")} />
        <div className={styles.content}>
          <PartnerPanelEmptyState
            title={t("profileRequiredTitle")}
            description={t("requestsProfileRequired")}
            action={<Link href="/dashboard/businesses" className={styles.compactPrimaryButton}>{t("goToListings")}</Link>}
          />
        </div>
      </>
    );
  }

  const supabase = await createClient();
  const [{ data: quotesRaw }, { data: responsesRaw }] = await Promise.all([
    supabase
      .from("quotes")
      .select("id,name,company,email,phone,service,category_type,city,district,date_range,valid_until,people,message,status,created_at")
      .eq("business_id", biz.id)
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("quote_responses")
      .select("id,quote_id,message,email_status,created_at")
      .eq("business_id", biz.id)
      .order("created_at", { ascending: true }),
  ]);

  const quotes = (quotesRaw ?? []) as IncomingQuote[];
  const responsesByQuote = new Map<number, QuoteResponse[]>();
  for (const r of (responsesRaw ?? []) as QuoteResponse[]) {
    (responsesByQuote.get(r.quote_id) ?? responsesByQuote.set(r.quote_id, []).get(r.quote_id)!).push(r);
  }

  const fmt = (v: string) => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(v));
  const serviceName = (value: string | null) => {
    if (!value) return null;
    const key = serviceTranslationKey(value);
    return key ? ts(key) : value;
  };

  return (
    <>
      <DashboardTopbar title={t("quotesInboxNav")} />
      <div className={styles.content}>
        <PartnerPanelCard bodyClassName="p-0">
          <div className="flex items-center justify-between gap-2 border-b border-line/70 px-5 py-3.5">
            <h2 className="inline-flex items-center gap-2 text-[15px] font-medium text-[#172033]">
              <Inbox size={17} className="text-[#1557C2]" aria-hidden /> {t("quotesInboxTitle")}
            </h2>
            <span className="rounded-pill bg-[#EAF2FF] px-2 py-0.5 text-[12px] font-semibold text-[#1557C2]">{quotes.length}</span>
          </div>

          {quotes.length === 0 ? (
            <p className="px-5 py-8 text-[13px] text-muted">{t("noQuotes")}</p>
          ) : (
            <ul className="divide-y divide-line/60">
              {quotes.map((q) => {
                const responses = responsesByQuote.get(q.id) ?? [];
                return (
                  <li key={q.id} className="px-5 py-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="flex min-w-0 items-baseline gap-2">
                        <span className="truncate text-[14px] font-bold text-ink">{q.name}</span>
                        {q.company && <span className="truncate text-[12px] text-muted">{q.company}</span>}
                      </div>
                      <span className="shrink-0 text-[11.5px] font-medium text-muted">{fmt(q.created_at)}</span>
                    </div>
                    <p className="mt-0.5 text-[12.5px] text-ink/75">
                      {[serviceName(q.service) ?? serviceName(q.category_type), [q.city, q.district].filter(Boolean).join("/"), q.date_range, q.people ? `${q.people} ${t("people")}` : null].filter(Boolean).join(" · ") || "—"}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-muted">
                      <a href={`mailto:${q.email}`} className="text-terra hover:underline">{q.email}</a>
                      {q.phone && <span>{q.phone}</span>}
                      {q.valid_until && <span className="font-medium text-terra-deep">{t("quoteValidUntil")}: {new Date(`${q.valid_until}T12:00:00`).toLocaleDateString(locale)}</span>}
                    </div>
                    {q.message && (
                      <p className="mt-2 whitespace-pre-line rounded-[8px] bg-[#F5F8FD] px-3 py-2 text-[12.5px] leading-5 text-ink/85">{q.message}</p>
                    )}

                    {responses.length > 0 && (
                      <div className="mt-3 grid gap-2">
                        {responses.map((r) => (
                          <div key={r.id} className="rounded-[8px] border border-emerald-200 bg-emerald-50/60 px-3 py-2">
                            <div className="mb-1 flex items-center justify-between gap-2 text-[11px] font-semibold text-emerald-800">
                              <span>{t("quoteReplySentLabel")} · {fmt(r.created_at)}</span>
                              {r.email_status !== "sent" && r.email_status !== "sent_fallback" && (
                                <span className="text-red-600">{t("quoteReplyNotDelivered")}</span>
                              )}
                            </div>
                            <p className="whitespace-pre-line text-[12.5px] leading-5 text-ink/85">{r.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <QuoteReplyForm quoteId={q.id} />
                  </li>
                );
              })}
            </ul>
          )}
        </PartnerPanelCard>
        <p className="mt-3 px-1 text-[12px] leading-5 text-muted">{t("quotesInboxHint")}</p>
      </div>
    </>
  );
}
