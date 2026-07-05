import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { isAccelerating } from "./momentum";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** prefers-reduced-motion'a abone olur (SSR-güvenli, effect'te setState yok). */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(REDUCED_MOTION_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );
}

/** Görsel geçiş süresi (animasyon). */
export const TRANSITION_MS = 500;
export const TRANSITION_EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";

// Giriş kilidi animasyondan UZUN: trackpad momentum'u (parmak kalktıktan sonra
// devam eden olay akışı) bu süre boyunca yutulur ki bir kaydırma tek panel kalsın.
const LOCK_MS = 760;
const SWIPE_THRESHOLD = 48; // px — dikey swipe bu eşiği aşmazsa snap-back
const IDLE_RESET_MS = 200; // bu süre olay gelmezse yeni kaydırma aksiyonu sayılır
const MAX_SAMPLES = 150; // momentum penceresi için tutulan en fazla örnek
const BOUNDARY_RELEASE_DELAY_MS = 260; // panel geçişinden kalan momentum footer'a taşmasın

/**
 * ReelDeck'in tüm etkileşim mantığı: aktif panel state'i + wheel/touch/klavye
 * dinleyicileri. Yalnızca deck viewport'u tam kapladığında jestleri yakalar;
 * sınırda (ilk panelde yukarı / son panelde aşağı) native scroll'a bırakır.
 */
export function useReelDeck(count: number) {
  const [index, setIndex] = useState(0);
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  const indexRef = useRef(0);
  const lockRef = useRef(false);
  const prevTimeRef = useRef(0);
  const samplesRef = useRef<number[]>([]);
  const touchStartRef = useRef<number | null>(null);
  const boundaryReleaseAtRef = useRef(0);

  const coversViewport = useCallback(() => {
    const el = rootRef.current;
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.top <= 1 && rect.bottom >= window.innerHeight - 1;
  }, []);

  const atBoundary = useCallback(
    (dir: number) =>
      (indexRef.current === count - 1 && dir === 1) ||
      (indexRef.current === 0 && dir === -1),
    [count]
  );

  const go = useCallback(
    (target: number) => {
      const clamped = Math.max(0, Math.min(count - 1, target));
      if (clamped === indexRef.current) return;
      lockRef.current = true;
      boundaryReleaseAtRef.current =
        performance.now() + (reduced ? 0 : LOCK_MS + BOUNDARY_RELEASE_DELAY_MS);
      indexRef.current = clamped;
      setIndex(clamped);
      window.setTimeout(() => {
        lockRef.current = false;
      }, reduced ? 0 : LOCK_MS);
    },
    [count, reduced]
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (!coversViewport()) return;
      const dir = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0;
      if (dir === 0) return;
      if (atBoundary(dir)) {
        if (performance.now() < boundaryReleaseAtRef.current) e.preventDefault();
        return; // sınır → bilinçli sonraki scroll'da native akış (Footer / üst boşluk)
      }
      e.preventDefault();

      // Momentum örneklerini güncelle (fullPage.js algoritması)
      const samples = samplesRef.current;
      if (samples.length > MAX_SAMPLES - 1) samples.shift();
      samples.push(Math.abs(e.deltaY));
      if (e.timeStamp - prevTimeRef.current > IDLE_RESET_MS) samplesRef.current = [];
      prevTimeRef.current = e.timeStamp;

      if (lockRef.current) return; // animasyon sürüyor
      if (!isAccelerating(samplesRef.current)) return; // sönümlenen momentum → yok say
      go(indexRef.current + dir);
    };

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (!coversViewport()) return;
      let dir = 0;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") dir = 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp") dir = -1;
      if (dir === 0 || atBoundary(dir)) return;
      e.preventDefault();
      if (!lockRef.current) go(indexRef.current + dir);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchStartRef.current === null || !coversViewport()) return;
      const dy = touchStartRef.current - e.touches[0].clientY;
      const dir = dy > 0 ? 1 : -1;
      if (!atBoundary(dir) && Math.abs(dy) > 6) e.preventDefault(); // native rubber-band'i engelle
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartRef.current === null) return;
      const dy = touchStartRef.current - e.changedTouches[0].clientY;
      touchStartRef.current = null;
      if (Math.abs(dy) < SWIPE_THRESHOLD) return;
      const dir = dy > 0 ? 1 : -1;
      if (!atBoundary(dir) && !lockRef.current) go(indexRef.current + dir);
    };

    const onTourGo = (e: Event) => {
      const detail = (e as CustomEvent<{ index?: number }>).detail;
      if (typeof detail?.index === "number") go(detail.index);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("tp:reel-go", onTourGo);
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("tp:reel-go", onTourGo);
    };
  }, [atBoundary, coversViewport, go]);

  // Hash → panel senkronu: header/footer'daki #nasil, #sss gibi linkler deck
  // transform tabanlı olduğu için native scroll ile çalışmaz; hedef id'nin
  // hangi panelde olduğunu bulup o panele geçeriz.
  useEffect(() => {
    const panelIndexForId = (id: string) => {
      if (!id) return -1;
      const target = document.getElementById(id);
      const track = rootRef.current?.firstElementChild;
      if (!target || !track) return -1;
      return Array.from(track.children).findIndex((p) => p.contains(target));
    };

    const goToHash = () => {
      const idx = panelIndexForId(window.location.hash.slice(1));
      if (idx >= 0) go(idx);
    };

    // Next.js Link hash navigasyonu history.pushState ile çalışır ve hashchange
    // event'i tetiklemez; bu yüzden deck içi hedefe giden tıklamaları yakalarız.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.includes("#")) return;
      let url: URL;
      try { url = new URL(href, window.location.href); } catch { return; }
      const idx = panelIndexForId(url.hash.slice(1));
      if (idx >= 0) requestAnimationFrame(() => go(idx));
    };

    goToHash(); // doğrudan /#sss ile açılış
    window.addEventListener("hashchange", goToHash); // tarayıcı geri/ileri
    window.addEventListener("popstate", goToHash);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", goToHash);
      window.removeEventListener("popstate", goToHash);
      document.removeEventListener("click", onClick);
    };
  }, [go]);

  return { index, reduced, rootRef };
}
