"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { GroupKey } from "@/lib/types";
import { visibleFacets } from "@/lib/facets";
import { cn } from "@/lib/utils";
import styles from "./styles";

/* Hizmet/koşul facet paneli — seçili gruplara göre ilgili facet'leri gösterir.
   bare=true → kendi kartı olmadan, kategori kartının içinde bölüm olarak render. */
const FacetPanel = ({
  groups,
  selected,
  onToggle,
  onClear,
  bare = false,
  minRating,
  onMinRating,
  ratingLabel,
}: {
  groups: GroupKey[];
  selected: Set<string>;
  onToggle: (slug: string) => void;
  onClear: () => void;
  bare?: boolean;
  /** Verildiğinde facet listesinin sonuna puan filtresi satırı eklenir (sol sidebar). */
  minRating?: number;
  onMinRating?: (v: number) => void;
  ratingLabel?: string;
}) => {
  const [closed, setClosed] = useState<Set<string>>(new Set());
  const facets = visibleFacets(groups);
  if (facets.length === 0 && !onMinRating) return null;

  return (
    <div className={bare ? styles.facetBare : styles.facetWrap}>
      <div className={styles.facetGroups}>
        {facets.map((f) => {
          const open = !closed.has(f.key);
          return (
            <div key={f.key} className={styles.facetRow}>
            <div className={styles.facetRowHead}>
              <button
                type="button"
                className={styles.facetRowToggle}
                onClick={() =>
                  setClosed((prev) => {
                    const next = new Set(prev);
                    if (next.has(f.key)) next.delete(f.key);
                    else next.add(f.key);
                    return next;
                  })
                }
                aria-expanded={open}
              >
                <span className={styles.facetRowLabel}>{f.label}</span>
                <ChevronDown className={cn(styles.facetChevron, open && styles.facetChevronOpen)} aria-hidden />
              </button>
              {selected.size > 0 && f.options.some((option) => selected.has(option.slug)) && (
                <button type="button" className={styles.facetClear} onClick={onClear}>
                  Temizle
                </button>
              )}
            </div>
            {open && <div className={styles.facetCheckList}>
              {f.options.map((o) => {
                const active = selected.has(o.slug);
                return (
                  <label key={o.slug} className={cn(styles.facetCheck, active && styles.facetCheckActive)}>
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => onToggle(o.slug)}
                      className="sr-only"
                    />
                    <span className={cn(styles.catCheckbox, active && styles.catCheckboxActive)} aria-hidden />
                    {o.label}
                  </label>
                );
              })}
            </div>}
          </div>
          );
        })}
        {onMinRating && (() => {
          const open = !closed.has("__rating");
          return (
            <div className={styles.facetRow}>
              <div className={styles.facetRowHead}>
                <button
                  type="button"
                  className={styles.facetRowToggle}
                  onClick={() =>
                    setClosed((prev) => {
                      const next = new Set(prev);
                      if (next.has("__rating")) next.delete("__rating");
                      else next.add("__rating");
                      return next;
                    })
                  }
                  aria-expanded={open}
                >
                  <span className={styles.facetRowLabel}>{ratingLabel}</span>
                  <ChevronDown className={cn(styles.facetChevron, open && styles.facetChevronOpen)} aria-hidden />
                </button>
              </div>
              {open && (
                <div className={styles.facetCheckList}>
                  {[4, 4.5, 4.8].map((v) => {
                    const active = minRating === v;
                    return (
                      <label key={v} className={cn(styles.facetCheck, active && styles.facetCheckActive)}>
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => onMinRating(active ? 0 : v)}
                          className="sr-only"
                        />
                        <span className={cn(styles.catCheckbox, active && styles.catCheckboxActive)} aria-hidden />
                        {v.toFixed(1)}+
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default FacetPanel;
