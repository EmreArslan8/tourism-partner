"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BUSINESSES } from "@/lib/data";
import { groupLabel } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { GroupKey } from "@/lib/types";
import MapPanel from "@/components/MapPanel";
import SupplierCard from "@/components/SupplierCard";
import FilterBar from "./FilterBar";
import ActiveTags, { type FilterTag } from "./ActiveTags";
import RegionSuggest from "./RegionSuggest";
import Pagination from "./Pagination";
import { s } from "./styles";

const PAGE_SIZE = 6;
const uniqSorted = (arr: string[]) => [...new Set(arr)].sort((a, b) => a.localeCompare(b, "tr"));
type Sort = "featured" | "rating" | "az";

export default function ListingView({
  initialGroups = [],
  initialCity = "all",
}: {
  initialGroups?: GroupKey[];
  initialCity?: string;
}) {
  const [groups, setGroups] = useState<Set<GroupKey>>(new Set(initialGroups));
  const [city, setCity] = useState(initialCity);
  const [district, setDistrict] = useState("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const [view, setView] = useState<"list" | "map">("list");
  const [page, setPage] = useState(1);

  const cities = useMemo(() => uniqSorted(BUSINESSES.map((b) => b.city)), []);
  const districts = useMemo(
    () => (city === "all" ? [] : uniqSorted(BUSINESSES.filter((b) => b.city === city).map((b) => b.district))),
    [city]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLocaleLowerCase("tr");
    const items = BUSINESSES.filter((b) => {
      if (groups.size && !groups.has(b.group)) return false;
      if (city !== "all" && b.city !== city) return false;
      if (district !== "all" && b.district !== district) return false;
      if (needle) {
        const hay = `${b.name} ${b.type} ${b.tag} ${b.city} ${b.district}`.toLocaleLowerCase("tr");
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    if (sort === "rating") items.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    else if (sort === "az") items.sort((a, b) => a.name.localeCompare(b.name, "tr"));
    else items.sort((a, b) => Number(b.sponsored) - Number(a.sponsored) || b.rating - a.rating);
    return items;
  }, [groups, city, district, q, sort]);

  const maxPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, maxPage);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function toggleGroup(g: GroupKey) {
    setGroups((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });
    setPage(1);
  }
  function pickCity(v: string) {
    setCity(v);
    setDistrict("all");
    setPage(1);
  }
  function reset() {
    setGroups(new Set());
    setCity("all");
    setDistrict("all");
    setQ("");
    setSort("featured");
    setPage(1);
  }

  // bölge önerileri
  const regions = useMemo(() => {
    const scope = BUSINESSES.filter((b) => !groups.size || groups.has(b.group));
    const map = new Map<string, { city: string; country: string; count: number }>();
    scope.forEach((b) => {
      const e = map.get(b.city) ?? { city: b.city, country: b.country, count: 0 };
      e.count += 1;
      map.set(b.city, e);
    });
    const ranked = [...map.values()].sort((a, b) => b.count - a.count);
    if (filtered.length === 0) return { title: "Sonuç yok — diğer bölgeleri deneyin", list: ranked.slice(0, 6) };
    if (city !== "all")
      return { title: "Bu bölgeyi sevdiyseniz bunları da keşfedin", list: ranked.filter((e) => e.city !== city).slice(0, 5) };
    return { title: "Popüler bölgeler", list: ranked.slice(0, 6) };
  }, [groups, city, filtered.length]);

  // aktif filtre etiketleri
  const tags: FilterTag[] = [];
  groups.forEach((g) => tags.push({ kind: "group", value: g, label: groupLabel(g) }));
  if (city !== "all") tags.push({ kind: "city", value: city, label: city });
  if (district !== "all") tags.push({ kind: "district", value: district, label: district });
  if (q.trim()) tags.push({ kind: "q", value: "", label: `“${q.trim()}”` });

  function removeTag(kind: string, value: string) {
    if (kind === "group") toggleGroup(value as GroupKey);
    else if (kind === "city") pickCity("all");
    else if (kind === "district") setDistrict("all");
    else if (kind === "q") setQ("");
    setPage(1);
  }

  // Sonuç sütunu: liste modunda tam genişlik (gridWide), harita modunda dar (grid).
  const resultsColumn = (gridClass: string) => (
    <div>
      {filtered.length === 0 ? (
        <div className={s.empty}>
          <h3 className={s.emptyTitle}>Sonuç bulunamadı</h3>
          <p className={s.emptyText}>Filtreleri genişleterek tekrar deneyin.</p>
          <button type="button" className="btn btn-solid" onClick={reset}>Filtreleri Temizle</button>
        </div>
      ) : (
        <div className={gridClass}>
          {pageItems.map((b) => (
            <SupplierCard key={b.id} business={b} flag={b.sponsored ? "Reklam" : null} showStars>
              <Link href={`/teklif?s=${b.id}`} className="btn btn-solid btn-sm">Teklif İste</Link>
              <Link href={`/tedarikci/${b.id}`} className="btn btn-outline btn-sm">Detay</Link>
            </SupplierCard>
          ))}
        </div>
      )}
      <Pagination page={safePage} maxPage={maxPage} onPage={setPage} />
    </div>
  );

  return (
    <div>
      <div className={s.head}>
        <p className="eyebrow">Listeleme</p>
        <h1 className={s.title}>Tedarikçileri keşfedin</h1>
        <p className={s.sub}>Kategori, şehir ve ilçe bazlı filtreleyin.</p>
      </div>

      <FilterBar
        groups={groups}
        city={city}
        district={district}
        q={q}
        cities={cities}
        districts={districts}
        onToggleGroup={toggleGroup}
        onCity={pickCity}
        onDistrict={(v) => { setDistrict(v); setPage(1); }}
        onQ={(v) => { setQ(v); setPage(1); }}
      />

      <ActiveTags tags={tags} onRemove={removeTag} onClear={reset} />

      <div className={s.resultsBar}>
        <p className={s.count}>
          <strong className={s.countStrong}>{filtered.length}</strong> sonuç
          {city !== "all" ? ` · ${city}` : ""}
        </p>
        <div className={s.barRight}>
          <div className={s.viewToggle} role="tablist" aria-label="Görünüm">
            <button
              type="button"
              role="tab"
              aria-selected={view === "list"}
              className={cn(s.viewBtn, view === "list" && s.viewBtnActive)}
              onClick={() => setView("list")}
            >
              <svg className={s.viewIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
              Liste
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === "map"}
              className={cn(s.viewBtn, view === "map" && s.viewBtnActive)}
              onClick={() => setView("map")}
            >
              <svg className={s.viewIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.4" />
              </svg>
              Harita
            </button>
          </div>
          <div className={s.sortWrap}>
            <label className={s.sortLabel} htmlFor="sort">Sırala</label>
            <select id="sort" className={s.sortSelect} value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="featured">Önerilen</option>
              <option value="rating">Puana göre</option>
              <option value="az">A → Z</option>
            </select>
          </div>
        </div>
      </div>

      <RegionSuggest title={regions.title} list={regions.list} onPick={pickCity} />

      {view === "map" ? (
        <div className={s.shell}>
          {resultsColumn(s.grid)}
          <aside className={s.mapAside}>
            <MapPanel items={filtered} />
          </aside>
        </div>
      ) : (
        resultsColumn(s.gridWide)
      )}
    </div>
  );
}
