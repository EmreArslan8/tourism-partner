"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { businessSlug } from "@/lib/business-slug";
import { facetLabel } from "@/lib/facets";
import { cn } from "@/lib/utils";
import {
  filterAndSortBusinesses,
  dopingRank,
} from "@/lib/listing";
import type { Business, GroupKey, ListingFilters, Sort } from "@/lib/types";
import dynamic from "next/dynamic";
import SupplierCard from "@/components/SupplierCard";
import FilterBar from "./FilterBar";
import FilterSelects from "./FilterSelects";
import CategoryCatalog from "./CategoryCatalog";
import FacetPanel from "./FacetPanel";
import BottomSheet from "./BottomSheet";
import SearchBox, { type Suggestion } from "./SearchBox";
import ActiveTags, { type FilterTag } from "./ActiveTags";
import Pagination from "./Pagination";
import styles from "./styles";


const MapPanel = dynamic(() => import("@/components/MapPanel"), {
  ssr: false,
  loading: () => (
    <div className="h-[560px] animate-pulse rounded-[16px] border border-line bg-cream-deep max-[1000px]:h-[360px]" />
  ),
});

const PAGE_SIZE = 9;
const uniqSorted = (arr: string[]) => [...new Set(arr)].sort((a, b) => a.localeCompare(b, "tr"));

const ListingView = ({
  isGuest = false,
  businesses = [],
  initialGroups = [],
  initialTypes = [],
  initialCountry = "all",
  initialCity = "all",
  initialDistrict = "all",
  initialQ = "",
  initialMinRating = 0,
  initialSort = "featured",
  initialAttrs = [],
}: {
  isGuest?: boolean;
  businesses?: Business[];
  initialGroups?: GroupKey[];
  initialTypes?: string[];
  initialCountry?: string;
  initialCity?: string;
  initialDistrict?: string;
  initialQ?: string;
  initialMinRating?: number;
  initialSort?: Sort;
  initialAttrs?: string[];
}) => {
  const t = useTranslations("listing");
  const tc = useTranslations("cat");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [groups, setGroups] = useState<Set<GroupKey>>(new Set(initialGroups));
  const [types, setTypes] = useState<Set<string>>(new Set(initialTypes));
  const [country, setCountry] = useState(initialCountry);
  const [city, setCity] = useState(initialCity);
  const [district, setDistrict] = useState(initialDistrict);
  const [q, setQ] = useState(initialQ);
  const [minRating, setMinRating] = useState(initialMinRating);
  const [attrs, setAttrs] = useState<Set<string>>(new Set(initialAttrs));
  const [sort, setSort] = useState<Sort>(initialSort);
  const [view, setView] = useState<"list" | "map">("list");
  const [page, setPage] = useState(1);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Yazarken input akıcı kalsın diye arama metnini geciktiriyoruz;
  // ağır liste hesabı arka planda, düşük öncelikte güncellenir.
  const deferredQ = useDeferredValue(q);

  const countries = useMemo(() => uniqSorted(businesses.map((b) => b.country)), [businesses]);
  const cities = useMemo(
    () => uniqSorted(businesses.filter((b) => country === "all" || b.country === country).map((b) => b.city)),
    [businesses, country]
  );
  const districts = useMemo(
    () =>
      city === "all"
        ? []
        : uniqSorted(
            businesses.filter((b) => (country === "all" || b.country === country) && b.city === city).map((b) => b.district)
          ),
    [businesses, city, country]
  );

  // Saf süzme/sıralama/skor mantığı lib/listing.ts'te; burada yalnız state → filtre nesnesi.
  const filters: ListingFilters = useMemo(
    () => ({ groups, types, country, city, district, minRating, attrs }),
    [groups, types, country, city, district, minRating, attrs]
  );

  const filtered = useMemo(
    () => filterAndSortBusinesses(businesses, filters, deferredQ, sort),
    [businesses, filters, deferredQ, sort]
  );

  // Kelime araması yapılıyorsa ülke seçimi zorunlu (modern "önce konum" akışı):
  // ülke seçili değilse sonuç yerine ülke seçtiren bir ekran gösterilir.
  const needsCountry = deferredQ.trim() !== "" && country === "all";

  const maxPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, maxPage);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function toggleGroup(g: GroupKey) {
    setGroups((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      // Grup kalkınca o gruba ait seçili alt türleri de temizle.
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
      const business = businesses.find((b) => b.id === s.id);
      router.push({
        pathname: "/supplier/[id]",
        params: { id: business ? businessSlug(business) : s.id.toString() }
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
    setMinRating(0);
    setAttrs(new Set());
    setSort("featured");
    setPage(1);
  }

  // Filtre durumunu URL'e yansıt (paylaşılabilir link + geri/ileri + SSR ön-filtre).
  useEffect(() => {
    const p = new URLSearchParams();
    if (groups.size) p.set("cat", [...groups].join(","));
    if (types.size) p.set("type", [...types].join(","));
    if (country !== "all") p.set("country", country);
    if (city !== "all") p.set("city", city);
    if (district !== "all") p.set("district", district);
    if (deferredQ.trim()) p.set("q", deferredQ.trim());
    if (minRating > 0) p.set("rating", String(minRating));
    if (attrs.size) p.set("attr", [...attrs].join(","));
    if (sort !== "featured") p.set("sort", sort);
    const qs = p.toString();
    if (qs !== (searchParams?.toString() ?? "")) {
      router.replace(
        { pathname: "/explore", query: Object.fromEntries(p) },
        { scroll: false }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, types, country, city, district, deferredQ, minRating, attrs, sort]);

  const tags: FilterTag[] = [];
  groups.forEach((g) => tags.push({ kind: "group", value: g, label: tc(g) }));
  types.forEach((ty) => tags.push({ kind: "type", value: ty, label: ty }));
  if (country !== "all") tags.push({ kind: "country", value: country, label: country });
  if (city !== "all") tags.push({ kind: "city", value: city, label: city });
  if (district !== "all") tags.push({ kind: "district", value: district, label: district });
  if (minRating > 0) tags.push({ kind: "rating", value: "", label: `★ ${minRating}+` });
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
    else if (kind === "rating") setMinRating(0);
    else if (kind === "attr") toggleAttr(value);
    else if (kind === "q") setQ("");
    setPage(1);
  }

  const visibleCount = filtered.length;
  const hasNoDatabaseResults = !isGuest && businesses.length === 0;

  // Misafir bilgilendirme şeridi: yalnızca dopingli/premium işletmeler gösterilir,
  // tüm tedarikçileri görmek için giriş/kayıt. (Kart listesi normal render edilir.)
  const guestBanner = isGuest ? (
    <div className={styles.guestBanner}>
      <div className={styles.guestBannerIcon} aria-hidden>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <div className={styles.guestBannerText}>
        <p className={styles.guestBannerTitle}>{t("guestBannerTitle")}</p>
        <p className={styles.guestBannerSub}>{t("guestBannerText")}</p>
      </div>
      <div className={styles.guestBannerActions}>
        <Link href="/login" className="btn btn-solid btn-sm">{t("gateLogin")}</Link>
        <Link href="/register" className="btn btn-outline btn-sm">{t("gateRegister")}</Link>
      </div>
    </div>
  ) : null;

  // Kelime araması var ama ülke seçilmemiş → "önce ülke seç" + popüler ülke çipleri.
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
        {countries.map((c) => (
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

  const resultsColumn = (gridClass: string) => (
    <div>
      {filtered.length === 0 ? (
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
          {pageItems.map((b) => (
            <SupplierCard
              key={b.id}
              business={b}
              impressionId={b.id}
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
        </div>
      )}
      <Pagination page={safePage} maxPage={maxPage} onPage={setPage} />
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

  // Mobil "Filtreler" rozeti için aktif konum/puan sayısı.
  const activeRefine =
    (country !== "all" ? 1 : 0) +
    (city !== "all" ? 1 : 0) +
    (district !== "all" ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  const selectProps = {
    country,
    city,
    district,
    minRating,
    countries,
    cities,
    districts,
    onCountry: (v: string) => { setCountry(v); setCity("all"); setDistrict("all"); setPage(1); },
    onCity: pickCity,
    onDistrict: (v: string) => { setDistrict(v); setPage(1); },
    onMinRating: (v: number) => { setMinRating(v); setPage(1); },
  };

  return (
    <div>
      <div className={styles.head}>
        <p className={styles.eyebrow}>{t("eyebrow")}</p>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.sub}>{t("sub")}</p>
      </div>

      <div className={styles.layout}>
        {/* Sol kenar: kategoriler + hizmet/koşul facet'leri TEK kart içinde (masaüstü) */}
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
          {/* Mobil araç çubuğu: arama + kategoriler + filtreler */}
          <div className={styles.toolbar}>
            <div className={styles.toolbarSearch}>
              <SearchBox businesses={businesses} value={q} onChange={(v) => { setQ(v); setPage(1); }} onPick={handlePick} />
            </div>
            <button type="button" className={styles.toolBtn} onClick={() => setCatalogOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
              {t("suggestCategories")}
            </button>
            <button type="button" className={styles.toolBtn} onClick={() => setFiltersOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M3 5h18M6 12h12M10 19h4" />
              </svg>
              {t("filters")}
              {activeRefine > 0 && <span className={styles.toolBtnBadge}>{activeRefine}</span>}
            </button>
          </div>

          {/* Masaüstü filtre barı */}
          <div className="max-[1120px]:hidden">
            <FilterBar
              businesses={businesses}
              country={country}
              city={city}
              district={district}
              q={q}
              minRating={minRating}
              countries={countries}
              cities={cities}
              districts={districts}
              onCountry={selectProps.onCountry}
              onCity={selectProps.onCity}
              onDistrict={selectProps.onDistrict}
              onQ={(v) => { setQ(v); setPage(1); }}
              onPick={handlePick}
              onMinRating={selectProps.onMinRating}
            />
          </div>

          <ActiveTags tags={tags} onRemove={removeTag} onClear={reset} />

          {needsCountry ? countryPrompt : (
          <>
          {guestBanner}
          <div className={styles.resultsBar}>
        <p className={styles.count}>
          {t.rich("results", { count: visibleCount, b: (c) => <strong className={styles.countStrong}>{c}</strong> })}
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
              <select id="sort" className={styles.sortSelect} value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                <option value="featured">{t("sortFeatured")}</option>
                <option value="rating">{t("sortRating")}</option>
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
                <MapPanel items={filtered} />
              </aside>
            </div>
          ) : (
            resultsColumn(styles.gridWide)
          )}
          </>
          )}
        </div>
      </div>

      {/* Mobil: kategoriler ve filtreler alttan açılan panellerde */}
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
