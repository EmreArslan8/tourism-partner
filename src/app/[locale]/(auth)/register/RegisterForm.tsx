"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useTranslations } from "next-intl";
import {
  Building2,
  Briefcase,
  Search,
  ChevronRight,
  Eye,
  EyeOff,
  Hotel,
  Compass,
  Bus,
  Sparkles,
  Stethoscope,
  UtensilsCrossed,
  Car,
  Hammer,
  ShoppingBag,
  GraduationCap,
  Laptop,
  Factory,
  Landmark,
  Megaphone,
  type LucideIcon,
} from "lucide-react";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { signUp } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import VerifyEmail from "./VerifyEmail";

type Intent = "service" | "buyer";

const GROUP_ICON: Record<string, LucideIcon> = {
  konaklama: Hotel,
  acente: Briefcase,
  rehber: Compass,
  ulasim: Bus,
  aktivite: Sparkles,
  saglik: Stethoscope,
  gastronomi: UtensilsCrossed,
};

// Alıcı (buyer) için opsiyonel sektör seçenekleri — etiketler i18n'de (sector_<slug>).
const SECTORS = ["otomotiv", "insaat", "perakende", "saglik", "egitim", "teknoloji", "uretim", "finans", "medya", "diger"] as const;

const SECTOR_ICON: Record<(typeof SECTORS)[number], LucideIcon> = {
  otomotiv: Car,
  insaat: Hammer,
  perakende: ShoppingBag,
  saglik: Stethoscope,
  egitim: GraduationCap,
  teknoloji: Laptop,
  uretim: Factory,
  finans: Landmark,
  medya: Megaphone,
  diger: Sparkles,
};

const RegisterForm = () => {
  const [state, action, pending] = useActionState(signUp, { ok: false });
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [intent, setIntent] = useState<Intent | "">(""); // "" = henüz seçilmedi
  const [group, setGroup] = useState<string>(""); // "service" akışında seçilen grup
  const [services, setServices] = useState<string[]>([]); // seçilen alt kategori slug'ları (çoklu)
  const category = services[0] ?? ""; // birincil = ilk seçilen
  const toggleService = (slug: string) =>
    setServices((current) => (current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]));
  const [sector, setSector] = useState("");
  const [sectorNote, setSectorNote] = useState("");
  const [email, setEmail] = useState(""); // verify ekranında göstermek için
  const [emailErr, setEmailErr] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [editingAgain, setEditingAgain] = useState(false); // verify ekranından forma dönüş
  const t = useTranslations("register");
  const tc = useTranslations("cat");

  // Adım değişince odağı yeni adıma taşı (a11y) — ilk mount'ta değil.
  const stepRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) stepRef.current?.focus();
    else mounted.current = true;
  }, [step]);

  if (state.ok && !editingAgain) {
    return <VerifyEmail email={email} onBack={() => setEditingAgain(true)} />;
  }

  const accountType = intent === "buyer" ? "buyer" : "supplier";
  // Acente artık ayrı akış değil — tüm tedarikçi grupları (acente dahil) tek listede.
  const serviceGroups = CATEGORY_GROUPS;
  // Alt kategori: service akışında açılan kategori bloğunun içinde seçilir · buyer → YOK.
  const hasCategory = accountType === "buyer" || !!category;
  const sectorValue = sectorNote.trim() ? sectorNote.trim() : sector;
  const canSubmit = hasCategory && !emailErr && !pwErr;
  const stepTitle = step === 1 ? t("step1Title") : step === 2 ? t("step2CategoryTitle") : t("step3Title");
  const stepShort = (n: 1 | 2 | 3) => (n === 1 ? t("stepShort1") : n === 2 ? t("stepShort2") : t("stepShort3"));

  const intents: { key: Intent; Icon: LucideIcon; title: string; desc: string }[] = [
    { key: "service", Icon: Building2, title: t("intentService"), desc: t("intentServiceDesc") },
    { key: "buyer", Icon: Search, title: t("typeBuyer"), desc: t("typeBuyerDesc") },
  ];

  // Adım geçişini View Transitions API ile yap (native, 0 KB). Desteklenmezse anında değişir.
  // dir: "forward" → eski sola gider, yeni sağdan gelir · "back" → tersi.
  const swap = (fn: () => void, dir: "forward" | "back" = "forward") => {
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { finished: Promise<void> };
    };
    if (typeof doc.startViewTransition !== "function") {
      fn();
      return;
    }
    const root = document.documentElement;
    root.classList.add(dir === "back" ? "vt-back" : "vt-forward");
    const transition = doc.startViewTransition(() => flushSync(fn));
    transition.finished.finally(() => root.classList.remove("vt-forward", "vt-back"));
  };

  // Kimlik seçilince önceki kategori seçimlerini sıfırla + kısa vurgudan sonra 2. adıma geç.
  const choose = (key: Intent) => {
    setIntent(key);
    setGroup("");
    setServices([]);
    setSector("");
    setSectorNote("");
    window.setTimeout(() => swap(() => setStep(2), "forward"), 180);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* SABİT ÜST — adım göstergesi + başlık (scroll etmez) */}
      <div className="shrink-0 px-5 pt-6 sm:px-8 lg:px-12 lg:pt-10">
        <div className="mx-auto w-full max-w-[720px]">
          {/* Stepper */}
          <div className="mb-6">
            <div className="mx-auto mb-4 h-2 w-full max-w-[620px] overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-terra transition-[width] duration-300 ease-brand"
                style={{ width: step === 1 ? "16%" : step === 2 ? "50%" : "100%" }}
              />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {([1, 2, 3] as const).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  if (n === 1) swap(() => setStep(1), "back");
                  else if (n === 2 && intent) swap(() => setStep(2), step === 3 ? "back" : "forward");
                  else if (n === 3 && hasCategory) swap(() => setStep(3), "forward");
                }}
                disabled={(n === 2 && !intent) || (n === 3 && !hasCategory)}
                className={cn(
                  "min-w-0 rounded-[8px] px-2 py-1 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-55",
                  step >= n ? "text-terra" : "text-ink/55 hover:text-ink/70",
                )}
                aria-current={step === n ? "step" : undefined}
              >
                <span className="block truncate text-[14px] font-extrabold leading-tight">{stepShort(n)}</span>
                <span className={cn("mt-1 block truncate text-[12px] font-semibold", step >= n ? "text-ink/65" : "text-ink/50")}>{n === 1 ? t("step1Desc") : n === 2 ? t("step2Desc") : t("step3Desc")}</span>
              </button>
              ))}
            </div>
          </div>

          {/* Başlık — adımın asıl sorusu (dinamik) */}
          <h1 className="text-[26px] font-extrabold leading-tight tracking-tight !text-ink lg:text-[30px]">
            {stepTitle}
          </h1>
          <p className="mt-2 text-[14px] font-medium text-ink/75">
            {t("haveAccount")}{" "}
            <Link
              href={{ pathname: "/login" }}
              className="font-extrabold text-brand underline decoration-brand/25 underline-offset-4 transition-colors hover:text-terra hover:decoration-terra/40"
            >
              {t("loginLink")}
            </Link>
          </p>
        </div>
      </div>

      {/* KAYDIRILAN GÖVDE — sadece bu alan scroll eder; içerik başlığa yakın, üstten hizalı */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 sm:px-8 lg:px-12">
        <div ref={stepRef} tabIndex={-1} style={{ viewTransitionName: "auth-step" }} className="mx-auto w-full max-w-[720px] pb-8 pt-5 outline-none lg:pt-7">
          {/* Ekran okuyucu için adım duyurusu */}
          <p aria-live="polite" className="sr-only">
            {t("stepLabel")} {step} / 3 — {stepTitle}
          </p>
      {/* ADIM 1 — kimlik seçimi (seçince otomatik geçer) */}
      {step === 1 && (
        <div key="step1" className="grid gap-2.5 lg:gap-3">
          {intents.map(({ key, Icon, title, desc }) => {
              const on = intent === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => choose(key)}
                  aria-pressed={on}
                  className={cn(
                    "flex items-center gap-4 rounded-[14px] border-[1.5px] bg-paper px-4 py-4 text-left transition-all lg:gap-5 lg:rounded-[16px] lg:px-6 lg:py-7",
                    on
                      ? "border-terra bg-terra/5 shadow-[0_10px_26px_-18px_rgba(15,59,176,.55)]"
                      : "border-line hover:border-terra/50 hover:bg-terra/[.03]",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-12 w-12 shrink-0 place-items-center rounded-[12px] transition-colors lg:h-[58px] lg:w-[58px] lg:rounded-[15px]",
                      on ? "bg-terra text-white" : "bg-cream-deep text-terra",
                    )}
                  >
                    <Icon className="h-[22px] w-[22px] lg:h-7 lg:w-7" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-bold !text-ink lg:text-[17px]">{title}</span>
                    <span className="mt-0.5 block text-[12.5px] font-medium leading-snug !text-[#33415f] lg:mt-1 lg:text-[13.5px]">{desc}</span>
                  </span>
                  <ChevronRight size={20} className={cn("ml-auto shrink-0 lg:h-6 lg:w-6", on ? "text-terra" : "text-muted/60")} aria-hidden />
                </button>
              );
            })}
        </div>
      )}

      {/* ADIM 2 — kategori / sektör seçimi */}
      {step === 2 && (
        <div key="step2" className="flex flex-col gap-3.5">
          {/* alıcı akışı: opsiyonel sektör (analitik) */}
          {intent === "buyer" && (
            <fieldset>
              <legend className="mb-3 text-[13px] font-semibold text-ink">{t("sectorLabel")}</legend>
              <div role="group" aria-label={t("sectorLabel")} className="grid grid-cols-3 gap-3 max-[640px]:grid-cols-2 max-[420px]:grid-cols-1">
                {SECTORS.filter((s) => s !== "diger").map((s) => {
                  const on = sector === s && !sectorNote.trim();
                  const Icon = SECTOR_ICON[s];
                  return (
                    <button
                      key={s}
                      type="button"
                      role="checkbox"
                      aria-checked={on}
                      onClick={() => {
                        setSector(on ? "" : s);
                        setSectorNote("");
                      }}
                      className={cn(
                        "grid min-h-[82px] place-items-center rounded-[7px] border-2 bg-white px-3 py-3 text-center transition-[border-color,box-shadow,transform] hover:-translate-y-px",
                        on
                          ? "border-terra shadow-[0_16px_28px_-24px_rgba(15,59,176,.9)]"
                          : "border-line hover:border-terra/55",
                      )}
                    >
                      <span
                        className={cn(
                          "mb-2 grid h-7 w-7 place-items-center rounded-full border text-[12px] font-bold",
                          on ? "border-terra bg-terra text-white" : "border-terra/70 text-terra",
                        )}
                        aria-hidden
                      >
                        <Icon size={16} strokeWidth={2} />
                      </span>
                      <span className="block text-[13.5px] font-semibold leading-tight text-[#555]">{t(`sector_${s}`)}</span>
                    </button>
                  );
                })}
              </div>
              <label className="mt-3 flex flex-col gap-1.5 text-[13px] font-semibold text-ink">
                {t("sectorOther")}
                <textarea
                  value={sectorNote}
                  onChange={(event) => {
                    setSectorNote(event.target.value);
                    if (event.target.value.trim()) setSector("");
                  }}
                  rows={3}
                  className="field min-h-[82px] py-2.5"
                  placeholder={t("sectorOtherPlaceholder")}
                />
              </label>
            </fieldset>
          )}

          {/* service akışı: görsel kartlarla kategori seçimi */}
          {intent === "service" && (
            <fieldset>
              {!group ? (
                <>
                  <legend className="mb-3 text-[13px] font-semibold text-ink">{t("pickGroup")}</legend>
                  <div className="grid grid-cols-3 gap-3 max-[640px]:grid-cols-2 max-[420px]:grid-cols-1">
                    {serviceGroups.map((g) => {
                      const Icon = GROUP_ICON[g.key];
                      return (
                        <button
                          key={g.key}
                          type="button"
                          onClick={() => {
                            setGroup(g.key);
                            setServices([]);
                          }}
                          className="grid min-h-[118px] place-items-center rounded-[7px] border-2 border-line bg-white px-3 py-4 text-center transition-[border-color,box-shadow,transform] hover:-translate-y-px hover:border-terra/55"
                        >
                          {Icon && <Icon size={34} strokeWidth={1.9} className="mb-3 text-terra/90" aria-hidden />}
                          <span className="block text-[15px] font-semibold leading-tight text-[#555]">{tc(g.key)}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <legend className="sr-only">{t("pickSub")}</legend>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setGroup("");
                        setServices([]);
                      }}
                      className="inline-flex items-center gap-1 text-[13px] font-semibold !text-[#33415f] transition-colors hover:!text-terra"
                    >
                      ‹ {tc(group)}
                    </button>
                    <span className="text-[12.5px] font-semibold text-[#555]">{t("pickSub")}</span>
                  </div>
                  <div role="radiogroup" aria-label={t("pickSub")} className="grid grid-cols-3 gap-3 max-[640px]:grid-cols-2 max-[420px]:grid-cols-1">
                    {serviceGroups
                      .find((g) => g.key === group)
                      ?.children.map((c) => {
                        const on = services.includes(c.slug);
                        const Icon = GROUP_ICON[group];
                        return (
                          <button
                            key={c.slug}
                            type="button"
                            role="checkbox"
                            aria-checked={on}
                            onClick={() => toggleService(c.slug)}
                            className={cn(
                              "grid min-h-[96px] place-items-center rounded-[7px] border-2 bg-white px-3 py-3 text-center transition-[border-color,box-shadow,transform] hover:-translate-y-px",
                              on
                                ? "border-terra shadow-[0_16px_28px_-24px_rgba(15,59,176,.9)]"
                                : "border-line hover:border-terra/55",
                            )}
                          >
                            <span
                              className={cn(
                                "mb-2 grid h-7 w-7 place-items-center rounded-full border text-[12px] font-bold",
                                on ? "border-terra bg-terra text-white" : "border-terra/70 text-terra",
                              )}
                              aria-hidden
                            >
                              {Icon && <Icon size={15} strokeWidth={2} />}
                            </span>
                            <span className="block text-[13.5px] font-semibold leading-tight text-[#555]">{c.label}</span>
                          </button>
                        );
                      })}
                  </div>
                </>
              )}
            </fieldset>
          )}

          <div className="mt-2 grid grid-cols-[minmax(110px,.38fr)_minmax(0,1fr)] gap-2.5 max-[420px]:grid-cols-1">
            <Button type="button" variant="outline" onClick={() => swap(() => setStep(1), "back")}>
              {t("back")}
            </Button>
            <Button type="button" disabled={!hasCategory} onClick={() => swap(() => setStep(3), "forward")}>
              {t("continueBtn")}
            </Button>
          </div>
        </div>
      )}

      {/* ADIM 3 — hesap bilgileri */}
      {step === 3 && (
        <form
          id="regform"
          key="step3"
          className="flex flex-col gap-3.5"
          action={(formData) => {
            setEditingAgain(false);
            action(formData);
          }}
        >
          {/* Honeypot */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <input type="hidden" name="accountType" value={accountType} />
          <input type="hidden" name="category" value={category} />
          <input type="hidden" name="services" value={services.join(",")} />
          <input type="hidden" name="sector" value={sectorValue} />

          <Input name="name" label={intent === "buyer" ? t("nameBuyer") : t("name")} type="text" required placeholder={t("namePh")} />

          <Input
            name="email"
            label={t("email")}
            type="email"
            required
            placeholder={t("emailPh")}
            error={emailErr}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailErr) setEmailErr("");
            }}
            onBlur={(e) =>
              setEmailErr(e.target.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value) ? t("vEmail") : "")
            }
          />

          {/* Şifre — göster/gizle + inline doğrulama (Input görünümüyle eşlenik) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-ink">{t("password")}</label>
            <div className="relative">
              <input
                name="password"
                type={showPw ? "text" : "password"}
                required
                minLength={6}
                placeholder="••••••••"
                aria-invalid={!!pwErr}
                onChange={() => pwErr && setPwErr("")}
                onBlur={(e) => setPwErr(e.target.value && e.target.value.length < 6 ? t("vPassword") : "")}
                className={cn("field h-[46px] w-full pr-11", pwErr && "border-red-500 focus:border-red-500")}
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
            {pwErr && <p className="text-[12px] font-medium text-red-600">{pwErr}</p>}
          </div>

          {state.error && (
            <p className="text-[13px] font-medium text-red-600">
              {["rate", "exists", "email", "password"].includes(state.error) ? t(`error_${state.error}`) : t("error")}
            </p>
          )}

          <div className="mt-2 grid grid-cols-[minmax(110px,.38fr)_minmax(0,1fr)] gap-2.5 max-[420px]:grid-cols-1">
            <Button type="button" variant="outline" onClick={() => swap(() => setStep(2), "back")}>
              {t("back")}
            </Button>
            <Button type="submit" loading={pending} disabled={!canSubmit}>
              {t("submit")}
            </Button>
          </div>
        </form>
      )}
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
