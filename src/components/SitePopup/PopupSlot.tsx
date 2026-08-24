import { getActivePopup } from "@/lib/platform-data";
import { connection } from "next/server";
import SitePopup from "./index";

/* Server slot: public aktif pop-up'ı getirir. Marketing/app layout'larında PPR ile
   güvenli kalması için burada cookie/auth okunmaz; hedefli pop-up gerekiyorsa ayrı
   client-side veya route handler tabanlı akışa taşınmalı. */
export default async function PopupSlot() {
  // Zaman penceresi kontrolü request anında yapılır; cache yalnız DB sonucunu tutar.
  await connection();
  const popup = await loadPopup();
  if (!popup) return null;
  return <SitePopup popup={popup} />;
}

async function loadPopup() {
  try {
    return await getActivePopup();
  } catch (error) {
    console.error("[site-popup] popup atlandı:", error);
    return null;
  }
}
