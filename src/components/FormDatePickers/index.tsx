"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { tr } from "react-day-picker/locale";
import styles from "@/components/QuoteForm/styles";

const dateFormatter = new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", weekday: "short" });

const toInputDate = (date?: Date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateLabel = (date?: Date) => date ? dateFormatter.format(date).replace(",", "") : "Seçin";

export function DateRangePicker({
  label,
  startLabel,
  endLabel,
  clearLabel,
  doneLabel,
  startName = "dateStart",
  endName = "dateEnd",
}: {
  label: string;
  startLabel: string;
  endLabel: string;
  clearLabel: string;
  doneLabel: string;
  startName?: string;
  endName?: string;
}) {
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
      <input type="hidden" name={startName} value={toInputDate(range?.from)} />
      <input type="hidden" name={endName} value={toInputDate(range?.to)} />
      <span className={styles.dateLegend}>{label}</span>
      <button
        type="button"
        className={styles.dateTrigger}
        aria-expanded={open}
        aria-label={`${label} seç`}
        onClick={() => setOpen((value) => !value)}
      >
        <CalendarIcon />
        <span className={styles.dateTriggerText}>
          <span className={range?.from ? styles.dateValue : styles.datePlaceholder}>
            {range?.from ? formatDateLabel(range.from) : startLabel}
          </span>
          <span className={styles.dateDash} aria-hidden>-</span>
          <span className={range?.to ? styles.dateValue : styles.datePlaceholder}>
            {range?.to ? formatDateLabel(range.to) : endLabel}
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
              {clearLabel}
            </button>
            <button type="button" className={styles.dateDoneButton} onClick={() => setOpen(false)}>
              {doneLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function SingleDatePicker({
  label,
  hint,
  placeholder,
  clearLabel,
  doneLabel,
  name = "validUntil",
}: {
  label: string;
  hint?: string;
  placeholder: string;
  clearLabel: string;
  doneLabel: string;
  name?: string;
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
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
      <input type="hidden" name={name} value={toInputDate(date)} />
      <span className={`${styles.dateLegend} ${hint ? styles.labelLine : ""}`}>
        {label}
        {hint && <small>{hint}</small>}
      </span>
      <button
        type="button"
        className={styles.dateTrigger}
        aria-expanded={open}
        aria-label={`${label} seç`}
        onClick={() => setOpen((value) => !value)}
      >
        <CalendarIcon />
        <span className={date ? styles.dateValue : styles.datePlaceholder}>
          {date ? formatDateLabel(date) : placeholder}
        </span>
      </button>
      {open && (
        <div className={styles.datePopover}>
          <DayPicker
            mode="single"
            selected={date}
            onSelect={(nextDate) => {
              setDate(nextDate);
              if (nextDate) setOpen(false);
            }}
            defaultMonth={date ?? today}
            startMonth={today}
            endMonth={new Date(today.getFullYear() + 2, today.getMonth(), 1)}
            locale={tr}
            weekStartsOn={1}
            disabled={{ before: today }}
            classNames={dayPickerClassNames}
          />
          <div className={styles.datePopoverFooter}>
            <button type="button" className={styles.dateClearButton} onClick={() => setDate(undefined)}>
              {clearLabel}
            </button>
            <button type="button" className={styles.dateDoneButton} onClick={() => setOpen(false)}>
              {doneLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CalendarIcon() {
  return (
    <span className={styles.dateIcon} aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="4" />
        <path d="M3 10h18" />
      </svg>
    </span>
  );
}

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
  selected: "text-primary [&>button]:bg-primary [&>button]:text-white",
  range_start: "[&>button]:bg-primary [&>button]:text-white [&>button]:hover:bg-primary",
  range_middle:
    "rounded-full bg-primary/10 text-primary [&>button]:!bg-transparent [&>button]:!text-primary [&>button]:hover:!bg-transparent",
  range_end: "[&>button]:bg-primary [&>button]:text-white [&>button]:hover:bg-primary",
  outside: "text-muted/45",
  disabled: "pointer-events-none text-muted/50 line-through opacity-70",
};
