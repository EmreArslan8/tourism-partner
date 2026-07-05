"use client";

import { useEffect, useRef } from "react";
import { recordB2bRequestView } from "@/lib/actions/b2b";

/* B2B ilan görüntülenme sayacı: tedarikçi açık ilanı gördüğünde oturum başına bir kez
   +1 kaydeder (sessionStorage dedup). Görünmez. */
export default function B2bViewTracker({ id }: { id: number }) {
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const key = `b2bv:${id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage yoksa yine de kaydet
    }
    recordB2bRequestView(id);
  }, [id]);
  return null;
}
