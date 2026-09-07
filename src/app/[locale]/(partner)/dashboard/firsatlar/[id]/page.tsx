import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, CalendarRange, Check, Eye, Globe, MapPin, Phone, Tag, Users } from "lucide-react";
import { Link, redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { businessImageUrl } from "@/lib/business-images";
import { getPanelSession, getPanelBusiness } from "@/lib/panel-auth";
import { CATEGORY_GROUPS, serviceTranslationKey } from "@/lib/categories";
import type { GroupKey } from "@/lib/types";
import { closeMyB2bDeal, expressDealInterest } from "@/lib/actions/deals";
import DashboardTopbar from "../../Topbar";
import styles from "../../styles";
import { PartnerPanelButton, PartnerPanelCard, PartnerPanelTextarea } from "../../_ui";
import DealsLoading from "../loading";
import DealViewTracker from "../DealViewTracker";

/* Tek fırsat ilanının detayı. Sahibiyse gelen ilgiler burada listelenir;
   başkasının ilanıysa iletişim + "İlgileniyorum" formu gösterilir. */

const one = <T,>(value: T | T[] | null | undefined): T | null =>
  (Array.isArray(value) ? value[0] ?? null : value ?? null);

type DealBusiness = { id: number; name: string; city: string | null; country: string | null; district: string | null; phone: string | null; website: string | null; verified: boolean; image: string | null };
type InterestBusiness = { id: number; name: string; city: string | null; phone: string | null };

type Deal = {
  id: number;
  business_id: number;
  title: string;
  description: string | null;
  group_key: GroupKey | null;
  types: string[];
  country: string | null;
  city: string | null;
  district: string | null;
  price: string | null;
  capacity: number | null;
  valid_from: string | null;
  valid_until: string | null;
  status: string;
  view_count: number;
  created_at: string;
  businesses: DealBusiness | DealBusiness[] | null;
};

export default async function DealDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<DealsLoading />}>
      <DealDetailContent locale={locale} id={Number(id)} />
    </Suspense>
  );
}

async function DealDetailContent({ locale, id }: { locale: string; id: number }) {
  const [t, tc, ts] = await Promise.all([
    getTranslations("panel"),
    getTranslations("cat"),
    getTranslations("service"),
  ]);
  const fmt = (v: string) => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(v));
  const fmtDate = (v: string) => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(`${v}T12:00:00`));
  const groupLabel = (g: string | null) => {
    const group = CATEGORY_GROUPS.find((c) => c.key === g);
    return group ? tc(group.key) : null;
  };

  const session = await getPanelSession();
  if (!session) return redirect({ href: "/login", locale });
  if (!Number.isInteger(id)) notFound();
  const biz = await getPanelBusiness();

  const supabase = await createClient();
  const { data } = await supabase
    .from("b2b_deals")
    .select("id,business_id,title,description,group_key,types,country,city,district,price,capacity,valid_from,valid_until,status,view_count,created_at,businesses(id,name,city,country,district,phone,website,verified,image)")
    .eq("id", id)
    .maybeSingle();

  const deal = (data ?? null) as unknown as Deal | null;
  if (!deal) notFound();

  const isMine = !!biz && deal.business_id === biz.id;
  const owner = one(deal.businesses);

  const [{ data: interestsRaw }, { data: myInterestRaw }] = await Promise.all([
    isMine
      ? supabase
          .from("b2b_deal_interests")
          .select("id,message,created_at,businesses(id,name,city,phone)")
          .eq("deal_id", deal.id)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] as unknown[] }),
    biz && !isMine
      ? supabase.from("b2b_deal_interests").select("id").eq("deal_id", deal.id).eq("business_id", biz.id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  type Interest = { id: number; message: string | null; created_at: string; businesses: InterestBusiness | InterestBusiness[] | null };
  const interests = (interestsRaw ?? []) as unknown as Interest[];
  const alreadyInterested = !!myInterestRaw;
  const validity = [deal.valid_from, deal.valid_until].filter(Boolean).map((d) => fmtDate(d!)).join(" – ");

  return (
    <>
      <DashboardTopbar title={t("dealsNav")} />
      <div className={styles.content}>
        {!isMine && <DealViewTracker id={deal.id} />}
        <Link
          href={isMine ? "/dashboard/firsatlar/ilanlarim" : "/dashboard/firsatlar"}
          className={`${styles.compactSecondaryButton} mb-4 inline-flex w-fit`}
        >
          <ArrowLeft size={15} className="rtl:rotate-180" aria-hidden />
          {isMine ? t("dealsMineNav") : t("dealsBackToBoard")}
        </Link>

        {/* TEK kart: kimlik → başlık → koşullar → açıklama → iletişim → teklif
            alanı. Liste satırıyla aynı kimlik bloğu, sağ sütun yok. */}
        <PartnerPanelCard bodyClassName="p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-[11px] bg-[#EEF3FF] text-[15px] font-bold uppercase text-[#1557C2]">
              {businessImageUrl(owner?.image) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={businessImageUrl(owner?.image) ?? ""} alt="" className="h-full w-full object-cover" />
              ) : (
                (owner?.name ?? "?").trim().charAt(0)
              )}
            </span>
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-[15px] font-bold text-ink">{owner?.name ?? "—"}</span>
                {owner?.verified && (
                  <span className="rounded-pill bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">{t("dealsVerified")}</span>
                )}
                {isMine && <span className="rounded-pill bg-[#EAF2FF] px-2 py-0.5 text-[10.5px] font-bold text-[#1557C2]">{t("dealsMineBadge")}</span>}
                {deal.status !== "published" && <span className="rounded-pill bg-[#F1F4F9] px-2 py-0.5 text-[10.5px] font-bold text-muted">{t("dealsArchived")}</span>}
              </p>
              <p className="mt-0.5 text-[12px] font-medium text-muted">
                {[owner?.district, owner?.city, owner?.country].filter(Boolean).join(" / ") || "—"} · {fmt(deal.created_at)}
              </p>
            </div>
            <div className="ms-auto flex flex-wrap items-center gap-x-4 gap-y-1">
              {owner?.phone && (
                <a href={`tel:${owner.phone}`} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#1557C2] hover:underline">
                  <Phone size={13} aria-hidden /> {owner.phone}
                </a>
              )}
              {owner?.website && (
                <a
                  href={owner.website.startsWith("http") ? owner.website : `https://${owner.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 break-all text-[13px] font-medium text-[#1557C2] hover:underline"
                >
                  <Globe size={13} aria-hidden /> {owner.website}
                </a>
              )}
            </div>
          </div>

          <h1 className="mt-4 text-[22px] font-bold leading-tight text-ink">{deal.title}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {groupLabel(deal.group_key) && (
              <span className="rounded-pill bg-terra/10 px-2 py-0.5 text-[10.5px] font-bold text-terra-deep">{groupLabel(deal.group_key)}</span>
            )}
            {(deal.types ?? []).map((type) => {
              const key = serviceTranslationKey(type);
              return <span key={type} className="rounded-pill bg-sapphire/10 px-2 py-0.5 text-[10.5px] font-bold text-sapphire-deep">{key ? ts(key) : type}</span>;
            })}
          </div>

          <p className="mt-2 inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] font-medium text-muted">
            <span className="inline-flex items-center gap-1"><MapPin size={12} aria-hidden /> {[deal.country, deal.city, deal.district].filter(Boolean).join(" / ") || "—"}</span>
            <span className="inline-flex items-center gap-1"><Eye size={12} aria-hidden /> {deal.view_count}</span>
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2.5 max-[640px]:grid-cols-1">
            <TermBox label={t("dealsPriceLabel")} value={deal.price ?? "—"} />
            <TermBox label={t("dealsCapacityLabel")} value={deal.capacity ? `${deal.capacity} ${t("dealsCapacityUnit")}` : "—"} />
            <TermBox label={t("dealsValidRange")} value={validity || "—"} icon={<CalendarRange size={12} aria-hidden />} />
          </div>

          <div className="mt-4 rounded-[10px] border border-line bg-[#F7FAFF] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[.07em] text-muted">{t("dealsDetailsTitle")}</p>
            <p className="mt-2 whitespace-pre-line text-[13.5px] leading-6 text-ink/85">
              {deal.description || t("dealsNoDescription")}
            </p>
          </div>

          {isMine ? (
            <>
              <div className="mt-5 border-t border-line/70 pt-4">
                <p className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[.06em] text-terra-deep">
                  <Users size={13} aria-hidden /> {t("dealsInterests", { count: interests.length })}
                </p>
                {interests.length === 0 ? (
                  <p className="mt-1.5 text-[13px] text-muted">{t("dealsInterestsEmpty")}</p>
                ) : (
                  <ul className="mt-2 grid gap-2">
                    {interests.map((i) => {
                      const from = one(i.businesses);
                      return (
                        <li key={i.id} className={styles.softPanel}>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[13.5px] font-bold text-ink">{from?.name ?? "—"}</span>
                            {from?.city && <span className="text-[11.5px] text-muted">{from.city}</span>}
                            {from?.phone && (
                              <a href={`tel:${from.phone}`} className="inline-flex items-center gap-1 text-[12px] font-medium text-[#1557C2] hover:underline">
                                <Phone size={12} aria-hidden /> {from.phone}
                              </a>
                            )}
                            <span className="ms-auto text-[11.5px] text-muted">{fmt(i.created_at)}</span>
                          </div>
                          {i.message && <p className="mt-1 whitespace-pre-line text-[12.5px] leading-5 text-ink/80">{i.message}</p>}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {deal.status === "published" && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line/70 pt-4">
                  <p className="max-w-[520px] text-[12.5px] leading-5 text-muted">{t("dealsUnpublishHint")}</p>
                  <form action={closeMyB2bDeal}>
                    <input type="hidden" name="id" value={deal.id} />
                    <button type="submit" className="inline-flex items-center gap-1.5 rounded-[9px] border border-[#BFD2F2] px-3 py-2 text-[12.5px] font-medium text-[#1557C2] transition-colors hover:bg-[#EAF2FF]">
                      <Tag size={12} aria-hidden />
                      {t("dealsUnpublish")}
                    </button>
                  </form>
                </div>
              )}
            </>
          ) : (
            <div className="mt-5 border-t border-line/70 pt-4">
              {alreadyInterested ? (
                <p className="inline-flex items-center gap-1.5 text-[13px] font-bold text-emerald-700">
                  <Check size={15} aria-hidden /> {t("dealsInterestSent")}
                </p>
              ) : (
                <form action={expressDealInterest} className="grid gap-2">
                  <p className="text-[12.5px] leading-5 text-muted">{t("dealsInterestHint")}</p>
                  <input type="hidden" name="deal_id" value={deal.id} />
                  {/* Not alanı tek satırlık input değil, 3 satırlık metin kutusu:
                      "kaç kişi, hangi tarih" gibi birkaç cümle sığsın. */}
                  <PartnerPanelTextarea
                    name="message"
                    rows={3}
                    maxLength={1000}
                    placeholder={t("dealsInterestPlaceholder")}
                    className="w-full min-w-0 resize-y"
                  />
                  <PartnerPanelButton type="submit" className="h-[42px] w-fit px-4">{t("dealsInterestCta")}</PartnerPanelButton>
                </form>
              )}
            </div>
          )}
        </PartnerPanelCard>
      </div>
    </>
  );
}

function TermBox({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-[10px] border border-line bg-paper px-3.5 py-2.5">
      <p className="inline-flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-[.06em] text-muted">{icon}{label}</p>
      <p className="mt-0.5 text-[13px] font-semibold text-ink/85">{value}</p>
    </div>
  );
}
