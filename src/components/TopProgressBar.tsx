"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/* Üst yükleme çubuğu — nprogress deseni: başta hızlı dolar, sona (%92) doğru yavaşlar,
   iş bitince %100'e tamamlanıp kaybolur (sürekli dönme değil, gerçek ilerleme).
   Tüm state güncellemeleri zamanlayıcı callback'lerinde (effect içinde senkron setState yok). */
export default function TopProgressBar({ active }: { active: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (active) {
      const kick = window.setTimeout(() => setProgress((p) => (p < 12 ? 12 : p)), 0);
      const tick = window.setInterval(() => {
        setProgress((p) => {
          if (p >= 92) return p; // %92'de bekle (iş bitene kadar)
          const remaining = 92 - p;
          const inc = p < 28 ? 9 : p < 58 ? 4.5 : Math.max(0.35, remaining * 0.16);
          return Math.min(92, p + inc);
        });
      }, 180);
      return () => {
        window.clearTimeout(kick);
        window.clearInterval(tick);
      };
    }
    // active bitti: son kısmı kademeli tamamla, kısa bekle, sıfırla (kaybol).
    const settle = window.setTimeout(() => setProgress((p) => (p > 0 ? Math.max(p, 97) : 0)), 80);
    const finish = window.setTimeout(() => setProgress((p) => (p > 0 ? 100 : 0)), 260);
    const hide = window.setTimeout(() => setProgress(0), 620);
    return () => {
      window.clearTimeout(settle);
      window.clearTimeout(finish);
      window.clearTimeout(hide);
    };
  }, [active]);

  if (progress <= 0 || typeof document === "undefined") return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[4px] bg-terra/10" aria-hidden>
      <div
        className="h-full rounded-r-full bg-[linear-gradient(90deg,#0a2472,#3542ee_55%,#8ea2ff)] shadow-[0_0_12px_2px_rgba(53,66,238,.6)] transition-[width] duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>,
    document.body,
  );
}
