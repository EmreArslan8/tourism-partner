import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Megaphone, Inbox, Send, Eye, Lock, Check, X, Tag } from "lucide-react";
import { Link, redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPanelSession, getPanelBusiness } from "@/lib/panel-auth";
import { CATEGORY_GROUPS, serviceTranslationKey } from "@/lib/categories";
import type { GroupKey } from "@/lib/types";
import { submitB2bOffer, closeMyB2bRequest, respondToB2bOffer } from "@/lib/actions/b2b";
import { DateRangePicker, SingleDatePicker } from "@/components/FormDatePickers";
import B2bViewTracker from "@/components/B2bViewTracker";
import DashboardTopbar from "../Topbar";
import styles from "../styles";
import { PartnerPanelButton, PartnerPanelCard, PartnerPanelEmptyState, PartnerPanelField, PartnerPanelTextarea } from "../_ui";
import RequestsLoading from "./loading";
import CreateRequestForm from "./CreateRequestForm";
import RequestRegionFields from "./RequestRegionFields";
import RequestCategoryFields from "./RequestCategoryFields";

const one = <T,>(value: T | T[] | null | undefined): T | null =>
  (Array.isArray(value) ? value[0] ?? null : value ?? null);

type OfferBusiness = { id: number; name: string; phone: string | null; website: string | null; city: string | null };
type ContactPerson = { business_id: number; full_name: string; title: string | null; phone: string | null; email: string | null };

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
  if (!session) return redirect({ href: "/login", locale });
  if (session.accountType === "buyer") return <BuyerRequestsContent locale={locale} userId={session.userId} />;
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
            action={<Link href="/dashboard/businesses" className={styles.compactPrimaryButton}>{t("goToListings")}</Link>}
          />
        </div>
      </>
    );
  }

  // Açık ilanlar artık b2b_open_requests görünümünden gelir: talep sahibinin
  // kimliği/iletişimi bu görünümde YOKTUR (teklif onaylanana kadar anonim).
  const [{ data: myReqRaw }, { data: openReqRaw }, { data: myOffersRaw }, { data: quotesRaw }] = await Promise.all([
    supabase.from("b2b_requests").select("id,title,description,region,status,view_count,created_at").eq("business_id", biz.id).order("created_at", { ascending: false }),
    supabase.from("b2b_open_requests").select("id,title,description,region,target_group,target_types,view_count,created_at,requester_city,requester_country,requester_verified").eq("is_mine", false).order("created_at", { ascending: false }).limit(80),
    supabase.from("b2b_my_offers").select("id,request_id,message,price,status,created_at,request_title,request_region,request_status,requester_business_id,requester_name,requester_phone,requester_website,requester_city").eq("business_id", biz.id).order("created_at", { ascending: false }).limit(100),
    supabase.from("quotes").select("id,name,company,email,phone,service,category_type,country,city,district,date_range,valid_until,people,message,created_at").eq("business_id", biz.id).order("created_at", { ascending: false }).limit(200),
  ]);

  type IncomingQuote = { id: number; name: string; company: string | null; email: string; phone: string | null; service: string | null; category_type: string | null; country: string | null; city: string | null; district: string | null; date_range: string | null; valid_until: string | null; people: number | null; message: string | null; created_at: string };
  const quotes = (quotesRaw ?? []) as IncomingQuote[];
  const serviceName = (value: string | null) => {
    if (!value) return null;
    const key = serviceTranslationKey(value);
    return key ? ts(key) : value;
  };

  type MyOffer = {
    id: number; request_id: number; message: string; price: string | null;
    status: "pending" | "accepted" | "declined"; created_at: string;
    request_title: string; request_region: string | null; request_status: string;
    requester_business_id: number | null; requester_name: string | null;
    requester_phone: string | null; requester_website: string | null; requester_city: string | null;
  };
  const myOffers = (myOffersRaw ?? []) as MyOffer[];
  const offered = new Set(myOffers.map((o) => o.request_id));

  const myReq = (myReqRaw ?? []) as Req[];
  const myReqIds = myReq.map((r) => r.id);

  // Açık ilanları tedarikçiye göre filtrele (Brief §7: "ilgili bölgedeki işletmeler"):
  // hedef kategori boş veya benim grubumla eşleşmeli; bölge boş veya şehrim/ülkemle örtüşmeli.
  type OpenReq = {
    id: number; title: string; description: string | null; region: string | null;
    target_group: GroupKey | null; target_types: string[]; view_count: number; created_at: string;
    requester_city: string | null; requester_country: string | null; requester_verified: boolean;
  };
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
  const openReqIds = openReq.map((r) => r.id);

  // Kendi taleplerime gelen teklifler + açık ilanlara teklif veren firma ADLARI.
  // İkincisi b2b_request_offer_authors görünümünden gelir: yalnız isim, teklif
  // içeriği/fiyatı rakip tedarikçilere kapalıdır.
  const [{ data: offersRaw }, { data: authorsRaw }] = await Promise.all([
    myReqIds.length
      ? supabase.from("b2b_offers").select("id,request_id,message,price,status,contact_unlocked_at,created_at,businesses(id,name,phone,website,city)").in("request_id", myReqIds).order("created_at", { ascending: false })
      : Promise.resolve({ data: [] as unknown[] }),
    openReqIds.length
      ? supabase.from("b2b_request_offer_authors").select("request_id,business_id,business_name,business_verified").in("request_id", openReqIds)
      : Promise.resolve({ data: [] as unknown[] }),
  ]);

  type Offer = {
    id: number; request_id: number; message: string; price: string | null;
    status: "pending" | "accepted" | "declined"; contact_unlocked_at: string | null; created_at: string;
    businesses: OfferBusiness | OfferBusiness[] | null;
  };
  const offers = (offersRaw ?? []) as Offer[];
  const offersByReq = new Map<number, Offer[]>();
  for (const o of offers) {
    (offersByReq.get(o.request_id) ?? offersByReq.set(o.request_id, []).get(o.request_id)!).push(o);
  }

  type OfferAuthor = { request_id: number; business_id: number; business_name: string; business_verified: boolean };
  const authorsByReq = new Map<number, OfferAuthor[]>();
  for (const a of (authorsRaw ?? []) as OfferAuthor[]) {
    (authorsByReq.get(a.request_id) ?? authorsByReq.set(a.request_id, []).get(a.request_id)!).push(a);
  }

  // İletişim kişileri yalnız kabul edilmiş tekliflerin iki tarafı için okunabilir
  // (business_contacts RLS). Boş dönmesi = henüz onay yok demektir.
  const unlockedBizIds = [
    ...offers.filter((o) => o.status === "accepted").map((o) => one(o.businesses)?.id),
    ...myOffers.filter((o) => o.status === "accepted").map((o) => o.requester_business_id),
  ].filter((id): id is number => typeof id === "number");
  const { data: contactsRaw } = unlockedBizIds.length
    ? await supabase.from("business_contacts").select("business_id,full_name,title,phone,email").in("business_id", [...new Set(unlockedBizIds)])
    : { data: [] as unknown[] };
  const contactsByBiz = new Map<number, ContactPerson[]>();
  for (const c of (contactsRaw ?? []) as ContactPerson[]) {
    (contactsByBiz.get(c.business_id) ?? contactsByBiz.set(c.business_id, []).get(c.business_id)!).push(c);
  }

  const ContactBlock = ({ businessId, name, phone, website, city }: { businessId: number | null; name: string | null; phone: string | null; website: string | null; city: string | null }) => (
    <div className="mt-2 rounded-[9px] border border-emerald-200 bg-emerald-50/60 px-3 py-2">
      <p className="text-[11px] font-bold uppercase tracking-[.06em] text-emerald-800">{t("requestsContactUnlocked")}</p>
      <p className="mt-1 text-[13px] font-bold text-ink">{name ?? "—"}{city ? <span className="ms-2 text-[11.5px] font-medium text-muted">{city}</span> : null}</p>
      <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-ink/80">
        {phone && <a href={`tel:${phone}`} className="text-[#1557C2] hover:underline">{phone}</a>}
        {website && <a href={website.startsWith("http") ? website : `https://${website}`} target="_blank" rel="noreferrer" className="text-[#1557C2] hover:underline">{website}</a>}
      </div>
      {(businessId ? contactsByBiz.get(businessId) ?? [] : []).map((c, i) => (
        <p key={i} className="mt-1 text-[12px] text-ink/80">
          <span className="font-semibold">{c.full_name}</span>
          {c.title && <span className="text-muted"> — {c.title}</span>}
          {c.phone && <> · <a href={`tel:${c.phone}`} className="text-[#1557C2] hover:underline">{c.phone}</a></>}
          {c.email && <> · <a href={`mailto:${c.email}`} className="text-[#1557C2] hover:underline">{c.email}</a></>}
        </p>
      ))}
    </div>
  );

  return (
    <>
      <DashboardTopbar title={t("requestsNav")} />
      <div className={styles.content}>
      {/* Gelen teklifler — quote formundan (b2b talep-teklif'ten AYRI). Kompakt,
          kaydırılabilir satır listesi: 100-200 kayıtta da düzeni bozmaz. */}
      <PartnerPanelCard bodyClassName="p-0" className="mb-6">
        <div className="flex items-center justify-between gap-2 border-b border-line/70 px-5 py-3.5">
          <h2 className="inline-flex items-center gap-2 text-[15px] font-medium text-[#172033]"><Inbox size={17} className="text-[#1557C2]" aria-hidden /> {t("quotesTitle")}</h2>
          <span className="rounded-pill bg-[#EAF2FF] px-2 py-0.5 text-[12px] font-semibold text-[#1557C2]">{quotes.length}</span>
        </div>
        {quotes.length === 0 ? (
          <p className="px-5 py-6 text-[13px] text-muted">{t("noQuotes")}</p>
        ) : (
          <ul className="max-h-[300px] divide-y divide-line/60 overflow-y-auto">
            {quotes.map((q) => (
              <li key={q.id} className="px-5 py-3 hover:bg-[#F7FAFF]">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex min-w-0 items-baseline gap-2">
                    <span className="truncate text-[13.5px] font-bold text-ink">{q.name}</span>
                    {q.company && <span className="truncate text-[12px] text-muted">{q.company}</span>}
                  </div>
                  <span className="shrink-0 text-[11.5px] font-medium text-muted">{fmt(q.created_at)}</span>
                </div>
                <p className="mt-0.5 truncate text-[12.5px] text-ink/75">
                  {[serviceName(q.service) ?? serviceName(q.category_type), [q.city, q.district].filter(Boolean).join("/"), q.date_range, q.people ? `${q.people} ${t("people")}` : null].filter(Boolean).join(" · ") || "—"}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-muted">
                  <a href={`mailto:${q.email}`} className="text-terra hover:underline">{q.email}</a>
                  {q.phone && <span>{q.phone}</span>}
                  {q.valid_until && <span className="font-medium text-terra-deep">{t("quoteValidUntil")}: {new Date(`${q.valid_until}T12:00:00`).toLocaleDateString("tr-TR")}</span>}
                  <a href={`mailto:${q.email}?subject=${encodeURIComponent(t("replySubject"))}`} className="ms-auto font-medium text-[#1557C2] hover:underline">{t("reply")}</a>
                </div>
                {q.message && (
                  <details className="mt-1.5 group">
                    <summary className="cursor-pointer list-none text-[11.5px] font-medium text-muted hover:text-ink [&::-webkit-details-marker]:hidden">{tq("message")} ▾</summary>
                    <p className="mt-1 whitespace-pre-line rounded-[8px] bg-[#F5F8FD] px-3 py-2 text-[12.5px] leading-5 text-ink/85">{q.message}</p>
                  </details>
                )}
              </li>
            ))}
          </ul>
        )}
      </PartnerPanelCard>

      <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(360px,.85fr)] gap-6 max-[1200px]:grid-cols-1">
        {/* SOL — Talep oluştur + Taleplerim */}
        <section className="flex flex-col gap-5">
          <PartnerPanelCard bodyClassName="p-5" className="overflow-visible">
            <h2 className="mb-3 inline-flex items-center gap-2 text-[15px] font-medium text-[#172033]"><Megaphone size={17} className="text-[#1557C2]" aria-hidden /> {t("requestsNew")}</h2>
            {/* Pano tıkanmasın: müşteri arayan firma talep açmak yerine fırsat ilanına gitsin. */}
            <div className="mb-3 flex flex-wrap items-center gap-2 rounded-[10px] border border-[#FFE0BF] bg-[#FFF7EE] px-3 py-2.5">
              <p className="min-w-0 flex-1 text-[12.5px] leading-5 text-ink/80">{t("requestsIsCustomerSearch")}</p>
              <Link href="/dashboard/firsatlar" className="inline-flex items-center gap-1 rounded-[8px] border border-[#E9B482] bg-white px-2.5 py-1 text-[11.5px] font-semibold text-terra-deep hover:bg-[#FFF1E2]">
                <Tag size={12} aria-hidden /> {t("requestsGoToDeals")}
              </Link>
            </div>
            <CreateRequestForm>
              <label className={styles.labelCls}>
                {t("requestsTitleLabel")}
                <PartnerPanelField name="title" required maxLength={160} placeholder={t("requestsTitlePlaceholder")} />
              </label>
              <RequestCategoryFields />
              <RequestRegionFields defaultCountry={biz.country ?? "Türkiye"} defaultCity={biz.city ?? ""} defaultDistrict={biz.district ?? ""} />
              <div className="grid grid-cols-[minmax(0,1.9fr)_minmax(160px,.6fr)_minmax(120px,.55fr)] gap-2.5 max-[760px]:grid-cols-1">
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
            </CreateRequestForm>
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
                          {offers.map((o) => {
                            const supplier = one(o.businesses);
                            return (
                              <div key={o.id} className="rounded-[9px] bg-white px-3 py-2 text-[12.5px]">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-bold text-ink">{supplier?.name ?? "—"}</span>
                                  {o.price && <span className="font-semibold text-terra-deep">{o.price}</span>}
                                  {o.status === "accepted" && <span className="rounded-pill bg-emerald-100 px-2 py-0.5 text-[10.5px] font-bold text-emerald-800">{t("requestsOfferAccepted")}</span>}
                                  {o.status === "declined" && <span className="rounded-pill bg-[#F1F4F9] px-2 py-0.5 text-[10.5px] font-bold text-muted">{t("requestsOfferDeclined")}</span>}
                                </div>
                                <p className="mt-0.5 whitespace-pre-line text-muted">{o.message}</p>
                                {o.status === "pending" ? (
                                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                    <form action={respondToB2bOffer}>
                                      <input type="hidden" name="offer_id" value={o.id} />
                                      <input type="hidden" name="decision" value="accept" />
                                      <button type="submit" className="inline-flex items-center gap-1 rounded-[8px] bg-emerald-600 px-2.5 py-1 text-[11.5px] font-semibold text-white hover:bg-emerald-700">
                                        <Check size={12} aria-hidden /> {t("requestsAcceptOffer")}
                                      </button>
                                    </form>
                                    <form action={respondToB2bOffer}>
                                      <input type="hidden" name="offer_id" value={o.id} />
                                      <input type="hidden" name="decision" value="decline" />
                                      <button type="submit" className="inline-flex items-center gap-1 rounded-[8px] border border-line px-2.5 py-1 text-[11.5px] font-medium text-muted hover:bg-[#F5F8FD]">
                                        <X size={12} aria-hidden /> {t("requestsDeclineOffer")}
                                      </button>
                                    </form>
                                    <span className="text-[11px] text-muted">{t("requestsAcceptHint")}</span>
                                  </div>
                                ) : o.status === "accepted" ? (
                                  <ContactBlock
                                    businessId={supplier?.id ?? null}
                                    name={supplier?.name ?? null}
                                    phone={supplier?.phone ?? null}
                                    website={supplier?.website ?? null}
                                    city={supplier?.city ?? null}
                                  />
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </PartnerPanelCard>
        </section>

        {/* SAĞ — Açık ilanlar (teklif ver) + verdiğim teklifler */}
        <section className="flex flex-col gap-5">
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
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[12px] font-medium text-muted">
                    <Lock size={11} aria-hidden /> {r.requester_verified ? t("requestsAnonVerified") : t("requestsAnonMember")} · {r.region ?? ([r.requester_city, r.requester_country].filter(Boolean).join(" / ") || "—")} · {fmt(r.created_at)}
                  </p>
                  {r.description && <p className="mt-1.5 whitespace-pre-line text-[13px] leading-5 text-ink/80">{r.description}</p>}
                  {(authorsByReq.get(r.id) ?? []).length > 0 && (
                    <p className="mt-1.5 text-[11.5px] leading-5 text-muted">
                      <span className="font-bold text-terra-deep">{t("requestsOfferAuthors", { count: (authorsByReq.get(r.id) ?? []).length })}:</span>{" "}
                      {(authorsByReq.get(r.id) ?? []).map((a) => a.business_name).join(", ")}
                    </p>
                  )}
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

          {/* Verdiğim teklifler — durum takibi. Talep sahibi onaylayana kadar
              karşı tarafın kimliği/iletişimi görünmez. */}
          <PartnerPanelCard bodyClassName="p-5">
            <h2 className="mb-3 inline-flex items-center gap-2 text-[15px] font-medium text-[#172033]"><Send size={17} className="text-[#1557C2]" aria-hidden /> {t("requestsMyOffers", { count: myOffers.length })}</h2>
            {myOffers.length === 0 ? (
              <p className="text-[13px] text-muted">{t("requestsMyOffersEmpty")}</p>
            ) : (
              <ul className="grid gap-3">
                {myOffers.map((o) => (
                  <li key={o.id} className={styles.softPanel}>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[13.5px] font-bold text-ink">{o.request_title}</p>
                      {o.status === "accepted" && <span className="rounded-pill bg-emerald-100 px-2 py-0.5 text-[10.5px] font-bold text-emerald-800">{t("requestsOfferAccepted")}</span>}
                      {o.status === "declined" && <span className="rounded-pill bg-[#F1F4F9] px-2 py-0.5 text-[10.5px] font-bold text-muted">{t("requestsOfferDeclined")}</span>}
                      {o.status === "pending" && <span className="rounded-pill bg-[#FFF3E4] px-2 py-0.5 text-[10.5px] font-bold text-terra-deep">{t("requestsOfferPending")}</span>}
                    </div>
                    <p className="mt-0.5 text-[12px] font-medium text-muted">{o.request_region ?? "—"} · {fmt(o.created_at)}{o.price ? ` · ${o.price}` : ""}</p>
                    {o.status === "accepted" ? (
                      <ContactBlock
                        businessId={o.requester_business_id}
                        name={o.requester_name}
                        phone={o.requester_phone}
                        website={o.requester_website}
                        city={o.requester_city}
                      />
                    ) : (
                      <p className="mt-1.5 inline-flex items-center gap-1 text-[11.5px] text-muted"><Lock size={11} aria-hidden /> {t("requestsContactLocked")}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </PartnerPanelCard>
        </section>
      </div>
      </div>
    </>
  );
}

async function BuyerRequestsContent({ locale, userId }: { locale: string; userId: string }) {
  const [t, tq] = await Promise.all([getTranslations("panel"), getTranslations("quote")]);
  const supabase = await createClient();
  const { data } = await supabase
    .from("quotes")
    .select("id,business_id,service,category_type,country,city,district,date_range,valid_until,people,message,status,created_at,businesses(name)")
    .eq("requester_id", userId)
    .order("created_at", { ascending: false })
    .limit(100);

  type Request = {
    id: number;
    business_id: number | null;
    service: string | null;
    category_type: string | null;
    country: string | null;
    city: string | null;
    district: string | null;
    date_range: string | null;
    valid_until: string | null;
    people: number | null;
    message: string | null;
    status: string;
    created_at: string;
    businesses: { name: string } | { name: string }[] | null;
  };
  const requests = (data ?? []) as unknown as Request[];
  const businessName = (value: Request["businesses"]) =>
    (Array.isArray(value) ? value[0]?.name : value?.name) ?? t("buyerRequestGeneral");
  const fmt = (value: string) => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(value));

  return (
    <>
      <DashboardTopbar title={t("requestsMineNav")} />
      <div className={styles.content}>
        <PartnerPanelCard bodyClassName="p-5">
          <div className="flex items-center justify-between gap-3 border-b border-line/70 pb-4">
            <div>
              <h2 className="text-[17px] font-semibold text-ink">{t("buyerRequestsTitle")}</h2>
              <p className="mt-1 text-[13px] leading-5 text-muted">{t("buyerRequestsSub")}</p>
            </div>
            <span className="rounded-pill bg-[#EAF2FF] px-2.5 py-1 text-[12px] font-semibold text-[#1557C2]">{requests.length}</span>
          </div>
          {requests.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-[13px] text-muted">{t("buyerRequestsEmpty")}</p>
              <Link href="/explore" className={`${styles.compactPrimaryButton} mt-4 inline-flex`}>{t("buyerExploreCta")}</Link>
            </div>
          ) : (
            <ul className="divide-y divide-line/70">
              {requests.map((request) => (
                <li key={request.id} className="py-4 first:pb-4 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-[14px] font-bold text-ink">{businessName(request.businesses)}</h3>
                      <p className="mt-1 text-[12.5px] text-muted">
                        {[request.service ?? request.category_type, [request.city, request.district].filter(Boolean).join(" / "), request.date_range, request.people ? `${request.people} ${tq("people")}` : null].filter(Boolean).join(" · ") || t("buyerRequestGeneral")}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11.5px] font-medium text-muted">{fmt(request.created_at)}</span>
                  </div>
                  {request.valid_until && <p className="mt-2 text-[12px] font-semibold text-terra-deep">{t("quoteValidUntil")}: {new Date(`${request.valid_until}T12:00:00`).toLocaleDateString(locale)}</p>}
                  {request.message && <p className="mt-2 whitespace-pre-line rounded-[8px] bg-[#F5F8FD] px-3 py-2 text-[12.5px] leading-5 text-ink/80">{request.message}</p>}
                </li>
              ))}
            </ul>
          )}
        </PartnerPanelCard>
      </div>
    </>
  );
}
