"use client";

import { useLocale } from "next-intl";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

const labels = {
  tr: { dark: "Karanlık moda geç", light: "Aydınlık moda geç" },
  en: { dark: "Switch to dark mode", light: "Switch to light mode" },
  ru: { dark: "Включить тёмную тему", light: "Включить светлую тему" },
  ar: { dark: "التبديل إلى الوضع الداكن", light: "التبديل إلى الوضع الفاتح" },
} as const;

const subscribe = (callback: () => void) => {
  window.addEventListener("tp-theme-change", callback);
  return () => window.removeEventListener("tp-theme-change", callback);
};

const getSnapshot = () => document.documentElement.classList.contains("dark");
const getServerSnapshot = () => false;

export default function ThemeToggle({ inline = false }: { inline?: boolean }) {
  const locale = useLocale() as keyof typeof labels;
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const label = labels[locale] ?? labels.en;

  const toggleTheme = () => {
    const nextDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextDark);
    document.documentElement.dataset.theme = nextDark ? "dark" : "light";
    localStorage.setItem("tp-theme", nextDark ? "dark" : "light");
    window.dispatchEvent(new Event("tp-theme-change"));
  };

  return (
    <button
      type="button"
      className={inline
        ? "flex h-11 w-full items-center justify-between rounded-[10px] border border-line bg-paper px-3.5 text-[14px] font-semibold text-ink transition-colors hover:bg-cream"
        : "grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border border-brand/20 bg-paper/70 text-brand shadow-sm backdrop-blur-md transition-colors hover:border-brand/45 hover:bg-cream dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"}
      onClick={toggleTheme}
      aria-label={isDark ? label.light : label.dark}
      title={isDark ? label.light : label.dark}
    >
      {inline && <span>{isDark ? label.light : label.dark}</span>}
      {isDark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
    </button>
  );
}
