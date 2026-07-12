"use client";

import { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import Field from "@/components/common/Field";

/* Konum alanları + "Adresten bul" (geocode). Ülke/Şehir/İlçe'den koordinat
   üretir; /api/geocode (OSM Nominatim proxy) çağrılır, Lat/Lng otomatik dolar.
   Admin isterse koordinatı elle düzeltebilir. Form fieldset disabled iken
   (görüntüleme modu) tüm inputlar zaten kilitli, buton da devre dışı kalır. */
export default function LocationFields({
  inputClassName,
  defaultCountry = "Türkiye",
  defaultCity = "",
  defaultDistrict = "",
  defaultLat = 0,
  defaultLng = 0,
}: {
  inputClassName: string;
  defaultCountry?: string;
  defaultCity?: string;
  defaultDistrict?: string;
  defaultLat?: number;
  defaultLng?: number;
}) {
  const [country, setCountry] = useState(String(defaultCountry ?? ""));
  const [city, setCity] = useState(String(defaultCity ?? ""));
  const [district, setDistrict] = useState(String(defaultDistrict ?? ""));
  const [lat, setLat] = useState(String(defaultLat ?? 0));
  const [lng, setLng] = useState(String(defaultLng ?? 0));
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function findCoords() {
    const q = [district, city, country].map((s) => s.trim()).filter(Boolean).join(", ");
    if (!q) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
      if (!res.ok) {
        setStatus("error");
        return;
      }
      const data = (await res.json()) as { lat: number; lng: number };
      setLat(String(data.lat));
      setLng(String(data.lng));
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 max-[520px]:grid-cols-1">
        <Field label="Ülke" required>
          <input name="country" required value={country} onChange={(e) => setCountry(e.target.value)} className={inputClassName} />
        </Field>
        <Field label="Şehir" required>
          <input name="city" required value={city} onChange={(e) => setCity(e.target.value)} className={inputClassName} />
        </Field>
      </div>
      <Field label="İlçe / Bölge" required>
        <input name="district" required value={district} onChange={(e) => setDistrict(e.target.value)} className={inputClassName} />
      </Field>

      <div className="flex items-center justify-between gap-3 rounded-[8px] border border-dashed border-line bg-cream/35 px-3 py-2">
        <span className="text-[12px] font-medium text-muted">
          {status === "ok" ? "Koordinat bulundu ✓" : status === "error" ? "Bulunamadı — elle girin" : "Adresten harita konumunu otomatik bul"}
        </span>
        <button
          type="button"
          onClick={findCoords}
          disabled={status === "loading"}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[7px] border border-line bg-white px-2.5 text-[12px] font-bold text-ink hover:bg-cream disabled:opacity-60"
        >
          {status === "loading" ? <Loader2 size={14} aria-hidden className="animate-spin" /> : <MapPin size={14} aria-hidden />}
          Adresten bul
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Lat" hint="opsiyonel">
          <input name="lat" value={lat} onChange={(e) => setLat(e.target.value)} className={inputClassName} />
        </Field>
        <Field label="Lng" hint="opsiyonel">
          <input name="lng" value={lng} onChange={(e) => setLng(e.target.value)} className={inputClassName} />
        </Field>
      </div>
    </>
  );
}
