"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { tr } from "react-day-picker/locale";
import { useTranslations } from "next-intl";
import type { Business, GroupKey } from "@/lib/types";
import { GROUP_COLORS } from "@/lib/categories";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { getCityOptions, getCountryOptions, getDistrictOptions } from "@/lib/regions";
import { initials } from "@/lib/utils";
import { submitQuote } from "@/lib/actions/quote";
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
  const isGeneral = !business;
  const countries = useMemo(() => getCountryOptions(), []);
  const initialGroup = initialFilters?.group ?? "";
  const initialType = initialFilters?.types?.[0] ?? "";
  const [group, setGroup] = useState<GroupKey | "">(initialGroup);
  const [categoryType, setCategoryType] = useState(initialType);
  const [phone, setPhone] = useState("");
  const selectedGroup = CATEGORY_GROUPS.find((item) => item.key === group);
  const [country, setCountry] = useState(initialFilters?.country ?? (countries.includes("Türkiye") ? "Türkiye" : countries[0] ?? ""));
  const [city, setCity] = useState(initialFilters?.city ?? "");
  const [district, setDistrict] = useState(initialFilters?.district ?? "");
  const cities = useMemo(() => getCityOptions(country), [country]);
  const districts = useMemo(() => getDistrictOptions(country, city), [country, city]);

  const serviceOptions = business
    ? [business.type, t("optAccommodation"), t("optTransfer"), t("optTour")]
    : CATEGORY_GROUPS.map((g) => tc(g.key));
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
                      <option key={item.slug} value={item.label}>{item.label}</option>
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
                    {countries.map((item) => <option key={item} value={item}>{item}</option>)}
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
                {serviceOptions.map((o) => <option key={o}>{o}</option>)}
              </select>
            </SelectShell>
          </label>
        )}
        <div className={styles.row}>
          <DateRangePicker label={t("dateRange")} />
          <label className={styles.label}>{t("people")}<input name="people" type="number" min={1} className={styles.field} placeholder="0" /></label>
        </div>
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

const dateFormatter = new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", weekday: "short" });

const toInputDate = (date?: Date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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

const formatDateLabel = (date?: Date) => date ? dateFormatter.format(date).replace(",", "") : "Seçin";

const DateRangePicker = ({ label }: { label: string }) => {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();
  const today = useMemo(() => new Date(), []);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div className={styles.datePicker} ref={rootRef}>
      <input type="hidden" name="dateStart" value={toInputDate(range?.from)} />
      <input type="hidden" name="dateEnd" value={toInputDate(range?.to)} />
      <span className={styles.dateLegend}>{label}</span>
      <button
        type="button"
        className={styles.dateTrigger}
        aria-expanded={open}
        aria-label={`${label} seç`}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.dateIcon} aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="4" />
            <path d="M3 10h18" />
          </svg>
        </span>
        <span className={styles.dateTriggerText}>
          <span className={range?.from ? styles.dateValue : styles.datePlaceholder}>
            {range?.from ? formatDateLabel(range.from) : "Başlangıç"}
          </span>
          <span className={styles.dateDash} aria-hidden>–</span>
          <span className={range?.to ? styles.dateValue : styles.datePlaceholder}>
            {range?.to ? formatDateLabel(range.to) : "Bitiş"}
          </span>
        </span>
      </button>
      {open && (
        <div className={styles.datePopover}>
          <DayPicker
            mode="range"
            selected={range}
            onSelect={(nextRange) => {
              setRange(nextRange);
              if (nextRange?.from && nextRange.to) setOpen(false);
            }}
            defaultMonth={range?.from ?? today}
            startMonth={today}
            endMonth={new Date(today.getFullYear() + 2, today.getMonth(), 1)}
            locale={tr}
            weekStartsOn={1}
            disabled={{ before: today }}
            classNames={dayPickerClassNames}
          />
          <div className={styles.datePopoverFooter}>
            <button type="button" className={styles.dateClearButton} onClick={() => setRange(undefined)}>
              Temizle
            </button>
            <button type="button" className={styles.dateDoneButton} onClick={() => setOpen(false)}>
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const dayPickerClassNames = {
  root: "w-full",
  months: "flex",
  month: "w-full",
  month_caption: "mb-3 flex h-8 items-center justify-center",
  caption_label: "text-[14px] font-semibold text-ink",
  nav: "pointer-events-none absolute left-4 right-4 top-4 flex items-center justify-between",
  button_previous:
    "pointer-events-auto grid h-7 w-7 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-30",
  button_next:
    "pointer-events-auto grid h-7 w-7 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-30",
  chevron: "h-3.5 w-3.5",
  month_grid: "w-full border-collapse",
  weekdays: "grid grid-cols-7",
  weekday: "pb-2 text-center text-[11px] font-semibold uppercase text-muted/80",
  weeks: "grid gap-1",
  week: "grid grid-cols-7 gap-1",
  day: "relative grid h-8 place-items-center text-center text-[13px] text-ink",
  day_button: "grid h-8 w-8 place-items-center rounded-full font-medium transition hover:bg-primary/10",
  today: "text-primary",
  selected: "text-primary",
  range_start: "[&>button]:bg-primary [&>button]:text-white [&>button]:hover:bg-primary",
  range_middle:
    "rounded-full bg-primary/10 text-primary [&>button]:!bg-transparent [&>button]:!text-primary [&>button]:hover:!bg-transparent",
  range_end: "[&>button]:bg-primary [&>button]:text-white [&>button]:hover:bg-primary",
  outside: "text-muted/45",
  disabled: "pointer-events-none text-muted/50 line-through opacity-70",
};

export default QuoteForm;

function quoteErrorMessage(t: ReturnType<typeof useTranslations>, error: string) {
  if (error === "missing") return t("errorMissing");
  if (error === "email") return t("errorEmail");
  if (error === "rate") return t("errorRate");
  if (error === "no_match") return t("errorNoMatch");
  return t("error");
}
