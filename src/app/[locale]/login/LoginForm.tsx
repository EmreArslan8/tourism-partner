"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { signIn } from "@/lib/actions/auth";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

/* Giriş formu — Supabase auth signInWithPassword (server action). */
const LoginForm = () => {
  const [state, action, pending] = useActionState(signIn, { ok: false });
  const t = useTranslations("login");

  return (
    <form className="flex flex-col gap-3.5" action={action}>
      <Input
        name="email"
        label={t("email")}
        type="text"
        required
        autoComplete="username"
        placeholder={t("emailPh")}
      />
      <Input
        name="password"
        label={t("password")}
        type="password"
        required
        autoComplete="current-password"
        placeholder="••••••••"
      />
      {state.error && (
        <p className="text-[13px] font-medium text-red-600">{t("error")}</p>
      )}
      <Button type="submit" block className="mt-1.5" loading={pending}>
        {t("submit")}
      </Button>
    </form>
  );
};

export default LoginForm;
