"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  BadgeCheck,
  Building2,
  Globe2,
  Handshake,
  LockKeyhole,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import Logo from "@/components/Logo";

const STORAGE_KEY = "membership-promo-popup:hidden";

const MembershipPromoPopup = () => {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const t = useTranslations("membershipPopup");
  const locale = useLocale();
  const [closed, setClosed] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const open = isClient && !closed && shouldOpen();

  const close = useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // storage yazılamazsa sessizce geç
    }
    setClosed(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  const features = t.raw("features") as ReadonlyArray<{ title: string; body: string }>;
  const benefits = t.raw("benefits") as ReadonlyArray<{ title: string; body: string }>;

  return (
    <div
      className="fixed inset-0 z-[130] grid place-items-center bg-ink/72 p-3 backdrop-blur-[10px] sm:p-4"
      onClick={close}
    >
      <div className="w-full max-w-[1040px]" onClick={(event) => event.stopPropagation()}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="membership-popup-title"
          className="relative grid max-h-[calc(100vh-1.5rem)] overflow-hidden rounded-[18px] bg-paper text-ink shadow-[0_34px_120px_-34px_rgba(1,8,47,.92)] ring-1 ring-white/24 md:max-h-[calc(100vh-2rem)] md:grid-cols-[1.02fr_.98fr] md:grid-rows-[minmax(0,1fr)_auto]"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label={t("close")}
            className="absolute end-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-white/15 text-white shadow-[0_16px_30px_-24px_rgba(1,8,47,.7)] backdrop-blur-xl transition-colors hover:bg-white/25 md:border-ink/10 md:bg-paper/88 md:text-ink md:hover:bg-cream md:end-5 md:top-5"
          >
            <X size={24} strokeWidth={2.1} aria-hidden />
          </button>

          <div aria-hidden className="absolute inset-0 z-0 md:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/popup-image.webp" alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,8,47,.62),rgba(1,8,47,.72)_45%,rgba(1,8,47,.86))]" />
          </div>

          <section className="relative hidden min-h-0 overflow-hidden bg-ink text-white md:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/popup-image.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(circle_at_70%_72%,rgba(0,125,255,.2),transparent_30%),linear-gradient(180deg,rgba(1,8,47,.4),rgba(1,8,47,.15)_36%,rgba(1,8,47,.72)_100%)]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,8,47,.84),rgba(1,8,47,.38)_58%,rgba(1,8,47,.12))]"
            />
            <div className="relative z-10 flex h-full flex-col p-8 lg:p-10">
              <Logo href={null} height={50} variant="light" className="w-fit drop-shadow-[0_4px_18px_rgba(0,0,0,.38)]" priority />
              <div className="mt-14 max-w-[430px] lg:mt-16">
                <p className="text-[34px] font-black leading-[1.07] tracking-[0] text-white lg:text-[40px]">
                  {t("leftTitleLine1")}
                  <br />
                  {t("leftTitleLine2")} <span className="text-[#2f89ff]">{t("leftTitleHighlight")}</span>
                </p>
                <p className="mt-6 max-w-[330px] text-[16px] font-medium leading-7 text-white/92">
                  {t("leftBody")}
                </p>
              </div>
            </div>
          </section>

          <section className="relative z-10 flex min-h-0 flex-col overflow-y-auto px-5 pb-6 pt-12 sm:px-8 md:px-10 md:pb-5 md:pt-8">
            <Logo href={null} height={38} variant="light" className="mb-5 w-fit md:hidden" priority />
            <h2 id="membership-popup-title" className="max-w-[380px] text-[26px] font-black leading-[1.08] tracking-[0] text-white sm:text-[32px] md:text-ink">
              {t("title")}
            </h2>
            <div aria-hidden className="mt-6 h-1 w-14 rounded-full bg-[#2586f5] md:mt-4" />
            <p className="mt-5 max-w-[430px] text-[14.5px] font-medium leading-6 text-white/85 md:mt-4 md:text-muted">
              {t("body")}
            </p>

            <div className="mt-4 hidden pr-1 md:block">
              {features.map((feature, index) => {
                const Icon = FEATURE_ICONS[index] ?? BadgeCheck;
                return (
                  <div key={feature.title} className="grid grid-cols-[34px_1fr] gap-3 border-b border-line/80 py-3 last:border-b-0">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-sapphire/8 text-[#2586f5]">
                      <Icon size={19} strokeWidth={2} aria-hidden />
                    </span>
                    <span className="grid gap-0.5">
                      <strong className="text-[14px] font-extrabold leading-tight text-ink">{feature.title}</strong>
                      <span className="text-[12.5px] font-medium leading-5 text-muted">{feature.body}</span>
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="shrink-0 pt-7 md:bg-paper md:pt-5">
              <a
                href={`/${locale}/register`}
                className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-[8px] bg-[#1877f2] px-5 text-[16px] font-extrabold text-white shadow-[0_18px_40px_-22px_rgba(24,119,242,.9)] transition-colors hover:bg-[#0f67db]"
                onClick={close}
              >
                <UserRound size={21} strokeWidth={2.1} aria-hidden />
                {t("cta")}
              </a>

              <p className="mt-3.5 text-center text-[13px] font-medium text-white/75 md:text-muted">
                {t("signInPrefix")}{" "}
                <a href={`/${locale}/login`} className="font-extrabold text-white underline underline-offset-2 hover:text-white md:text-sapphire md:no-underline md:hover:text-sapphire-deep">
                  {t("signIn")}
                </a>
              </p>
            </div>
          </section>

          <div className="hidden gap-3 border-t border-line bg-[#eef6ff] px-5 py-3 sm:grid-cols-2 lg:grid-cols-4 md:col-span-2 md:grid md:px-8">
            {benefits.map((benefit, index) => {
              const Icon = BENEFIT_ICONS[index] ?? ShieldCheck;
              return (
                <div key={benefit.title} className="grid grid-cols-[30px_1fr] gap-2.5">
                  <span className="text-[#2586f5]">
                    <Icon size={24} strokeWidth={1.9} aria-hidden />
                  </span>
                  <span className="grid gap-0.5">
                    <strong className="text-[12px] font-extrabold leading-tight text-ink">{benefit.title}</strong>
                    <span className="text-[11.5px] font-medium leading-4 text-muted">{benefit.body}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const FEATURE_ICONS = [UserRound, Globe2, Building2, Search, Handshake] as const;
const BENEFIT_ICONS = [ShieldCheck, Globe2, BadgeCheck, LockKeyhole] as const;

function emptySubscribe() {
  return () => {};
}

function shouldOpen() {
  if (typeof window === "undefined") return false;
  try {
    return !window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return true;
  }
}

export default MembershipPromoPopup;
