import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowUpRight, CalendarRange, Eye, MapPin, Phone, Tag, Users } from "lucide-react";
import { Link, redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { businessImageUrl } from "@/lib/business-images";
import { getPanelSession, getPanelBusiness } from "@/lib/panel-auth";
import { CATEGORY_GROUPS, serviceTranslationKey } from "@/lib/categories";
import type { GroupKey } from "@/lib/types";
import { closeMyB2bDeal } from "@/lib/actions/deals";
import DashboardTopbar from "../../Topbar";
import styles from "../../styles";
import { PartnerPanelCard, PartnerPanelEmptyState } from "../../_ui";
import DealsLoading from "../loading";

/* Kendi fırsat ilanlarım — panoda yer kaplamasın diye ayrı sayfada.
   Kimlik açık olduğu için ilgilenen firmanın adı/telefonu doğrudan görünür. */

const one = <T,>(value: T | T[] | null | undefined): T | null =>
  (Array.isArray(value) ? value[0] ?? null : value ?? null);

type InterestBusiness = { id: number; name: string; city: string | null; phone: string | null };

type Deal = {
  id: number;
  title: string;
  description: string | null;
  group_key: GroupKey | null;
  types: string[];
  country: string | null;
  city: string | null;
  district: string | null;
  price: string | null;
  capacity: number | null;
  valid_until: string | null;
  status: string;
  view_count: number;
  created_at: string;
};

export default async function MyDealsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<DealsLoading />}>
      <MyDealsContent locale={locale} />
    </Suspense>
  );
}

async function MyDealsContent({ locale }: { locale: string }) {
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
  const biz = await getPanelBusiness();

  if (!biz) {
    return (
      <>
        <DashboardTopbar title={t("dealsMineNav")} />
        <div className={styles.content}>
          <PartnerPanelEmptyState
            title={t("profileRequiredTitle")}
            description={t("dealsProfileRequired")}
            action={<Link href="/dashboard/businesses" className={styles.compactPrimaryButton}>{t("goToListings")}</Link>}
          />
        </div>
      </>
    );
  }

  const supabase = await createClient();
  // Kapak görseli PanelBusinessLite'ta yok; satır rozetleri için ayrıca okunur.
  const { data: bizRow } = await supabase.from("businesses").select("image").eq("id", biz.id).maybeSingle();
  const bizImage = (bizRow as { image: string | null } | null)?.image ?? null;

  const { data: myDealsRaw } = await supabase
    .from("b2b_deals")
    .select("id,title,description,group_key,types,country,city,district,price,capacity,valid_until,status,view_count,created_at")
    .eq("business_id", biz.id)
    .order("created_at", { ascending: false });

  const myDeals = (myDealsRaw ?? []) as Deal[];
  const ids = myDeals.map((d) => d.id);
  const { data: interestsRaw } = ids.length
    ? await supabase
        .from("b2b_deal_interests")
        .select("id,deal_id,message,created_at,businesses(id,name,city,phone)")
        .in("deal_id", ids)
        .order("created_at", { ascending: false })
    : { data: [] as unknown[] };

  type Interest = { id: number; deal_id: number; message: string | null; created_at: string; businesses: InterestBusiness | InterestBusiness[] | null };
  const interestsByDeal = new Map<number, Interest[]>();
  for (const i of (interestsRaw ?? []) as Interest[]) {
    (interestsByDeal.get(i.deal_id) ?? interestsByDeal.set(i.deal_id, []).get(i.deal_id)!).push(i);
  }

  return (
    <>
      <DashboardTopbar title={t("dealsMineNav")} />
      <div className={styles.content}>
        <Link href="/dashboard/firsatlar" className={`${styles.compactSecondaryButton} mb-4 inline-flex w-fit`}>
          <ArrowLeft size={15} className="rtl:rotate-180" aria-hidden />
          {t("dealsBackToBoard")}
        </Link>

        {myDeals.length === 0 ? (
          <PartnerPanelCard bodyClassName="p-5">
            <p className="text-[13px] text-muted">{t("dealsMineEmpty")}</p>
          </PartnerPanelCard>
        ) : (
          <ul className="grid gap-4">
            {myDeals.map((d) => {
              const interests = interestsByDeal.get(d.id) ?? [];
              return (
                <li key={d.id}>
                  <PartnerPanelCard bodyClassName="p-5">
                    {/* Panodaki satırla aynı düzen: üstte işletme, altında başlık. */}
                    <div className="flex items-center gap-2.5">
                      {/* İşletmenin kapak görseli; yoksa baş harf rozetine düşer. */}
                      <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-[10px] bg-[#EEF3FF] text-[14px] font-bold uppercase text-[#1557C2]">
                        {businessImageUrl(bizImage) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={businessImageUrl(bizImage) ?? ""} alt="" className="h-full w-full object-cover" />
                        ) : (
                          biz.name.trim().charAt(0)
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="truncate text-[13px] font-bold text-ink/85">{biz.name}</span>
                          {d.status !== "published" && (
                            <span className="rounded-pill bg-[#F1F4F9] px-2 py-0.5 text-[10.5px] font-bold text-muted">{t("dealsArchived")}</span>
                          )}
                        </p>
                        <p className="mt-0.5 truncate text-[11.5px] font-medium text-muted">
                          {[biz.city, biz.country].filter(Boolean).join(" / ") || "—"} · {fmt(d.created_at)}
                        </p>
                      </div>
                      {d.price && (
                        <span className="ms-auto shrink-0 rounded-[9px] border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[13px] font-bold text-emerald-700">{d.price}</span>
                      )}
                    </div>

                    <Link
                      href={{ pathname: "/dashboard/firsatlar/[id]", params: { id: String(d.id) } }}
                      className="mt-3 block text-[17px] font-bold leading-6 text-ink transition-colors hover:text-[#1557C2]"
                    >
                      {d.title}
                    </Link>

                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {groupLabel(d.group_key) && (
                        <span className="rounded-pill bg-terra/10 px-2 py-0.5 text-[10.5px] font-bold text-terra-deep">{groupLabel(d.group_key)}</span>
                      )}
                      {(d.types ?? []).map((type) => {
                        const key = serviceTranslationKey(type);
                        return <span key={type} className="rounded-pill bg-sapphire/10 px-2 py-0.5 text-[10.5px] font-bold text-sapphire-deep">{key ? ts(key) : type}</span>;
                      })}
                    </div>

                    <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-medium text-muted">
                      <span className="inline-flex items-center gap-1"><MapPin size={11} aria-hidden /> {[d.city, d.district].filter(Boolean).join(" / ") || d.country || "—"}</span>
                      {d.capacity && <span className="inline-flex items-center gap-1"><Users size={11} aria-hidden /> {d.capacity} {t("dealsCapacityUnit")}</span>}
                      {d.valid_until && <span className="inline-flex items-center gap-1"><CalendarRange size={11} aria-hidden /> {fmtDate(d.valid_until)}</span>}
                      <span className="inline-flex items-center gap-1"><Eye size={11} aria-hidden /> {d.view_count}</span>
                    </p>

                    {d.description && <p className="mt-2.5 whitespace-pre-line text-[13px] leading-6 text-ink/80 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">{d.description}</p>}

                    {/* Aksiyonlar panodaki satırla aynı hizada: sağda tek grup. */}
                    <div className="mt-3 flex flex-wrap items-center justify-end gap-2 border-t border-line/70 pt-3">
                      {d.status === "published" && (
                        <form action={closeMyB2bDeal}>
                          <input type="hidden" name="id" value={d.id} />
                          <button type="submit" className="inline-flex items-center gap-1 rounded-[9px] px-3 py-2 text-[12.5px] font-medium text-muted transition-colors hover:bg-cream/60 hover:text-ink">
                            <Tag size={12} aria-hidden />
                            {t("dealsUnpublish")}
                          </button>
                        </form>
                      )}
                      <Link
                        href={{ pathname: "/dashboard/firsatlar/[id]", params: { id: String(d.id) } }}
                        className="inline-flex shrink-0 items-center gap-1 rounded-[9px] border border-[#BFD2F2] px-3 py-2 text-[12.5px] font-semibold text-[#1557C2] transition-colors hover:bg-[#EAF2FF]"
                      >
                        {t("dealsDetail")} <ArrowUpRight size={13} aria-hidden />
                      </Link>
                    </div>

                    <div className="mt-3 border-t border-line/70 pt-3">
                      <p className="inline-flex items-center gap-1 text-[11.5px] font-bold uppercase tracking-[.06em] text-terra-deep">
                        <Users size={12} aria-hidden /> {t("dealsInterests", { count: interests.length })}
                      </p>
                      {interests.length === 0 ? (
                        <p className="mt-1 text-[12.5px] text-muted">{t("dealsInterestsEmpty")}</p>
                      ) : (
                        <ul className="mt-1.5 grid gap-1.5 min-[1100px]:grid-cols-2">
                          {interests.slice(0, 3).map((i) => {
                            const from = one(i.businesses);
                            return (
                              <li key={i.id} className="rounded-[9px] bg-[#F7FAFF] px-3 py-2 text-[12.5px]">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-bold text-ink">{from?.name ?? "—"}</span>
                                  {from?.city && <span className="text-[11.5px] text-muted">{from.city}</span>}
                                  {from?.phone && (
                                    <a href={`tel:${from.phone}`} className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#1557C2] hover:underline">
                                      <Phone size={11} aria-hidden /> {from.phone}
                                    </a>
                                  )}
                                  <span className="ms-auto text-[11px] text-muted">{fmt(i.created_at)}</span>
                                </div>
                                {i.message && <p className="mt-0.5 line-clamp-2 text-muted">{i.message}</p>}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                      {interests.length > 3 && (
                        <Link
                          href={{ pathname: "/dashboard/firsatlar/[id]", params: { id: String(d.id) } }}
                          className="mt-1.5 inline-block text-[12px] font-semibold text-[#1557C2] hover:underline"
                        >
                          {t("dealsInterestsAll", { count: interests.length })}
                        </Link>
                      )}
                    </div>
                  </PartnerPanelCard>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
