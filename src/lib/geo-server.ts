/* Coğrafya SERVER katmanı — server action doğrulamaları için public/geo chunk'larını
   dosya sisteminden okur (dış istek yok, module-level cache; dosyalar deploy'da sabit).
   Kanonik değerler Türkçe ülke adı + chunk'taki şehir/ilçe adlarıdır.
   Client tarafı için bkz. lib/geo.ts. Üretim: scripts/build-geo.mjs */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { normalizeTr } from "@/lib/utils";

type GeoTree = Record<string, string[]>;
type CountryIndex = [iso2: string, nameTr: string, nameEn: string][];

const GEO_DIR = path.join(process.cwd(), "public", "geo");

let indexPromise: Promise<CountryIndex> | null = null;
const treeCache = new Map<string, Promise<GeoTree>>();

function getIndex(): Promise<CountryIndex> {
  indexPromise ??= readFile(path.join(GEO_DIR, "index.json"), "utf8")
    .then((raw) => JSON.parse(raw) as CountryIndex)
    .catch(() => []);
  return indexPromise;
}

async function getTree(countryName: string): Promise<GeoTree> {
  const index = await getIndex();
  const iso2 = index.find(([, tr, en]) => tr === countryName || en === countryName)?.[0];
  if (!iso2 || !/^[A-Z]{2}$/.test(iso2)) return {};
  let cached = treeCache.get(iso2);
  if (!cached) {
    cached = readFile(path.join(GEO_DIR, `${iso2}.json`), "utf8")
      .then((raw) => JSON.parse(raw) as GeoTree)
      .catch(() => ({}));
    treeCache.set(iso2, cached);
  }
  return cached;
}

/** Kanonik (Türkçe) ülke adları — kayıt/teklif doğrulamasında kullanılır. */
export async function getCountryOptions(): Promise<string[]> {
  return (await getIndex()).map(([, tr]) => tr);
}

/** Aramadaki Türkçe/İngilizce ülke adını kanonik Türkçe değere çevirir.
 *  Tam adın yanında benzersiz 3+ karakterli başlangıçları da kabul eder:
 *  "Egypt hotel" / "egy hotel" → "misir hotel". */
export async function canonicalizeCountryMentions(rawQuery: string): Promise<string> {
  const normalized = normalizeTr(rawQuery);
  if (!normalized) return "";

  const countries = (await getIndex()).map(([, tr, en]) => ({
    canonical: normalizeTr(tr),
    aliases: [...new Set([normalizeTr(tr), normalizeTr(en)])],
  }));

  let query = ` ${normalized.replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/g, " ").trim()} `;
  // Önce çok kelimeli/tam ülke adlarını yakala.
  const exactAliases = countries
    .flatMap((country) => country.aliases.map((alias) => ({ alias, canonical: country.canonical })))
    .sort((a, b) => b.alias.length - a.alias.length);
  for (const { alias, canonical } of exactAliases) {
    const boundedAlias = ` ${alias} `;
    if (alias && query.includes(boundedAlias)) {
      query = query.replaceAll(boundedAlias, ` ${canonical} `);
    }
  }

  const tokens = query.trim().split(/\s+/).filter(Boolean);
  return tokens.map((token) => {
    if (token.length < 3) return token;
    const matches = countries.filter((country) =>
      country.aliases.some((alias) => alias.startsWith(token)),
    );
    return matches.length === 1 ? matches[0].canonical : token;
  }).join(" ");
}

export async function getCityOptions(country: string): Promise<string[]> {
  return Object.keys(await getTree(country));
}

export async function getDistrictOptions(country: string, city: string): Promise<string[]> {
  return (await getTree(country))[city] ?? [];
}

export async function isValidCity(country: string, city: string): Promise<boolean> {
  return Boolean(country && city && city in (await getTree(country)));
}

/** İlçe opsiyonel: boşsa geçerli; doluysa şehrin listesinde olmalı. */
export async function isValidDistrict(country: string, city: string, district: string): Promise<boolean> {
  if (!district) return true;
  return ((await getTree(country))[city] ?? []).includes(district);
}

export async function isValidRegion(country: string, city: string, district: string): Promise<boolean> {
  return ((await getTree(country))[city] ?? []).includes(district);
}
