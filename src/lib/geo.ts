"use client";

/* Coğrafya (ülke→şehir→ilçe) CLIENT katmanı — statik chunk mimarisi.
   Veri: public/geo/index.json ([iso2, adTR, adEN, adRU, adAR]) + ülke başına
   /geo/{ISO2}.json (yalnızca seçilen ülke fetch edilir; module cache + browser cache).
   Bu JSON dosyaları KAYNAK'tır — elle bakımlı, repo'ya commit'li (üretici script yok).

   Kanonik değer (DB'de saklanan, form value'su) = Türkçe ülke adı — mevcut kayıtlarla
   uyum için. Diğer locale'ler yalnızca görünen etiketi değiştirir (Yunanistan ↔ Greece
   ↔ Греция ↔ اليونان). Server tarafı doğrulama için bkz. lib/geo-server.ts. */

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";

export type GeoTree = Record<string, string[]>;
export type CountryOption = { value: string; label: string; aliases: string[] };
type CountryIndex = [iso2: string, nameTr: string, nameEn: string, nameRu: string, nameAr: string][];

let indexPromise: Promise<CountryIndex> | null = null;
const treeCache = new Map<string, Promise<GeoTree>>();

function loadIndex(): Promise<CountryIndex> {
  // no-cache: her yüklemede origin'e koşullu doğrulama (değişmediyse 304, ~bedava).
  // Böylece deploy'da güncellenen geo verisi kullanıcıya anında yansır.
  indexPromise ??= fetch("/geo/index.json", { cache: "no-cache" }).then((r) => {
    if (!r.ok) throw new Error(`geo index: HTTP ${r.status}`);
    return r.json();
  });
  return indexPromise;
}

async function loadTree(countryName: string): Promise<GeoTree> {
  const index = await loadIndex();
  const iso2 = index.find(([, tr, en]) => tr === countryName || en === countryName)?.[0];
  if (!iso2) return {};
  let cached = treeCache.get(iso2);
  if (!cached) {
    cached = fetch(`/geo/${iso2}.json`, { cache: "no-cache" }).then((r) => (r.ok ? r.json() : {}));
    treeCache.set(iso2, cached);
  }
  return cached;
}

/* Ülke/şehir/ilçe seçenekleri — lazy yüklemeli hook.
   countries: { value: kanonik TR ad, label: locale'e göre ad } (locale sıralı).
   Chunk henüz gelmediyse mevcut seçili değer tek seçenek olarak korunur
   (kayıtlı formlar yükleme anında boş görünmesin). */
export function useRegions(country: string, city: string, district = "") {
  const locale = useLocale();
  const [index, setIndex] = useState<CountryIndex>([]);
  // Ülkeyle birlikte sakla: ülke değişince eski ağaç render'da otomatik geçersizleşir
  // (effect içinde senkron setState reset'ine gerek kalmaz).
  const [loaded, setLoaded] = useState<{ country: string; tree: GeoTree } | null>(null);
  const tree = loaded?.country === country ? loaded.tree : null;

  useEffect(() => {
    let live = true;
    loadIndex().then((next) => {
      if (live) setIndex(next);
    }).catch(() => {});
    return () => { live = false; };
  }, []);

  useEffect(() => {
    let live = true;
    if (!country) return;
    loadTree(country).then((next) => {
      if (live) setLoaded({ country, tree: next });
    }).catch(() => {});
    return () => { live = false; };
  }, [country]);

  const countries = useMemo<CountryOption[]>(() => {
    // value = Türkçe kanonik ad (DB'de saklanan); label = locale'e göre gösterim.
    // Ru/Ar isimleri i18n-iso-countries (CLDR) kaynaklı; index'te 5 kolon: tr,en,ru,ar.
    const collator = new Intl.Collator(locale);
    const label = ([, tr, en, ru, ar]: CountryIndex[number]) =>
      locale === "en" ? en : locale === "ru" ? ru : locale === "ar" ? ar : tr;
    return index
      .map((row) => ({ value: row[1], label: label(row), aliases: [row[1], row[2], row[3], row[4]] }))
      .sort((a, b) => collator.compare(a.label, b.label));
  }, [index, locale]);

  const cities = useMemo(() => {
    const list = tree ? Object.keys(tree) : [];
    return list.length === 0 && city ? [city] : list;
  }, [tree, city]);

  const districts = useMemo(() => {
    const list = tree?.[city] ?? [];
    return list.length === 0 && district ? [district] : list;
  }, [tree, city, district]);

  return { countries, cities, districts };
}
