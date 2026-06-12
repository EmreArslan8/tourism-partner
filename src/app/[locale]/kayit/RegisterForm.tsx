"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { signUp } from "@/lib/actions/auth";

const fieldCls = "field h-[46px] font-normal";
const labelCls = "flex flex-col gap-1.5 text-[13px] font-semibold";

/* Firma hesabı oluşturma formu — signUp ile auth hesabı + businesses kaydı.
   Oturum açılırsa server action panele yönlendirir; e-posta onayı gerekirse mesaj. */
export default function RegisterForm() {
  const [state, action, pending] = useActionState(signUp, { ok: false });
  const t = useTranslations("register");
  const tc = useTranslations("cat");

  if (state.ok) {
    return (
      <div className="rounded-[14px] border border-line bg-cream px-5 py-6 text-center">
        <p className="text-[15px] font-semibold text-ink">{t("checkEmail")}</p>
        <p className="mt-1.5 text-[13.5px] text-muted">{t("checkEmailSub")}</p>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-3.5" action={action}>
      {/* Honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <label className={labelCls}>
        {t("name")}
        <input name="name" type="text" required placeholder={t("namePh")} className={fieldCls} />
      </label>
      <label className={labelCls}>
        {t("category")}
        <select name="category" required defaultValue="" className={fieldCls}>
          <option value="" disabled>{t("select")}</option>
          {CATEGORY_GROUPS.flatMap((g) =>
            g.children.map((c) => (
              <option key={c.slug} value={c.slug}>{tc(g.key)} › {c.label}</option>
            ))
          )}
        </select>
      </label>
      <label className={labelCls}>
        {t("email")}
        <input name="email" type="email" required placeholder={t("emailPh")} className={fieldCls} />
      </label>
      <label className={labelCls}>
        {t("password")}
        <input name="password" type="password" required minLength={6} placeholder="••••••••" className={fieldCls} />
      </label>
      {state.error && (
        <p className="text-[13px] font-medium text-red-600">
          {["rate", "exists", "email", "password"].includes(state.error)
            ? t(`error_${state.error}`)
            : t("error")}
        </p>
      )}
      <button type="submit" className="btn btn-solid btn-block mt-1.5 disabled:opacity-60" disabled={pending}>
        {pending ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
