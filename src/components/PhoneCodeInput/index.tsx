"use client";

/* Ülke arama kodu seçici — yazarak arama + tam ülke listesi (bkz. lib/phone-codes).
   Kayıt formu ve teklif formu ortak kullanır; liste yönü `placement` ile ayarlanır. */

import { useState } from "react";
import { useLocale } from "next-intl";
import { DEFAULT_PHONE_CODE, filterPhoneCodes, normalizePhoneCode, phoneCodeLabel } from "@/lib/phone-codes";

const PhoneCodeInput = ({
  value,
  onChange,
  label,
  fallback = DEFAULT_PHONE_CODE,
  placement = "bottom",
  className = "w-[72px]",
  heightClass = "h-[46px]",
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  fallback?: string;
  placement?: "top" | "bottom";
  className?: string;
  /* Yanındaki alanla aynı yüksekliği tutturmak için (form başına değişebiliyor). */
  heightClass?: string;
}) => {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  // draft: kullanıcının yazdığı metin; null = henüz yazılmadı. Mevcut değeri (+1)
  // filtre sorgusu saymıyoruz — aksi halde açılışta yalnızca "1" içeren kodlar
  // görünürdü. draft null iken tam liste (Türkiye üstte), yazınca filtre gelir.
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? value;
  const filtered = filterPhoneCodes(draft === null ? "" : shown, locale);

  return (
    <div className={`relative shrink-0 ${className}`}>
      <input
        value={shown}
        onChange={(event) => {
          setDraft(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          onChange(normalizePhoneCode(draft ?? value) || fallback);
          setDraft(null);
          window.setTimeout(() => setOpen(false), 120);
        }}
        inputMode="tel"
        maxLength={5}
        className={`field w-full rounded-e-none border-e-0 px-2 pe-5 text-[13px] ${heightClass}`}
        aria-label={label}
        autoComplete="off"
      />
      <button
        type="button"
        onMouseDown={(event) => {
          event.preventDefault();
          setOpen((current) => !current);
        }}
        className="absolute end-1 top-1/2 grid h-7 w-5 -translate-y-1/2 place-items-center text-ink/55 transition-colors hover:text-terra"
        aria-label={label}
      >
        <span className="text-[10px] leading-none" aria-hidden>▾</span>
      </button>
      {open && filtered.length > 0 && (
        <div
          className={`absolute start-0 z-20 max-h-[280px] w-[260px] overflow-y-auto rounded-[8px] border border-line bg-paper py-1 shadow-card ${
            placement === "top" ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]"
          }`}
        >
          {filtered.map((code) => (
            <button
              key={code.iso2}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                onChange(code.dial);
                setDraft(null);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between gap-3 px-3 py-2 text-start text-[13px] font-semibold text-ink transition-colors hover:bg-terra/8"
            >
              <span className="min-w-0 truncate">{phoneCodeLabel(code.iso2, locale)}</span>
              <span className="shrink-0 text-terra" dir="ltr">{code.dial}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhoneCodeInput;
