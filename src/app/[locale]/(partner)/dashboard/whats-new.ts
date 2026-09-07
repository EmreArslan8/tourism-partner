"use client";

import { useSyncExternalStore } from "react";

/* Panelde yeni özellik duyurusu — "görüldü" bilgisi tarayıcıda tutulur (sunucuda
   kullanıcı başına kolon açmaya değmez). Sidebar rozeti ve ilk giriş modalı aynı
   anahtarı paylaşır: kullanıcı özelliği bir kez gördüyse ikisi de susar. */

export const DEALS_FEATURE_KEY = "tp-seen:deals-2026-09";

/* Sidebar rozeti modaldan bağımsız: sayfayı ziyaret etmek onu söndürmez, ilk
   görülmesinden itibaren 3 gün ekranda kalır. Amaç, kullanıcının özelliği bir
   kez açtıktan sonra da birkaç gün hatırlaması. */
export const DEALS_BADGE_KEY = "tp-badge:deals-2026-09";
export const BADGE_DURATION_MS = 3 * 24 * 60 * 60 * 1000;

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function markFeatureSeen(key: string) {
  try {
    if (localStorage.getItem(key) === "1") return;
    localStorage.setItem(key, "1");
  } catch {
    // localStorage kapalıysa duyuru her oturumda görünür; akış bozulmaz.
  }
  for (const listener of listeners) listener();
}

/* Rozet penceresini başlatır — ilk görülme anını bir kez yazar. */
export function startBadgeWindow(key: string) {
  try {
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, String(Date.now()));
  } catch {
    // localStorage kapalıysa rozet her oturumda görünür; akış bozulmaz.
    return;
  }
  for (const listener of listeners) listener();
}

/* Rozet hâlâ geçerli mi? Pencere başlamadıysa gösterilir (effect hemen başlatır). */
export function useBadgeActive(key: string): boolean {
  return useSyncExternalStore(
    subscribe,
    () => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return true;
        const started = Number(raw);
        return Number.isFinite(started) && Date.now() - started < BADGE_DURATION_MS;
      } catch {
        return false;
      }
    },
    () => false,
  );
}

/* Sunucu anlık görüntüsü daima "görüldü": hydration'da rozet/modal parlamasın,
   yalnızca istemcide gerçek değer okununca ortaya çıksın. */
export function useFeatureSeen(key: string): boolean {
  return useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(key) === "1";
      } catch {
        return true;
      }
    },
    () => true,
  );
}
