"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/* Header bildirim zili — tıklayınca sayfaya GİTMEZ, küçük bir not açar.
   Nottaki bağlantıya tıklanınca destek kutusuna gidilir. */
export default function AdminNotifyBell({ newTicketCount = 0 }: { newTicketCount?: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const has = newTicketCount > 0;

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Bildirimler"
        aria-label={has ? `${newTicketCount} yeni destek talebi` : "Bildirimler"}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "relative grid h-9 w-9 place-items-center rounded-[8px] text-muted transition-colors hover:bg-cream hover:text-brand",
          open && "bg-cream text-brand",
        )}
      >
        <Bell size={18} aria-hidden />
        {has && (
          <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#BA1A1A] px-1 text-[10px] font-bold leading-none text-white">
            {newTicketCount > 99 ? "99+" : newTicketCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute end-0 top-[calc(100%+8px)] z-40 w-[260px] overflow-hidden rounded-xl border border-line bg-white shadow-[0_16px_44px_-16px_rgba(15,23,42,.35)]"
        >
          <div className="border-b border-line/70 px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-muted">
            Bildirimler
          </div>
          {has ? (
            <Link
              href="/admin/destek"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-cream"
            >
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#DAE2FD] text-[#1E3A8A]">
                <Bell size={15} aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold text-ink">
                  {newTicketCount} yeni destek talebi
                </span>
                <span className="block text-[12px] text-muted">İşleme alınmayı bekliyor — görüntülemek için tıkla</span>
              </span>
            </Link>
          ) : (
            <div className="px-4 py-6 text-center text-[13px] text-muted">Yeni bildirim yok</div>
          )}
        </div>
      )}
    </div>
  );
}
