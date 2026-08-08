/* Coğrafya veri üretimi — tüm ülkeler + şehir + ilçe, statik chunk mimarisi.
   Çalıştır: node scripts/build-geo.mjs   (tek seferlik; çıktı repo'ya commit edilir)

   Çıktılar:
     public/geo/index.json  → [[iso2, adTR, adEN], ...] (~10KB) — ilk yüklenen tek dosya.
       Kanonik değer (DB'de saklanan) = Türkçe ad; EN locale yalnızca etiketi değiştirir.
     public/geo/{ISO2}.json → { "Şehir": ["İlçe", ...], ... } — ülke seçilince lazy fetch

   Kaynaklar:
     TR  → turkiyeapi.dev (81 il + resmi ilçeler, Türkçe adlarla; DB "İstanbul" ile uyumlu)
     Dünya → dr5hn/countries-states-cities-database (state=şehir, city=ilçe eşlemesi)
   Mevcut DB'de Türkçe eksonimlerle kayıt olan şehirler (Atina, Tiflis, Batum...) legacy
   birleştirme ile korunur. */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "geo");

const TR_URL = "https://turkiyeapi.dev/api/v1/provinces?fields=name,districts";
const COUNTRIES_URL =
  "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/countries.json";
const WORLD_URL =
  "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/countries%2Bstates%2Bcities.json";

/* Mevcut DB/seed'de kullanılan Türkçe şehir adları — üretilen chunk'lara eklenir ki
   kayıtlı işletmelerin country/city/district değerleri seçilebilir kalsın. */
const LEGACY = {
  GE: {
    "Batum": ["Merkez"],
    "Kutaisi": ["Merkez"],
    "Tiflis": ["Mtatsminda", "Old Tbilisi", "Saburtalo", "Vake"],
  },
  GR: {
    "Atina": ["Merkez", "Plaka", "Pire"],
    "Girit": ["Hanya", "Heraklion", "Resmo"],
    "Mikonos": ["Merkez"],
    "Rodos": ["Merkez"],
    "Santorini": ["Fira", "Imerovigli", "Oia"],
    "Selanik": ["Merkez"],
    // dr5hn'de ilçe listesi boş gelen iki bölge — ilçe zorunlu olduğu için elle dolduruldu.
    "Achaea": ["Patras", "Aigio", "Kalavryta"],
    "North Aegean": ["Midilli", "Sakız", "Sisam"],
  },
  // Aşağıdaki ülkelerde dr5hn kaynağında ilçesi boş gelen şehirler; ilçe alanı
  // zorunlu olduğu için (Orta Doğu + komşu ülkeler) elle dolduruldu.
  IQ: {
    "Iqlim Kurdistan": ["Erbil", "Süleymaniye", "Dohuk", "Halepçe"],
  },
  QA: {
    "Al Daayen": ["Lusail", "Umm Qarn", "Al Kheesa", "Rawdat Al Hamama"],
  },
  OM: {
    "Ash Sharqiyah North": ["Ibra", "Al Mudaybi", "Bidiyah", "Al Qabil", "Wadi Bani Khalid"],
  },
  AZ: {
    "Babek": ["Merkez"],
    "Julfa": ["Merkez"],
    "Kangarli": ["Merkez"],
    "Ordubad": ["Merkez"],
    "Sadarak": ["Merkez"],
    "Shahbuz": ["Merkez"],
    "Sharur": ["Merkez"],
  },
};

/* Kaynak (dr5hn) ağacını tamamen değiştiren ülkeler. dr5hn Fas'ta hem 12 bölgeyi
   hem illeri karışık döndürüp çift kayıt üretiyordu (Casablanca + Casablanca-Settat…).
   Wikipedia'nın resmi yapısıyla (12 bölge = şehir, il/prefektür = ilçe) elle kuruldu. */
const OVERRIDE = {
  MA: {
    "Béni Mellal-Khénifra": ["Azilal", "Béni Mellal", "Fquih Ben Salah", "Khénifra", "Khouribga"],
    "Casablanca-Settat": ["Benslimane", "Berrechid", "Casablanca", "El Jadida", "Médiouna", "Mohammedia", "Nouaceur", "Settat", "Sidi Bennour"],
    "Drâa-Tafilalet": ["Errachidia", "Midelt", "Ouarzazate", "Tinghir", "Zagora"],
    "Fès-Meknès": ["Boulemane", "El Hajeb", "Fès", "Ifrane", "Meknès", "Moulay Yacoub", "Sefrou", "Taounate", "Taza"],
    "Marrakesh-Safi": ["Al Haouz", "Chichaoua", "El Kelâa des Sraghna", "Essaouira", "Marrakesh", "Rehamna", "Safi", "Youssoufia"],
    "Oriental": ["Berkane", "Driouch", "Figuig", "Guercif", "Jerada", "Nador", "Oujda-Angad", "Taourirt"],
    "Rabat-Salé-Kénitra": ["Kénitra", "Khémisset", "Rabat", "Salé", "Sidi Kacem", "Sidi Slimane", "Skhirate-Témara"],
    "Souss-Massa": ["Agadir-Ida Ou Tanane", "Chtouka Aït Baha", "Inezgane-Aït Melloul", "Taroudant", "Tata", "Tiznit"],
    "Tanger-Tétouan-Al Hoceïma": ["Al Hoceïma", "Chefchaouen", "Fahs-Anjra", "Larache", "M'diq-Fnideq", "Ouezzane", "Tanger-Assilah", "Tétouan"],
    "Guelmim-Oued Noun": ["Assa-Zag", "Guelmim", "Sidi Ifni", "Tan-Tan"],
    "Laâyoune-Sakia El Hamra": ["Boujdour", "Es Semara", "Laâyoune", "Tarfaya"],
    "Dakhla-Oued Ed-Dahab": ["Aousserd", "Oued Ed-Dahab"],
  },
};

const collator = new Intl.Collator("tr");

async function fetchJson(url, label) {
  process.stdout.write(`indiriliyor: ${label} … `);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${label}: HTTP ${res.status}`);
  const data = await res.json();
  console.log("ok");
  return data;
}

function sortTree(tree) {
  const sorted = {};
  for (const city of Object.keys(tree).sort(collator.compare)) {
    sorted[city] = [...new Set(tree[city])].sort(collator.compare);
  }
  return sorted;
}

const [trRes, countries, world] = await Promise.all([
  fetchJson(TR_URL, "turkiyeapi il/ilçe"),
  fetchJson(COUNTRIES_URL, "dr5hn ülkeler"),
  fetchJson(WORLD_URL, "dr5hn dünya (46MB)"),
]);

await mkdir(OUT, { recursive: true });

/* 1 — Ülke indeksi ([iso2, adTR, adEN], Türkçe sıralı) */
const index = countries
  .map((c) => [c.iso2, c.translations?.tr || c.name, c.name])
  .sort((a, b) => collator.compare(a[1], b[1]));
await writeFile(path.join(OUT, "index.json"), JSON.stringify(index));
console.log(`index.json → ${index.length} ülke`);

/* 2 — TR chunk (turkiyeapi, resmi Türkçe il/ilçe) */
const trTree = {};
for (const p of trRes.data) trTree[p.name] = (p.districts ?? []).map((d) => d.name);
await writeFile(path.join(OUT, "TR.json"), JSON.stringify(sortTree(trTree)));
console.log(`TR.json → ${Object.keys(trTree).length} il`);

/* 3 — Dünya chunk'ları (TR hariç; state=şehir, city=ilçe) */
let total = 0;
let bytes = 0;
for (const c of world) {
  if (c.iso2 === "TR") continue;
  const tree = {};
  for (const s of c.states ?? []) {
    const districts = (s.cities ?? []).map((x) => x.name);
    if (s.name) tree[s.name] = districts;
  }
  // OVERRIDE: kaynağı tamamen değiştir (bkz. Fas çift-kayıt sorunu).
  const overridden = OVERRIDE[c.iso2];
  if (overridden) {
    for (const k of Object.keys(tree)) delete tree[k];
    Object.assign(tree, overridden);
  }
  // Eyaleti olmayan mikro ülkeler: ülke adını tek şehir yap (boş bırakma).
  if (Object.keys(tree).length === 0) tree[c.translations?.tr || c.name] = [];
  Object.assign(tree, LEGACY[c.iso2] ?? {});
  const json = JSON.stringify(sortTree(tree));
  await writeFile(path.join(OUT, `${c.iso2}.json`), json);
  total += 1;
  bytes += json.length;
}
console.log(`dünya → ${total} ülke chunk'ı, toplam ${(bytes / 1024 / 1024).toFixed(1)}MB`);
console.log("bitti: public/geo/");
