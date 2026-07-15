"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "@/lib/actions/auth";
import { Link } from "@/i18n/navigation";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

/* Giriş formu — Supabase auth signInWithPassword (server action). AuthShell içinde ortalı. */
const LoginForm = () => {
  const [state, action, pending] = useActionState(signIn, { ok: false });
  const [showPw, setShowPw] = useState(false);
  const t = useTranslations("login");

  return (
    <div className="flex h-full items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
      <div className="w-full max-w-[560px]">
        <span className="mb-3 block text-[12px] font-extrabold uppercase tracking-[.14em] text-brand/70">{t("eyebrow")}</span>
        <h1 className="text-[32px] font-extrabold leading-tight tracking-tight text-ink sm:text-[36px] lg:text-[40px]">{t("title")}</h1>
        <p className="mb-8 mt-3 text-[16px] font-medium leading-relaxed text-ink/75">
          {t("noAccount")}{" "}
          <Link
            href={{ pathname: "/register" }}
            className="font-extrabold text-brand underline decoration-brand/25 underline-offset-4 transition-colors hover:text-terra hover:decoration-terra/40"
          >
            {t("signupLink")}
          </Link>
        </p>

        <form className="flex flex-col gap-[18px]" action={action}>
          <Input
            name="email"
            label={t("email")}
            type="text"
            required
            autoComplete="username"
            placeholder={t("emailPh")}
            className="h-[56px] text-[16px] font-semibold text-ink placeholder:text-ink/45"
          />

          {/* Şifre — göster/gizle */}
          <div className="flex flex-col gap-2">
            <label className="text-[14.5px] font-bold text-ink">{t("password")}</label>
            <div className="relative">
              <input
                name="password"
                type={showPw ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="field h-[56px] w-full pe-12 text-[16px] font-semibold text-ink placeholder:text-ink/45"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? t("pwHide") : t("pwShow")}
                className="absolute end-4 top-1/2 grid -translate-y-1/2 place-items-center text-ink/50 transition-colors hover:text-brand"
              >
                {showPw ? <EyeOff size={20} strokeWidth={2.25} aria-hidden /> : <Eye size={20} strokeWidth={2.25} aria-hidden />}
              </button>
            </div>
          </div>

          <p className="-mt-1 text-end text-[13.5px] font-semibold">
            <Link
              href={{ pathname: "/forgot-password" }}
              className="text-brand/80 underline decoration-brand/25 underline-offset-4 transition-colors hover:text-terra"
            >
              {t("forgot")}
            </Link>
          </p>

          {state.error && <p className="text-[13px] font-medium text-red-600">{t("error")}</p>}

          <Button type="submit" block size="lg" className="mt-3 h-[58px] text-[16px]" loading={pending}>
            {t("submit")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
