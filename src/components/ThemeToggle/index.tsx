"use client";

import { useLocale } from "next-intl";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import {
  THEME_CHANGE_EVENT,
  THEME_COOKIE_MAX_AGE,
  THEME_COOKIE_NAME,
  THEME_STORAGE_KEY,
  type ThemePreference,
} from "@/theme";

const labels = {
  tr: { dark: "Karanlık moda geç", light: "Aydınlık moda geç" },
  en: { dark: "Switch to dark mode", light: "Switch to light mode" },
  ru: { dark: "Включить тёмную тему", light: "Включить светлую тему" },
  ar: { dark: "التبديل إلى الوضع الداكن", light: "التبديل إلى الوضع الفاتح" },
} as const;

const subscribe = (callback: () => void) => {
  const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const handleColorSchemeChange = () => {
    if (document.documentElement.dataset.theme !== "system") return;
    applyTheme("system");
    callback();
  };

  window.addEventListener(THEME_CHANGE_EVENT, callback);
  colorScheme.addEventListener("change", handleColorSchemeChange);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
    colorScheme.removeEventListener("change", handleColorSchemeChange);
  };
};

const getSnapshot = () => document.documentElement.classList.contains("dark");
const getServerSnapshot = () => false;

const applyTheme = (preference: ThemePreference) => {
  const isDark = preference === "dark"
    || (preference === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const root = document.documentElement;

  root.dataset.theme = preference;
  root.classList.toggle("dark", isDark);
  root.style.colorScheme = isDark ? "dark" : "light";
};

const persistTheme = (preference: ThemePreference) => {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${THEME_COOKIE_NAME}=${preference}; Path=/; Max-Age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
  localStorage.setItem(THEME_STORAGE_KEY, preference);
};

export default function ThemeToggle({ inline = false }: { inline?: boolean }) {
  const locale = useLocale() as keyof typeof labels;
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const label = labels[locale] ?? labels.en;

  const toggleTheme = () => {
    const nextDark = !document.documentElement.classList.contains("dark");
    const preference = nextDark ? "dark" : "light";

    applyTheme(preference);
    persistTheme(preference);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  return (
    <button
      type="button"
      className={inline
        ? "flex h-11 w-full items-center justify-between rounded-[10px] border border-line bg-paper px-3.5 text-[14px] font-semibold text-ink transition-colors hover:bg-cream"
        : "grid h-11 w-11 shrink-0 place-items-center rounded-[12px] border border-brand/[.18] bg-paper/70 text-brand shadow-[inset_0_1px_0_rgba(255,255,255,.65),0_8px_22px_-18px_rgba(36,17,63,.5)] backdrop-blur-md transition-all hover:border-brand/35 hover:bg-paper/90 dark:border-white/20 dark:bg-white/[.08] dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,.12)] dark:hover:border-white/35 dark:hover:bg-white/[.13]"}
      onClick={toggleTheme}
      aria-label={isDark ? label.light : label.dark}
      title={isDark ? label.light : label.dark}
    >
      {inline && <span>{isDark ? label.light : label.dark}</span>}
      {isDark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
    </button>
  );
}
