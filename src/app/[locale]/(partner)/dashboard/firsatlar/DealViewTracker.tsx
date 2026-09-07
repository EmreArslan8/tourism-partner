"use client";

import { useEffect, useRef } from "react";
import { recordB2bDealView } from "@/lib/actions/deals";

/* Fırsat ilanı görüntülenme sayacı — oturum başına bir kez +1 (sessionStorage dedup). */
export default function DealViewTracker({ id }: { id: number }) {
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const key = `b2bd:${id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage yoksa yine de kaydet
    }
    recordB2bDealView(id);
  }, [id]);
  return null;
}
