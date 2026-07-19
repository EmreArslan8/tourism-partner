"use client";

import { useEffect, useState, useTransition } from "react";
import type { MouseEvent, PointerEvent } from "react";
import { Heart } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { toggleFavorite } from "@/lib/actions/favorites";

/* İşletme detayında "Favorilere kaydet" — client island. Sayfa SSG kalsın diye
   oturum/favori durumunu tarayıcıda kendisi yükler (page.tsx cookie okumaz).
   Girişsiz kullanıcı butona basınca /login'e yönlenir. */
export default function FavoriteButton({
  businessId,
  variant = "full",
}: {
  businessId: number;
  variant?: "full" | "icon" | "header";
}) {
  const [fav, setFav] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [ready, setReady] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    let active = true;
    const sb = createClient();
    sb.auth.getUser().then(async ({ data: { user } }) => {
      if (!active) return;
      if (!user) {
        console.info("[FavoriteButton] no session", { businessId });
        setReady(true);
        return;
      }
      setLoggedIn(true);
      const { data, error } = await sb.from("favorites").select("id").eq("business_id", businessId).maybeSingle();
      if (!active) return;
      console.info("[FavoriteButton] initial state", {
        businessId,
        favorite: !!data,
        favoriteId: data?.id ?? null,
        error: error?.message ?? null,
      });
      setFav(!!data);
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, [businessId]);

  const isIcon = variant === "icon";
  const isHeader = variant === "header";
  const label = fav ? "Favorilerden çıkar" : "Favorilere kaydet";
  const stopCardNavigation = (event: MouseEvent<HTMLElement> | PointerEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const showFeedback = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 1200);
  };

  if (ready && !loggedIn) {
    return (
      <Link
        href="/login"
        aria-label="Favorilere kaydetmek için giriş yap"
        title="Favorilere kaydet"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
        className={
          isIcon
            ? "relative z-[6] inline-grid h-9 w-9 shrink-0 place-items-center text-paper drop-shadow-[0_2px_8px_rgba(0,0,0,.28)] transition-colors hover:text-brand-deep"
            : isHeader
              ? "inline-flex h-10 items-center gap-2 rounded-[9px] px-3 text-[13px] font-semibold text-white transition-colors hover:bg-white/10"
            : "mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-line px-4 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:border-sapphire hover:text-brand"
        }
      >
        <Heart size={22} strokeWidth={2.25} aria-hidden />
        {!isIcon && <span className={isHeader ? "underline decoration-white/40 underline-offset-2" : undefined}>Favorilere kaydet</span>}
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={pending || !ready}
      aria-pressed={fav}
      aria-label={label}
      title={label}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        stopCardNavigation(event);
        const optimistic = !fav;
        console.info("[FavoriteButton] click", { businessId, current: fav, optimistic });
        setFav(optimistic);
        start(async () => {
          const next = await toggleFavorite(businessId);
          console.info("[FavoriteButton] server result", { businessId, optimistic, next });
          setFav(next);
          if (next) showFeedback("Favorilere eklendi");
        });
      }}
      className={
          isIcon
          ? `relative z-[6] inline-grid h-9 w-9 shrink-0 place-items-center drop-shadow-[0_2px_8px_rgba(0,0,0,.35)] transition-colors disabled:opacity-60 ${
              fav ? "text-sapphire hover:text-paper" : "text-paper hover:text-sapphire"
            }`
          : isHeader
            ? `inline-flex h-10 items-center gap-2 rounded-[9px] px-3 text-[13px] font-semibold transition-colors hover:bg-white/10 disabled:opacity-60 ${fav ? "text-gold" : "text-white"}`
          : `mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[10px] border px-4 py-2.5 text-[13.5px] font-semibold transition-colors disabled:opacity-60 ${
              fav ? "border-sapphire bg-cream text-brand" : "border-line text-ink hover:border-sapphire hover:text-brand"
            }`
      }
    >
      <Heart size={24} strokeWidth={2.5} className={fav ? "fill-current" : ""} aria-hidden />
      {!isIcon && <span className={isHeader ? "underline decoration-current/40 underline-offset-2" : undefined}>{label}</span>}
      {isIcon && feedback && (
        <span className="pointer-events-none absolute end-0 top-10 whitespace-nowrap rounded-full bg-paper/95 px-3 py-1.5 text-[11.5px] font-semibold text-brand-deep shadow-[0_14px_34px_-20px_rgba(7,9,42,.65)] ring-1 ring-line backdrop-blur">
          {feedback}
        </span>
      )}
    </button>
  );
}
