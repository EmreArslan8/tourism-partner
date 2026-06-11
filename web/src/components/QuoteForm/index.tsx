"use client";

import { useState } from "react";
import type { Business } from "@/lib/types";
import { GROUP_COLORS, groupLabel } from "@/lib/categories";
import { initials } from "@/lib/utils";
import { s } from "./styles";

/* Teklif (RFQ) formu — Faz 1 yer tutucu. Gönderim Faz 2-3'te backend'e bağlanacak. */
export default function QuoteForm({ business }: { business: Business | null }) {
  const [sent, setSent] = useState(false);

  return (
    <div className={s.card}>
      <p className="eyebrow">Teklif Al</p>
      <h1 className="mb-2 text-[28px]">
        {business ? "Bu tedarikçiye talep gönderin" : "Teklif talebi oluşturun"}
      </h1>
      <p className={s.note}>
        Talebinizi iletin; uygun tedarikçi(ler) doğrudan sizinle iletişime geçsin.
      </p>

      {business && (
        <div className={`${s.supplier} mt-5`}>
          <span className={s.supplierMono} style={{ background: GROUP_COLORS[business.group] }}>
            {initials(business.name)}
          </span>
          <div>
            <p className={s.supplierName}>{business.name}</p>
            <p className={s.supplierMeta}>{groupLabel(business.group)} · {business.type} — {business.city}</p>
          </div>
        </div>
      )}

      <form
        className={s.form}
        onSubmit={(e) => { e.preventDefault(); setSent(true); }}
      >
        <div className={s.row}>
          <label className={s.label}>Ad Soyad<input className={s.field} placeholder="Adınız" /></label>
          <label className={s.label}>Acente / Firma<input className={s.field} placeholder="Şirket adı" /></label>
        </div>
        <label className={s.label}>E-posta<input type="email" className={s.field} placeholder="ornek@acente.com" /></label>
        <label className={s.label}>
          Hizmet
          <select className={s.field} defaultValue="">
            <option value="" disabled>Seçin…</option>
            {business
              ? [business.type, "Grup konaklama", "Transfer", "Tur paketi"].map((o) => <option key={o}>{o}</option>)
              : ["Konaklama", "Acente", "Rehber", "Eğlence", "Sağlık turizmi"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </label>
        <div className={s.row}>
          <label className={s.label}>Tarih aralığı<input className={s.field} placeholder="örn. 10–15 Temmuz" /></label>
          <label className={s.label}>Kişi sayısı<input type="number" min={1} className={s.field} placeholder="0" /></label>
        </div>
        <label className={s.label}>Mesaj<textarea className={s.textarea} placeholder="Talebinizin detayları…" /></label>
        <button type="submit" className="btn btn-solid btn-block" disabled={sent}>
          {sent ? "Talebiniz alındı (demo)" : "Talebi Gönder"}
        </button>
      </form>
    </div>
  );
}
