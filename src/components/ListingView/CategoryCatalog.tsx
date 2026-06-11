"use client";

import { useTranslations } from "next-intl";
import { CATEGORY_GROUPS, GROUP_COLORS } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { GroupKey } from "@/lib/types";
import styles from "./styles";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg className={cn(styles.catChev, open && styles.catChevOpen)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export default function CategoryCatalog({
  groups,
  types,
  groupCounts,
  typeCounts,
  onToggleGroup,
  onToggleType,
  children,
}: {
  groups: Set<GroupKey>;
  types: Set<string>;
  groupCounts: Record<string, number>;
  typeCounts: Record<string, number>;
  onToggleGroup: (g: GroupKey) => void;
  onToggleType: (t: string) => void;
  /** Aynı kart içinde kategorilerin altında render edilecek ek filtreler (facet'ler). */
  children?: React.ReactNode;
}) {
  const tc = useTranslations("cat");
  const t = useTranslations("listing");
  const totalCount = CATEGORY_GROUPS.reduce((sum, g) => sum + (groupCounts[g.key] ?? 0), 0);

  return (
    <div className={styles.catalog}>
      <div className={styles.catalogTitle}>
        <span className={styles.catalogTitleText}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 7h16M7 12h10M10 17h4" />
          </svg>
          {t("suggestCategories")}
        </span>
        <span className={styles.catalogTotal}>{totalCount}</span>
      </div>

      {CATEGORY_GROUPS.map((g) => {
        const active = groups.has(g.key);
        const open = active || g.children.some((c) => types.has(c.label));
        return (
          <div key={g.key}>
            <button
              type="button"
              className={cn(styles.catHead, active && styles.catHeadActive)}
              onClick={() => onToggleGroup(g.key)}
              aria-pressed={active}
              aria-expanded={open}
            >
              <i className={styles.catDot} style={{ background: GROUP_COLORS[g.key] }} />
              <span className={styles.catLabel}>{tc(g.key)}</span>
              <span className={styles.catCount}>{groupCounts[g.key] ?? 0}</span>
              <span className={styles.catChevBtn} aria-hidden>
                <Chevron open={open} />
              </span>
            </button>

            {open && (
              <div className={styles.catChildren}>
                {g.children.map((c) => {
                  const on = types.has(c.label);
                  return (
                    <button
                      key={c.slug}
                      type="button"
                      className={cn(styles.catChild, on && styles.catChildActive)}
                      onClick={() => onToggleType(c.label)}
                      aria-pressed={on}
                    >
                      <span className={styles.catChildLabel}>{c.label}</span>
                      <span className={styles.catCount}>{typeCounts[c.label] ?? 0}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {children}
    </div>
  );
}
