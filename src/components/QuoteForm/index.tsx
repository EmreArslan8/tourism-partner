"use client";

import { useActionState, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { Business, GroupKey } from "@/lib/types";
import { GROUP_COLORS } from "@/lib/categories";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { getCityOptions, getCountryOptions, getDistrictOptions } from "@/lib/regions";
import { cn, initials } from "@/lib/utils";
import { submitQuote } from "@/lib/actions/quote";
import styles from "./styles";


/* Teklif (RFQ) formu — gönderim Supabase quotes tablosuna yazar (server action). */
const QuoteForm = ({ business }: { business: Business | null }) => {
  const [state, action, pending] = useActionState(submitQuote, { ok: false });
  const t = useTranslations("quote");
  const tc = useTranslations("cat");
  const isGeneral = !business;
  const countries = useMemo(() => getCountryOptions(), []);
  const [group, setGroup] = useState<GroupKey | "">("");
  const [categoryType, setCategoryType] = useState("");
  const selectedGroup = CATEGORY_GROUPS.find((item) => item.key === group);
  const [country, setCountry] = useState(countries.includes("Türkiye") ? "Türkiye" : countries[0] ?? "");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const cities = useMemo(() => getCityOptions(country), [country]);
  const districts = useMemo(() => getDistrictOptions(country, city), [country, city]);

  const serviceOptions = business
    ? [business.type, t("optAccommodation"), t("optTransfer"), t("optTour")]
    : CATEGORY_GROUPS.map((g) => tc(g.key));

  return (
    <div className={styles.card}>
      <h1 className="mb-2 text-[28px]">{business ? t("titleSupplier") : t("titleGeneral")}</h1>
      <p className={styles.note}>{t("note")}</p>

      {business && (
        <div className={`${styles.supplier} mt-5`}>
          <span className={styles.supplierMono} style={{ background: GROUP_COLORS[business.group] }}>
            {initials(business.name)}
          </span>
          <div>
            <p className={styles.supplierName}>{business.name}</p>
            <p className={styles.supplierMeta}>{tc(business.group)} · {business.type} — {business.city}</p>
          </div>
        </div>
      )}

      <form className={styles.form} action={action}>
        {/* Honeypot — botlar doldurur, gerçek kullanıcı görmez */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        {business && <input type="hidden" name="businessId" value={business.id} />}
        {business && (
          <>
            <input type="hidden" name="categoryGroup" value={business.group} />
            <input type="hidden" name="categoryType" value={business.type} />
            <input type="hidden" name="country" value={business.country} />
            <input type="hidden" name="city" value={business.city} />
            <input type="hidden" name="district" value={business.district} />
          </>
        )}
        <div className={styles.row}>
          <label className={styles.label}>{t("name")}<input name="name" required className={styles.field} placeholder={t("namePh")} /></label>
          <label className={styles.label}>{t("company")}<input name="company" className={styles.field} placeholder={t("companyPh")} /></label>
        </div>
        <label className={styles.label}>{t("email")}<input name="email" type="email" required className={styles.field} placeholder={t("emailPh")} /></label>
        <label className={styles.label}>{t("phone")}<input name="phone" type="tel" required className={styles.field} placeholder={t("phonePh")} /></label>
        {isGeneral ? (
          <>
            <input type="hidden" name="categoryGroup" value={group} />
            <input type="hidden" name="categoryType" value={categoryType} />
            <fieldset className={styles.choiceSet}>
              <legend className={styles.choiceLegend}>{t("category")}</legend>
              <div className={styles.categoryGrid}>
                {CATEGORY_GROUPS.map((item) => {
                  const active = group === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      className={cn(styles.categoryOption, active && styles.categoryOptionActive)}
                      onClick={() => {
                        setGroup(item.key);
                        setCategoryType("");
                      }}
                      aria-pressed={active}
                    >
                      <span className={styles.categoryDot} style={{ backgroundColor: GROUP_COLORS[item.key] }} aria-hidden />
                      <span>{tc(item.key)}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className={styles.choiceSet}>
              <legend className={styles.choiceLegend}>{t("type")}</legend>
              {selectedGroup ? (
                <div className={styles.typeGrid}>
                  {selectedGroup.children.map((item) => {
                    const active = categoryType === item.label;
                    return (
                      <button
                        key={item.slug}
                        type="button"
                        className={cn(styles.typeOption, active && styles.typeOptionActive)}
                        onClick={() => setCategoryType(item.label)}
                        aria-pressed={active}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className={styles.typeEmpty}>{t("categoryFirst")}</p>
              )}
            </fieldset>
            <div className={styles.row}>
              <label className={styles.label}>
                {t("country")}
                <select
                  name="country"
                  className={styles.field}
                  value={country}
                  required
                  onChange={(event) => {
                    setCountry(event.target.value);
                    setCity("");
                    setDistrict("");
                  }}
                >
                  <option value="" disabled>{t("select")}</option>
                  {countries.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className={styles.label}>
                {t("city")}
                <select
                  name="city"
                  className={styles.field}
                  value={city}
                  required
                  disabled={!country}
                  onChange={(event) => {
                    setCity(event.target.value);
                    setDistrict("");
                  }}
                >
                  <option value="" disabled>{country ? t("select") : t("countryFirst")}</option>
                  {cities.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
            </div>
            <label className={styles.label}>
              {t("district")}
              <select
                name="district"
                className={styles.field}
                value={district}
                disabled={!city}
                onChange={(event) => setDistrict(event.target.value)}
              >
                <option value="">{city ? t("districtOptional") : t("cityFirst")}</option>
                {districts.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
          </>
        ) : (
          <label className={styles.label}>
            {t("service")}
            <select name="service" className={styles.field} defaultValue="">
              <option value="" disabled>{t("select")}</option>
              {serviceOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
        )}
        <div className={styles.row}>
          <label className={styles.label}>{t("dateRange")}<input name="dateRange" className={styles.field} placeholder={t("datePh")} /></label>
          <label className={styles.label}>{t("people")}<input name="people" type="number" min={1} className={styles.field} placeholder="0" /></label>
        </div>
        <label className={styles.label}>{t("message")}<textarea name="message" className={styles.textarea} placeholder={t("messagePh")} /></label>
        {state.error && !state.ok && (
          <p className="text-[13px] font-medium text-red-600">{t("error")}</p>
        )}
        <button type="submit" className="btn btn-solid btn-block" disabled={pending || state.ok || (isGeneral && (!group || !categoryType))}>
          {state.ok ? t("sent") : pending ? t("sending") : t("submit")}
        </button>
      </form>
    </div>
  );
};

export default QuoteForm;
