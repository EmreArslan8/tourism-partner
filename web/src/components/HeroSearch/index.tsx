"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { CITIES } from "@/lib/data";
import type { GroupKey } from "@/lib/types";
import { s } from "./styles";

/* Ana sayfa hero arama — filtreleme burada YAPILMAZ, /listeleme'ye yönlendirir. */
export default function HeroSearch() {
  const router = useRouter();
  const t = useTranslations("hero");
  const tc = useTranslations("cat");
  const [group, setGroup] = useState<GroupKey | "all">("all");
  const [city, setCity] = useState("all");
  const [q, setQ] = useState("");

  function go(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (group !== "all") params.set("cat", group);
    if (city !== "all") params.set("city", city);
    if (q.trim()) params.set("q", q.trim());
    router.push(`/listeleme${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form className={s.form} onSubmit={go}>
      <select aria-label={t("searchCat")} className={s.field} value={group} onChange={(e) => setGroup(e.target.value as GroupKey | "all")}>
        <option value="all">{t("searchCat")}</option>
        {CATEGORY_GROUPS.map((g) => <option key={g.key} value={g.key}>{tc(g.key)}</option>)}
      </select>
      <select aria-label={t("searchCity")} className={s.field} value={city} onChange={(e) => setCity(e.target.value)}>
        <option value="all">{t("searchCity")}</option>
        {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <input type="text" className={s.input} placeholder={t("searchPh")} value={q} onChange={(e) => setQ(e.target.value)} aria-label={t("searchPh")} />
      <button type="submit" className={s.submit}>{t("searchBtn")}</button>
    </form>
  );
}
