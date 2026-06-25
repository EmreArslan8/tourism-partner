"use client";

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
}: {
  groups: GroupKey[];
  selected: Set<string>;
  onToggle: (slug: string) => void;
  onClear: () => void;
  bare?: boolean;
}) => {
  const facets = visibleFacets(groups);
  if (facets.length === 0) return null;

  return (
    <div className={bare ? styles.facetBare : styles.facetWrap}>
      <div className={styles.facetHead}>
        <svg className={styles.facetHeadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 5h18M6 12h12M10 19h4" />
        </svg>
        Hizmet &amp; koşul filtreleri
        {selected.size > 0 && (
          <button type="button" className={styles.facetClear} onClick={onClear}>
            Temizle ({selected.size})
          </button>
        )}
      </div>

      <div className={styles.facetGroups}>
        {facets.map((f) => (
          <div key={f.key} className={styles.facetRow}>
            <span className={styles.facetRowLabel}>{f.label}</span>
            <div className={styles.facetCheckList}>
              {f.options.map((o) => {
                const active = selected.has(o.slug);
                return (
                  <label key={o.slug} className={cn(styles.facetCheck, active && styles.facetCheckActive)}>
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => onToggle(o.slug)}
                      className={styles.facetCheckbox}
                    />
                    {o.label}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacetPanel;
