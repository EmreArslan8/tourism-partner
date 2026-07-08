"use client";

import { useEffect, useState } from "react";

/* Üst yükleme çubuğu — nprogress deseni: başta hızlı dolar, sona (%90) doğru yavaşlar,
   iş bitince %100'e tamamlanıp kaybolur (sürekli dönme değil, gerçek ilerleme).
   Tüm state güncellemeleri zamanlayıcı callback'lerinde (effect içinde senkron setState yok). */
export default function TopProgressBar({ active }: { active: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (active) {
      const kick = window.setTimeout(() => setProgress((p) => (p < 10 ? 10 : p)), 0);
      const tick = window.setInterval(() => {
        setProgress((p) => {
          if (p >= 90) return p; // %90'da bekle (iş bitene kadar)
          const inc = p < 25 ? 10 : p < 55 ? 5 : p < 78 ? 2 : 0.5; // sona doğru yavaşlar
          return Math.min(90, p + inc);
        });
      }, 180);
      return () => {
        window.clearTimeout(kick);
        window.clearInterval(tick);
      };
    }
    // active bitti: %100'e tamamla, kısa bekle, sıfırla (kaybol).
    const finish = window.setTimeout(() => setProgress((p) => (p > 0 ? 100 : 0)), 0);
    const hide = window.setTimeout(() => setProgress(0), 320);
    return () => {
      window.clearTimeout(finish);
      window.clearTimeout(hide);
    };
  }, [active]);

  if (progress <= 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[4px] bg-terra/10" aria-hidden>
      <div
        className="h-full rounded-r-full bg-[linear-gradient(90deg,#0a2472,#3542ee_55%,#8ea2ff)] shadow-[0_0_12px_2px_rgba(53,66,238,.6)] transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
