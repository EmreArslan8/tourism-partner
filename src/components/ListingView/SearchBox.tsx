"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { BUSINESSES } from "@/lib/data";
import { CATEGORY_GROUPS, GROUP_COLORS } from "@/lib/categories";
import { cn, normalizeTr } from "@/lib/utils";
import type { GroupKey } from "@/lib/types";
import styles from "./styles";

export type Suggestion =
  | { kind: "business"; id: number; label: string; sub: string }
  | { kind: "region"; city: string; district?: string; label: string }
  | { kind: "group"; value: GroupKey; label: string }
  | { kind: "type"; value: string; label: string };

const MAX_BUSINESS = 5;
const MAX_REGION = 4;
const MAX_CAT = 3;

export default function SearchBox({
  value,
  onChange,
  onPick,
}: {
  value: string;
  onChange: (v: string) => void;
  onPick: (s: Suggestion) => void;
}) {
  const t = useTranslations("listing");
  const tc = useTranslations("cat");
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const sections = useMemo(() => {
    const needle = normalizeTr(value);
    if (needle.length < 2) return [] as { key: string; label: string; items: Suggestion[] }[];

    const businesses: Suggestion[] = BUSINESSES.filter((b) => normalizeTr(b.name).includes(needle))
      .slice(0, MAX_BUSINESS)
      .map((b) => ({ kind: "business", id: b.id, label: b.name, sub: `${b.city} · ${b.type}` }));

    const seen = new Set<string>();
    const regions: Suggestion[] = [];
    for (const b of BUSINESSES) {
      if (regions.length >= MAX_REGION) break;
      if (normalizeTr(b.city).includes(needle) && !seen.has(b.city)) {
        seen.add(b.city);
        regions.push({ kind: "region", city: b.city, label: b.city });
      } else if (normalizeTr(b.district).includes(needle) && !seen.has(`${b.city}/${b.district}`)) {
        seen.add(`${b.city}/${b.district}`);
        regions.push({ kind: "region", city: b.city, district: b.district, label: `${b.district}, ${b.city}` });
      }
    }

    const cats: Suggestion[] = [];
    for (const g of CATEGORY_GROUPS) {
      if (cats.length >= MAX_CAT) break;
      if (normalizeTr(tc(g.key)).includes(needle)) cats.push({ kind: "group", value: g.key, label: tc(g.key) });
    }
    for (const g of CATEGORY_GROUPS) {
      for (const c of g.children) {
        if (cats.length >= MAX_CAT) break;
        if (normalizeTr(c.label).includes(needle)) cats.push({ kind: "type", value: c.label, label: c.label });
      }
    }

    return [
      { key: "suggestBusinesses", label: t("suggestBusinesses"), items: businesses },
      { key: "suggestRegions", label: t("suggestRegions"), items: regions },
      { key: "suggestCategories", label: t("suggestCategories"), items: cats },
    ].filter((s) => s.items.length > 0);
  }, [value, t, tc]);

  const flat = useMemo(() => sections.flatMap((s) => s.items), [sections]);

  // Dışarı tıklayınca öneri panelini kapat.
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function choose(s: Suggestion) {
    onPick(s);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || flat.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % flat.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + flat.length) % flat.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(flat[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const showPanel = open && normalizeTr(value).length >= 2;
  const listboxId = "supplier-search-results";

  const SearchIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden width="18" height="18">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );

  return (
    <div className={styles.acWrap} ref={wrapRef}>
      <span className={styles.acSearchIcon}>{SearchIcon}</span>
      <input
        type="text"
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={showPanel ? "true" : "false"}
        aria-autocomplete="list"
        className={styles.acInput}
        placeholder={t("searchPh")}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        aria-label={t("searchPh")}
      />

      {showPanel && (
        <div className={styles.acPanel} id={listboxId} role="listbox">
          {flat.length === 0 ? (
            <div className={styles.acEmpty}>{t("suggestEmpty")}</div>
          ) : (
            sections.map((sec) => {
              const offset = flat.findIndex((it) => sec.items.includes(it));
              return (
                <div key={sec.key}>
                  <div className={styles.acGroup}>{sec.label}</div>
                  {sec.items.map((s, i) => {
                    const idx = offset + i;
                    return (
                      <button
                        key={`${s.kind}-${"id" in s ? s.id : s.label}`}
                        type="button"
                        role="option"
                        aria-selected={idx === active}
                        className={cn(styles.acItem, idx === active && styles.acItemActive)}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => choose(s)}
                      >
                        {s.kind === "group" ? (
                          <i className={styles.acDot} style={{ background: GROUP_COLORS[s.value] }} />
                        ) : (
                          <Icon kind={s.kind} className={styles.acIcon} />
                        )}
                        <span className={styles.acItemMain}>{s.label}</span>
                        {s.kind === "business" && <span className={styles.acItemSub}>{s.sub}</span>}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function Icon({ kind, className }: { kind: Suggestion["kind"]; className: string }) {
  if (kind === "region")
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" />
        <circle cx="12" cy="10" r="2.4" />
      </svg>
    );
  if (kind === "type")
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 7h18M3 12h18M3 17h18" />
      </svg>
    );
  // business
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
    </svg>
  );
}
