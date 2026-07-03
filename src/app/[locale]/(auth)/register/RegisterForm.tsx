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
  Check,
  Hotel,
  Compass,
  Bus,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { signUp } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import VerifyEmail from "./VerifyEmail";

type Intent = "service" | "agency" | "buyer";

const GROUP_ICON: Record<string, LucideIcon> = {
  konaklama: Hotel,
  rehber: Compass,
  ulasim: Bus,
  aktivite: Sparkles,
  saglik: Stethoscope,
};

// Alıcı (buyer) için opsiyonel sektör seçenekleri — etiketler i18n'de (sector_<slug>).
const SECTORS = ["otomotiv", "insaat", "perakende", "saglik", "egitim", "teknoloji", "uretim", "finans", "medya", "diger"] as const;

const RegisterForm = () => {
  const [state, action, pending] = useActionState(signUp, { ok: false });
  const [step, setStep] = useState<1 | 2>(1);
  const [intent, setIntent] = useState<Intent | "">(""); // "" = henüz seçilmedi
  const [group, setGroup] = useState<string>(""); // "service" akışında seçilen grup
  const [category, setCategory] = useState<string>(""); // seçilen alt kategori slug'ı
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

  // Yeni bir kayıt sonucu geldiğinde "forma dön" bayrağını sıfırla (reload'suz).
  useEffect(() => {
    setEditingAgain(false);
  }, [state]);

  if (state.ok && !editingAgain) {
    return <VerifyEmail email={email} onBack={() => setEditingAgain(true)} />;
  }

  const accountType = intent === "buyer" ? "buyer" : "supplier";
  const acente = CATEGORY_GROUPS.find((g) => g.key === "acente")!;
  const serviceGroups = CATEGORY_GROUPS.filter((g) => g.key !== "acente");
  // Alt kategori: acente → acente çocukları · service → seçilen grubun çocukları · buyer → YOK.
  const activeGroup =
    intent === "agency" ? acente : intent === "service" ? serviceGroups.find((g) => g.key === group) : undefined;
  const hasCategory = accountType === "buyer" || !!category;
  const canSubmit = hasCategory && !emailErr && !pwErr;

  const intents: { key: Intent; Icon: LucideIcon; title: string; desc: string }[] = [
    { key: "service", Icon: Building2, title: t("intentService"), desc: t("intentServiceDesc") },
    { key: "agency", Icon: Briefcase, title: t("intentAgency"), desc: t("intentAgencyDesc") },
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
    setCategory("");
    window.setTimeout(() => swap(() => setStep(2), "forward"), 180);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* SABİT ÜST — adım göstergesi + başlık (scroll etmez) */}
      <div className="shrink-0 px-5 pt-6 sm:px-8 lg:px-12 lg:pt-10">
        <div className="mx-auto w-full max-w-[720px]">
          {/* Numaralı stepper */}
          <div className="mb-6 flex items-center gap-2.5">
            {([1, 2] as const).map((n) => (
              <div key={n} className="flex items-center gap-2.5">
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "grid h-[22px] w-[22px] place-items-center rounded-full text-[11.5px] font-bold transition-colors",
                      step >= n ? "bg-terra text-white" : "bg-cream-deep text-muted",
                    )}
                  >
                    {n}
                  </span>
                  <span className={cn("text-[12.5px] font-semibold transition-colors", step === n ? "text-ink" : "text-muted")}>
                    {n === 1 ? t("stepShort1") : t("stepShort2")}
                  </span>
                </span>
                {n === 1 && <span className="h-px w-7 bg-line" aria-hidden />}
              </div>
            ))}
          </div>

          {/* Başlık — adımın asıl sorusu (dinamik) */}
          <h1 className="text-[26px] font-extrabold leading-tight tracking-tight text-ink lg:text-[30px]">
            {step === 1 ? t("step1Title") : t("step2Title")}
          </h1>
          <p className="mt-2 text-[14px] text-muted">
            {t("haveAccount")}{" "}
            <Link href={{ pathname: "/login" }} className="font-semibold text-terra transition-colors hover:text-terra-deep">
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
            {t("stepLabel")} {step} / 2 — {step === 1 ? t("step1Title") : t("step2Title")}
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
                    <span className="block text-[15px] font-bold text-ink lg:text-[17px]">{title}</span>
                    <span className="mt-0.5 block text-[12.5px] leading-snug text-muted lg:mt-1 lg:text-[13.5px]">{desc}</span>
                  </span>
                  <ChevronRight size={20} className={cn("ml-auto shrink-0 lg:h-6 lg:w-6", on ? "text-terra" : "text-muted/60")} aria-hidden />
                </button>
              );
            })}
        </div>
      )}

      {/* ADIM 2 — kategori (gerekliyse) + hesap bilgileri */}
      {step === 2 && (
        <form id="regform" key="step2" className="flex flex-col gap-3.5" action={action}>
          {/* Honeypot */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <input type="hidden" name="accountType" value={accountType} />
          <input type="hidden" name="category" value={category} />

          <button
            type="button"
            onClick={() => swap(() => setStep(1), "back")}
            className="mb-1 inline-flex w-fit items-center gap-1 text-[13px] font-semibold text-muted transition-colors hover:text-terra-deep"
          >
            ‹ {t("back")}
          </button>

          {/* alıcı akışı: opsiyonel sektör (analitik) */}
          {intent === "buyer" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-ink">{t("sectorLabel")}</label>
              <select name="sector" defaultValue="" className="field h-[46px] w-full">
                <option value="">{t("sectorPlaceholder")}</option>
                {SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {t(`sector_${s}`)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* service akışı: önce grup seç */}
          {intent === "service" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-ink">{t("pickGroup")}</label>
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                {serviceGroups.map((g) => {
                  const Icon = GROUP_ICON[g.key];
                  const on = group === g.key;
                  return (
                    <button
                      key={g.key}
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        setGroup(g.key);
                        setCategory("");
                      }}
                      className={cn(
                        "inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-[11px] border px-3 py-2 text-[13.5px] font-semibold transition-all duration-150 active:scale-[.97]",
                        on
                          ? "border-terra bg-terra text-white shadow-[0_8px_20px_-12px_rgba(15,59,176,.65)]"
                          : "border-line bg-cream-deep text-ink hover:border-terra/50 hover:bg-terra/[.05]",
                      )}
                    >
                      {Icon && <Icon size={16} className={on ? "text-white" : "text-terra"} aria-hidden />}
                      {tc(g.key)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* alt kategori (acente akışı doğrudan, service akışı grup seçilince) */}
          {activeGroup && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-ink">{t("pickSub")}</label>
              <div role="radiogroup" aria-label={t("pickSub")} className="flex flex-wrap gap-2">
                {activeGroup.children.map((c) => {
                  const on = category === c.slug;
                  return (
                    <button
                      key={c.slug}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setCategory(c.slug)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-[11px] border px-3.5 py-2 text-[13.5px] font-semibold transition-all duration-150 active:scale-[.97]",
                        on
                          ? "border-terra bg-terra text-white shadow-[0_8px_20px_-12px_rgba(15,59,176,.65)]"
                          : "border-line bg-cream-deep text-ink hover:border-terra/50 hover:bg-terra/[.05]",
                      )}
                    >
                      {on && <Check size={15} className="-ml-0.5" aria-hidden />}
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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

          <Button type="submit" block className="mt-2" loading={pending} disabled={!canSubmit}>
            {t("submit")}
          </Button>
        </form>
      )}
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
