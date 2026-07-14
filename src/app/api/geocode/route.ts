import { NextResponse, type NextRequest } from "next/server";

/*
 * Adres → koordinat (geocode) proxy'si. OpenStreetMap Nominatim'i kullanır
 * (harita zaten Leaflet/OSM). Tarayıcıdan direkt çağrılmaz; buradan proxy'lenir
 * ki Nominatim politikası gereği User-Agent set edilsin ve sonuç cache'lensin.
 * Politika: saniyede ~1 istek, tanımlı User-Agent zorunlu.
 */

const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const UA = "TourismPartner/1.0 (admin geocode; contact: info@tourismpartner)";

// Basit süreç-içi cache — aynı adres tekrar sorulmasın (TTL 24s).
const cache = new Map<string, { at: number; data: { lat: number; lng: number; label: string } | null }>();
const TTL = 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  const q = new URL(request.url).searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ error: "missing_query" }, { status: 400 });
  }

  const key = q.toLowerCase();
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < TTL) {
    return cached.data
      ? NextResponse.json(cached.data)
      : NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  try {
    const url = `${NOMINATIM}?q=${encodeURIComponent(q)}&format=json&limit=1&addressdetails=0`;
    const res = await fetch(url, {
      headers: { "User-Agent": UA, "Accept-Language": "tr" },
      // Nominatim yanıtı adres bazında değişmez; ağ katmanında da cache'le.
      next: { revalidate: TTL / 1000 },
    });
    if (!res.ok) return NextResponse.json({ error: "upstream" }, { status: 502 });

    const list = (await res.json()) as Array<{ lat: string; lon: string; display_name: string }>;
    const hit = list[0];
    if (!hit) {
      cache.set(key, { at: Date.now(), data: null });
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const data = { lat: Number(hit.lat), lng: Number(hit.lon), label: hit.display_name };
    cache.set(key, { at: Date.now(), data });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
