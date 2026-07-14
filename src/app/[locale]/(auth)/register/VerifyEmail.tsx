"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { MailCheck, Inbox, RotateCw, Mail } from "lucide-react";
import { resendSignupEmail } from "@/lib/actions/auth";
import Button from "@/components/common/Button";

/* E-posta sağlayıcısına göre "gelen kutunu aç" kısayolu. */
function inboxUrl(email: string): string | null {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  if (domain.includes("gmail") || domain.includes("googlemail")) return "https://mail.google.com";
  if (domain.includes("outlook") || domain.includes("hotmail") || domain.includes("live") || domain.includes("msn"))
    return "https://outlook.live.com/mail";
  if (domain.includes("yahoo")) return "https://mail.yahoo.com";
  if (domain.includes("yandex")) return "https://mail.yandex.com";
  if (domain.includes("icloud") || domain.includes("me.com")) return "https://www.icloud.com/mail";
  return null;
}

export default function VerifyEmail({ email, onBack }: { email: string; onBack: () => void }) {
  const t = useTranslations("register");
  const [cooldown, setCooldown] = useState(0);
  const [note, setNote] = useState<"" | "resent" | "fail">("");
  const [pending, start] = useTransition();
  const inbox = email ? inboxUrl(email) : null;

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const resend = () => {
    if (cooldown > 0 || pending) return;
    setNote("");
    start(async () => {
      const res = await resendSignupEmail(email);
      if (res.ok) {
        setNote("resent");
        setCooldown(45);
      } else {
        setNote("fail");
        if (res.error === "rate") setCooldown(60);
      }
    });
  };

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden px-6 py-10">
      {/* dekоratif gradyan lekeleri — derinlik */}
      <div aria-hidden className="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-terra/5 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 left-6 h-64 w-64 rounded-full bg-terra/[.06] blur-3xl" />

      <div className="relative w-full max-w-[440px] text-center">
        {/* Katmanlı gradyan ikon + ping halkası */}
        <div className="relative mx-auto mb-7 grid h-24 w-24 place-items-center">
          <span aria-hidden className="absolute inset-0 rounded-full bg-terra/[.06]" />
          <span aria-hidden className="absolute inset-[10px] rounded-full bg-terra/10" />
          <span aria-hidden className="absolute inset-[18px] rounded-full bg-terra/20 motion-safe:animate-ping" />
          <span className="relative grid h-16 w-16 place-items-center rounded-full bg-[linear-gradient(150deg,#0a2472_0%,#0f3bb0_100%)] text-white shadow-[0_14px_34px_-12px_rgba(15,59,176,.75)]">
            <MailCheck size={30} aria-hidden />
          </span>
        </div>

        <h2 className="text-[26px] font-extrabold leading-tight tracking-tight text-ink">{t("verifyTitle")}</h2>
        <p className="mt-2.5 text-[13.5px] text-muted">{t("verifyDesc")}</p>
        {email && (
          <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-line bg-cream-deep px-4 py-2 text-[14.5px] font-bold text-ink">
            <Mail size={15} className="text-terra" aria-hidden />
            <span className="break-all">{email}</span>
          </span>
        )}
        <p className="mx-auto mt-4 max-w-[360px] text-[12.5px] leading-relaxed text-muted">{t("verifySpam")}</p>

        <div className="mt-6 flex flex-col gap-2.5">
          {inbox && (
            <Button href={inbox} target="_blank" block icon={<Inbox size={17} aria-hidden />}>
              {t("openInbox")}
            </Button>
          )}
          <Button
            variant="outline"
            block
            onClick={resend}
            disabled={cooldown > 0}
            loading={pending}
            icon={<RotateCw size={16} aria-hidden />}
          >
            {cooldown > 0 ? t("resendIn", { s: cooldown }) : t("resend")}
          </Button>
        </div>

        <div aria-live="polite" className="mt-3 min-h-[18px] text-[12.5px] font-medium">
          {note === "resent" && <span className="text-emerald-600">{t("resent")}</span>}
          {note === "fail" && <span className="text-red-600">{t("resendFail")}</span>}
        </div>

        <button
          type="button"
          onClick={onBack}
          className="mt-3 text-[12.5px] font-semibold text-muted transition-colors hover:text-terra-deep"
        >
          {t("wrongEmail")}
        </button>
      </div>
    </div>
  );
}
