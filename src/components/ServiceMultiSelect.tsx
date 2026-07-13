"use client";

import { useMemo, useState } from "react";
import { CATEGORY_GROUPS, serviceLabel } from "@/lib/categories";
import type { CategoryNode, GroupKey } from "@/lib/types";

/* Sabit gruba ait alt kategorilerin çoklu seçimi (business_services). Grup değişmez —
   partner kayıt sırasında grubunu belirler; burada yalnızca hizmetlerini işaretler.
   İlk seçilen birincil olur (server type'a yazar); gizli `type` input'u fallback tutar. */
const ServiceMultiSelect = ({
  group,
  initialServices,
  initialType,
  className,
}: {
  group: GroupKey;
  initialServices: string[];
  initialType: string;
  className?: string;
}) => {
  const [selected, setSelected] = useState<string[]>(initialServices);
  const groupNode = CATEGORY_GROUPS.find((item) => item.key === group) ?? CATEGORY_GROUPS[0];
  const primaryType = selected.length > 0 ? serviceLabel(selected[0]) : initialType;

  const sections = useMemo(() => {
    const map = new Map<string, CategoryNode[]>();
    for (const child of groupNode.children) {
      const key = child.section ?? "";
      (map.get(key) ?? map.set(key, []).get(key)!).push(child);
    }
    return [...map.entries()];
  }, [groupNode]);

  const toggle = (slug: string) =>
    setSelected((current) => (current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]));

  return (
    <div className={className}>
      <input type="hidden" name="type" value={primaryType} />
      <div className="grid gap-3">
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
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${
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
    </div>
  );
};

export default ServiceMultiSelect;
