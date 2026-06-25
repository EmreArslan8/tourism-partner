"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import styles from "./styles";


/* ~3 saniyelik karşılama ekranı. Oturum başına bir kez gösterilir.
   İlk durum "show" (SSR ile tutarlı); state değişimleri yalnız timer
   callback'lerinde olur (effect içinde senkron setState yok). */
const Splash = () => {
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
    <div className={`${styles.overlay} ${phase === "leaving" ? styles.leaving : ""}`} role="presentation">
      <div className={styles.inner}>
        <Image
          src="/assets/logo.jpeg"
          alt="Tourism Partner"
          width={192}
          height={192}
          priority
          className={styles.logoImage}
        />
        <p className={styles.tag}>{t("tagline")}</p>
      </div>
    </div>
  );
};

export default Splash;
