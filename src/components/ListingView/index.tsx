"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { BUSINESSES } from "@/lib/data";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { attrsPass, facetLabel } from "@/lib/facets";
import { cn, normalizeTr } from "@/lib/utils";
import type { GroupKey } from "@/lib/types";
import dynamic from "next/dynamic";
import SupplierCard from "@/components/SupplierCard";
import FilterBar from "./FilterBar";
import FilterSelects from "./FilterSelects";
import CategoryCatalog from "./CategoryCatalog";
import FacetPanel from "./FacetPanel";
import BottomSheet from "./BottomSheet";
import SearchBox, { type Suggestion } from "./SearchBox";
import ActiveTags, { type FilterTag } from "./ActiveTags";
import RegionSuggest from "./RegionSuggest";
import Pagination from "./Pagination";
import styles from "./styles";


const MapPanel = dynamic(() => import("@/components/MapPanel"), {
  ssr: false,
  loading: () => (
    <div className="h-[560px] animate-pulse rounded-[16px] border border-line bg-[#e7ecff] max-[1000px]:h-[360px]" />
  ),
});

const PAGE_SIZE = 6;
const uniqSorted = (arr: string[]) => [...new Set(arr)].sort((a, b) => a.localeCompare(b, "tr"));
type Sort = "featured" | "rating" | "az";

export default function ListingView({
  initialGroups = [],
  initialTypes = [],
  initialCountry = "all",
  initialCity = "all",
  initialDistrict = "all",
  initialQ = "",
  initialVerified = false,
  initialMinRating = 0,
  initialSort = "featured",
  initialAttrs = [],
}: {
  initialGroups?: GroupKey[];
  initialTypes?: string[];
  initialCountry?: string;
  initialCity?: string;
  initialDistrict?: string;
  initialQ?: string;
  initialVerified?: boolean;
  initialMinRating?: number;
  initialSort?: Sort;
  initialAttrs?: string[];
}) {
  const t = useTranslations("listing");
  const tc = useTranslations("cat");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [groups, setGroups] = useState<Set<GroupKey>>(new Set(initialGroups));
  const [types, setTypes] = useState<Set<string>>(new Set(initialTypes));
  const [country, setCountry] = useState(initialCountry);
  const [city, setCity] = useState(initialCity);
  const [district, setDistrict] = useState(initialDistrict);
  const [q, setQ] = useState(initialQ);
  const [verifiedOnly, setVerifiedOnly] = useState(initialVerified);
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

  const countries = useMemo(() => uniqSorted(BUSINESSES.map((b) => b.country)), []);
  const cities = useMemo(
    () => uniqSorted(BUSINESSES.filter((b) => country === "all" || b.country === country).map((b) => b.city)),
    [country]
  );
  const districts = useMemo(
    () =>
      city === "all"
        ? []
        : uniqSorted(
            BUSINESSES.filter((b) => (country === "all" || b.country === country) && b.city === city).map((b) => b.district)
          ),
    [city, country]
  );

  // Alaka skoru: isimde geçen +3, tür +2, etiket/şehir/ilçe +1.
  const score = (b: (typeof BUSINESSES)[number], needle: string) => {
    if (!needle) return 0;
    let s = 0;
    if (normalizeTr(b.name).includes(needle)) s += 3;
    if (normalizeTr(b.type).includes(needle)) s += 2;
    if (normalizeTr(b.tag).includes(needle)) s += 1;
    if (normalizeTr(b.city).includes(needle)) s += 1;
    if (normalizeTr(b.district).includes(needle)) s += 1;
    return s;
  };

  // Tek facet'i atlayabilen ortak süzgeç — hem sonuç listesi hem sayaçlar için.
  const passes = (
    b: (typeof BUSINESSES)[number],
    needle: string,
    opts: { ignoreGroup?: boolean; ignoreType?: boolean } = {}
  ) => {
    if (!opts.ignoreGroup && groups.size && !groups.has(b.group)) return false;
    if (!opts.ignoreType && types.size && !types.has(b.type)) return false;
    if (country !== "all" && b.country !== country) return false;
    if (city !== "all" && b.city !== city) return false;
    if (district !== "all" && b.district !== district) return false;
    if (verifiedOnly && !b.verified) return false;
    if (minRating > 0 && b.rating < minRating) return false;
    if (!attrsPass(b.attributes, attrs)) return false;
    if (needle && score(b, needle) === 0) return false;
    return true;
  };

  const filtered = useMemo(() => {
    const needle = normalizeTr(deferredQ);
    const items = BUSINESSES.filter((b) => passes(b, needle)).map((b) => ({ b, s: score(b, needle) }));
    if (sort === "rating") items.sort((a, b) => b.b.rating - a.b.rating || b.b.reviews - a.b.reviews);
    else if (sort === "az") items.sort((a, b) => a.b.name.localeCompare(b.b.name, "tr"));
    // Varsayılan: arama varsa önce alaka skoru, yoksa sponsor + puan.
    else if (needle) items.sort((a, b) => b.s - a.s || Number(b.b.sponsored) - Number(a.b.sponsored) || b.b.rating - a.b.rating);
    else items.sort((a, b) => Number(b.b.sponsored) - Number(a.b.sponsored) || b.b.rating - a.b.rating);
    return items.map(({ b }) => b);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, types, country, city, district, deferredQ, verifiedOnly, minRating, attrs, sort]);

  // Facet sayaçları: grup sayımı grup+tür filtresini yok sayar; tür sayımı yalnız tür filtresini yok sayar.
  const groupCounts = useMemo(() => {
    const needle = normalizeTr(deferredQ);
    const acc: Record<string, number> = {};
    BUSINESSES.forEach((b) => {
      if (passes(b, needle, { ignoreGroup: true, ignoreType: true })) acc[b.group] = (acc[b.group] ?? 0) + 1;
    });
    return acc;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [types, country, city, district, deferredQ, verifiedOnly, minRating, attrs]);

  const typeCounts = useMemo(() => {
    const needle = normalizeTr(deferredQ);
    const acc: Record<string, number> = {};
    BUSINESSES.forEach((b) => {
      if (passes(b, needle, { ignoreType: true })) acc[b.type] = (acc[b.type] ?? 0) + 1;
    });
    return acc;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, country, city, district, deferredQ, verifiedOnly, minRating, attrs]);

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
      router.push(`/tedarikci/${s.id}`);
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
    setVerifiedOnly(false);
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
    if (verifiedOnly) p.set("verified", "1");
    if (minRating > 0) p.set("rating", String(minRating));
    if (attrs.size) p.set("attr", [...attrs].join(","));
    if (sort !== "featured") p.set("sort", sort);
    const qs = p.toString();
    if (qs !== (searchParams?.toString() ?? "")) {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, types, country, city, district, deferredQ, verifiedOnly, minRating, attrs, sort]);

  const regions = useMemo(() => {
    const scope = BUSINESSES.filter((b) => (country === "all" || b.country === country) && (!groups.size || groups.has(b.group)));
    const map = new Map<string, { city: string; country: string; count: number }>();
    scope.forEach((b) => {
      const e = map.get(b.city) ?? { city: b.city, country: b.country, count: 0 };
      e.count += 1;
      map.set(b.city, e);
    });
    const ranked = [...map.values()].sort((a, b) => b.count - a.count);
    if (filtered.length === 0) return { key: "regionEmpty", list: ranked.slice(0, 6) };
    if (city !== "all") return { key: "regionRelated", list: ranked.filter((e) => e.city !== city).slice(0, 5) };
    return { key: "regionPopular", list: ranked.slice(0, 6) };
  }, [groups, country, city, filtered.length]);

  const tags: FilterTag[] = [];
  groups.forEach((g) => tags.push({ kind: "group", value: g, label: tc(g) }));
  types.forEach((ty) => tags.push({ kind: "type", value: ty, label: ty }));
  if (country !== "all") tags.push({ kind: "country", value: country, label: country });
  if (city !== "all") tags.push({ kind: "city", value: city, label: city });
  if (district !== "all") tags.push({ kind: "district", value: district, label: district });
  if (verifiedOnly) tags.push({ kind: "verified", value: "", label: `✓ ${t("verifiedOnly")}` });
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
    else if (kind === "verified") setVerifiedOnly(false);
    else if (kind === "rating") setMinRating(0);
    else if (kind === "attr") toggleAttr(value);
    else if (kind === "q") setQ("");
    setPage(1);
  }

  const resultsColumn = (gridClass: string) => (
    <div>
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <h3 className={styles.emptyTitle}>{t("emptyTitle")}</h3>
          <p className={styles.emptyText}>{t("emptyText")}</p>
          <button type="button" className="btn btn-solid" onClick={reset}>{t("clearFilters")}</button>
        </div>
      ) : (
        <div className={gridClass}>
          {pageItems.map((b) => (
            <SupplierCard key={b.id} business={b} flag={b.sponsored ? tCommon("ad") : null} showStars>
              <Link href={`/teklif?s=${b.id}`} className="btn btn-solid btn-sm !px-3.5 !py-2 !text-[12.5px]">{tCommon("requestQuote")}</Link>
              <Link href={`/tedarikci/${b.id}`} className="btn btn-outline btn-sm !px-3.5 !py-2 !text-[12.5px]">{tCommon("detail")}</Link>
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
      groupCounts={groupCounts}
      typeCounts={typeCounts}
      onToggleGroup={toggleGroup}
      onToggleType={toggleType}
    />
  );

  // Mobil "Filtreler" rozeti için aktif konum/puan/doğrulama sayısı.
  const activeRefine =
    (country !== "all" ? 1 : 0) +
    (city !== "all" ? 1 : 0) +
    (district !== "all" ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (verifiedOnly ? 1 : 0);

  const selectProps = {
    country,
    city,
    district,
    verifiedOnly,
    minRating,
    countries,
    cities,
    districts,
    onCountry: (v: string) => { setCountry(v); setCity("all"); setDistrict("all"); setPage(1); },
    onCity: pickCity,
    onDistrict: (v: string) => { setDistrict(v); setPage(1); },
    onVerified: (v: boolean) => { setVerifiedOnly(v); setPage(1); },
    onMinRating: (v: number) => { setMinRating(v); setPage(1); },
  };

  return (
    <div>
      <div className={styles.head}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.sub}>{t("sub")}</p>
      </div>

      <div className={styles.layout}>
        {/* Sol kenar: kategoriler + hizmet/koşul facet'leri TEK kart içinde (masaüstü) */}
        <aside className={styles.catalogAside}>
          <CategoryCatalog
            groups={groups}
            types={types}
            groupCounts={groupCounts}
            typeCounts={typeCounts}
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
              <SearchBox value={q} onChange={(v) => { setQ(v); setPage(1); }} onPick={handlePick} />
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
              country={country}
              city={city}
              district={district}
              q={q}
              verifiedOnly={verifiedOnly}
              minRating={minRating}
              countries={countries}
              cities={cities}
              districts={districts}
              onCountry={selectProps.onCountry}
              onCity={selectProps.onCity}
              onDistrict={selectProps.onDistrict}
              onQ={(v) => { setQ(v); setPage(1); }}
              onPick={handlePick}
              onVerified={selectProps.onVerified}
              onMinRating={selectProps.onMinRating}
            />
          </div>

          <ActiveTags tags={tags} onRemove={removeTag} onClear={reset} />

          <div className={styles.resultsBar}>
        <p className={styles.count}>
          {t.rich("results", { count: filtered.length, b: (c) => <strong className={styles.countStrong}>{c}</strong> })}
          {city !== "all" ? ` · ${city}` : ""}
        </p>
        <div className={styles.barRight}>
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
            <select id="sort" className={styles.sortSelect} value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="featured">{t("sortFeatured")}</option>
              <option value="rating">{t("sortRating")}</option>
              <option value="az">{t("sortAz")}</option>
            </select>
          </div>
        </div>
      </div>

          <div className={styles.regionMobileHide}>
            <RegionSuggest title={t(regions.key)} list={regions.list} onPick={pickCity} />
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
}
