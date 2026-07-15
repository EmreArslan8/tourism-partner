"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { PublicPopup } from "@/lib/platform-data";

/* Site geneli pop-up (erişilebilir modal). Gösterim sıklığı:
   - 'always'  → her sayfa yüklemede
   - 'session' → sessionStorage `popup:<id>` (oturum başına bir kez)
   - 'daily'   → localStorage `popup:<id>:date` bugünle karşılaştırılır
   Kapatınca ilgili işaret kaydedilir. JS alert/confirm KULLANILMAZ. */
const SitePopup = ({ popup }: { popup: PublicPopup }) => {
  const [closedPopupId, setClosedPopupId] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const sessionKey = `popup:${popup.id}`;
  const dailyKey = `popup:${popup.id}:date`;

  const open = closedPopupId !== popup.id && shouldOpenPopup(popup, sessionKey, dailyKey);

  const close = useCallback(() => {
    try {
      if (popup.frequency === "session") window.sessionStorage.setItem(sessionKey, "1");
      if (popup.frequency === "daily") {
        window.localStorage.setItem(dailyKey, new Date().toISOString().slice(0, 10));
      }
    } catch {
      // storage yazılamazsa sessizce geç
    }
    setClosedPopupId(popup.id);
  }, [popup.id, popup.frequency, sessionKey, dailyKey]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] grid place-items-center bg-ink/60 p-4 backdrop-blur-sm"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="site-popup-title"
        className="relative w-full max-w-[440px] overflow-hidden rounded-[18px] bg-paper shadow-[0_30px_80px_-30px_rgba(11,16,47,.55)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Kapat"
          className="absolute end-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-paper/80 text-ink transition-colors hover:bg-cream"
        >
          <X size={18} aria-hidden />
        </button>

        {popup.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={popup.image_url} alt="" className="h-44 w-full object-cover" />
        )}

        <div className="grid gap-3 p-6">
          <h2 id="site-popup-title" className="text-[20px] font-extrabold leading-tight text-ink">
            {popup.title}
          </h2>
          {popup.body && <p className="text-[14px] leading-6 text-muted">{popup.body}</p>}
          {popup.cta_url && (
            <a href={popup.cta_url} className="btn btn-solid mt-1 w-fit" onClick={close}>
              {popup.cta_label || "Detay"}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

function shouldOpenPopup(popup: PublicPopup, sessionKey: string, dailyKey: string) {
  if (typeof window === "undefined") return false;
  try {
    if (popup.frequency === "session" && window.sessionStorage.getItem(sessionKey)) return false;
    if (popup.frequency === "daily") {
      const today = new Date().toISOString().slice(0, 10);
      if (window.localStorage.getItem(dailyKey) === today) return false;
    }
  } catch {
    // storage erişilemezse yine de göster
  }
  return true;
}

export default SitePopup;
