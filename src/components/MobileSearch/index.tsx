"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const SearchIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

/* Mobil header arama — ikona basınca üstten inen arama paneli. */
const MobileSearch = () => {
  const t = useTranslations("hero");
  const tn = useTranslations("nav");
  const router = useRouter();
  type RouterHref = Parameters<typeof router.push>[0];
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const href: RouterHref = q.trim()
      ? { pathname: "/explore", query: { q: q.trim() } }
      : { pathname: "/explore" };
    router.push(href);
    setOpen(false);
  };

  const chips: Array<{ label: string; href: RouterHref }> = [
    { label: t("pop1"), href: { pathname: "/explore", query: { city: "İstanbul", cat: "konaklama" } } },
    { label: t("pop2"), href: { pathname: "/explore", query: { city: "Nevşehir", q: "balon" } } },
    { label: t("pop3"), href: { pathname: "/explore", query: { city: "Antalya", cat: "acente" } } },
  ];

  return (
    <>
      <button
        type="button"
        aria-label={tn("explore")}
        onClick={() => setOpen(true)}
        className="hidden h-10 w-10 place-items-center rounded-full text-white transition-colors active:bg-white/15 max-[900px]:grid"
      >
        <SearchIcon size={24} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[80]">
          <button
            type="button"
            aria-label="Kapat"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-pine/55 backdrop-blur-sm animate-[splashIn_.2s_ease]"
          />
          <div className="absolute inset-x-0 top-0 bg-white p-4 pb-5 shadow-[0_24px_60px_-20px_rgba(7,9,42,.5)] animate-[splashMark_.28s_cubic-bezier(.22,1,.36,1)]">
            <form onSubmit={submit} className="flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2.5 rounded-xl border-[1.5px] border-line bg-cream px-3.5 py-3 text-muted focus-within:border-terra">
                <SearchIcon size={18} />
                <input
                  ref={inputRef}
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t("searchPh")}
                  className="w-full border-0 bg-transparent text-[15px] font-medium text-ink placeholder:text-[#727b97] focus:outline-none"
                />
              </div>
              <button type="submit" className="shrink-0 rounded-xl bg-terra px-5 py-3 text-[15px] font-bold text-white active:scale-95">
                {t("searchBtn")}
              </button>
            </form>

            <div className="mt-3 flex flex-wrap gap-2">
              {chips.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => { router.push(c.href); setOpen(false); }}
                  className="rounded-pill border border-line bg-paper px-3 py-1.5 text-[13px] font-semibold text-ink/80 active:bg-cream"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileSearch;
