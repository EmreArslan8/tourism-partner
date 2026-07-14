"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import type { Business, GroupKey } from "@/lib/types";
import { CATEGORY_GROUPS, GROUP_COLORS, serviceTranslationKey } from "@/lib/categories";
import { useRegions } from "@/lib/geo";
import { initials } from "@/lib/utils";
import { submitQuote } from "@/lib/actions/quote";
import { DateRangePicker, SingleDatePicker } from "@/components/FormDatePickers";
import styles from "./styles";


export type QuoteInitialFilters = {
  group?: GroupKey;
  types?: string[];
  country?: string;
  city?: string;
  district?: string;
  q?: string;
  minRating?: number;
  attrs?: string[];
};

/* Teklif (RFQ) formu — gönderim Supabase quotes tablosuna yazar (server action). */
const QuoteForm = ({ business, initialFilters }: { business: Business | null; initialFilters?: QuoteInitialFilters }) => {
  const [state, action, pending] = useActionState(submitQuote, { ok: false });
  const t = useTranslations("quote");
  const tc = useTranslations("cat");
  const ts = useTranslations("service");
  const isGeneral = !business;
  const initialGroup = initialFilters?.group ?? "";
  const initialType = initialFilters?.types?.[0] ?? "";
  const [group, setGroup] = useState<GroupKey | "">(initialGroup);
  const [categoryType, setCategoryType] = useState(initialType);
  const [phone, setPhone] = useState("");
  const selectedGroup = CATEGORY_GROUPS.find((item) => item.key === group);
  const [country, setCountry] = useState(initialFilters?.country ?? "Türkiye");
  const [city, setCity] = useState(initialFilters?.city ?? "");
  const [district, setDistrict] = useState(initialFilters?.district ?? "");
  const { countries, cities, districts } = useRegions(country, city, district);

  const businessTypeKey = business ? serviceTranslationKey(business.type) : null;
  const serviceOptions = business
    ? [
        { value: business.type, label: businessTypeKey ? ts(businessTypeKey) : business.type },
        { value: t("optAccommodation"), label: t("optAccommodation") },
        { value: t("optTransfer"), label: t("optTransfer") },
        { value: t("optTour"), label: t("optTour") },
      ]
    : CATEGORY_GROUPS.map((g) => ({ value: tc(g.key), label: tc(g.key) }));
  const submittedFilterTypes =
    initialFilters?.types?.length && categoryType === initialType
      ? initialFilters.types
      : categoryType
        ? [categoryType]
        : [];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className="text-[28px]">{business ? t("titleSupplier") : t("titleGeneral")}</h1>
        <p className={styles.note}>{t("note")}</p>
      </div>

      {business && (
        <div className={`${styles.supplier} mt-5`}>
          <span className={styles.supplierMono} style={{ background: GROUP_COLORS[business.group] }}>
            {initials(business.name)}
          </span>
          <div>
            <p className={styles.supplierName}>{business.name}</p>
            <p className={styles.supplierMeta}>{tc(business.group)} · {businessTypeKey ? ts(businessTypeKey) : business.type} — {business.city}</p>
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
        <label className={styles.label}>
          {t("phone")}
          <span className={styles.phoneField}>
            <span className={styles.phonePrefix}>+90</span>
            <input type="hidden" name="phone" value={phone ? `+90 ${phone}` : ""} />
            <input
              type="tel"
              required
              className={styles.phoneInput}
              placeholder="5xx xxx xx xx"
              value={phone}
              inputMode="tel"
              autoComplete="tel-national"
              maxLength={13}
              pattern="^5[0-9]{2} [0-9]{3} [0-9]{2} [0-9]{2}$"
              title="5xx xxx xx xx formatında girin"
              onChange={(event) => setPhone(formatTrPhone(event.target.value))}
            />
          </span>
        </label>
        {isGeneral ? (
          <>
            <input type="hidden" name="categoryGroup" value={group} />
            <input type="hidden" name="categoryType" value={categoryType} />
            <input type="hidden" name="filterGroups" value={group || initialFilters?.group || ""} />
            <input type="hidden" name="filterTypes" value={submittedFilterTypes.join(",")} />
            <input type="hidden" name="filterAttrs" value={(initialFilters?.attrs ?? []).join(",")} />
            <input type="hidden" name="filterQ" value={initialFilters?.q ?? ""} />
            <input type="hidden" name="filterRating" value={initialFilters?.minRating ? String(initialFilters.minRating) : ""} />
            <div className={styles.row}>
              <label className={styles.label}>
                {t("category")}
                <SelectShell>
                  <select
                    className={styles.select}
                    value={group}
                    required
                    onChange={(event) => {
                      setGroup(event.target.value as GroupKey);
                      setCategoryType("");
                    }}
                  >
                    <option value="" disabled>{t("select")}</option>
                    {CATEGORY_GROUPS.map((item) => (
                      <option key={item.key} value={item.key}>{tc(item.key)}</option>
                    ))}
                  </select>
                </SelectShell>
              </label>
              <label className={styles.label}>
                {t("type")}
                <SelectShell>
                  <select
                    className={styles.select}
                    value={categoryType}
                    required
                    disabled={!selectedGroup}
                    onChange={(event) => setCategoryType(event.target.value)}
                  >
                    <option value="" disabled>{selectedGroup ? t("select") : t("categoryFirst")}</option>
                    {selectedGroup?.children.map((item) => (
                      <option key={item.slug} value={item.label}>{ts(item.slug)}</option>
                    ))}
                  </select>
                </SelectShell>
              </label>
            </div>
            <div className={styles.row}>
              <label className={styles.label}>
                {t("country")}
                <SelectShell>
                  <select
                    name="country"
                    className={styles.select}
                    value={country}
                    required
                    onChange={(event) => {
                      setCountry(event.target.value);
                      setCity("");
                      setDistrict("");
                    }}
                  >
                    <option value="" disabled>{t("select")}</option>
                    {countries.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </SelectShell>
              </label>
              <label className={styles.label}>
                {t("city")}
                <SelectShell>
                  <select
                    name="city"
                    className={styles.select}
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
                </SelectShell>
              </label>
            </div>
            <label className={styles.label}>
              {t("district")}
              <SelectShell>
                <select
                  name="district"
                  className={styles.select}
                  value={district}
                  disabled={!city}
                  onChange={(event) => setDistrict(event.target.value)}
                >
                  <option value="">{city ? t("districtOptional") : t("cityFirst")}</option>
                  {districts.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </SelectShell>
            </label>
          </>
        ) : (
          <label className={styles.label}>
            {t("service")}
            <SelectShell>
              <select name="service" className={styles.select} defaultValue="">
                <option value="" disabled>{t("select")}</option>
                {serviceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </SelectShell>
          </label>
        )}
        <div className={styles.row}>
          <DateRangePicker
            label={t("dateRange")}
            startLabel={t("dateStart")}
            endLabel={t("dateEnd")}
            clearLabel={t("dateClear")}
            doneLabel={t("dateDone")}
          />
          <label className={styles.label}>{t("people")}<input name="people" type="number" min={1} className={styles.field} placeholder="0" /></label>
        </div>
        <SingleDatePicker
          label={t("validUntil")}
          hint={t("validUntilHint")}
          placeholder={t("dateSelect")}
          clearLabel={t("dateClear")}
          doneLabel={t("dateDone")}
        />
        <label className={styles.label}>{t("message")}<textarea name="message" className={styles.textarea} placeholder={t("messagePh")} /></label>
        {state.error && !state.ok && (
          <p className="text-[13px] font-medium text-red-600">{quoteErrorMessage(t, state.error)}</p>
        )}
        <button type="submit" className="btn btn-solid btn-block" disabled={pending || state.ok || (isGeneral && (!group || !categoryType))}>
          {state.ok ? t("sent") : pending ? t("sending") : t("submit")}
        </button>
      </form>
    </div>
  );
};

const SelectShell = ({ children }: { children: React.ReactNode }) => (
  <span className={styles.selectWrap}>
    {children}
    <svg className={styles.selectChevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  </span>
);

const formatTrPhone = (value: string) => {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("90")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  digits = digits.slice(0, 10);

  const parts = [
    digits.slice(0, 3),
    digits.slice(3, 6),
    digits.slice(6, 8),
    digits.slice(8, 10),
  ].filter(Boolean);

  return parts.join(" ");
};

export default QuoteForm;

function quoteErrorMessage(t: ReturnType<typeof useTranslations>, error: string) {
  if (error === "missing") return t("errorMissing");
  if (error === "email") return t("errorEmail");
  if (error === "rate") return t("errorRate");
  if (error === "no_match") return t("errorNoMatch");
  if (error === "valid_until") return t("errorValidUntil");
  return t("error");
}
