"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { GroupKey } from "@/lib/types";
import styles from "./styles";

const normalize = (value: string) =>
  value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

const CategoryCatalog = ({
  groups,
  types,
  onToggleGroup,
  onToggleType,
  children,
}: {
  groups: Set<GroupKey>;
  types: Set<string>;
  onToggleGroup: (g: GroupKey) => void;
  onToggleType: (t: string) => void;
  /** Aynı kart içinde kategorilerin altında render edilecek ek filtreler (facet'ler). */
  children?: React.ReactNode;
}) => {
  const tc = useTranslations("cat");
  const t = useTranslations("listing");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(true);
  const needle = normalize(query.trim());
  const visibleGroups = useMemo(
    () =>
      CATEGORY_GROUPS.map((g) => ({
        ...g,
        groupLabel: tc(g.key),
        children: g.children.filter((c) => !needle || normalize(c.label).includes(needle)),
      })).filter((g) => !needle || normalize(g.groupLabel).includes(needle) || g.children.length > 0),
    [needle, tc]
  );

  return (
    <div className={styles.catalog}>
      <div className={styles.catalogTitle}>
        <button
          type="button"
          className={styles.catalogCollapse}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
        >
          <span>{t("suggestCategories")}</span>
          <ChevronDown className={cn(styles.catalogChevron, open && styles.catalogChevronOpen)} aria-hidden />
        </button>
      </div>
      {open && (
        <>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className={styles.catalogSearch}
            placeholder={t("categorySearch")}
          />

          <div className={styles.catList}>
          {visibleGroups.map((g) => {
        const active = groups.has(g.key);
        const showChildren = active || g.children.some((c) => types.has(c.label)) || Boolean(needle);
        return (
          <div key={g.key} className={styles.catBlock}>
            <button
              type="button"
              className={cn(styles.catHead, active && styles.catHeadActive)}
              onClick={() => onToggleGroup(g.key)}
              aria-pressed={active}
            >
              <span className={cn(styles.catCheckbox, active && styles.catCheckboxActive)} aria-hidden />
              <span className={styles.catLabel}>{g.groupLabel}</span>
            </button>

            {showChildren && (
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
                      <span className={cn(styles.catCheckbox, on && styles.catCheckboxActive)} aria-hidden />
                      <span className={styles.catChildLabel}>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
          </div>
        </>
      )}

      {children}
    </div>
  );
};

export default CategoryCatalog;
