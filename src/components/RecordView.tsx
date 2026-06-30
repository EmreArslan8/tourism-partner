"use client";

import { useEffect, useRef } from "react";
import { recordView } from "@/lib/actions/views";

/* Görüntülenmeyi bir kez kaydeden görünmez bileşen. Oturum başına entity başına
   tek sayım (sessionStorage) — yenileme/StrictMode tekrar saymaz. */
export default function RecordView({ type, id }: { type: "business" | "quote" | "page"; id: number }) {
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const key = `v:${type}:${id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage yoksa yine de kaydet
    }
    recordView(type, id);
  }, [type, id]);
  return null;
}
