"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "@/lib/actions/auth";
import { Link } from "@/i18n/navigation";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import styles from "./styles";

/* Giriş formu — Supabase auth signInWithPassword (server action). AuthShell içinde ortalı. */
const LoginForm = () => {
  const [state, action, pending] = useActionState(signIn, { ok: false });
  const [showPw, setShowPw] = useState(false);
  const t = useTranslations("login");

  // 2FA adımı — şifre doğrulandıktan sonra kod istenir.
  const mfaStep = (state.error === "mfa" || state.error === "mfa_invalid") && state.factorId && state.challengeId;

  if (mfaStep) {
    return (
      <div className={styles.viewport}>
        <div className={styles.mfaPanel}>
          <span className={styles.eyebrow}>{t("eyebrow")}</span>
          <h1 className={styles.mfaTitle}>{t("mfaTitle")}</h1>
          <p className={styles.mfaIntro}>
            {t("mfaDescription")}
          </p>
          <form className={styles.form} action={action}>
            <input type="hidden" name="mfaFactorId" value={state.factorId} />
            <input type="hidden" name="mfaChallengeId" value={state.challengeId} />
            <input
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              autoFocus
              placeholder="000000"
              className={styles.mfaInput}
            />
            {state.error === "mfa_invalid" && <p className={styles.error}>{t("mfaInvalid")}</p>}
            <Button type="submit" block size="lg" className={styles.mfaSubmit} loading={pending}>
              {t("mfaSubmit")}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.viewport}>
      <div className={styles.panel}>
        <span className={styles.eyebrow}>{t("eyebrow")}</span>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.intro}>
          {t("noAccount")}{" "}
          <Link
            href={{ pathname: "/register" }}
            className={styles.textLink}
          >
            {t("signupLink")}
          </Link>
        </p>

        <form className={styles.form} action={action}>
          <Input
            name="email"
            label={t("email")}
            type="text"
            required
            autoComplete="username"
            placeholder={t("emailPh")}
            className={styles.input}
          />

          {/* Şifre — göster/gizle */}
          <div className={styles.passwordField}>
            <label className={styles.label}>{t("password")}</label>
            <div className={styles.passwordWrap}>
              <input
                name="password"
                type={showPw ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className={styles.passwordInput}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? t("pwHide") : t("pwShow")}
                className={styles.visibilityButton}
              >
                {showPw ? <EyeOff size={20} strokeWidth={2.25} aria-hidden /> : <Eye size={20} strokeWidth={2.25} aria-hidden />}
              </button>
            </div>
          </div>

          <p className={styles.forgotRow}>
            <Link
              href={{ pathname: "/forgot-password" }}
              className={styles.textLink}
            >
              {t("forgot")}
            </Link>
          </p>

          {state.error && <p className={styles.error}>{t("error")}</p>}

          <Button type="submit" block size="lg" className={styles.submit} loading={pending}>
            {t("submit")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
