"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { requestPasswordReset } from "@/lib/actions/auth";
import { Link } from "@/i18n/navigation";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

/* Şifre sıfırlama isteği — e-postaya recovery linki gönderir (server action). */
const ForgotPasswordForm = () => {
  const [state, action, pending] = useActionState(requestPasswordReset, { ok: false });
  const t = useTranslations("resetPw");

  return (
    <div className="flex h-full items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
      <div className="w-full max-w-[560px]">
        <span className="mb-3 block text-[12px] font-extrabold uppercase tracking-[.14em] text-brand/70">{t("requestEyebrow")}</span>
        <h1 className="text-[32px] font-extrabold leading-tight tracking-tight text-ink sm:text-[36px] lg:text-[40px]">{t("requestTitle")}</h1>
        <p className="mb-8 mt-3 text-[16px] font-medium leading-relaxed text-ink/75">{t("requestSub")}</p>

        {state.ok ? (
          <p className="rounded-[12px] border border-line bg-cream/40 px-4 py-3.5 text-[14.5px] font-semibold text-ink">
            ✓ {t("sent")}
          </p>
        ) : (
          <form className="flex flex-col gap-[18px]" action={action}>
            <Input
              name="email"
              label={t("email")}
              type="email"
              required
              autoComplete="username"
              placeholder={t("emailPh")}
              className="h-[56px] text-[16px] font-semibold text-ink placeholder:text-ink/45"
            />

            {state.error && (
              <p className="text-[13px] font-medium text-red-600">
                {state.error === "rate" ? t("rate") : t("error")}
              </p>
            )}

            <Button type="submit" block size="lg" className="mt-3 h-[58px] text-[16px]" loading={pending}>
              {t("submit")}
            </Button>
          </form>
        )}

        <p className="mt-6 text-[14.5px] font-medium text-ink/75">
          <Link
            href={{ pathname: "/login" }}
            className="font-extrabold text-brand underline decoration-brand/25 underline-offset-4 transition-colors hover:text-terra hover:decoration-terra/40"
          >
            {t("backToLogin")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
