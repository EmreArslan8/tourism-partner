"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { PartnerPanelSelect } from "../_ui";
import styles from "../styles";

export default function RequestCategoryFields() {
  const tc = useTranslations("cat");
  const ts = useTranslations("service");
  const tq = useTranslations("quote");
  const [group, setGroup] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const current = CATEGORY_GROUPS.find((item) => item.key === group);

  const toggle = (slug: string) => {
    setSelected((items) => (items.includes(slug) ? items.filter((item) => item !== slug) : [...items, slug]));
  };

  return (
    <div className="grid gap-2.5">
      <label className={styles.labelCls}>
        {tq("category")}
        <PartnerPanelSelect
          name="target_group"
          value={group}
          onChange={(event) => {
            setGroup(event.target.value);
            setSelected([]);
          }}
        >
          <option value="">Tüm kategoriler</option>
          {CATEGORY_GROUPS.map((item) => <option key={item.key} value={item.key}>{tc(item.key)}</option>)}
        </PartnerPanelSelect>
      </label>

      {current && (
        <fieldset className="rounded-[10px] border border-line bg-paper/60 p-2.5">
          <legend className="px-1 text-[11px] font-extrabold uppercase tracking-[.06em] text-muted">
            {tq("select")}
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {current.children.map((child) => {
              const checked = selected.includes(child.slug);
              return (
                <label
                  key={child.slug}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors ${checked ? "border-sapphire bg-sapphire/10 text-brand" : "border-line bg-paper text-ink/80 hover:bg-cream/60"}`}
                >
                  <input type="checkbox" name="target_types" value={child.slug} checked={checked} onChange={() => toggle(child.slug)} className="sr-only" />
                  {ts(child.slug)}
                </label>
              );
            })}
          </div>
          <p className="mt-2 text-[11px] text-muted">Birden fazla alt kategori seçebilirsin.</p>
        </fieldset>
      )}
    </div>
  );
}
