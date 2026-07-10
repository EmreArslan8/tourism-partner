import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import styles from "./styles";

const FilterSelects = ({
  country,
  city,
  district,
  minRating,
  countries,
  cities,
  districts,
  onCountry,
  onCity,
  onDistrict,
  onMinRating,
  stack = false,
  showRating = true,
}: {
  country: string;
  city: string;
  district: string;
  minRating: number;
  countries: string[];
  cities: string[];
  districts: string[];
  onCountry: (v: string) => void;
  onCity: (v: string) => void;
  onDistrict: (v: string) => void;
  onMinRating: (v: number) => void;
  stack?: boolean;
  showRating?: boolean;
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
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
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
      {showRating && (
        <span className={selectWrap}>
          <select aria-label={t("minRating")} className={field} value={minRating} onChange={(e) => onMinRating(Number(e.target.value))}>
            <option value={0}>{t("minRating")}: {t("anyRating")}</option>
            <option value={4}>{t("minRating")}: 4.0+</option>
            <option value={4.5}>{t("minRating")}: 4.5+</option>
            <option value={4.8}>{t("minRating")}: 4.8+</option>
          </select>
          {chevron}
        </span>
      )}
    </>
  );

  return stack ? <div className={styles.sheetFilters}>{inner}</div> : inner;
};

export default FilterSelects;
