"use client";

import { useEffect, useRef } from "react";
import { recordView } from "@/lib/actions/views";

/* Kart-impression sayacı: işletme kartı arama sonucunda ekrana geldiğinde
   (viewport'a girdiğinde) bir kez impression kaydeder. Oturum başına işletme
   başına tek sayım (sessionStorage) — kaydırıp geri gelince tekrar saymaz.
   Görünmez; layout'u etkilemez (absolute, 1×1). */
export default function ImpressionTracker({ id }: { id: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || done.current) return;

    const key = `imp:business:${id}`;
    try {
      if (sessionStorage.getItem(key)) {
        done.current = true;
        return;
      }
    } catch {
      // sessionStorage yoksa yine de gözlemle
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !done.current) {
            done.current = true;
            try {
              sessionStorage.setItem(key, "1");
            } catch {
              // yut
            }
            recordView("impression", id);
            io.disconnect();
          }
        }
      },
      { threshold: 0.5 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [id]);

  return <span ref={ref} aria-hidden className="pointer-events-none absolute h-px w-px" />;
}
