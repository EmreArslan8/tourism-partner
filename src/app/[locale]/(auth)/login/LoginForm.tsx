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
    <div className="flex h-full items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
      <div className="w-full max-w-[440px]">
        <h1 className="text-[26px] font-extrabold leading-tight tracking-tight text-ink lg:text-[30px]">{t("title")}</h1>
        <p className="mb-7 mt-2 text-[14px] text-muted">
          {t("noAccount")}{" "}
          <Link href={{ pathname: "/register" }} className="font-semibold text-terra transition-colors hover:text-terra-deep">
            {t("signupLink")}
          </Link>
        </p>

        <form className="flex flex-col gap-3.5" action={action}>
          <Input
            name="email"
            label={t("email")}
            type="text"
            required
            autoComplete="username"
            placeholder={t("emailPh")}
          />

          {/* Şifre — göster/gizle */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-ink">{t("password")}</label>
            <div className="relative">
              <input
                name="password"
                type={showPw ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="field h-[46px] w-full pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? t("pwHide") : t("pwShow")}
                className="absolute right-3 top-1/2 grid -translate-y-1/2 place-items-center text-muted transition-colors hover:text-ink"
              >
                {showPw ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
              </button>
            </div>
          </div>

          {state.error && <p className="text-[13px] font-medium text-red-600">{t("error")}</p>}

          <Button type="submit" block className="mt-2" loading={pending}>
            {t("submit")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
