"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { Business } from "@/lib/types";
import { styles } from "./styles";


/* Ana sayfa hero arama — filtreleme burada YAPILMAZ, /kesfet'ye yönlendirir. */
export default function HeroSearch({ businesses }: { businesses: Business[] }) {
  const router = useRouter();
  const t = useTranslations("hero");
  const [country, setCountry] = useState("Türkiye");
  const [city, setCity] = useState("all");
  const [district, setDistrict] = useState("all");
  const [q, setQ] = useState("");
  const cityDisabled = country === "all";
  const districtDisabled = cityDisabled || city === "all";
  const countries = [...new Set(businesses.map((b) => b.country))].sort((a, b) =>
    a.localeCompare(b, "tr")
  );
  const cities =
    country === "all"
      ? []
      : [...new Set(businesses.filter((b) => b.country === country).map((b) => b.city))].sort((a, b) =>
          a.localeCompare(b, "tr")
        );
  const districts =
    districtDisabled
      ? []
      : [...new Set(businesses.filter((b) => b.country === country && b.city === city).map((b) => b.district))].sort((a, b) =>
          a.localeCompare(b, "tr")
        );

  function go(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (country !== "all") params.set("country", country);
    if (!cityDisabled && city !== "all") params.set("city", city);
    if (!districtDisabled && district !== "all") params.set("district", district);
    router.push(`/kesfet${params.toString() ? `?${params}` : ""}`);
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

      <div className={`hs-field ${styles.field}`}>
        <label htmlFor="heroCountry" className={styles.label}>{t("countryLabel")}</label>
        <span className={styles.selectShell}>
          <select
            id="heroCountry"
            aria-label={t("countryLabel")}
            className={styles.select}
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setCity("all");
              setDistrict("all");
            }}
          >
            <option value="all">{t("allCountries")}</option>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>

      <span className={`hs-divider ${styles.divider} ${cityDisabled ? styles.hiddenStep : ""}`} aria-hidden="true" />

      <div className={`hs-field ${styles.field} ${cityDisabled ? styles.hiddenStep : ""}`}>
        <label htmlFor="heroCity" className={styles.label}>{t("cityLabel")}</label>
        <span className={styles.selectShell}>
          <select
            id="heroCity"
            aria-label={t("cityLabel")}
            className={styles.select}
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

      <div className={`hs-field ${styles.field} ${districtDisabled ? styles.hiddenStep : ""}`}>
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
}
