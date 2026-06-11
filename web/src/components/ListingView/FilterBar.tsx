import { useTranslations } from "next-intl";
import { CATEGORY_GROUPS, GROUP_COLORS } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { GroupKey } from "@/lib/types";
import { s } from "./styles";

export default function FilterBar({
  groups,
  city,
  district,
  q,
  cities,
  districts,
  onToggleGroup,
  onCity,
  onDistrict,
  onQ,
}: {
  groups: Set<GroupKey>;
  city: string;
  district: string;
  q: string;
  cities: string[];
  districts: string[];
  onToggleGroup: (g: GroupKey) => void;
  onCity: (v: string) => void;
  onDistrict: (v: string) => void;
  onQ: (v: string) => void;
}) {
  const t = useTranslations("listing");
  const tc = useTranslations("cat");
  return (
    <div className={s.bar}>
      <div className={s.chips}>
        {CATEGORY_GROUPS.map((g) => (
          <button
            key={g.key}
            type="button"
            className={cn(s.chip, groups.has(g.key) && s.chipActive)}
            onClick={() => onToggleGroup(g.key)}
          >
            <i className={s.chipDot} style={{ background: GROUP_COLORS[g.key] }} />
            {tc(g.key)}
          </button>
        ))}
      </div>
      <select aria-label={t("allCities")} className={s.field} value={city} onChange={(e) => onCity(e.target.value)}>
        <option value="all">{t("allCities")}</option>
        {cities.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <select
        aria-label={t("allDistricts")}
        className={s.field}
        value={district}
        disabled={city === "all"}
        onChange={(e) => onDistrict(e.target.value)}
      >
        <option value="all">{city === "all" ? t("cityFirst") : t("allDistricts")}</option>
        {districts.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
      <input
        type="text"
        className={s.search}
        placeholder={t("searchPh")}
        value={q}
        onChange={(e) => onQ(e.target.value)}
        aria-label={t("searchPh")}
      />
    </div>
  );
}
