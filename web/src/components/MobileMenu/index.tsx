"use client";

import { useState } from "react";
import Link from "next/link";
import { s } from "./styles";

const LINKS = [
  { href: "/", label: "Anasayfa" },
  { href: "/listeleme", label: "Keşfet" },
  { href: "/#nasil", label: "Nasıl Çalışır" },
  { href: "/teklif", label: "Teklif Al" },
  { href: "/#sss", label: "SSS" },
];

/* Mobil menü — sadece <900px'te görünür hamburger + açılır panel. */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={s.button}
        aria-label="Menü"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex flex-col gap-[5px]">
          <span className={`${s.bar} ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`${s.bar} ${open ? "opacity-0" : ""}`} />
          <span className={`${s.bar} ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </span>
      </button>

      {open && (
        <div className={s.panel}>
          <nav className={s.list}>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={s.link} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className={s.actions}>
            <Link href="/giris" className="btn btn-outline" onClick={() => setOpen(false)}>Giriş Yap</Link>
            <Link href="/kayit" className="btn btn-solid" onClick={() => setOpen(false)}>+ Firma Ekle</Link>
          </div>
        </div>
      )}
    </>
  );
}
