import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { CountryOption } from "@/lib/geo";
import styles from "./styles";

const FilterSelects = ({
  country,
  city,
  district,
  countries,
  cities,
  districts,
  onCountry,
  onCity,
  onDistrict,
  stack = false,
}: {
  country: string;
  city: string;
  district: string;
  countries: CountryOption[];
  cities: string[];
  districts: string[];
  onCountry: (v: string) => void;
  onCity: (v: string) => void;
  onDistrict: (v: string) => void;
  stack?: boolean;
}) => {
  const t = useTranslations("listing");
  const field = cn(styles.field, styles.selectControl, "peer", stack && "!w-full");
  const selectWrap = cn(styles.selectWrap, !stack && styles.selectField, stack && "!w-full");

  const chevron = (
    <svg className={styles.selectChevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );

  const inner = (
    <>
      <span className={selectWrap}>
        <select aria-label={t("allCountries")} className={field} value={country} onChange={(e) => onCountry(e.target.value)}>
          <option value="all">{t("allCountries")}</option>
          {countries.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        {chevron}
      </span>
      <span className={selectWrap}>
        <select aria-label={t("allCities")} className={field} value={city} onChange={(e) => onCity(e.target.value)}>
          <option value="all">{t("allCities")}</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {chevron}
      </span>
      <span className={selectWrap}>
        <select
          aria-label={t("allDistricts")}
          className={field}
          value={district}
          disabled={city === "all"}
          onChange={(e) => onDistrict(e.target.value)}
        >
          <option value="all">{city === "all" ? t("cityFirst") : t("allDistricts")}</option>
          {districts.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        {chevron}
      </span>
    </>
  );

  return stack ? <div className={styles.sheetFilters}>{inner}</div> : inner;
};

export default FilterSelects;
