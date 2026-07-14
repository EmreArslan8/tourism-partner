"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import { updatePassword } from "@/lib/actions/auth";
import { Link } from "@/i18n/navigation";
import Button from "@/components/common/Button";

/* Yeni şifre belirleme — recovery linkiyle gelen oturum üzerinde updateUser çağırır. */
const ResetPasswordForm = () => {
  const [state, action, pending] = useActionState(updatePassword, { ok: false });
  const [showPw, setShowPw] = useState(false);
  const t = useTranslations("resetPw");

  const errorText =
    state.error === "mismatch"
      ? t("mismatch")
      : state.error === "short"
        ? t("tooShort")
        : state.error === "session"
          ? t("sessionMissing")
          : state.error
            ? t("error")
            : null;

  return (
    <div className="flex h-full items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
      <div className="w-full max-w-[560px]">
        <span className="mb-3 block text-[12px] font-extrabold uppercase tracking-[.14em] text-brand/70">{t("newEyebrow")}</span>
        <h1 className="text-[32px] font-extrabold leading-tight tracking-tight text-ink sm:text-[36px] lg:text-[40px]">{t("newTitle")}</h1>
        <p className="mb-8 mt-3 text-[16px] font-medium leading-relaxed text-ink/75">{t("newSub")}</p>

        {state.ok ? (
          <div>
            <p className="rounded-[12px] border border-line bg-cream/40 px-4 py-3.5 text-[14.5px] font-semibold text-ink">
              ✓ {t("updated")}
            </p>
            <p className="mt-6 text-[14.5px] font-medium text-ink/75">
              <Link
                href={{ pathname: "/login" }}
                className="font-extrabold text-brand underline decoration-brand/25 underline-offset-4 transition-colors hover:text-terra hover:decoration-terra/40"
              >
                {t("backToLogin")}
              </Link>
            </p>
          </div>
        ) : (
          <form className="flex flex-col gap-[18px]" action={action}>
            <div className="flex flex-col gap-2">
              <label className="text-[14.5px] font-bold text-ink">{t("password")}</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="field h-[56px] w-full pr-12 text-[16px] font-semibold text-ink placeholder:text-ink/45"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "hide" : "show"}
                  className="absolute right-4 top-1/2 grid -translate-y-1/2 place-items-center text-ink/50 transition-colors hover:text-brand"
                >
                  {showPw ? <EyeOff size={20} strokeWidth={2.25} aria-hidden /> : <Eye size={20} strokeWidth={2.25} aria-hidden />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14.5px] font-bold text-ink">{t("password2")}</label>
              <input
                name="password2"
                type={showPw ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="••••••••"
                className="field h-[56px] w-full text-[16px] font-semibold text-ink placeholder:text-ink/45"
              />
            </div>

            {errorText && <p className="text-[13px] font-medium text-red-600">{errorText}</p>}

            <Button type="submit" block size="lg" className="mt-3 h-[58px] text-[16px]" loading={pending}>
              {t("submitNew")}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordForm;
