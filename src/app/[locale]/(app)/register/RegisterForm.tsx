"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { signUp } from "@/lib/actions/auth";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

const RegisterForm = () => {
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
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <Input
        name="name"
        label={t("name")}
        type="text"
        required
        placeholder={t("namePh")}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-ink">
          {t("category")}
        </label>
        <select
          name="category"
          required
          defaultValue=""
          className="field h-[46px] w-full"
        >
          <option value="" disabled>
            {t("select")}
          </option>
          {CATEGORY_GROUPS.flatMap((g) =>
            g.children.map((c) => (
              <option key={c.slug} value={c.slug}>
                {tc(g.key)} › {c.label}
              </option>
            )),
          )}
        </select>
      </div>

      <Input
        name="email"
        label={t("email")}
        type="email"
        required
        placeholder={t("emailPh")}
      />

      <Input
        name="password"
        label={t("password")}
        type="password"
        required
        minLength={6}
        placeholder="••••••••"
      />

      {state.error && (
        <p className="text-[13px] font-medium text-red-600">
          {["rate", "exists", "email", "password"].includes(state.error)
            ? t(`error_${state.error}`)
            : t("error")}
        </p>
      )}

      <Button type="submit" block className="mt-1.5" loading={pending}>
        {t("submit")}
      </Button>
    </form>
  );
};

export default RegisterForm;
