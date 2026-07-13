"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { businessSlug } from "@/lib/business-slug";
import { facetLabel } from "@/lib/facets";
import { cn } from "@/lib/utils";
import { dopingRank } from "@/lib/listing";
import { useRegions } from "@/lib/geo";
import type { Business, GroupKey, Sort } from "@/lib/types";
import type { ExploreIndexItem, ExploreMapItem } from "@/lib/explore-search";
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

const uniqSorted = (arr: string[]) => [...new Set(arr)].sort((a, b) => a.localeCompare(b, "tr"));

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
  const tCommon = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [groups, setGroups] = useState<Set<GroupKey>>(new Set(initialGroups));
  const [types, setTypes] = useState<Set<string>>(new Set(initialTypes));
  const [country, setCountry] = useState(initialCountry);
  const [city, setCity] = useState(initialCity);
  const [district, setDistrict] = useState(initialDistrict);
  const [q, setQ] = useState(initialQ);
  const [attrs, setAttrs] = useState<Set<string>>(new Set(initialAttrs));
  const [sort, setSort] = useState<Sort>(initialSort);
  const [page, setPage] = useState(serverPage);
  const [view, setView] = useState<"list" | "map">("list");
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Business[]>(items);
  const resultKeyRef = useRef("");
  const urlSyncReadyRef = useRef(false);

  // Yazarken URL'e yazmayı geciktir (doğal debounce); sunucu isteği arka planda.
  const deferredQ = useDeferredValue(q);

  // Ülke/şehir/ilçe seçenekleri TAM dünya listesinden (public/geo chunk'ları) —
  // MVP: tüm bölgeler seçilebilir görünmeli; tedarikçisi olmayan bölge boş sonuç verir.
  const { countries, cities, districts } = useRegions(
    country === "all" ? "" : country,
    city === "all" ? "" : city,
    district === "all" ? "" : district,
  );
  // "Önce ülke seç" istem çipleri: 250 ülke değil, tedarikçisi olan ülkeler.
  const promptCountries = useMemo(() => uniqSorted(index.map((b) => b.country)), [index]);

  // Kelime araması yapılıyorsa ülke seçimi zorunlu (önce konum akışı).
  const needsCountry = deferredQ.trim() !== "" && country === "all";
  const shownPage = Math.min(page, pageCount);
  const resultKey = useMemo(
    () =>
      JSON.stringify({
        groups: initialGroups,
        types: initialTypes,
        country: initialCountry,
        city: initialCity,
        district: initialDistrict,
        q: initialQ,
        sort: initialSort,
        attrs: initialAttrs,
      }),
    [initialGroups, initialTypes, initialCountry, initialCity, initialDistrict, initialQ, initialSort, initialAttrs]
  );
  const shownCount = Math.min(visibleItems.length, total);
  const hasMore = pageCount > 1 && shownPage < pageCount && shownCount < total;

  useEffect(() => {
    const changedResultSet = resultKeyRef.current !== resultKey;
    if (changedResultSet || serverPage <= 1) {
      resultKeyRef.current = resultKey;
      setVisibleItems(items);
      return;
    }
    setVisibleItems((prev) => {
      const next = new Map(prev.map((item) => [item.id, item]));
      items.forEach((item) => next.set(item.id, item));
      return [...next.values()];
    });
  }, [items, resultKey, serverPage]);

  function toggleGroup(g: GroupKey) {
    setGroups((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      const stillValid = new Set(
        CATEGORY_GROUPS.filter((cg) => next.has(cg.key)).flatMap((cg) => cg.children.map((c) => c.label))
      );
      setTypes((prevT) => new Set([...prevT].filter((ty) => stillValid.has(ty))));
      return next;
    });
    setPage(1);
  }
  function toggleType(ty: string) {
    setTypes((prev) => {
      const next = new Set(prev);
      if (next.has(ty)) next.delete(ty);
      else next.add(ty);
      return next;
    });
    setPage(1);
  }
  function toggleAttr(slug: string) {
    setAttrs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
    setPage(1);
  }
  function pickCity(v: string) {
    setCity(v);
    setDistrict("all");
    setPage(1);
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
    setQ("");
    if (s.kind === "region") {
      setCountry("all");
      setCity(s.city);
      setDistrict(s.district ?? "all");
    } else if (s.kind === "group") {
      if (!groups.has(s.value)) toggleGroup(s.value);
    } else if (s.kind === "type") {
      const g = CATEGORY_GROUPS.find((cg) => cg.children.some((c) => c.label === s.value));
      if (g) setGroups((prev) => new Set(prev).add(g.key));
      if (!types.has(s.value)) toggleType(s.value);
    }
    setPage(1);
  }
  function reset() {
    setGroups(new Set());
    setTypes(new Set());
    setCountry("all");
    setCity("all");
    setDistrict("all");
    setQ("");
    setAttrs(new Set());
    setSort("featured");
    setPage(1);
  }

  // Filtre/sayfa durumunu URL'e yaz → sunucu yeni sonuçları döner. useTransition ile
  // giriş akıcı kalır, sunucu compute arka planda çalışır (anlık his + ölçek).
  useEffect(() => {
    const p = new URLSearchParams();
    if (groups.size) p.set("cat", [...groups].join(","));
    if (types.size) p.set("type", [...types].join(","));
    if (country !== "all") p.set("country", country);
    if (city !== "all") p.set("city", city);
    if (district !== "all") p.set("district", district);
    if (deferredQ.trim()) p.set("q", deferredQ.trim());
    if (attrs.size) p.set("attr", [...attrs].join(","));
    if (sort !== "featured") p.set("sort", sort);
    if (page > 1) p.set("page", String(page));
    const qs = p.toString();
    if (!urlSyncReadyRef.current) {
      urlSyncReadyRef.current = true;
      return;
    }
    if (qs !== (searchParams?.toString() ?? "")) {
      startTransition(() => {
        router.replace({ pathname: "/explore", query: Object.fromEntries(p) }, { scroll: false });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, types, country, city, district, deferredQ, attrs, sort, page]);

  const tags: FilterTag[] = [];
  groups.forEach((g) => tags.push({ kind: "group", value: g, label: tc(g) }));
  types.forEach((ty) => tags.push({ kind: "type", value: ty, label: ty }));
  if (country !== "all") tags.push({ kind: "country", value: country, label: country });
  if (city !== "all") tags.push({ kind: "city", value: city, label: city });
  if (district !== "all") tags.push({ kind: "district", value: district, label: district });
  attrs.forEach((slug) => tags.push({ kind: "attr", value: slug, label: facetLabel(slug) }));
  if (q.trim()) tags.push({ kind: "q", value: "", label: `“${q.trim()}”` });

  function removeTag(kind: string, value: string) {
    if (kind === "group") toggleGroup(value as GroupKey);
    else if (kind === "type") toggleType(value);
    else if (kind === "country") {
      setCountry("all");
      setCity("all");
      setDistrict("all");
    }
    else if (kind === "city") pickCity("all");
    else if (kind === "district") setDistrict("all");
    else if (kind === "attr") toggleAttr(value);
    else if (kind === "q") setQ("");
    setPage(1);
  }

  const hasNoDatabaseResults = !isGuest && index.length === 0;
  const countryPrompt = (
    <div className={styles.countryAsk}>
      <div className={styles.countryAskIcon} aria-hidden>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.6" />
        </svg>
      </div>
      <h3 className={styles.countryAskTitle}>{t("countryAskTitle")}</h3>
      <p className={styles.countryAskText}>{t("countryAskText")}</p>
      <div className={styles.countryAskChips}>
        {promptCountries.map((c) => (
          <button
            key={c}
            type="button"
            className={styles.countryChip}
            onClick={() => { setCountry(c); setCity("all"); setDistrict("all"); setPage(1); }}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );

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
            onClick={() => setPage(Math.min(shownPage + 1, pageCount))}
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
    onCountry: (v: string) => { setCountry(v); setCity("all"); setDistrict("all"); setPage(1); },
    onCity: pickCity,
    onDistrict: (v: string) => { setDistrict(v); setPage(1); },
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
              onClear={() => { setAttrs(new Set()); setPage(1); }}
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
              q={q}
              countries={countries}
              cities={cities}
              districts={districts}
              onCountry={selectProps.onCountry}
              onCity={selectProps.onCity}
              onDistrict={selectProps.onDistrict}
              onQ={(v) => { setQ(v); setPage(1); }}
              onPick={handlePick}
            />
          </div>
          <div className={styles.toolbar}>
            <div className={styles.toolbarSearch}>
              <SearchBox businesses={index} value={q} onChange={(v) => { setQ(v); setPage(1); }} onPick={handlePick} />
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

          {needsCountry ? countryPrompt : (
          <>
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
          <div className={styles.viewToggle} role="tablist" aria-label="View">
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
              <select id="sort" className={styles.sortSelect} value={sort} onChange={(e) => { setSort(e.target.value as Sort); setPage(1); }}>
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
          </>
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
          onClear={() => { setAttrs(new Set()); setPage(1); }}
        />
      </BottomSheet>
    </div>
  );
};

export default ListingView;
