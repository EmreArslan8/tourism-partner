"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { s } from "./styles";

/* ~3 saniyelik karşılama ekranı. Oturum başına bir kez gösterilir.
   İlk durum "show" (SSR ile tutarlı); state değişimleri yalnız timer
   callback'lerinde olur (effect içinde senkron setState yok). */
export default function Splash() {
  const [phase, setPhase] = useState<"show" | "leaving" | "hidden">("show");
  const t = useTranslations("splash");

  useEffect(() => {
    if (sessionStorage.getItem("tp_splash_seen")) {
      const skip = setTimeout(() => setPhase("hidden"), 0);
      return () => clearTimeout(skip);
    }
    document.body.style.overflow = "hidden";
    const leave = setTimeout(() => setPhase("leaving"), 2600);
    const done = setTimeout(() => {
      setPhase("hidden");
      sessionStorage.setItem("tp_splash_seen", "1");
      document.body.style.overflow = "";
    }, 3200);
    return () => {
      clearTimeout(leave);
      clearTimeout(done);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div className={`${s.overlay} ${phase === "leaving" ? s.leaving : ""}`} role="presentation">
      <div className={s.inner}>
        <svg viewBox="0 -8 98 86" className={s.mark} aria-hidden focusable="false">
          <path d="M6 24C27 4 60 5 78 28c10 13 11 30 4 44 13-20 8-48-11-62C49-7 21 2 6 24Z" />
          <path d="M17 31c19-10 44-5 58 13 7 10 9 23 5 33 9-17 3-38-13-49-15-10-34-10-50 3Z" />
        </svg>
        <span className={s.type}>
          <span className={s.typeTop}>TOURISM</span>
          <span className={s.typeBottom}>PARTNER</span>
        </span>
        <p className={s.tag}>{t("tagline")}</p>
      </div>
    </div>
  );
}
