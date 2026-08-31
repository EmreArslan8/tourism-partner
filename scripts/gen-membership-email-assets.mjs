/* Üyelik tanıtım mailinin (email-templates/membership-showcase.ts) görsellerini üretir.

   Rozetler sitedeki bileşenlerle birebir aynı SVG'den render edilir
   (VerifiedBusinessBadge → lucide BadgeCheck, FounderMedal → SupplierHeader),
   böylece mailde gösterilen mühür kullanıcının profilinde göreceğiyle aynı olur.

   Kullanım:  node scripts/gen-membership-email-assets.mjs
   Çıktı:     public/email-assets/*.png  (mail istemcileri SVG/WebP desteklemez) */

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const OUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "email-assets");
mkdirSync(OUT_DIR, { recursive: true });

const GOLD = "#c89422";
const GOLD_DEEP = "#a97a12";
const NAVY = "#0e2745";
const AMBER = "#ffb957";
const PURPLE = "#4c1d95";

/* ---- Doğrulanmış işletme rozeti (lucide BadgeCheck, gold dolgu + beyaz kontur) ---- */
const verifiedBadge = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
  <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" fill="${GOLD}" stroke="#ffffff" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="m9 12 2 2 4-4" fill="none" stroke="#ffffff" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

/* ---- Kurucu üye mührü (SupplierCard/SupplierHeader'daki FounderMedal) ---- */
const founderMedal = (height) => {
  const width = Math.round((height * 48) / 54);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 48 54">
  <path d="M13 30v18l11-5 11 5V30Z" fill="${AMBER}"/>
  <path d="M17.5 32.5v8.7l6.5-3 6.5 3v-8.7Z" fill="${NAVY}"/>
  <circle cx="24" cy="20" r="16" fill="${NAVY}" stroke="${AMBER}" stroke-width="5"/>
  <path d="m24 9 3.2 6.5 7.2 1-5.2 5 1.2 7.1-6.4-3.4-6.4 3.4 1.2-7.1-5.2-5 7.2-1Z" fill="${AMBER}"/>
</svg>`;
};

/* ---- Kapak görseli olmayan işletmeler için placeholder kare ----
   Önizleme kartı maildeki HTML'de kuruluyor (işletmenin gerçek adı/konumu ile);
   burada yalnızca kapak görseli yoksa kullanılacak nötr kare üretiliyor. */
const photoPlaceholder = () => `<svg xmlns="http://www.w3.org/2000/svg" width="232" height="232" viewBox="0 0 232 232">
  <defs>
    <linearGradient id="photo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${PURPLE}"/>
      <stop offset="1" stop-color="#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="232" height="232" rx="24" fill="url(#photo)"/>
  <circle cx="84" cy="86" r="22" fill="#ffffff" opacity="0.22"/>
  <path d="M44 178l46-58 34 42 26-28 40 44z" fill="#ffffff" opacity="0.3"/>
</svg>`;

const assets = [
  ["membership-badge-verified.png", verifiedBadge(240)],
  ["membership-badge-founder.png", founderMedal(240)],
  ["membership-card-photo.png", photoPlaceholder()],
];

for (const [name, svg] of assets) {
  const buffer = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  writeFileSync(path.join(OUT_DIR, name), buffer);
  const { width, height, size } = await sharp(buffer).metadata();
  console.log(`${name} → ${width}×${height}, ${Math.round(size / 1024)} KB`);
}
