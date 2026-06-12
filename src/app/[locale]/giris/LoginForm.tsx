"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { signIn } from "@/lib/actions/auth";

const fieldCls = "field h-[46px] font-normal";
const labelCls = "flex flex-col gap-1.5 text-[13px] font-semibold";

/* Giriş formu — Supabase auth signInWithPassword (server action). */
export default function LoginForm() {
  const [state, action, pending] = useActionState(signIn, { ok: false });
  const t = useTranslations("login");

  return (
    <form className="flex flex-col gap-3.5" action={action}>
      <label className={labelCls}>
        {t("email")}
        <input name="email" type="text" required autoComplete="username" placeholder={t("emailPh")} className={fieldCls} />
      </label>
      <label className={labelCls}>
        {t("password")}
        <input name="password" type="password" required autoComplete="current-password" placeholder="••••••••" className={fieldCls} />
      </label>
      {state.error && (
        <p className="text-[13px] font-medium text-red-600">{t("error")}</p>
      )}
      <button type="submit" className="btn btn-solid btn-block mt-1.5 disabled:opacity-60" disabled={pending}>
        {pending ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
