"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useState, useRef, useEffect } from "react";
import { Globe2 } from "lucide-react";
import styles from "./styles";

type Locale = "tr" | "en" | "ru" | "ar";

/**
 * Dropdown dil seçici bileşeni.
 * next-intl navigation yardımcılarını kullanarak locale değiştirir.
 */
const LocaleSwitcher = ({ light = false, inline = false, sidebar = false }: { light?: boolean; inline?: boolean; sidebar?: boolean } = {}) => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const locales = [
    { code: "tr", label: "TR", name: "Türkçe" },
    { code: "en", label: "EN", name: "English" },
    { code: "ru", label: "RU", name: "Русский" },
    { code: "ar", label: "AR", name: "العربية" },
  ];

  const currentLocale = locales.find((l) => l.code === locale) || locales[0];

  const handleLocaleChange = (newLocale: Locale) => {
    router.replace(
      // @ts-expect-error -- next-intl resmî kalıbı: pathname ve params çalışma anında
      // her zaman eşleşir; TS dinamik rotalar için bu eşleşmeyi statik doğrulayamaz.
      { pathname, params },
      { locale: newLocale }
    );
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

  // Inline varyant (mobil sheet): dört dil yan yana pill olarak gösterilir.
  if (inline) {
    return (
      <div className={styles.inlineWrap}>
        {locales.map((l) => (
          <button
            key={l.code}
            type="button"
            className={`${styles.inlineItem} ${l.code === locale ? styles.inlineItemActive : ""}`}
            onClick={() => handleLocaleChange(l.code as Locale)}
            aria-current={l.code === locale}
          >
            {l.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={sidebar ? styles.sidebarWrapper : styles.wrapper} ref={dropdownRef}>
      <button
        type="button"
        className={sidebar ? styles.buttonSidebar : light ? styles.buttonLight : styles.button}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {sidebar && <Globe2 size={17} aria-hidden />}
        <span className={styles.label}>{currentLocale.label}</span>
        <span className="sr-only">{currentLocale.name}</span>
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
        <div className={sidebar ? styles.dropdownSidebar : styles.dropdown}>
          {locales.map((l) => (
            <button
              key={l.code}
              className={`${sidebar ? styles.sidebarItem : styles.item} ${l.code === locale ? (sidebar ? styles.sidebarItemActive : styles.itemActive) : ""}`}
              onClick={() => handleLocaleChange(l.code as Locale)}
            >
              <span className={styles.itemLeft}>
                <span className={sidebar ? styles.sidebarItemName : styles.itemName}>{l.name}</span>
              </span>
              <span className={styles.itemCode}>{l.code.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocaleSwitcher;
