"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import Logo from "@/components/Logo";
import type { PublicPopup } from "@/lib/platform-data";

/* Site geneli pop-up (erişilebilir modal). Gösterim sıklığı:
   - 'always'  → her sayfa yüklemede
   - 'session' → sessionStorage `popup:<id>` (oturum başına bir kez)
   - 'daily'   → localStorage `popup:<id>:date` bugünle karşılaştırılır
   Kapatınca ilgili işaret kaydedilir. JS alert/confirm KULLANILMAZ. */
const SitePopup = ({ popup }: { popup: PublicPopup }) => {
  const t = useTranslations("common");
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [closedPopupId, setClosedPopupId] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const sessionKey = `popup:${popup.id}`;
  const dailyKey = `popup:${popup.id}:date`;
  const hasImage = Boolean(popup.image_url);

  const open =
    isClient &&
    closedPopupId !== popup.id &&
    shouldOpenPopup(popup, sessionKey, dailyKey);

  const close = useCallback(() => {
    try {
      if (popup.frequency === "session")
        window.sessionStorage.setItem(sessionKey, "1");
      if (popup.frequency === "daily") {
        window.localStorage.setItem(
          dailyKey,
          new Date().toISOString().slice(0, 10),
        );
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
      className="fixed inset-0 z-[120] grid place-items-center bg-ink/28 p-4 backdrop-blur-[14px]"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="site-popup-title"
        className={[
          "relative w-full overflow-hidden rounded-[22px] border border-white/45 bg-white/[.16] shadow-[0_34px_120px_-34px_rgba(1,8,47,.92)] backdrop-blur-[34px] ring-1 ring-white/30",
          hasImage
            ? "aspect-[4/5] max-w-[430px] sm:aspect-[5/3] sm:max-w-[700px]"
            : "max-w-[520px]",
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/75"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,.34),rgba(255,255,255,.12)_42%,rgba(0,79,230,.12))]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-sapphire-deep/[.16]"
        />
        {popup.image_url && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={popup.image_url}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,8,47,.88),rgba(1,8,47,.58)_42%,rgba(1,8,47,.16)_76%,rgba(1,8,47,.08))] max-sm:bg-[linear-gradient(180deg,rgba(1,8,47,.18),rgba(1,8,47,.26)_34%,rgba(1,8,47,.86)_100%)]"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-ink/80 via-ink/20 to-transparent sm:hidden"
            />
          </>
        )}
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label={t("close")}
          className="absolute end-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-white/12 text-white shadow-[0_12px_30px_-18px_rgba(1,8,47,.78)] backdrop-blur-xl transition-colors hover:bg-white/20"
        >
          <X size={20} strokeWidth={2.2} aria-hidden />
        </button>

        <div
          className={
            hasImage
              ? "relative flex h-full max-w-[410px] flex-col justify-center gap-4 px-6 py-8 text-left sm:px-8"
              : "relative grid gap-4 px-6 pb-6 pt-7 sm:px-8 sm:pb-8 sm:pt-8"
          }
        >
          {hasImage && (
            <Logo
              href={null}
              height={44}
              variant="light"
              className="w-fit drop-shadow-[0_3px_16px_rgba(1,8,47,.38)]"
              priority
            />
          )}
          <h2
            id="site-popup-title"
            className={[
              "text-white drop-shadow-[0_2px_18px_rgba(1,8,47,.42)]",
              hasImage
                ? "max-w-[20rem] text-balance text-[24px] font-black leading-[1.03] tracking-[0] sm:text-[30px]"
                : "max-w-[calc(100%-3.25rem)] text-[22px] font-extrabold leading-[1.12] sm:text-[26px]",
            ].join(" ")}
          >
            {popup.title}
          </h2>
          {popup.body && (
            <p
              className={[
                "font-medium text-white/90",
                hasImage
                  ? "max-w-[21rem] text-[14.5px] leading-6 drop-shadow-[0_2px_12px_rgba(1,8,47,.55)]"
                  : "max-w-[34rem] text-[15px] leading-7",
              ].join(" ")}
            >
              {popup.body}
            </p>
          )}
          {popup.cta_url && (
            <a
              href={popup.cta_url}
              className={[
                "mt-1 inline-flex h-11 min-w-[190px] items-center justify-center rounded-[12px] px-5 text-[14px] font-bold shadow-[0_18px_38px_-20px_rgba(1,8,47,.9)] transition-colors",
                hasImage
                  ? "border border-white/40 bg-white text-sapphire-deep backdrop-blur-xl hover:bg-cream"
                  : "border border-white/30 bg-white/18 text-white backdrop-blur-xl hover:bg-white/26",
              ].join(" ")}
              onClick={close}
            >
              {popup.cta_label || "Detay"}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

function emptySubscribe() {
  return () => {};
}

function shouldOpenPopup(
  popup: PublicPopup,
  sessionKey: string,
  dailyKey: string,
) {
  if (typeof window === "undefined") return false;
  try {
    if (
      popup.frequency === "session" &&
      window.sessionStorage.getItem(sessionKey)
    )
      return false;
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
