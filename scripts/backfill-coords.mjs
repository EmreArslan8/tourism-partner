/*
 * İşletme koordinat backfill'i — lat/lng boş (ya da 0,0) olan işletmeleri
 * adreslerinden (ilçe, şehir, ülke) OpenStreetMap Nominatim ile geocode edip
 * businesses.lat / businesses.lng alanlarını doldurur.
 *
 * Çalıştırma:
 *   node --env-file=.env.local scripts/backfill-coords.mjs           # önizleme (dry-run)
 *   node --env-file=.env.local scripts/backfill-coords.mjs --write   # DB'ye yaz
 *
 * Notlar:
 *  - Nominatim kullanım politikası: en fazla 1 istek/sn ve bir User-Agent zorunlu.
 *    Script her istek arasında ~1.2 sn bekler.
 *  - Adreste sokak yok; hassasiyet ilçe/şehir merkezi seviyesindedir (pin için yeterli).
 */
import { createClient } from "@supabase/supabase-js";

const WRITE = process.argv.includes("--write");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY eksik (.env.local).");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* Nominatim'de serbest metin sorgusu; ilk sonucun lat/lon'unu döndürür (yoksa null).
   Geçici ağ/servis hatalarında (ECONNRESET, 5xx, 429) artan bekleme ile 4 kez dener. */
async function geocode(query) {
  const u = new URL("https://nominatim.openstreetmap.org/search");
  u.searchParams.set("format", "json");
  u.searchParams.set("limit", "1");
  u.searchParams.set("accept-language", "tr");
  u.searchParams.set("q", query);

  let lastErr;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(u, {
        headers: { "User-Agent": "tourism-partner-geocode/1.0 (backfill script)" },
      });
      if (res.status === 429 || res.status >= 500) throw new Error(`Nominatim ${res.status}`);
      if (!res.ok) throw new Error(`Nominatim ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) return null;
      const lat = Number(data[0].lat);
      const lon = Number(data[0].lon);
      return Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lng: lon } : null;
    } catch (e) {
      lastErr = e;
      if (attempt < 4) await sleep(2000 * attempt); // 2s, 4s, 6s backoff
    }
  }
  throw lastErr;
}

async function main() {
  // lat null VEYA (lat=0 ve lng=0) olanları çek.
  const { data: rows, error } = await supabase
    .from("businesses")
    .select("id,name,country,city,district,lat,lng")
    .or("lat.is.null,and(lat.eq.0,lng.eq.0)")
    .order("id", { ascending: true });
  if (error) throw new Error(error.message);

  console.log(`${rows.length} işletmenin koordinatı eksik.${WRITE ? "" : "  (DRY-RUN — yazılmayacak; --write ile çalıştır)"}\n`);

  let ok = 0;
  let miss = 0;
  for (const b of rows) {
    // Kademeli sorgular: en spesifikten en genele.
    const candidates = [
      [b.district, b.city, b.country].filter(Boolean).join(", "),
      [b.city, b.country].filter(Boolean).join(", "),
      b.city,
    ].filter(Boolean);

    let hit = null;
    let used = "";
    try {
      for (const q of candidates) {
        hit = await geocode(q);
        await sleep(1200); // Nominatim rate-limit
        if (hit) {
          used = q;
          break;
        }
      }
    } catch (e) {
      miss++;
      console.log(`✗ #${b.id} ${b.name} — geocode hatası: ${e.message}`);
      continue;
    }

    if (!hit) {
      miss++;
      console.log(`✗ #${b.id} ${b.name} — bulunamadı (${b.district}, ${b.city}, ${b.country})`);
      continue;
    }

    ok++;
    console.log(`✓ #${b.id} ${b.name} → ${hit.lat.toFixed(5)}, ${hit.lng.toFixed(5)}  [${used}]`);

    if (WRITE) {
      const { error: upErr } = await supabase
        .from("businesses")
        .update({ lat: hit.lat, lng: hit.lng })
        .eq("id", b.id);
      if (upErr) console.error(`  ! yazılamadı: ${upErr.message}`);
    }
  }

  console.log(`\nBitti. Eşleşen: ${ok}, bulunamayan: ${miss}${WRITE ? " (yazıldı)" : " (dry-run)"}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
