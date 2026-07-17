/* Keşfet sayfası yalnızca oturum bilgisini okur. Salt-okunur istemci, Next 16
   dev modunda Server Action sonrası cookies() invariant hatasını önler. */
import { createReadOnlyClient as createClient } from "@/lib/supabase/read-only-server";
import { getBusinesses, toListingBusiness } from "@/lib/businesses";
import { filterAndSortBusinesses, facetCounts } from "@/lib/listing";
import { canAppearInExplore, type ViewerKind } from "@/lib/business-visibility";
import type { Business, ListingFilters } from "@/lib/types";
import type { ExploreInitialFilters } from "@/lib/explore-filters";
import { EXPLORE_PAGE_SIZE } from "@/lib/explore-filters";

/* Keşfet arama MOTORU — SUNUCU tarafı.
   Amaç: filtre/sıralama/sayfalama/facet-sayımı client yerine burada çalışsın; istemciye
   yalnız GEREKLİ veri insin. Ağır iş `lib/listing.ts`'teki saf fonksiyonlarla yapılır
   (davranış birebir korunur), ama compute sunucuda olur.

   İstemciye dönenler:
   - items      : yalnızca aktif sayfa (kartlar için tam nesne)
   - total/page : sayaç + sayfa bilgisi (sayfalama sunucuda)
   - facets     : grup/tür facet sayaçları (filtreye duyarlı, sunucuda hesaplı)
   - mapItems   : TÜM filtrelenmiş sonuç ama HAFİF (harita pinleri için)
   - index      : TÜM görünür set ama HAFİF (arama önerisi + il/ilçe seçicileri için)
   Böylece ağır alanlar (desc/attributes/seo/images) yalnız aktif sayfada taşınır. */

const hasEnv = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type ExploreMapItem = { id: number; name: string; group: Business["group"]; coords: [number, number] };
export type ExploreIndexItem = {
  id: number;
  name: string;
  city: string;
  district: string;
  country: string;
  group: Business["group"];
  type: string;
};

export type ExploreResults = {
  isGuest: boolean;
  total: number;
  fullTotal: number;
  page: number;
  pageCount: number;
  items: Business[];
  lockedPreviewItems: Business[];
  mapItems: ExploreMapItem[];
  facets: { group: Record<string, number>; type: Record<string, number> };
  index: ExploreIndexItem[];
};

function toListingFilters(f: ExploreInitialFilters): ListingFilters {
  return {
    groups: new Set(f.groups),
    types: new Set(f.types),
    country: f.country,
    city: f.city,
    district: f.district,
    minRating: f.minRating,
    attrs: new Set(f.attrs),
  };
}

export async function getIsGuest(): Promise<boolean> {
  if (!hasEnv()) return false;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !user;
}

export async function getExploreViewerKind(): Promise<ViewerKind> {
  if (!hasEnv()) return "authenticated";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "guest";

  const { data: profile } = await supabase
    .from("profiles")
    .select("role,account_type")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role === "admin") return "admin";
  if (profile?.account_type === "buyer") return "buyer";
  if (profile?.account_type === "supplier") return "supplier";
  return "authenticated";
}

export async function getExploreResults(
  filters: ExploreInitialFilters,
  page: number,
  viewerArg?: ViewerKind | boolean,
): Promise<ExploreResults> {
  // Viewer çağıran taraftan gelebilir (tek kez hesaplansın, öneri sorgusuyla paralel çalışsın).
  const viewerPromise =
    typeof viewerArg === "string"
      ? Promise.resolve(viewerArg)
      : typeof viewerArg === "boolean"
        ? Promise.resolve<ViewerKind>(viewerArg ? "guest" : "authenticated")
        : getExploreViewerKind();
  const [all, viewer] = await Promise.all([
    getBusinesses(),
    viewerPromise,
  ]);
  const isGuest = viewer === "guest";

  // Misafir → yalnız dopingli/premium (müşteri kuralı); iletişim alanları da çıkarılır.
  const visible = all.filter((business) => canAppearInExplore(business, viewer)).map(toListingBusiness);

  // Kelime araması ülke seçimi olmadan çalışmaz. UI zaten kullanıcıyı ülke
  // seçimine yönlendiriyor; burada da sonucu kapatıyoruz ki URL/API seviyesinde
  // ülkesiz toplu arama verisi dönmesin.
  const requiresCountry = filters.q.trim() !== "" && filters.country === "all";
  const index: ExploreIndexItem[] = visible.map((b) => ({
    id: b.id,
    name: b.name,
    city: b.city,
    district: b.district,
    country: b.country,
    group: b.group,
    type: b.type,
  }));

  if (requiresCountry) {
    return {
      isGuest,
      total: 0,
      fullTotal: 0,
      page: 1,
      pageCount: 1,
      items: [],
      lockedPreviewItems: [],
      mapItems: [],
      facets: { group: {}, type: {} },
      index,
    };
  }

  const lf = toListingFilters(filters);
  const fullFiltered = filterAndSortBusinesses(all.map(toListingBusiness), lf, filters.q, filters.sort);
  const fullTotal = fullFiltered.length;
  const filtered = filterAndSortBusinesses(visible, lf, filters.q, filters.sort);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / EXPLORE_PAGE_SIZE));
  const safe = Math.min(Math.max(1, page), pageCount);
  const items = filtered.slice((safe - 1) * EXPLORE_PAGE_SIZE, safe * EXPLORE_PAGE_SIZE);

  const facets = {
    group: facetCounts(visible, lf, filters.q, "group"),
    type: facetCounts(visible, lf, filters.q, "type"),
  };

  const mapItems: ExploreMapItem[] = filtered.map((b) => ({
    id: b.id,
    name: b.name,
    group: b.group,
    coords: b.coords,
  }));

  const lockedPreviewItems = isGuest
    ? fullFiltered.filter((business) => !filtered.some((visibleBusiness) => visibleBusiness.id === business.id)).slice(0, 3)
    : [];

  return { isGuest, total, fullTotal, items, lockedPreviewItems, page: safe, pageCount, mapItems, facets, index };
}
