import { getTranslations, setRequestLocale } from "next-intl/server";
import { Heart } from "lucide-react";
import { Link, redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPanelSession } from "@/lib/panel-auth";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { businessSlug } from "@/lib/business-slug";
import { removeFavorite } from "@/lib/actions/favorites";
import DashboardTopbar from "../Topbar";
import styles from "../styles";
import { PartnerPanelCard, PartnerPanelEmptyState } from "../_ui";

type FavBiz = { id: number; name: string; group: string; city: string | null; country: string | null };

export default async function FavoritesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tc] = await Promise.all([getTranslations("panel"), getTranslations("cat")]);
  const groupLabel = (g: string | null) => {
    const group = CATEGORY_GROUPS.find((c) => c.key === g);
    return group ? tc(group.key) : "—";
  };

  const session = await getPanelSession();
  if (!session) return redirect({ href: "/login", locale });

  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("favorites")
    .select("business_id,created_at,businesses(id,name,group,city,country)")
    .eq("user_id", session!.userId)
    .order("created_at", { ascending: false });

  type Row = { business_id: number; businesses: FavBiz | FavBiz[] | null };
  const favs = ((rows ?? []) as unknown as Row[])
    .map((r) => (Array.isArray(r.businesses) ? r.businesses[0] : r.businesses))
    .filter((b): b is FavBiz => !!b);

  return (
    <>
      <DashboardTopbar title={t("favoritesNav")} />
      <div className={styles.content}>
      {favs.length === 0 ? (
        <PartnerPanelEmptyState
          icon={<Heart size={22} aria-hidden />}
          title={t("favoritesEmptyTitle")}
          description={t("favoritesEmptyDescription")}
        />
      ) : (
        <ul className="grid grid-cols-2 gap-3.5 max-[720px]:grid-cols-1">
          {favs.map((b) => (
            <PartnerPanelCard as="li" key={b.id} bodyClassName="flex items-start justify-between gap-3 p-4">
              <Link href={{ pathname: "/supplier/[id]", params: { id: businessSlug(b) } }} className="min-w-0 flex-1">
                <span className="rounded-full bg-cream px-2 py-0.5 text-[10.5px] font-medium text-brand">{groupLabel(b.group)}</span>
                <p className="mt-1.5 truncate text-[15px] font-medium text-ink">{b.name}</p>
                <p className="mt-0.5 text-[12.5px] font-medium text-muted">{[b.city, b.country].filter(Boolean).join(" · ") || "—"}</p>
              </Link>
              <form action={removeFavorite}>
                <input type="hidden" name="business_id" value={b.id} />
                <button type="submit" aria-label={t("favoritesRemove")} className="shrink-0 rounded-[8px] border border-line p-1.5 text-brand transition-colors hover:bg-cream">
                  <Heart size={16} className="fill-current" aria-hidden />
                </button>
              </form>
            </PartnerPanelCard>
          ))}
        </ul>
      )}
      </div>
    </>
  );
}
