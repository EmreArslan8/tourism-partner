"use client";

import { useMemo, useState } from "react";
import Field from "@/components/common/Field";
import { CATEGORY_GROUPS, serviceLabel } from "@/lib/categories";
import type { CategoryNode, GroupKey } from "@/lib/types";

/* Grup + çoklu hizmet seçimi. Bir işletme birden fazla alt kategori (hizmet)
   sunabilir; ilk seçilen birincil olur (server tarafında type'a yazılır). */
const BusinessCategoryFields = ({
  initialGroup,
  initialServices,
  initialType,
  inputClassName,
}: {
  initialGroup: GroupKey;
  initialServices: string[];
  initialType: string;
  inputClassName: string;
}) => {
  const [group, setGroup] = useState<GroupKey>(initialGroup);
  const [selected, setSelected] = useState<string[]>(initialServices);
  const selectedGroup = CATEGORY_GROUPS.find((item) => item.key === group) ?? CATEGORY_GROUPS[0];
  // Hiç hizmet seçilmezse (eski kayıt) birincil tür fallback'i korunur.
  const primaryType = selected.length > 0 ? serviceLabel(selected[0]) : initialType;

  // Alt kategorileri section başlıklarına göre grupla (görseldeki gibi).
  const sections = useMemo(() => {
    const map = new Map<string, CategoryNode[]>();
    for (const child of selectedGroup.children) {
      const key = child.section ?? "";
      (map.get(key) ?? map.set(key, []).get(key)!).push(child);
    }
    return [...map.entries()];
  }, [selectedGroup]);

  const toggle = (slug: string) =>
    setSelected((current) => (current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]));

  return (
    <div className="grid gap-3">
      {/* Hizmet seçilmediğinde bile birincil türü koru (eski kayıt uyumu). */}
      <input type="hidden" name="type" value={primaryType} />
      <Field label="Grup" required>
        <select
          name="group"
          value={group}
          className={inputClassName}
          onChange={(event) => {
            setGroup(event.target.value as GroupKey);
            setSelected([]); // slug'lar gruba özgü — grup değişince temizle
          }}
        >
          {CATEGORY_GROUPS.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
        </select>
      </Field>

      <Field label="Hizmetler (çoklu seçim — ilki birincil)" required>
        <div className="grid gap-3 rounded-[8px] border border-line bg-cream/30 p-3">
          {sections.map(([section, children]) => (
            <div key={section || "_"}>
              {section && <p className="mb-1.5 text-[11px] font-extrabold uppercase tracking-[.06em] text-muted">{section}</p>}
              <div className="flex flex-wrap gap-1.5">
                {children.map((child) => {
                  const checked = selected.includes(child.slug);
                  const primary = checked && selected[0] === child.slug;
                  return (
                    <label
                      key={child.slug}
                      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                        checked ? "border-sapphire bg-sapphire/10 text-brand" : "border-line bg-paper text-ink/80 hover:bg-cream/60"
                      }`}
                    >
                      <input type="checkbox" name="services" value={child.slug} checked={checked} onChange={() => toggle(child.slug)} className="sr-only" />
                      {child.label}
                      {primary && <span className="rounded-full bg-sapphire px-1.5 text-[10px] font-bold text-paper">Birincil</span>}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Field>
    </div>
  );
};

export default BusinessCategoryFields;
