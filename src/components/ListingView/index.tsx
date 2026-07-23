"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { CATEGORY_GROUPS, serviceTranslationKey } from "@/lib/categories";
import { businessSlug } from "@/lib/business-slug";
import { facetLabel } from "@/lib/facets";
import { cn } from "@/lib/utils";
import { dopingRank } from "@/lib/listing";
import { useRegions } from "@/lib/geo";
import type { Business, GroupKey, Sort } from "@/lib/types";
import type { ExploreIndexItem, ExploreMapItem } from "@/lib/explore-search";
import { EXPLORE_PAGE_SIZE, serializeExploreFilters } from "@/lib/explore-filters";
import dynamic from "next/dynamic";
import SupplierCard from "@/components/SupplierCard";
import FilterBar from "./FilterBar";
import FilterSelects from "./FilterSelects";
import CategoryCatalog from "./CategoryCatalog";
import FacetPanel from "./FacetPanel";
import BottomSheet from "./BottomSheet";
import SearchBox, { type Suggestion } from "./SearchBox";
import ActiveTags, { type FilterTag } from "./ActiveTags";
import TopProgressBar from "@/components/TopProgressBar";
import styles from "./styles";


const MapPanel = dynamic(() => import("@/components/MapPanel"), {
  ssr: false,
  loading: () => (
    <div className="h-[560px] animate-pulse rounded-[16px] border border-line bg-cream-deep max-[1000px]:h-[360px]" />
  ),
});

const guestUnlockWideSpan = (itemCount: number) => cn(
  "col-span-1",
  itemCount % 2 === 0
    ? "min-[641px]:max-[1180px]:col-span-2"
    : "min-[641px]:max-[1180px]:col-span-1",
  itemCount % 3 === 0
    ? "min-[1181px]:max-[1599px]:col-span-3"
    : itemCount % 3 === 1
      ? "min-[1181px]:max-[1599px]:col-span-2"
      : "min-[1181px]:max-[1599px]:col-span-1",
  itemCount % 4 === 0
    ? "min-[1600px]:col-span-4"
    : itemCount % 4 === 1
      ? "min-[1600px]:col-span-3"
      : itemCount % 4 === 2
        ? "min-[1600px]:col-span-2"
        : "min-[1600px]:col-span-1"
);

/* Keşfet listesi — SUNUCU-GÜDÜMLÜ.
   Filtre/sıralama/sayfalama artık `lib/explore-search.getExploreResults` içinde (sunucu).
   Bu bileşen yalnız: kontrol state'i tutar, değişimi URL'e yazar (useTransition ile anlık his),
   ve sunucudan gelen sonuçları (items/total/pageCount) + hafif index'i (arama/seçici) + mapItems'ı
   (harita) render eder. Ağır iş ve ağır veri istemciye inmez. */
const ListingView = ({
  isGuest = false,
  items = [],
  lockedPreviewItems = [],
  index = [],
  mapItems = [],
  total = 0,
  fullTotal = 0,
  page: serverPage = 1,
  pageCount = 1,
  initialGroups = [],
  initialTypes = [],
  initialCountry = "all",
  initialCity = "all",
  initialDistrict = "all",
  initialQ = "",
  initialSort = "featured",
  initialAttrs = [],
}: {
  isGuest?: boolean;
  items?: Business[];
  lockedPreviewItems?: Business[];
  index?: ExploreIndexItem[];
  mapItems?: ExploreMapItem[];
  total?: number;
  fullTotal?: number;
  page?: number;
  pageCount?: number;
  initialGroups?: GroupKey[];
  initialTypes?: string[];
  initialCountry?: string;
  initialCity?: string;
  initialDistrict?: string;
  initialQ?: string;
  initialSort?: Sort;
  initialAttrs?: string[];
}) => {
  const t = useTranslations("listing");
  const tc = useTranslations("cat");
  const ts = useTranslations("service");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const groups = useMemo(() => new Set(initialGroups), [initialGroups]);
  const types = useMemo(() => new Set(initialTypes), [initialTypes]);
  const attrs = useMemo(() => new Set(initialAttrs), [initialAttrs]);
  const country = initialCountry;
  const city = initialCity;
  const district = initialDistrict;
  const sort = initialSort;
  const [qDraft, setQDraft] = useState(initialQ);
  const committedQRef = useRef(initialQ);
  const pendingQEchoesRef = useRef(new Set<string>());
  const serverQRef = useRef(initialQ);
  const suppressDeferredQRef = useRef(false);
  const [view, setView] = useState<"list" | "map">("list");
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Business[]>(items);
  const resultKeyRef = useRef("");

  // Yazarken URL güncellemesini deferred render'a bırak; sunucu isteği arka planda.
  const deferredQ = useDeferredValue(qDraft);

  // Ülke/şehir/ilçe seçenekleri TAM dünya listesinden (public/geo chunk'ları) —
  // MVP: tüm bölgeler seçilebilir görünmeli; tedarikçisi olmayan bölge boş sonuç verir.
  const { countries, cities, districts } = useRegions(
    country === "all" ? "" : country,
    city === "all" ? "" : city,
    district === "all" ? "" : district,
  );
  const shownPage = Math.min(serverPage, pageCount);
  const shownCount = Math.min(visibleItems.length, total);
  const hasMore = pageCount > 1 && shownPage < pageCount && shownCount < total;

  const resultKey = useMemo(
    () => JSON.stringify({
      groups: initialGroups,
      types: initialTypes,
      country: initialCountry,
      city: initialCity,
      district: initialDistrict,
      q: initialQ,
      sort: initialSort,
      attrs: initialAttrs,
    }),
    [initialGroups, initialTypes, initialCountry, initialCity, initialDistrict, initialQ, initialSort, initialAttrs],
  );

  useEffect(() => {
    const changedResultSet = resultKeyRef.current !== resultKey;
    if (changedResultSet) {
      resultKeyRef.current = resultKey;
      setVisibleItems(items);
      return;
    }
    setVisibleItems((previous) => {
      const prefix = previous.slice(0, (serverPage - 1) * EXPLORE_PAGE_SIZE);
      const next = new Map(prefix.map((item) => [item.id, item]));
      items.forEach((item) => next.set(item.id, item));
      return [...next.values()];
    });
  }, [items, resultKey, serverPage]);

  useEffect(() => {
    if (serverQRef.current === initialQ) return;
    serverQRef.current = initialQ;
    suppressDeferredQRef.current = true;
    if (pendingQEchoesRef.current.delete(initialQ)) return;
    committedQRef.current = initialQ;
    setQDraft(initialQ);
  }, [initialQ]);

  type FilterPatch = Partial<{
    groups: Iterable<GroupKey>;
    types: Iterable<string>;
    country: string;
    city: string;
    district: string;
    q: string;
    attrs: Iterable<string>;
    sort: Sort;
    page: number;
  }>;

  const replaceFilters = useCallback((patch: FilterPatch) => {
    const nextGroups = [...(patch.groups ?? groups)];
    const nextTypes = [...(patch.types ?? types)];
    const nextAttrs = [...(patch.attrs ?? attrs)];
    const nextCountry = patch.country ?? country;
    const nextCity = patch.city ?? city;
    const nextDistrict = patch.district ?? district;
    const nextQ = (patch.q ?? committedQRef.current).trim();
    const nextSort = patch.sort ?? sort;
    const nextPage = patch.page ?? 1;
    const query = serializeExploreFilters({
      groups: nextGroups,
      types: nextTypes,
      country: nextCountry,
      city: nextCity,
      district: nextDistrict,
      q: nextQ,
      attrs: nextAttrs,
      sort: nextSort,
      page: nextPage,
    });

    committedQRef.current = nextQ;
    if (patch.q !== undefined && nextQ !== initialQ) pendingQEchoesRef.current.add(nextQ);

    startTransition(() => {
      router.replace({ pathname: "/explore", query }, { scroll: false });
    });
  }, [attrs, city, country, district, groups, initialQ, router, sort, startTransition, types]);

  useEffect(() => {
    if (suppressDeferredQRef.current) {
      suppressDeferredQRef.current = false;
      return;
    }
    const nextQ = deferredQ.trim();
    if (nextQ !== qDraft.trim() || nextQ === committedQRef.current) return;
    replaceFilters({ q: nextQ, page: 1 });
  }, [deferredQ, qDraft, replaceFilters]);

  function toggleGroup(g: GroupKey) {
    const next = new Set(groups);
    if (next.has(g)) next.delete(g);
    else next.add(g);
    const stillValid = new Set(
      CATEGORY_GROUPS.filter((cg) => next.has(cg.key)).flatMap((cg) => cg.children.map((c) => c.label))
    );
    replaceFilters({
      groups: next,
      types: [...types].filter((ty) => stillValid.has(ty)),
      page: 1,
    });
  }
  function toggleType(ty: string) {
    const next = new Set(types);
    if (next.has(ty)) next.delete(ty);
    else next.add(ty);
    replaceFilters({ types: next, page: 1 });
  }
  function toggleAttr(slug: string) {
    const next = new Set(attrs);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    replaceFilters({ attrs: next, page: 1 });
  }
  function pickCity(v: string) {
    replaceFilters({ city: v, district: "all", page: 1 });
  }
  function handlePick(s: Suggestion) {
    if (s.kind === "business") {
      const business = index.find((b) => b.id === s.id);
      router.push({
        pathname: "/supplier/[id]",
        params: { id: business ? businessSlug({ name: business.name }) : s.id.toString() },
      });
      return;
    }
    setQDraft("");
    if (s.kind === "region") {
      replaceFilters({
        country: s.country,
        city: s.city ?? "all",
        district: s.district ?? "all",
        q: "",
        page: 1,
      });
    } else if (s.kind === "group") {
      if (!groups.has(s.value)) replaceFilters({ groups: new Set(groups).add(s.value), q: "", page: 1 });
    } else if (s.kind === "type") {
      const g = CATEGORY_GROUPS.find((cg) => cg.children.some((c) => c.label === s.value));
      const nextGroups = new Set(groups);
      const nextTypes = new Set(types);
      if (g) nextGroups.add(g.key);
      nextTypes.add(s.value);
      replaceFilters({ groups: nextGroups, types: nextTypes, q: "", page: 1 });
    }
  }
  function reset() {
    setQDraft("");
    replaceFilters({
      groups: [],
      types: [],
      country: "all",
      city: "all",
      district: "all",
      q: "",
      attrs: [],
      sort: "featured",
      page: 1,
    });
  }

  const tags: FilterTag[] = [];
  groups.forEach((g) => tags.push({ kind: "group", value: g, label: tc(g) }));
  types.forEach((ty) => {
    const key = serviceTranslationKey(ty);
    tags.push({ kind: "type", value: ty, label: key ? ts(key) : ty });
  });
  if (country !== "all") tags.push({ kind: "country", value: country, label: country });
  if (city !== "all") tags.push({ kind: "city", value: city, label: city });
  if (district !== "all") tags.push({ kind: "district", value: district, label: district });
  attrs.forEach((slug) => tags.push({ kind: "attr", value: slug, label: facetLabel(slug) }));
  if (qDraft.trim()) tags.push({ kind: "q", value: "", label: `“${qDraft.trim()}”` });

  function removeTag(kind: string, value: string) {
    if (kind === "group") toggleGroup(value as GroupKey);
    else if (kind === "type") toggleType(value);
    else if (kind === "country") {
      replaceFilters({ country: "all", city: "all", district: "all", page: 1 });
    }
    else if (kind === "city") pickCity("all");
    else if (kind === "district") replaceFilters({ district: "all", page: 1 });
    else if (kind === "attr") toggleAttr(value);
    else if (kind === "q") {
      setQDraft("");
      replaceFilters({ q: "", page: 1 });
    }
  }

  const hasNoDatabaseResults = !isGuest && index.length === 0;
  const resultsColumn = (gridClass: string, fillGuestRow = false) => (
    <div
      aria-busy={isPending}
      className={cn("transition-opacity duration-200", isPending && "pointer-events-none opacity-55")}
    >
      {total === 0 ? (
        <div className={styles.empty}>
          <h3 className={styles.emptyTitle}>{hasNoDatabaseResults ? "DB verisi görünmüyor" : t("emptyTitle")}</h3>
          <p className={styles.emptyText}>
            {hasNoDatabaseResults
              ? "Seed fallback kapalı. Supabase bağlantısı yoksa veya businesses tablosunda approved kayıt bulunmuyorsa liste boş görünür."
              : t("emptyText")}
          </p>
          {!hasNoDatabaseResults && <button type="button" className="btn btn-solid" onClick={reset}>{t("clearFilters")}</button>}
        </div>
      ) : (
        <div className={gridClass}>
          {visibleItems.map((b) => (
            <SupplierCard
              key={b.id}
              business={b}
              impressionId={b.id}
              href={{ pathname: "/supplier/[id]", params: { id: businessSlug(b) } }}
              flag={dopingRank(b) === 2 ? tCommon("ad") : dopingRank(b) === 1 ? tCommon("featured") : null}
              showStars
            >
              <Link
                href={{ pathname: "/supplier/[id]", params: { id: businessSlug(b) } }}
                className="btn btn-outline btn-sm !px-3.5 !py-2 !text-[12.5px]"
              >
                {tCommon("detail")}
              </Link>
              <Link
                href={{ pathname: "/quote", query: { s: b.id.toString() } }}
                className="btn btn-solid btn-sm !px-3.5 !py-2 !text-[12.5px]"
              >
                {tCommon("requestQuote")}
              </Link>
            </SupplierCard>
          ))}
          {isGuest && fullTotal > total && (
            <article className={cn(styles.guestUnlockShell, fillGuestRow ? guestUnlockWideSpan(visibleItems.length) : "col-span-full")}>
              <div className={styles.guestUnlockPreview} aria-hidden>
                {lockedPreviewItems.map((business) => (
                  <SupplierCard key={business.id} business={business} showStars>{null}</SupplierCard>
                ))}
              </div>
              <div className={styles.guestUnlockOverlay}>
                <div className={styles.guestUnlockPanel}>
                  <div className={styles.guestUnlockIcon} aria-hidden>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="10" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div className={styles.guestUnlockCopy}>
                    <p className={styles.guestUnlockEyebrow}>{t("guestCountEyebrow")}</p>
                    <h3 className={styles.guestUnlockTitle}>{t("guestUnlockTitle", { count: fullTotal - total })}</h3>
                    <p className={styles.guestUnlockText}>{t("guestUnlockText", { total: fullTotal })}</p>
                  </div>
                  <Link href="/register" className={styles.guestUnlockCta}>{t("guestUnlockCta")}</Link>
                </div>
              </div>
            </article>
          )}
        </div>
      )}
      {hasMore && (
        <div className={styles.loadMoreWrap}>
          <p className={styles.loadMoreText}>{t("shownCount", { shown: shownCount, total })}</p>
          <button
            type="button"
            className={styles.loadMoreBtn}
            disabled={isPending}
            onClick={() => replaceFilters({ page: Math.min(shownPage + 1, pageCount) })}
          >
            {isPending ? t("loadingMore") : t("loadMore")}
          </button>
        </div>
      )}
    </div>
  );

  const catalogEl = (
    <CategoryCatalog
      groups={groups}
      types={types}
      onToggleGroup={toggleGroup}
      onToggleType={toggleType}
    />
  );

  const activeRefine =
    (country !== "all" ? 1 : 0) +
    (city !== "all" ? 1 : 0) +
    (district !== "all" ? 1 : 0);

  const selectProps = {
    country,
    city,
    district,
    countries,
    cities,
    districts,
    onCountry: (v: string) => replaceFilters({ country: v, city: "all", district: "all", page: 1 }),
    onCity: pickCity,
    onDistrict: (v: string) => replaceFilters({ district: v, page: 1 }),
  };

  return (
    <div className="relative">
      {/* Filtre/arama/sayfa güncellenirken üstte gerçek ilerleme çubuğu (dolup sona doğru yavaşlar,
          bitince tamamlanır). Sonuçlar stale-while-revalidate: eski kartlar görünür kalır, soluklaşır. */}
      <TopProgressBar active={isPending} />

      <div className={styles.head}>
        <div>
          <span className={styles.eyebrow}>{t("eyebrow")}</span>
          <h1 className={styles.title}>{t("title")}</h1>
        </div>
      </div>

      <div className={styles.layout}>
        <aside className={styles.catalogAside}>
          <CategoryCatalog
            groups={groups}
            types={types}
            onToggleGroup={toggleGroup}
            onToggleType={toggleType}
          >
            <FacetPanel
              bare
              groups={[...groups]}
              selected={attrs}
              onToggle={toggleAttr}
              onClear={() => replaceFilters({ attrs: [], page: 1 })}
            />
          </CategoryCatalog>
        </aside>

        <div className={styles.content}>
          <div className={styles.topSearch}>
            <FilterBar
              businesses={index}
              country={country}
              city={city}
              district={district}
              q={qDraft}
              countries={countries}
              cities={cities}
              districts={districts}
              onCountry={selectProps.onCountry}
              onCity={selectProps.onCity}
              onDistrict={selectProps.onDistrict}
              onQ={setQDraft}
              onPick={handlePick}
            />
          </div>
          <div className={styles.toolbar}>
            <div className={styles.toolbarSearch}>
              <SearchBox
                businesses={index}
                countryOptions={countries}
                value={qDraft}
                onChange={setQDraft}
                onPick={handlePick}
              />
            </div>
            <button type="button" className={styles.toolBtn} onClick={() => setCatalogOpen(true)}>
              {t("suggestCategories")}
            </button>
            <button type="button" className={styles.toolBtn} onClick={() => setFiltersOpen(true)}>
              {t("filters")}
              {activeRefine > 0 && <span className={styles.toolBtnBadge}>{activeRefine}</span>}
            </button>
          </div>

          <ActiveTags tags={tags} onRemove={removeTag} onClear={reset} />

          <div className={styles.resultsBar}>
        <p className={styles.count}>
          {isGuest && fullTotal > total
            ? t.rich("guestResults", {
                shown: total,
                total: fullTotal,
                b: (c) => <strong className={styles.guestCountStrong}>{c}</strong>,
              })
            : t.rich("results", { count: total, b: (c) => <strong className={styles.countStrong}>{c}</strong> })}
          {city !== "all" ? ` · ${city}` : ""}
        </p>
        {<div className={styles.barRight}>
          <div className={styles.viewToggle} role="tablist" aria-label={t("viewMode")}>
            <button
              type="button"
              role="tab"
              aria-selected={view === "list"}
              className={cn(styles.viewBtn, view === "list" && styles.viewBtnActive)}
              onClick={() => setView("list")}
            >
              <svg className={styles.viewIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
              {t("viewList")}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === "map"}
              className={cn(styles.viewBtn, view === "map" && styles.viewBtnActive)}
              onClick={() => setView("map")}
            >
              <svg className={styles.viewIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.4" />
              </svg>
              {t("viewMap")}
            </button>
          </div>
          <div className={styles.sortWrap}>
            <label className={styles.sortLabel} htmlFor="sort">{t("sortLabel")}</label>
            <span className={styles.sortSelectWrap}>
              <select id="sort" className={styles.sortSelect} value={sort} onChange={(e) => replaceFilters({ sort: e.target.value as Sort, page: 1 })}>
                <option value="featured">{t("sortFeatured")}</option>
                <option value="az">{t("sortAz")}</option>
              </select>
              <svg className={styles.sortChevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </div>
        </div>}
      </div>

          {view === "map" ? (
            <div className={styles.shell}>
              {resultsColumn(styles.grid)}
              <aside className={cn(styles.mapAside, "max-[1120px]:order-first max-[1120px]:mb-4")}>
                <MapPanel items={mapItems} />
              </aside>
            </div>
          ) : (
            resultsColumn(styles.gridWide, true)
          )}
        </div>
      </div>

      <BottomSheet open={catalogOpen} onClose={() => setCatalogOpen(false)} title={t("suggestCategories")}>
        {catalogEl}
      </BottomSheet>
      <BottomSheet open={filtersOpen} onClose={() => setFiltersOpen(false)} title={t("filters")}>
        <FilterSelects {...selectProps} stack />
        <FacetPanel
          groups={[...groups]}
          selected={attrs}
          onToggle={toggleAttr}
          onClear={() => replaceFilters({ attrs: [], page: 1 })}
        />
      </BottomSheet>
    </div>
  );
};

export default ListingView;
