import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Megaphone, Inbox, Send, Eye } from "lucide-react";
import { Link, redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPanelSession, getPanelBusiness } from "@/lib/panel-auth";
import { CATEGORY_GROUPS, serviceTranslationKey } from "@/lib/categories";
import type { GroupKey } from "@/lib/types";
import { createB2bRequest, submitB2bOffer, closeMyB2bRequest } from "@/lib/actions/b2b";
import { DateRangePicker, SingleDatePicker } from "@/components/FormDatePickers";
import B2bViewTracker from "@/components/B2bViewTracker";
import DashboardTopbar from "../Topbar";
import styles from "../styles";
import { PartnerPanelButton, PartnerPanelCard, PartnerPanelEmptyState, PartnerPanelField, PartnerPanelTextarea } from "../_ui";
import RequestsLoading from "./loading";
import RequestRegionFields from "./RequestRegionFields";
import RequestCategoryFields from "./RequestCategoryFields";

const bizName = (r: { name: string } | { name: string }[] | null) =>
  (Array.isArray(r) ? r[0]?.name : r?.name) ?? "—";

type Req = { id: number; title: string; description: string | null; region: string | null; status: string; view_count: number; created_at: string };

export default async function RequestsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<RequestsLoading />}>
      <RequestsContent locale={locale} />
    </Suspense>
  );
}

async function RequestsContent({ locale }: { locale: string }) {
  const [t, tq, tc, ts] = await Promise.all([
    getTranslations("panel"),
    getTranslations("quote"),
    getTranslations("cat"),
    getTranslations("service"),
  ]);
  const fmt = (v: string) => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(v));
  const groupLabel = (g: string | null) => {
    const group = CATEGORY_GROUPS.find((c) => c.key === g);
    return group ? tc(group.key) : null;
  };

  const session = await getPanelSession();
  if (!session) redirect({ href: "/login", locale });
  const biz = await getPanelBusiness();

  const supabase = await createClient();

  if (!biz) {
    return (
      <>
        <DashboardTopbar title={t("requestsNav")} />
        <div className={styles.content}>
          <PartnerPanelEmptyState
            title={t("profileRequiredTitle")}
            description={t("requestsProfileRequired")}
            action={<Link href="/dashboard/listings" className={styles.compactPrimaryButton}>{t("goToListings")}</Link>}
          />
        </div>
      </>
    );
  }

  const [{ data: myReqRaw }, { data: openReqRaw }, { data: myOffersRaw }] = await Promise.all([
    supabase.from("b2b_requests").select("id,title,description,region,status,view_count,created_at").eq("business_id", biz.id).order("created_at", { ascending: false }),
    supabase.from("b2b_requests").select("id,title,description,region,target_group,target_types,status,view_count,created_at,business_id,businesses(name)").eq("status", "published").neq("business_id", biz.id).order("created_at", { ascending: false }).limit(80),
    supabase.from("b2b_offers").select("request_id").eq("business_id", biz.id),
  ]);

  const myReq = (myReqRaw ?? []) as Req[];
  const myReqIds = myReq.map((r) => r.id);
  const { data: offersRaw } = myReqIds.length
    ? await supabase.from("b2b_offers").select("id,request_id,message,price,created_at,businesses(name)").in("request_id", myReqIds).order("created_at", { ascending: false })
    : { data: [] as unknown[] };

  type Offer = { id: number; request_id: number; message: string; price: string | null; created_at: string; businesses: { name: string } | { name: string }[] | null };
  const offersByReq = new Map<number, Offer[]>();
  for (const o of (offersRaw ?? []) as Offer[]) {
    (offersByReq.get(o.request_id) ?? offersByReq.set(o.request_id, []).get(o.request_id)!).push(o);
  }
  const offered = new Set(((myOffersRaw ?? []) as { request_id: number }[]).map((o) => o.request_id));

  // Açık ilanları tedarikçiye göre filtrele (Brief §7: "ilgili bölgedeki işletmeler"):
  // hedef kategori boş veya benim grubumla eşleşmeli; bölge boş veya şehrim/ülkemle örtüşmeli.
  type OpenReq = Req & { target_group: GroupKey | null; target_types: string[]; business_id: number; businesses: { name: string } | { name: string }[] | null };
  const myGroup = biz.group as GroupKey;
  const myTypeSlug = serviceTranslationKey(biz.type) ?? biz.type;
  const myCity = (biz.city ?? "").toLocaleLowerCase("tr");
  const myCountry = (biz.country ?? "").toLocaleLowerCase("tr");
  const openReq = ((openReqRaw ?? []) as unknown as OpenReq[]).filter((r) => {
    const groupOk = !r.target_group || r.target_group === myGroup;
    const typeOk = !r.target_types?.length || r.target_types.includes(myTypeSlug) || r.target_types.includes(biz.type);
    const reg = (r.region ?? "").toLocaleLowerCase("tr");
    const regionOk = !reg || (!!myCity && (reg.includes(myCity) || myCity.includes(reg))) || (!!myCountry && reg.includes(myCountry));
    return groupOk && typeOk && regionOk;
  });

  return (
    <>
      <DashboardTopbar title={t("requestsNav")} />
      <div className={styles.content}>
      <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(360px,.85fr)] gap-6 max-[980px]:grid-cols-1">
        {/* SOL — Talep oluştur + Taleplerim */}
        <section className="flex flex-col gap-5">
          <PartnerPanelCard bodyClassName="p-5">
            <h2 className="mb-3 inline-flex items-center gap-2 text-[15px] font-medium text-[#172033]"><Megaphone size={17} className="text-[#1557C2]" aria-hidden /> {t("requestsNew")}</h2>
            <form action={createB2bRequest} className="grid gap-3">
              <label className={styles.labelCls}>
                {t("requestsTitleLabel")}
                <PartnerPanelField name="title" required maxLength={160} placeholder={t("requestsTitlePlaceholder")} />
              </label>
              <RequestCategoryFields />
              <RequestRegionFields defaultCountry={biz.country ?? "Türkiye"} defaultCity={biz.city ?? ""} defaultDistrict={biz.district ?? ""} />
              <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(220px,.9fr)_minmax(120px,.55fr)] gap-2.5 max-[760px]:grid-cols-1">
                <DateRangePicker
                  label={tq("dateRange")}
                  startLabel={tq("dateStart")}
                  endLabel={tq("dateEnd")}
                  clearLabel={tq("dateClear")}
                  doneLabel={tq("dateDone")}
                />
                <SingleDatePicker
                  label={tq("validUntil")}
                  placeholder={tq("dateSelect")}
                  clearLabel={tq("dateClear")}
                  doneLabel={tq("dateDone")}
                />
                <label className={styles.labelCls}>
                  {tq("people")}
                  <PartnerPanelField name="people" type="number" min={1} placeholder="0" />
                </label>
              </div>
              <label className={styles.labelCls}>
                {tq("message")}
                <PartnerPanelTextarea name="description" rows={4} maxLength={1600} placeholder={t("requestsDetailsPlaceholder")} />
              </label>
              <PartnerPanelButton type="submit" className="h-9 w-fit px-3.5">{t("requestsPublish")}</PartnerPanelButton>
            </form>
          </PartnerPanelCard>

          <PartnerPanelCard bodyClassName="p-5">
            <h2 className="mb-3 inline-flex items-center gap-2 text-[15px] font-medium text-[#172033]"><Inbox size={17} className="text-[#1557C2]" aria-hidden /> {t("requestsMine", { count: myReq.length })}</h2>
            {myReq.length === 0 ? (
              <p className="text-[13px] text-muted">{t("requestsMineEmpty")}</p>
            ) : (
              <ul className="grid gap-3">
                {myReq.map((r) => {
                  const offers = offersByReq.get(r.id) ?? [];
                  return (
                    <li key={r.id} className={styles.softPanel}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[14px] font-bold text-ink">{r.title}</p>
                          <p className="mt-0.5 text-[12px] font-medium text-muted">{r.region ?? "—"} · {fmt(r.created_at)} · <Eye size={11} className="inline" aria-hidden /> {r.view_count}</p>
                          {r.description && <p className="mt-1.5 whitespace-pre-line text-[13px] leading-5 text-ink/80">{r.description}</p>}
                        </div>
                        {r.status !== "archived" && (
                          <form action={closeMyB2bRequest}>
                            <input type="hidden" name="id" value={r.id} />
                            <button type="submit" className="shrink-0 rounded-[8px] border border-[#BFD2F2] px-2.5 py-1 text-[11.5px] font-medium text-[#1557C2] hover:bg-[#EAF2FF]">{t("requestsClose")}</button>
                          </form>
                        )}
                      </div>
                      {offers.length > 0 && (
                        <div className="mt-2.5 grid gap-1.5 border-t border-line/70 pt-2.5">
                          <p className="text-[11.5px] font-bold uppercase tracking-[.06em] text-terra-deep">{t("requestsOffersReceived", { count: offers.length })}</p>
                          {offers.map((o) => (
                            <div key={o.id} className="rounded-[9px] bg-white px-3 py-2 text-[12.5px]">
                              <span className="font-bold text-ink">{bizName(o.businesses)}</span>
                              {o.price && <span className="ml-2 font-semibold text-terra-deep">{o.price}</span>}
                              <p className="mt-0.5 text-muted">{o.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </PartnerPanelCard>
        </section>

        {/* SAĞ — Açık ilanlar (teklif ver) */}
        <PartnerPanelCard bodyClassName="p-5">
          <h2 className="mb-3 inline-flex items-center gap-2 text-[15px] font-medium text-[#172033]"><Send size={17} className="text-[#1557C2]" aria-hidden /> {t("requestsOpenMatches")}</h2>
          {openReq.length === 0 ? (
            <p className="text-[13px] text-muted">{t("requestsOpenEmpty")}</p>
          ) : (
            <ul className="grid gap-3">
              {openReq.map((r) => (
                <li key={r.id} className={`relative ${styles.softPanel}`}>
                  <B2bViewTracker id={r.id} />
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[14px] font-bold text-ink">{r.title}</p>
                    {groupLabel(r.target_group) && (
                      <span className="rounded-pill bg-terra/10 px-2 py-0.5 text-[10.5px] font-bold text-terra-deep">{groupLabel(r.target_group)}</span>
                    )}
                    {(r.target_types ?? []).map((type) => {
                      const key = serviceTranslationKey(type);
                      return <span key={type} className="rounded-pill bg-sapphire/10 px-2 py-0.5 text-[10.5px] font-bold text-sapphire-deep">{key ? ts(key) : type}</span>;
                    })}
                  </div>
                  <p className="mt-0.5 text-[12px] font-medium text-muted">{bizName(r.businesses)} · {r.region ?? "—"} · {fmt(r.created_at)}</p>
                  {r.description && <p className="mt-1.5 whitespace-pre-line text-[13px] leading-5 text-ink/80">{r.description}</p>}
                  {offered.has(r.id) ? (
                    <p className="mt-2.5 text-[12.5px] font-bold text-emerald-700">✓ {t("requestsOffered")}</p>
                  ) : (
                    <form action={submitB2bOffer} className="mt-2.5 grid gap-2 border-t border-line/70 pt-2.5">
                      <input type="hidden" name="request_id" value={r.id} />
                      <div className="grid grid-cols-[1fr_140px] gap-2 max-[420px]:grid-cols-1">
                        <PartnerPanelField name="message" required maxLength={2000} placeholder={t("requestsOfferPlaceholder")} />
                        <PartnerPanelField name="price" maxLength={120} placeholder={t("requestsPricePlaceholder")} />
                      </div>
                      <PartnerPanelButton type="submit" variant="ghost" className="h-9 w-fit px-3.5">{t("requestsSubmitOffer")}</PartnerPanelButton>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          )}
        </PartnerPanelCard>
      </div>
      </div>
    </>
  );
}
