import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Tag, ArrowUpRight, CalendarRange, Check, Eye, MapPin, Users } from "lucide-react";
import { Link, redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { businessImageUrl } from "@/lib/business-images";
import { getPanelSession, getPanelBusiness } from "@/lib/panel-auth";
import { CATEGORY_GROUPS, serviceTranslationKey } from "@/lib/categories";
import type { GroupKey } from "@/lib/types";
import { DateRangePicker } from "@/components/FormDatePickers";
import DashboardTopbar from "../Topbar";
import styles from "../styles";
import { PartnerPanelCard, PartnerPanelEmptyState, PartnerPanelField, PartnerPanelTextarea } from "../_ui";
import RequestRegionFields from "../requests/RequestRegionFields";
import RequestCategoryFields from "../requests/RequestCategoryFields";
import DealsLoading from "./loading";
import NewDealDialog from "./NewDealDialog";
import DealViewTracker from "./DealViewTracker";

/* Fırsat ilanları panosu — talep panosunun aynası. Talep = "müşterim var,
   tedarikçi arıyorum"; fırsat ilanı = "kontenjanım/tarifem var, müşteri
   arıyorum". Kimlik AÇIKTIR: amaç görünmek. Sayfa yalnız üyelere açıktır.
   Kendi ilanlarım ayrı sayfada (./ilanlarim), ilan detayı ./[id]. */

const one = <T,>(value: T | T[] | null | undefined): T | null =>
  (Array.isArray(value) ? value[0] ?? null : value ?? null);

type DealBusiness = { id: number; name: string; city: string | null; country: string | null; phone: string | null; verified: boolean; image: string | null };

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
  view_count: number;
  created_at: string;
  businesses: DealBusiness | DealBusiness[] | null;
};

export default async function DealsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<DealsLoading />}>
      <DealsContent locale={locale} />
    </Suspense>
  );
}

async function DealsContent({ locale }: { locale: string }) {
  const [t, tq, tc, ts] = await Promise.all([
    getTranslations("panel"),
    getTranslations("quote"),
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
        <DashboardTopbar title={t("dealsNav")} />
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
  const [{ data: openDealsRaw }, { data: myInterestsRaw }, { count: myDealCount }] = await Promise.all([
    supabase
      .from("b2b_deals")
      .select("id,title,description,group_key,types,country,city,district,price,capacity,valid_until,view_count,created_at,businesses(id,name,city,country,phone,verified,image)")
      .eq("status", "published")
      .neq("business_id", biz.id)
      .order("created_at", { ascending: false })
      .limit(80),
    supabase.from("b2b_deal_interests").select("deal_id").eq("business_id", biz.id),
    supabase.from("b2b_deals").select("id", { count: "exact", head: true }).eq("business_id", biz.id),
  ]);

  const openDeals = (openDealsRaw ?? []) as unknown as Deal[];
  const interested = new Set(((myInterestsRaw ?? []) as { deal_id: number }[]).map((i) => i.deal_id));

  return (
    <>
      <DashboardTopbar title={t("dealsNav")} />
      <div className={styles.content}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-[620px] text-[12.5px] leading-5 text-muted">{t("dealsBoardHint")}</p>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/dashboard/firsatlar/ilanlarim" className={styles.compactSecondaryButton}>
              <Tag size={15} aria-hidden />
              {t("dealsMine", { count: myDealCount ?? 0 })}
            </Link>
            <NewDealDialog>
              <label className={styles.labelCls}>
                {t("dealsTitleLabel")}
                <PartnerPanelField name="title" required maxLength={160} placeholder={t("dealsTitlePlaceholder")} />
              </label>
              <RequestCategoryFields />
              <RequestRegionFields defaultCountry={biz.country ?? "Türkiye"} defaultCity={biz.city ?? ""} defaultDistrict={biz.district ?? ""} />
              <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(140px,.7fr)_minmax(110px,.55fr)] gap-2.5 max-[640px]:grid-cols-1">
                <DateRangePicker
                  label={t("dealsValidRange")}
                  startLabel={tq("dateStart")}
                  endLabel={tq("dateEnd")}
                  clearLabel={tq("dateClear")}
                  doneLabel={tq("dateDone")}
                />
                <label className={styles.labelCls}>
                  {t("dealsPriceLabel")}
                  <PartnerPanelField name="price" maxLength={160} placeholder={t("dealsPricePlaceholder")} />
                </label>
                <label className={styles.labelCls}>
                  {t("dealsCapacityLabel")}
                  <PartnerPanelField name="capacity" type="number" min={1} placeholder="0" />
                </label>
              </div>
              <label className={styles.labelCls}>
                {tq("message")}
                <PartnerPanelTextarea name="description" rows={4} maxLength={2000} placeholder={t("dealsDetailsPlaceholder")} />
              </label>
            </NewDealDialog>
          </div>
        </div>

        {openDeals.length === 0 ? (
          <PartnerPanelCard bodyClassName="p-5">
            <p className="text-[13px] text-muted">{t("dealsBoardEmpty")}</p>
          </PartnerPanelCard>
        ) : (
          <ul className="grid gap-4">
            {openDeals.map((d) => {
              const owner = one(d.businesses);
              return (
                <li key={d.id}>
                  {/* Her satır TEK ilan, tam genişlik: işletme → başlık → rozetler →
                      künye → açıklama → ayak (detay + ilgi), alt alta. */}
                  <PartnerPanelCard bodyClassName="p-5">
                    <DealViewTracker id={d.id} />
                    {/* Üstte yayınlayan işletme (baş harf rozetiyle), altında ilan
                        başlığı. Telefon burada YOK: iletişim detay sayfasından. */}
                    <div className="flex items-center gap-2.5">
                      {/* İşletmenin kapak görseli; yoksa baş harf rozetine düşer. */}
                      <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-[10px] bg-[#EEF3FF] text-[14px] font-bold uppercase text-[#1557C2]">
                        {businessImageUrl(owner?.image) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={businessImageUrl(owner?.image) ?? ""} alt="" className="h-full w-full object-cover" />
                        ) : (
                          (owner?.name ?? "?").trim().charAt(0)
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="truncate text-[13px] font-bold text-ink/85">{owner?.name ?? "—"}</span>
                          {owner?.verified && (
                            <span className="rounded-pill bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">{t("dealsVerified")}</span>
                          )}
                        </p>
                        <p className="mt-0.5 truncate text-[11.5px] font-medium text-muted">
                          {[owner?.city, owner?.country].filter(Boolean).join(" / ") || "—"} · {fmt(d.created_at)}
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

                    {d.description && (
                      <p className="mt-2.5 whitespace-pre-line text-[13px] leading-6 text-ink/80 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">{d.description}</p>
                    )}

                    {/* Tek aksiyon: satır detaya götürür. İlgi bildirimi orada,
                        not alanıyla birlikte verilir — listede iki buton yarışmasın. */}
                    <div className="mt-3 flex flex-wrap items-center justify-end gap-3 border-t border-line/70 pt-3">
                      {interested.has(d.id) && (
                        <p className="me-auto inline-flex items-center gap-1.5 text-[12.5px] font-bold text-emerald-700">
                          <Check size={14} aria-hidden /> {t("dealsInterestSent")}
                        </p>
                      )}
                      <Link
                        href={{ pathname: "/dashboard/firsatlar/[id]", params: { id: String(d.id) } }}
                        className={`${styles.compactPrimaryButton} h-9`}
                      >
                        {t("dealsDetail")} <ArrowUpRight size={14} aria-hidden />
                      </Link>
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
