import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import styles from "./styles";

export default function FilterSelects({
  country,
  city,
  district,
  verifiedOnly,
  minRating,
  countries,
  cities,
  districts,
  onCountry,
  onCity,
  onDistrict,
  onVerified,
  onMinRating,
  stack = false,
}: {
  country: string;
  city: string;
  district: string;
  verifiedOnly: boolean;
  minRating: number;
  countries: string[];
  cities: string[];
  districts: string[];
  onCountry: (v: string) => void;
  onCity: (v: string) => void;
  onDistrict: (v: string) => void;
  onVerified: (v: boolean) => void;
  onMinRating: (v: number) => void;
  stack?: boolean;
}) {
  const t = useTranslations("listing");
  const field = cn(styles.field, stack && "!w-full");

  const inner = (
    <>
      <select aria-label={t("allCountries")} className={field} value={country} onChange={(e) => onCountry(e.target.value)}>
        <option value="all">{t("allCountries")}</option>
        {countries.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <select aria-label={t("allCities")} className={field} value={city} onChange={(e) => onCity(e.target.value)}>
        <option value="all">{t("allCities")}</option>
        {cities.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
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
      <select aria-label={t("minRating")} className={field} value={minRating} onChange={(e) => onMinRating(Number(e.target.value))}>
        <option value={0}>{t("minRating")}: {t("anyRating")}</option>
        <option value={4}>{t("minRating")}: 4.0+</option>
        <option value={4.5}>{t("minRating")}: 4.5+</option>
        <option value={4.8}>{t("minRating")}: 4.8+</option>
      </select>
      <button
        type="button"
        aria-pressed={verifiedOnly}
        className={cn(styles.toggle, verifiedOnly && styles.toggleActive, stack && "!w-full")}
        onClick={() => onVerified(!verifiedOnly)}
      >
        <span className={styles.toggleBox} style={{ background: verifiedOnly ? "var(--color-terra, #d6633f)" : "transparent" }}>
          {verifiedOnly && (
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
        {t("verifiedOnly")}
      </button>
    </>
  );

  return stack ? <div className={styles.sheetFilters}>{inner}</div> : inner;
}
