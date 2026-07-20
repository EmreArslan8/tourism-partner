"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
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

  const locale = getLocaleFromPath(window.location.pathname);
  const copy = COPY[locale] ?? COPY.en;

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
          className="relative grid h-[min(680px,calc(100vh-2rem))] overflow-hidden rounded-[18px] bg-paper text-ink shadow-[0_34px_120px_-34px_rgba(1,8,47,.92)] ring-1 ring-white/24 md:grid-cols-[1.02fr_.98fr] md:grid-rows-[minmax(0,1fr)_auto]"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label={copy.close}
            className="absolute end-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-ink/10 bg-paper/88 text-ink shadow-[0_16px_30px_-24px_rgba(1,8,47,.7)] backdrop-blur-xl transition-colors hover:bg-cream md:end-5 md:top-5"
          >
            <X size={24} strokeWidth={2.1} aria-hidden />
          </button>

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
                  One Platform.
                  <br />
                  Endless <span className="text-[#2f89ff]">Opportunities.</span>
                </p>
                <p className="mt-6 max-w-[330px] text-[16px] font-medium leading-7 text-white/92">
                  {copy.leftBody}
                </p>
              </div>
            </div>
          </section>

          <section className="flex min-h-0 flex-col overflow-hidden px-5 pb-5 pt-12 sm:px-8 md:px-10 md:pb-5 md:pt-8">
            <Logo href={null} height={38} className="mb-5 w-fit md:hidden" priority />
            <h2 id="membership-popup-title" className="max-w-[380px] text-[26px] font-black leading-[1.08] tracking-[0] text-ink sm:text-[32px]">
              {copy.title}
            </h2>
            <div aria-hidden className="mt-4 h-1 w-14 rounded-full bg-[#2586f5]" />
            <p className="mt-5 max-w-[430px] text-[14.5px] font-medium leading-6 text-ink/78">
              {copy.body}
            </p>

            <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
              {copy.features.map((feature, index) => {
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

            <div className="shrink-0 bg-paper pt-5">
              <a
                href={`/${locale}/register`}
                className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-[8px] bg-[#1877f2] px-5 text-[16px] font-extrabold text-white shadow-[0_18px_40px_-22px_rgba(24,119,242,.9)] transition-colors hover:bg-[#0f67db]"
                onClick={close}
              >
                <UserRound size={21} strokeWidth={2.1} aria-hidden />
                {copy.cta}
              </a>

              <p className="mt-3.5 text-center text-[13px] font-medium text-muted">
                {copy.signInPrefix}{" "}
                <a href={`/${locale}/login`} className="font-extrabold text-sapphire hover:text-sapphire-deep">
                  {copy.signIn}
                </a>
              </p>
            </div>
          </section>

          <div className="grid gap-3 border-t border-line bg-[#eef6ff] px-5 py-3 sm:grid-cols-2 lg:grid-cols-4 md:col-span-2 md:px-8">
            {copy.benefits.map((benefit, index) => {
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

const COPY = {
  tr: {
    close: "Kapat",
    title: "Turizm İşinizi Globalde Büyütün",
    body: "Turizm profesyonellerini tek pazarda buluşturan ağa katılın. Firma profilinizi oluşturun, hizmetlerinizi sergileyin ve dünya çapında iş ortaklarıyla bağlantı kurun.",
    cta: "Tourism Partner'a Ücretsiz Katıl",
    leftBody: "Turizm sektörünün tüm parçalarını birbirine bağlayan global B2B pazaryeri.",
    signInPrefix: "Zaten hesabınız var mı?",
    signIn: "Giriş Yap",
    features: [
      { title: "Ücretsiz Kayıt", body: "Hesabınızı dakikalar içinde oluşturun." },
      { title: "Global İş Ağı", body: "Doğrulanmış turizm profesyonelleriyle bağlantı kurun." },
      { title: "Firma Vitrini", body: "İşletmenizi ve hizmetlerinizi öne çıkarın." },
      { title: "Akıllı Arama ve Filtreler", body: "Doğru iş ortaklarını hızlıca bulun." },
      { title: "Doğrudan İş Bağlantıları", body: "İlişki kurun, birlikte büyüyün." },
    ],
    benefits: [
      { title: "Komisyon Yok", body: "Komisyonsuz çalışın" },
      { title: "Global Pazaryeri", body: "Uluslararası pazarlara ulaşın" },
      { title: "Doğrulanmış Profesyoneller", body: "Sadece turizm profesyonelleri" },
      { title: "Güvenli ve Sağlam", body: "Verileriniz güvende" },
    ],
  },
  en: {
    close: "Close",
    title: "Grow Your Tourism Business Globally",
    body: "Join thousands of tourism professionals in one growing marketplace. Create your company profile, showcase your services and connect with business partners worldwide.",
    cta: "Join Tourism Partner Free",
    leftBody: "The global B2B marketplace that connects every part of the tourism industry.",
    signInPrefix: "Already have an account?",
    signIn: "Sign In",
    features: [
      { title: "Free Registration", body: "Create your account in minutes." },
      { title: "Global Business Network", body: "Connect with verified tourism professionals." },
      { title: "Company Showcase", body: "Highlight your business and services." },
      { title: "Smart Search & Filters", body: "Find the right partners quickly." },
      { title: "Direct Business Connections", body: "Build relationships, grow together." },
    ],
    benefits: [
      { title: "No Commission", body: "Work commission-free" },
      { title: "Global Marketplace", body: "Reach international markets" },
      { title: "Verified Professionals", body: "Tourism professionals only" },
      { title: "Secure & Reliable", body: "Your data is safe with us" },
    ],
  },
  ar: {
    close: "إغلاق",
    title: "نمّ عملك السياحي عالمياً",
    body: "انضم إلى سوق واحد يجمع محترفي السياحة. أنشئ ملف شركتك، اعرض خدماتك وتواصل مع شركاء أعمال حول العالم.",
    cta: "انضم إلى Tourism Partner مجاناً",
    leftBody: "سوق B2B عالمي يربط جميع أجزاء قطاع السياحة.",
    signInPrefix: "لديك حساب بالفعل؟",
    signIn: "تسجيل الدخول",
    features: [
      { title: "تسجيل مجاني", body: "أنشئ حسابك خلال دقائق." },
      { title: "شبكة أعمال عالمية", body: "تواصل مع محترفي سياحة موثوقين." },
      { title: "واجهة للشركة", body: "ابرز شركتك وخدماتك." },
      { title: "بحث وفلاتر ذكية", body: "اعثر على الشركاء المناسبين بسرعة." },
      { title: "اتصالات أعمال مباشرة", body: "ابن علاقات وانمُ معاً." },
    ],
    benefits: [
      { title: "بدون عمولة", body: "اعمل بدون عمولات" },
      { title: "سوق عالمي", body: "صل إلى أسواق دولية" },
      { title: "محترفون موثقون", body: "لمحترفي السياحة فقط" },
      { title: "آمن وموثوق", body: "بياناتك آمنة لدينا" },
    ],
  },
  ru: {
    close: "Закрыть",
    title: "Развивайте туристический бизнес глобально",
    body: "Присоединяйтесь к единой площадке для профессионалов туризма. Создайте профиль компании, покажите услуги и находите партнеров по всему миру.",
    cta: "Присоединиться бесплатно",
    leftBody: "Глобальная B2B-площадка, объединяющая все части туристической индустрии.",
    signInPrefix: "Уже есть аккаунт?",
    signIn: "Войти",
    features: [
      { title: "Бесплатная регистрация", body: "Создайте аккаунт за несколько минут." },
      { title: "Глобальная деловая сеть", body: "Свяжитесь с проверенными профессионалами туризма." },
      { title: "Витрина компании", body: "Представьте компанию и услуги." },
      { title: "Умный поиск и фильтры", body: "Быстро находите подходящих партнеров." },
      { title: "Прямые бизнес-связи", body: "Стройте отношения и растите вместе." },
    ],
    benefits: [
      { title: "Без комиссии", body: "Работайте без комиссий" },
      { title: "Глобальный рынок", body: "Выходите на международные рынки" },
      { title: "Проверенные специалисты", body: "Только профессионалы туризма" },
      { title: "Безопасно и надежно", body: "Ваши данные защищены" },
    ],
  },
} as const;

function emptySubscribe() {
  return () => {};
}

function shouldOpen() {
  if (typeof window === "undefined") return false;
  try {
    if (!window.matchMedia("(min-width: 768px)").matches) return false;
    return !window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return true;
  }
}

function getLocaleFromPath(pathname: string) {
  const first = pathname.split("/").filter(Boolean)[0];
  return first === "tr" || first === "en" || first === "ar" || first === "ru"
    ? first
    : "tr";
}

export default MembershipPromoPopup;
