"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useRegions } from "@/lib/geo";
import styles from "./styles";


/* Hero arama — ülke/şehir/ilçe TAM dünya listesinden gelir (public/geo chunk'ları),
   kayıtlı tedarikçi verisinden değil (MVP: tüm bölgeler seçilebilir görünmeli). */
const HeroSearch = () => {
  const router = useRouter();
  const t = useTranslations("hero");
  const [country, setCountry] = useState("all");
  const [city, setCity] = useState("all");
  const [district, setDistrict] = useState("all");
  const [q, setQ] = useState("");
  const cityDisabled = country === "all";
  const districtDisabled = cityDisabled || city === "all";
  const { countries, cities, districts } = useRegions(
    country === "all" ? "" : country,
    city === "all" ? "" : city,
    district === "all" ? "" : district,
  );

  function go(e: React.FormEvent) {
    e.preventDefault();
    const query: Record<string, string> = {};
    if (q.trim()) query.q = q.trim();
    if (country !== "all") query.country = country;
    if (!cityDisabled && city !== "all") query.city = city;
    if (!districtDisabled && district !== "all") query.district = district;
    
    router.push({
      pathname: "/explore",
      query: query
    });
  }

  return (
    <form className={`hero-search ${styles.form}`} id="heroSearch" onSubmit={go}>
      <div className={`hs-field hs-grow ${styles.field} ${styles.grow}`}>
        <label htmlFor="heroSearchInput" className={styles.label}>{t("searchLabel")}</label>
        <input
          id="heroSearchInput"
          type="text"
          className={styles.input}
          placeholder={t("searchPh")}
          autoComplete="off"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label={t("searchPh")}
        />
      </div>

      <span className={`hs-divider ${styles.divider}`} aria-hidden="true" />

      <div className={`hs-field ${styles.field} ${styles.fieldSelect}`}>
        <label htmlFor="heroCountry" className={styles.label}>{t("countryLabel")}</label>
        <span className={styles.selectShell}>
          <svg className={styles.selectIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
          </svg>
          <select
            id="heroCountry"
            aria-label={t("countryLabel")}
            className={`${styles.select} ${styles.selectPad}`}
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setCity("all");
              setDistrict("all");
            }}
          >
            <option value="all">{t("allCountries")}</option>
            {countries.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>

      <span className={`hs-divider ${styles.divider} ${cityDisabled ? styles.hiddenStep : ""}`} aria-hidden="true" />

      <div className={`hs-field ${styles.field} ${styles.fieldSelect} ${cityDisabled ? styles.hiddenStep : ""}`}>
        <label htmlFor="heroCity" className={styles.label}>{t("cityLabel")}</label>
        <span className={styles.selectShell}>
          <svg className={styles.selectIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 21s-7-4.5-7-10a7 7 0 0 1 14 0c0 5.5-7 10-7 10Z" /><circle cx="12" cy="11" r="2.5" />
          </svg>
          <select
            id="heroCity"
            aria-label={t("cityLabel")}
            className={`${styles.select} ${styles.selectPad}`}
            value={city}
            disabled={cityDisabled}
            onChange={(e) => {
              setCity(e.target.value);
              setDistrict("all");
            }}
          >
            <option value="all">{cityDisabled ? t("countryFirst") : t("searchCity")}</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>

      <span className={`hs-divider ${styles.divider} ${districtDisabled ? styles.hiddenStep : ""}`} aria-hidden="true" />

      <div className={`hs-field ${styles.field} ${styles.fieldSelect} ${districtDisabled ? styles.hiddenStep : ""}`}>
        <label htmlFor="heroDistrict" className={styles.label}>{t("districtLabel")}</label>
        <span className={styles.selectShell}>
          <select
            id="heroDistrict"
            aria-label={t("districtLabel")}
            className={styles.select}
            value={district}
            disabled={districtDisabled}
            onChange={(e) => setDistrict(e.target.value)}
          >
            <option value="all">{districtDisabled ? t("cityFirst") : t("allDistricts")}</option>
            {districts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>

      <button type="submit" className={`hs-btn ${styles.submit}`}>
        <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4.2-4.2" />
        </svg>
        <span>{t("searchBtn")}</span>
      </button>
    </form>
  );
};

export default HeroSearch;
