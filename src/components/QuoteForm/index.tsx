"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import type { Business } from "@/lib/types";
import { GROUP_COLORS } from "@/lib/categories";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { initials } from "@/lib/utils";
import { submitQuote } from "@/lib/actions/quote";
import styles from "./styles";


/* Teklif (RFQ) formu — gönderim Supabase quotes tablosuna yazar (server action). */
const QuoteForm = ({ business }: { business: Business | null }) => {
  const [state, action, pending] = useActionState(submitQuote, { ok: false });
  const t = useTranslations("quote");
  const tc = useTranslations("cat");

  const serviceOptions = business
    ? [business.type, t("optAccommodation"), t("optTransfer"), t("optTour")]
    : CATEGORY_GROUPS.map((g) => tc(g.key));

  return (
    <div className={styles.card}>
      <h1 className="mb-2 text-[28px]">{business ? t("titleSupplier") : t("titleGeneral")}</h1>
      <p className={styles.note}>{t("note")}</p>

      {business && (
        <div className={`${styles.supplier} mt-5`}>
          <span className={styles.supplierMono} style={{ background: GROUP_COLORS[business.group] }}>
            {initials(business.name)}
          </span>
          <div>
            <p className={styles.supplierName}>{business.name}</p>
            <p className={styles.supplierMeta}>{tc(business.group)} · {business.type} — {business.city}</p>
          </div>
        </div>
      )}

      <form className={styles.form} action={action}>
        {/* Honeypot — botlar doldurur, gerçek kullanıcı görmez */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        {business && <input type="hidden" name="businessId" value={business.id} />}
        <div className={styles.row}>
          <label className={styles.label}>{t("name")}<input name="name" required className={styles.field} placeholder={t("namePh")} /></label>
          <label className={styles.label}>{t("company")}<input name="company" className={styles.field} placeholder={t("companyPh")} /></label>
        </div>
        <label className={styles.label}>{t("email")}<input name="email" type="email" required className={styles.field} placeholder={t("emailPh")} /></label>
        <label className={styles.label}>
          {t("service")}
          <select name="service" className={styles.field} defaultValue="">
            <option value="" disabled>{t("select")}</option>
            {serviceOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
        </label>
        <div className={styles.row}>
          <label className={styles.label}>{t("dateRange")}<input name="dateRange" className={styles.field} placeholder={t("datePh")} /></label>
          <label className={styles.label}>{t("people")}<input name="people" type="number" min={1} className={styles.field} placeholder="0" /></label>
        </div>
        <label className={styles.label}>{t("message")}<textarea name="message" className={styles.textarea} placeholder={t("messagePh")} /></label>
        {state.error && !state.ok && (
          <p className="text-[13px] font-medium text-red-600">{t("error")}</p>
        )}
        <button type="submit" className="btn btn-solid btn-block" disabled={pending || state.ok}>
          {state.ok ? t("sent") : pending ? t("sending") : t("submit")}
        </button>
      </form>
    </div>
  );
};

export default QuoteForm;
