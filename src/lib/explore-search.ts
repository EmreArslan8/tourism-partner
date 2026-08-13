/* Keşfet sayfası yalnızca oturum bilgisini okur. Salt-okunur istemci, Next 16
   dev modunda Server Action sonrası cookies() invariant hatasını önler. */
import { createReadOnlyClient as createClient } from "@/lib/supabase/read-only-server";
import { getBusinesses, toListingBusiness } from "@/lib/businesses";
import { filterAndSortBusinesses, facetCounts } from "@/lib/listing";
import { canAppearInExplore, type ViewerKind } from "@/lib/business-visibility";
import type { Business, ListingFilters } from "@/lib/types";
import type { ExploreInitialFilters } from "@/lib/explore-filters";
import { EXPLORE_PAGE_SIZE } from "@/lib/explore-filters";
import { canonicalizeCountryMentions } from "@/lib/geo-server";

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

const COUNTRY_CENTER_COORDS: Record<string, [number, number]> = {
  "Türkiye": [39.0, 35.0],
  "Fas": [31.7917, -7.0926],
  "Mısır": [26.8206, 30.8025],
  "Tunus": [33.8869, 9.5375],
  "Cezayir": [28.0339, 1.6596],
  "Birleşik Arap Emirlikleri": [23.4241, 53.8478],
  "Suudi Arabistan": [23.8859, 45.0792],
  "Katar": [25.3548, 51.1839],
  "Bahreyn": [26.0667, 50.5577],
  "Umman": [21.4735, 55.9754],
  "Ürdün": [30.5852, 36.2384],
  "Lübnan": [33.8547, 35.8623],
  "Irak": [33.2232, 43.6793],
  "İran": [32.4279, 53.6880],
  "İsrail": [31.0461, 34.8516],
  "Yunanistan": [39.0742, 21.8243],
  "Kuzey Kıbrıs Türk Cumhuriyeti": [35.1264, 33.4299],
  "Gürcistan": [42.3154, 43.3569],
  "Azerbaycan": [40.1431, 47.5769],
  "İtalya": [41.8719, 12.5674],
  "İspanya": [40.4637, -3.7492],
  "Fransa": [46.2276, 2.2137],
  "Almanya": [51.1657, 10.4515],
  "Birleşik Krallik": [55.3781, -3.4360],
  "Amerika": [37.0902, -95.7129],
  "Tayland": [15.8700, 100.9925],
  "Endonezya": [-0.7893, 113.9213],
  "Malezya": [4.2105, 101.9758],
  "Singapur": [1.3521, 103.8198],
  "Japonya": [36.2048, 138.2529],
  "Güney Kore": [35.9078, 127.7669],
  "Çin": [35.8617, 104.1954],
  "Hindistan": [20.5937, 78.9629],
  "Maldivler": [3.2028, 73.2207],
};

function isValidCoords(coords: [number, number]): boolean {
  const [lat, lng] = coords;
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180 && !(lat === 0 && lng === 0);
}

function resolveMapCoords(business: Business): [number, number] | null {
  if (isValidCoords(business.coords)) return business.coords;
  return COUNTRY_CENTER_COORDS[business.country] ?? null;
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
  const [all, viewer, canonicalQuery] = await Promise.all([
    getBusinesses(),
    viewerPromise,
    canonicalizeCountryMentions(filters.q),
  ]);
  const isGuest = viewer === "guest";

  // Tüm onaylı kayıtlar görünür; premium kayıtlar yalnızca sıralamada öne çıkar.
  // Liste payload'ından iletişim alanları yine çıkarılır.
  const visible = all.filter((business) => canAppearInExplore(business, viewer)).map(toListingBusiness);

  const index: ExploreIndexItem[] = visible.map((b) => ({
    id: b.id,
    name: b.name,
    city: b.city,
    district: b.district,
    country: b.country,
    group: b.group,
    type: b.type,
  }));

  const lf = toListingFilters(filters);
  const fullFiltered = filterAndSortBusinesses(all.map(toListingBusiness), lf, canonicalQuery, filters.sort);
  const fullTotal = fullFiltered.length;
  const filtered = filterAndSortBusinesses(visible, lf, canonicalQuery, filters.sort);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / EXPLORE_PAGE_SIZE));
  const safe = Math.min(Math.max(1, page), pageCount);
  const items = filtered.slice((safe - 1) * EXPLORE_PAGE_SIZE, safe * EXPLORE_PAGE_SIZE);

  const facets = {
    group: facetCounts(visible, lf, canonicalQuery, "group"),
    type: facetCounts(visible, lf, canonicalQuery, "type"),
  };

  const mapItems: ExploreMapItem[] = filtered.flatMap((b) => {
    const coords = resolveMapCoords(b);
    return coords ? [{ id: b.id, name: b.name, group: b.group, coords }] : [];
  });

  const lockedPreviewItems = isGuest
    ? fullFiltered.filter((business) => !filtered.some((visibleBusiness) => visibleBusiness.id === business.id)).slice(0, 3)
    : [];

  return { isGuest, total, fullTotal, items, lockedPreviewItems, page: safe, pageCount, mapItems, facets, index };
}
