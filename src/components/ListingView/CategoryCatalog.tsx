"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CATEGORY_GROUPS, GROUP_COLORS } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { CategoryGroup, GroupKey } from "@/lib/types";
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
}: {
  groups: Set<GroupKey>;
  types: Set<string>;
  groupCounts: Record<string, number>;
  typeCounts: Record<string, number>;
  onToggleGroup: (g: GroupKey) => void;
  onToggleType: (t: string) => void;
}) {
  const tc = useTranslations("cat");
  const t = useTranslations("listing");
  const [manual, setManual] = useState<Set<GroupKey>>(new Set());

  const isOpen = (g: CategoryGroup) =>
    manual.has(g.key) || groups.has(g.key) || g.children.some((c) => types.has(c.label));

  const toggleExpand = (k: GroupKey) =>
    setManual((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  return (
    <div className={styles.catalog}>
      <div className={styles.catalogTitle}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
        {t("eyebrow")}
      </div>

      {CATEGORY_GROUPS.map((g) => {
        const open = isOpen(g);
        const active = groups.has(g.key);
        return (
          <div key={g.key}>
            <div className={cn(styles.catHead, active && styles.catHeadActive)}>
              <button
                type="button"
                className={cn(styles.catHeadMain, active && styles.catHeadMainActive)}
                onClick={() => onToggleGroup(g.key)}
                aria-pressed={active}
              >
                <i className={styles.catDot} style={{ background: GROUP_COLORS[g.key] }} />
                <span className={styles.catLabel}>{tc(g.key)}</span>
                <span className={styles.catCount}>{groupCounts[g.key] ?? 0}</span>
              </button>
              <button
                type="button"
                className={styles.catChevBtn}
                onClick={() => toggleExpand(g.key)}
                aria-label={tc(g.key)}
                aria-expanded={open}
              >
                <Chevron open={open} />
              </button>
            </div>

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
    </div>
  );
}
