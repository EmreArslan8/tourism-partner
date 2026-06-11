"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useState, useRef, useEffect } from "react";
import { styles } from "./styles";


/**
 * Dropdown dil seçici bileşeni.
 * next-intl navigation yardımcılarını kullanarak locale değiştirir.
 */
export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const locales = [
    { code: "tr", label: "TR", name: "Türkçe", flag: "🇹🇷" },
    { code: "en", label: "EN", name: "English", flag: "🇬🇧" },
  ];

  const currentLocale = locales.find((l) => l.code === locale) || locales[0];

  const handleLocaleChange = (newLocale: string) => {
    // @ts-ignore - next-intl type issue with locale property
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.wrapper} ref={dropdownRef}>
      <button
        type="button"
        className={styles.button}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className={styles.flag}>{currentLocale.flag}</span>
        <span className={styles.label}>{currentLocale.label}</span>
        <svg
          className={`${styles.icon} transition-transform ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {locales.map((l) => (
            <button
              key={l.code}
              className={`${styles.item} ${l.code === locale ? styles.itemActive : ""}`}
              onClick={() => handleLocaleChange(l.code)}
            >
              <span className={styles.itemLeft}>
                <span className={styles.flag}>{l.flag}</span>
                <span className={styles.itemName}>{l.name}</span>
              </span>
              <span className={styles.itemCode}>{l.code.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
