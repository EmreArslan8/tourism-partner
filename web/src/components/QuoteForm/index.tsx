"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Business } from "@/lib/types";
import { GROUP_COLORS } from "@/lib/categories";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { initials } from "@/lib/utils";
import { s } from "./styles";

/* Teklif (RFQ) formu — Faz 1 yer tutucu. Gönderim Faz 2-3'te backend'e bağlanacak. */
export default function QuoteForm({ business }: { business: Business | null }) {
  const [sent, setSent] = useState(false);
  const t = useTranslations("quote");
  const tc = useTranslations("cat");

  const serviceOptions = business
    ? [business.type, t("optAccommodation"), t("optTransfer"), t("optTour")]
    : CATEGORY_GROUPS.map((g) => tc(g.key));

  return (
    <div className={s.card}>
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1 className="mb-2 text-[28px]">{business ? t("titleSupplier") : t("titleGeneral")}</h1>
      <p className={s.note}>{t("note")}</p>

      {business && (
        <div className={`${s.supplier} mt-5`}>
          <span className={s.supplierMono} style={{ background: GROUP_COLORS[business.group] }}>
            {initials(business.name)}
          </span>
          <div>
            <p className={s.supplierName}>{business.name}</p>
            <p className={s.supplierMeta}>{tc(business.group)} · {business.type} — {business.city}</p>
          </div>
        </div>
      )}

      <form className={s.form} onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
        <div className={s.row}>
          <label className={s.label}>{t("name")}<input className={s.field} placeholder={t("namePh")} /></label>
          <label className={s.label}>{t("company")}<input className={s.field} placeholder={t("companyPh")} /></label>
        </div>
        <label className={s.label}>{t("email")}<input type="email" className={s.field} placeholder={t("emailPh")} /></label>
        <label className={s.label}>
          {t("service")}
          <select className={s.field} defaultValue="">
            <option value="" disabled>{t("select")}</option>
            {serviceOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
        </label>
        <div className={s.row}>
          <label className={s.label}>{t("dateRange")}<input className={s.field} placeholder={t("datePh")} /></label>
          <label className={s.label}>{t("people")}<input type="number" min={1} className={s.field} placeholder="0" /></label>
        </div>
        <label className={s.label}>{t("message")}<textarea className={s.textarea} placeholder={t("messagePh")} /></label>
        <button type="submit" className="btn btn-solid btn-block" disabled={sent}>
          {sent ? t("sent") : t("submit")}
        </button>
      </form>
    </div>
  );
}
