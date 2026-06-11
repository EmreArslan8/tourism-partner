"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { s } from "./styles";

/* Aktif yolu koruyarak dili değiştirir (next-intl Link locale prop'u). */
export default function LangSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  return (
    <div className={s.wrap} role="group" aria-label="Dil">
      {routing.locales.map((l) => (
        <Link key={l} href={pathname} locale={l} className={cn(s.btn, l === locale && s.active)}>
          {l}
        </Link>
      ))}
    </div>
  );
}
