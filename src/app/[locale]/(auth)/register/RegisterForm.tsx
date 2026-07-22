"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
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
  MapPin,
  FileText,
  UserRound,
  ImagePlus,
  Loader2,
  Info,
  type LucideIcon,
} from "lucide-react";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { useRegions } from "@/lib/geo";
import { signUp } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import VerifyEmail from "./VerifyEmail";

type Intent = "service" | "buyer";
type StepNo = 1 | 2 | 3 | 4;

/* Kapak görselini tarayıcıda küçült (canvas → jpeg) — yükleme öncesi boyutu düşürür. */
async function compressImage(file: File, maxDim = 1600, quality = 0.82): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  let { width, height } = bitmap;
  if (Math.max(width, height) > maxDim) {
    const r = maxDim / Math.max(width, height);
    width = Math.round(width * r);
    height = Math.round(height * r);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();
  const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/jpeg", quality));
  return blob && blob.size < file.size ? blob : file;
}

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

const PHONE_CODES = [
  { value: "+1", label: "🇺🇸 ABD / Kanada" },
  { value: "+7", label: "🇷🇺 Rusya / Kazakistan" },
  { value: "+20", label: "🇪🇬 Mısır" },
  { value: "+27", label: "🇿🇦 Güney Afrika" },
  { value: "+30", label: "🇬🇷 Yunanistan" },
  { value: "+31", label: "🇳🇱 Hollanda" },
  { value: "+32", label: "🇧🇪 Belçika" },
  { value: "+33", label: "🇫🇷 Fransa" },
  { value: "+34", label: "🇪🇸 İspanya" },
  { value: "+36", label: "🇭🇺 Macaristan" },
  { value: "+39", label: "🇮🇹 İtalya" },
  { value: "+40", label: "🇷🇴 Romanya" },
  { value: "+41", label: "🇨🇭 İsviçre" },
  { value: "+43", label: "🇦🇹 Avusturya" },
  { value: "+44", label: "🇬🇧 Birleşik Krallık" },
  { value: "+45", label: "🇩🇰 Danimarka" },
  { value: "+46", label: "🇸🇪 İsveç" },
  { value: "+47", label: "🇳🇴 Norveç" },
  { value: "+48", label: "🇵🇱 Polonya" },
  { value: "+49", label: "🇩🇪 Almanya" },
  { value: "+51", label: "🇵🇪 Peru" },
  { value: "+52", label: "🇲🇽 Meksika" },
  { value: "+54", label: "🇦🇷 Arjantin" },
  { value: "+55", label: "🇧🇷 Brezilya" },
  { value: "+56", label: "🇨🇱 Şili" },
  { value: "+57", label: "🇨🇴 Kolombiya" },
  { value: "+58", label: "🇻🇪 Venezuela" },
  { value: "+60", label: "🇲🇾 Malezya" },
  { value: "+61", label: "🇦🇺 Avustralya" },
  { value: "+62", label: "🇮🇩 Endonezya" },
  { value: "+63", label: "🇵🇭 Filipinler" },
  { value: "+64", label: "🇳🇿 Yeni Zelanda" },
  { value: "+65", label: "🇸🇬 Singapur" },
  { value: "+66", label: "🇹🇭 Tayland" },
  { value: "+81", label: "🇯🇵 Japonya" },
  { value: "+82", label: "🇰🇷 Güney Kore" },
  { value: "+84", label: "🇻🇳 Vietnam" },
  { value: "+86", label: "🇨🇳 Çin" },
  { value: "+90", label: "🇹🇷 Türkiye" },
  { value: "+91", label: "🇮🇳 Hindistan" },
  { value: "+92", label: "🇵🇰 Pakistan" },
  { value: "+93", label: "🇦🇫 Afganistan" },
  { value: "+94", label: "🇱🇰 Sri Lanka" },
  { value: "+95", label: "🇲🇲 Myanmar" },
  { value: "+98", label: "🇮🇷 İran" },
  { value: "+212", label: "🇲🇦 Fas" },
  { value: "+213", label: "🇩🇿 Cezayir" },
  { value: "+216", label: "🇹🇳 Tunus" },
  { value: "+218", label: "🇱🇾 Libya" },
  { value: "+220", label: "🇬🇲 Gambiya" },
  { value: "+221", label: "🇸🇳 Senegal" },
  { value: "+225", label: "🇨🇮 Fildişi Sahili" },
  { value: "+233", label: "🇬🇭 Gana" },
  { value: "+234", label: "🇳🇬 Nijerya" },
  { value: "+251", label: "🇪🇹 Etiyopya" },
  { value: "+254", label: "🇰🇪 Kenya" },
  { value: "+255", label: "🇹🇿 Tanzanya" },
  { value: "+256", label: "🇺🇬 Uganda" },
  { value: "+351", label: "🇵🇹 Portekiz" },
  { value: "+352", label: "🇱🇺 Lüksemburg" },
  { value: "+353", label: "🇮🇪 İrlanda" },
  { value: "+354", label: "🇮🇸 İzlanda" },
  { value: "+356", label: "🇲🇹 Malta" },
  { value: "+357", label: "🇨🇾 Kıbrıs" },
  { value: "+358", label: "🇫🇮 Finlandiya" },
  { value: "+359", label: "🇧🇬 Bulgaristan" },
  { value: "+370", label: "🇱🇹 Litvanya" },
  { value: "+371", label: "🇱🇻 Letonya" },
  { value: "+372", label: "🇪🇪 Estonya" },
  { value: "+373", label: "🇲🇩 Moldova" },
  { value: "+374", label: "🇦🇲 Ermenistan" },
  { value: "+375", label: "🇧🇾 Belarus" },
  { value: "+380", label: "🇺🇦 Ukrayna" },
  { value: "+381", label: "🇷🇸 Sırbistan" },
  { value: "+382", label: "🇲🇪 Karadağ" },
  { value: "+383", label: "🇽🇰 Kosova" },
  { value: "+385", label: "🇭🇷 Hırvatistan" },
  { value: "+386", label: "🇸🇮 Slovenya" },
  { value: "+387", label: "🇧🇦 Bosna Hersek" },
  { value: "+389", label: "🇲🇰 Kuzey Makedonya" },
  { value: "+420", label: "🇨🇿 Çekya" },
  { value: "+421", label: "🇸🇰 Slovakya" },
  { value: "+423", label: "🇱🇮 Lihtenştayn" },
  { value: "+852", label: "🇭🇰 Hong Kong" },
  { value: "+853", label: "🇲🇴 Makao" },
  { value: "+855", label: "🇰🇭 Kamboçya" },
  { value: "+856", label: "🇱🇦 Laos" },
  { value: "+880", label: "🇧🇩 Bangladeş" },
  { value: "+886", label: "🇹🇼 Tayvan" },
  { value: "+960", label: "🇲🇻 Maldivler" },
  { value: "+961", label: "🇱🇧 Lübnan" },
  { value: "+962", label: "🇯🇴 Ürdün" },
  { value: "+963", label: "🇸🇾 Suriye" },
  { value: "+964", label: "🇮🇶 Irak" },
  { value: "+965", label: "🇰🇼 Kuveyt" },
  { value: "+966", label: "🇸🇦 Suudi Arabistan" },
  { value: "+967", label: "🇾🇪 Yemen" },
  { value: "+968", label: "🇴🇲 Umman" },
  { value: "+970", label: "🇵🇸 Filistin" },
  { value: "+971", label: "🇦🇪 Birleşik Arap Emirlikleri" },
  { value: "+972", label: "🇮🇱 İsrail" },
  { value: "+973", label: "🇧🇭 Bahreyn" },
  { value: "+974", label: "🇶🇦 Katar" },
  { value: "+975", label: "🇧🇹 Bhutan" },
  { value: "+976", label: "🇲🇳 Moğolistan" },
  { value: "+977", label: "🇳🇵 Nepal" },
  { value: "+994", label: "🇦🇿 Azerbaycan" },
  { value: "+995", label: "🇬🇪 Gürcistan" },
  { value: "+996", label: "🇰🇬 Kırgızistan" },
  { value: "+998", label: "🇺🇿 Özbekistan" },
] as const;

function normalizePhoneCode(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits ? `+${digits}` : "";
}

function localizedPhoneCodeLabel(label: string, value: string, locale: string): string {
  const flagParts = Array.from(label).slice(0, 2);
  const region = flagParts
    .map((part) => String.fromCharCode((part.codePointAt(0) ?? 127397) - 127397))
    .join("");
  const names = new Intl.DisplayNames([locale], { type: "region" });
  const regions = value === "+1" ? [region, "CA"] : value === "+7" ? [region, "KZ"] : [region];
  return `${flagParts.join("")} ${regions.map((code) => names.of(code) ?? code).join(" / ")}`;
}

function PhoneCodeInput({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const q = value.trim().toLocaleLowerCase(locale).replace(/^\+/, "");
  const filtered = PHONE_CODES.filter((code) => {
    const digits = code.value.replace("+", "");
    const text = `${localizedPhoneCodeLabel(code.label, code.value, locale)} ${code.value}`.toLocaleLowerCase(locale);
    return !q || digits.startsWith(q) || text.includes(q);
  });

  return (
    <div className="relative w-[72px] shrink-0">
      <input
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          onChange(normalizePhoneCode(value) || "+1");
          window.setTimeout(() => setOpen(false), 120);
        }}
        inputMode="tel"
        maxLength={5}
        className="field h-[46px] w-full rounded-e-none border-e-0 px-2 pe-5 text-[13px]"
        aria-label={label}
        autoComplete="off"
      />
      <button
        type="button"
        onMouseDown={(event) => {
          event.preventDefault();
          setOpen((current) => !current);
        }}
        className="absolute end-1 top-1/2 grid h-7 w-5 -translate-y-1/2 place-items-center text-ink/55 transition-colors hover:text-terra"
        aria-label={label}
      >
        <span className="text-[10px] leading-none" aria-hidden>▾</span>
      </button>
      {open && filtered.length > 0 && (
        <div className="absolute bottom-[calc(100%+6px)] start-0 z-20 max-h-[220px] w-[260px] overflow-y-auto rounded-[8px] border border-line bg-white py-1 shadow-card">
          {filtered.map((code) => (
            <button
              key={code.value}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                onChange(code.value);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between gap-3 px-3 py-2 text-start text-[13px] font-semibold text-ink transition-colors hover:bg-terra/8"
            >
              <span className="min-w-0 truncate">{localizedPhoneCodeLabel(code.label, code.value, locale)}</span>
              <span className="shrink-0 text-terra">{code.value}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const RegisterForm = () => {
  const [state, action, pending] = useActionState(signUp, { ok: false });
  const [step, setStep] = useState<StepNo>(1);
  const [intent, setIntent] = useState<Intent | "">(""); // "" = henüz seçilmedi
  const [group, setGroup] = useState<string>(""); // "service" akışında seçilen grup
  const [services, setServices] = useState<string[]>([]); // seçilen alt kategori slug'ları (çoklu)
  const category = services[0] ?? ""; // birincil = ilk seçilen
  const toggleService = (slug: string) =>
    setServices((current) => (current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]));
  const [sector, setSector] = useState("");
  const [sectorNote, setSectorNote] = useState("");
  // Adım 3 (yalnızca tedarikçi): işletme profili — kayıtta toplanır, metadata ile taşınır.
  const [bizCountry, setBizCountry] = useState("");
  const [bizCity, setBizCity] = useState("");
  const [bizDistrict, setBizDistrict] = useState("");
  const [bizDesc, setBizDesc] = useState("");
  const [bizWhatsapp, setBizWhatsapp] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhoneCode, setContactPhoneCode] = useState("+1");
  const [contactPhone, setContactPhone] = useState("");
  const [bizWhatsappCode, setBizWhatsappCode] = useState("+1");
  const [contactEmail, setContactEmail] = useState("");
  // Kapak görseli — oturumsuz draft yükleme (bkz. /api/signup/cover). Zorunlu.
  const [coverPath, setCoverPath] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverErr, setCoverErr] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState(""); // verify ekranında göstermek için
  const [emailErr, setEmailErr] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [editingAgain, setEditingAgain] = useState(false); // verify ekranından forma dönüş
  const t = useTranslations("register");
  const tc = useTranslations("cat");
  const ts = useTranslations("service");

  const { countries, cities, districts } = useRegions(bizCountry, bizCity, bizDistrict);

  // Yetkili kişi iletişim doğrulaması — saçma girişleri engelle. İkisi de opsiyonel
  // ama girildiyse geçerli olmalı.
  const emailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const phoneValid = (v: string) => /^[+]?[\d][\d\s()/-]{6,}$/.test(v) && (v.match(/\d/g)?.length ?? 0) >= 7;
  const fullContactPhone = `${normalizePhoneCode(contactPhoneCode)} ${contactPhone}`.trim();
  const fullBizWhatsapp = `${normalizePhoneCode(bizWhatsappCode)} ${bizWhatsapp}`.trim();
  const contactEmailErr = contactEmail.trim() !== "" && !emailValid(contactEmail.trim());
  const contactPhoneErr = contactPhone.trim() !== "" && !phoneValid(fullContactPhone);
  const bizWhatsappErr = bizWhatsapp.trim() !== "" && !phoneValid(fullBizWhatsapp);

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
  const isSupplier = intent === "service";
  // Acente artık ayrı akış değil — tüm tedarikçi grupları (acente dahil) tek listede.
  const serviceGroups = CATEGORY_GROUPS;
  // Alt kategori: service akışında açılan kategori bloğunun içinde seçilir · buyer → YOK.
  const hasCategory = accountType === "buyer" || !!category;
  const sectorValue = sectorNote.trim() ? sectorNote.trim() : sector;
  const canSubmit = hasCategory && !emailErr && !pwErr;

  // Akış sırası kimliğe göre değişir: alıcıda işletme adımı (3) yok.
  const flow: StepNo[] = isSupplier ? [1, 2, 3, 4] : [1, 2, 4];
  const stepIndex = Math.max(0, flow.indexOf(step));
  const progress = ((stepIndex + 1) / flow.length) * 100;

  const titleFor = (n: StepNo) =>
    n === 1 ? t("step1Title") : n === 2 ? t("step2CategoryTitle") : n === 3 ? t("bizStepTitle") : t("step3Title");
  const shortFor = (n: StepNo) =>
    n === 1 ? t("stepShort1") : n === 2 ? t("stepShort2") : n === 3 ? t("bizStepShort") : t("stepShort3");
  const descFor = (n: StepNo) =>
    n === 1 ? t("step1Desc") : n === 2 ? t("step2Desc") : n === 3 ? t("bizStepDesc") : t("step3Desc");
  const stepTitle = titleFor(step);

  // İşletme adımı (3) oyunlaştırması: dolan her alan profil gücünü yükseltir.
  // Bu adım zorunlu — kapak, adres, açıklama ve yetkili kişi dolmadan hesaba geçilemez.
  const bizChecks = [
    Boolean(coverPath),
    Boolean(bizCountry && bizCity && bizDistrict),
    Boolean(bizDesc.trim()),
    Boolean(contactName.trim()),
    Boolean(contactPhone.trim()),
    Boolean(bizWhatsapp.trim()),
  ];
  const bizComplete = bizChecks.every(Boolean) && !contactEmailErr && !contactPhoneErr && !bizWhatsappErr;

  async function onCoverPick(file: File) {
    setCoverErr(false);
    setCoverUploading(true);
    try {
      const blob = await compressImage(file);
      const body = new FormData();
      body.append("file", new File([blob], "cover.jpg", { type: blob.type || "image/jpeg" }));
      const res = await fetch("/api/signup/cover", { method: "POST", body });
      if (!res.ok) {
        setCoverErr(true);
        return;
      }
      const data = (await res.json()) as { path?: string };
      if (!data.path) {
        setCoverErr(true);
        return;
      }
      setCoverPath(data.path);
      setCoverPreview(URL.createObjectURL(blob));
    } catch {
      setCoverErr(true);
    } finally {
      setCoverUploading(false);
    }
  }

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

  // Akış listesinde ileri/geri (alıcıda 3. adım otomatik atlanır).
  const goNext = () => {
    const i = flow.indexOf(step);
    if (i >= 0 && i < flow.length - 1) swap(() => setStep(flow[i + 1]), "forward");
  };
  const goBack = () => {
    const i = flow.indexOf(step);
    if (i > 0) swap(() => setStep(flow[i - 1]), "back");
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
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="grid gap-3 text-center" style={{ gridTemplateColumns: `repeat(${flow.length}, minmax(0,1fr))` }}>
              {flow.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    if (n === step) return;
                    const target = flow.indexOf(n);
                    // Yalnızca tamamlanmış önceki adımlara / geçilebilir adımlara git.
                    if (target < stepIndex) swap(() => setStep(n), "back");
                    else if (n === 2 && intent) swap(() => setStep(2), "forward");
                    else if (n === 3 && hasCategory) swap(() => setStep(3), "forward");
                    else if (n === 4 && hasCategory && (!isSupplier || bizComplete)) swap(() => setStep(4), "forward");
                  }}
                  disabled={(n === 2 && !intent) || ((n === 3 || n === 4) && !hasCategory) || (n === 4 && isSupplier && !bizComplete)}
                  className={cn(
                    "min-w-0 rounded-[8px] px-2 py-1 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-55",
                    flow.indexOf(n) <= stepIndex ? "text-terra" : "text-ink/55 hover:text-ink/70",
                  )}
                  aria-current={step === n ? "step" : undefined}
                >
                  <span className="block truncate text-[14px] font-extrabold leading-tight">{shortFor(n)}</span>
                  <span className={cn("mt-1 block truncate text-[12px] font-semibold", flow.indexOf(n) <= stepIndex ? "text-ink/65" : "text-ink/50")}>{descFor(n)}</span>
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
            {t("stepLabel")} {stepIndex + 1} / {flow.length} — {stepTitle}
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
                    "flex items-center gap-4 rounded-[14px] border-[1.5px] bg-paper px-4 py-4 text-start transition-all lg:gap-5 lg:rounded-[16px] lg:px-6 lg:py-7",
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
                  <ChevronRight size={20} className={cn("ms-auto shrink-0 rtl:rotate-180 lg:h-6 lg:w-6", on ? "text-terra" : "text-muted/60")} aria-hidden />
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
                            <span className="block text-[13.5px] font-semibold leading-tight text-[#555]">{ts(c.slug)}</span>
                          </button>
                        );
                      })}
                  </div>
                </>
              )}
            </fieldset>
          )}

          <div className="mt-2 grid grid-cols-[minmax(110px,.38fr)_minmax(0,1fr)] gap-2.5 max-[420px]:grid-cols-1">
            <Button type="button" variant="outline" onClick={goBack}>
              {t("back")}
            </Button>
            <Button type="button" disabled={!hasCategory} onClick={goNext}>
              {t("continueBtn")}
            </Button>
          </div>
        </div>
      )}

      {/* ADIM 3 — işletme profili (yalnızca tedarikçi) — oyunlaştırılmış, atlanabilir */}
      {step === 3 && isSupplier && (
        <div key="step3" className="flex flex-col gap-4">
          {/* Kapak görseli (zorunlu, oturumsuz draft yükleme) */}
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink">
              <ImagePlus size={15} className="text-terra" aria-hidden />
              {t("bizCoverLegend")}
            </legend>
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className={cn(
                "relative grid h-[128px] w-full place-items-center overflow-hidden rounded-[12px] border-2 border-dashed transition-colors",
                coverPreview ? "border-terra/40" : "border-line hover:border-terra/55 hover:bg-terra/[.03]",
              )}
            >
              {coverPreview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverPreview} alt="" className="h-full w-full object-cover" />
                  <span className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-[12px] font-bold text-white backdrop-blur">
                    <ImagePlus size={13} aria-hidden />
                    {t("bizCoverChange")}
                  </span>
                </>
              ) : (
                <span className="flex items-center gap-3 px-4 text-start">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-terra/10 text-terra">
                    {coverUploading ? <Loader2 size={22} className="animate-spin" aria-hidden /> : <ImagePlus size={22} aria-hidden />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14px] font-bold text-ink">{coverUploading ? t("bizCoverUploading") : t("bizCoverPick")}</span>
                    <span className="mt-0.5 block text-[12px] font-medium leading-snug text-ink/55">{t("bizCoverHint")}</span>
                  </span>
                </span>
              )}
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onCoverPick(file);
                e.target.value = "";
              }}
            />
            {coverErr && <p className="text-[12.5px] font-semibold text-red-600">{t("bizCoverError")}</p>}
          </fieldset>

          {/* Adres */}
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink">
              <MapPin size={15} className="text-terra" aria-hidden />
              {t("bizAddressLegend")}
            </legend>
            <div className="grid grid-cols-3 gap-2.5 max-[520px]:grid-cols-1">
              <select
                value={bizCountry}
                onChange={(e) => {
                  setBizCountry(e.target.value);
                  setBizCity("");
                  setBizDistrict("");
                }}
                className="field h-[46px]"
                aria-label={t("bizCountryPh")}
              >
                <option value="">{t("bizCountryPh")}</option>
                {countries.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <select
                value={bizCity}
                onChange={(e) => {
                  setBizCity(e.target.value);
                  setBizDistrict("");
                }}
                disabled={!bizCountry}
                className="field h-[46px] disabled:opacity-55"
                aria-label={t("bizCityPh")}
              >
                <option value="">{bizCountry ? t("bizCityPh") : t("bizCountryFirst")}</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={bizDistrict}
                onChange={(e) => setBizDistrict(e.target.value)}
                disabled={!bizCity}
                className="field h-[46px] disabled:opacity-55"
                aria-label={t("bizDistrictPh")}
              >
                <option value="">{t("bizDistrictPh")}</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </fieldset>

          {/* Açıklama */}
          <label className="flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink">
              <FileText size={15} className="text-terra" aria-hidden />
              {t("bizDescLegend")}
            </span>
            <textarea
              value={bizDesc}
              onChange={(e) => setBizDesc(e.target.value)}
              rows={3}
              maxLength={2000}
              className="field min-h-[84px] py-2.5"
              placeholder={t("bizDescPh")}
            />
          </label>

          {/* Yetkili kişi */}
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink">
              <UserRound size={15} className="text-terra" aria-hidden />
              {t("bizContactLegend")}
            </legend>
            <input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              maxLength={160}
              className="field h-[46px]"
              placeholder={t("bizContactNamePh")}
              autoComplete="off"
            />
            <div className="grid grid-cols-2 gap-2 max-[640px]:grid-cols-1">
              <div className="min-w-0 flex flex-col gap-1">
                <div className="flex w-full min-w-0">
                  <PhoneCodeInput value={contactPhoneCode} onChange={setContactPhoneCode} label={t("phoneCode")} />
                  <input
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    maxLength={40}
                    type="tel"
                    inputMode="tel"
                    aria-invalid={contactPhoneErr}
                    className={cn("field h-[46px] min-w-0 flex-1 rounded-s-none", contactPhoneErr && "border-red-500 focus:border-red-500")}
                    placeholder={t("bizContactPhonePh")}
                    autoComplete="off"
                  />
                </div>
                {contactPhoneErr && <p className="text-[11.5px] font-medium text-red-600">{t("bizContactPhoneErr")}</p>}
              </div>
              <div className="min-w-0 flex flex-col gap-1">
                <div className="group relative flex w-full min-w-0">
                  <PhoneCodeInput value={bizWhatsappCode} onChange={setBizWhatsappCode} label={t("phoneCode")} />
                  <input
                    value={bizWhatsapp}
                    onChange={(e) => setBizWhatsapp(e.target.value)}
                    maxLength={40}
                    type="tel"
                    inputMode="tel"
                    aria-invalid={bizWhatsappErr}
                    className={cn("field h-[46px] min-w-0 flex-1 rounded-s-none pe-10", bizWhatsappErr && "border-red-500 focus:border-red-500")}
                    placeholder={t("bizWhatsappPh")}
                    autoComplete="off"
                  />
                  <span
                    tabIndex={0}
                    aria-label={t("bizWhatsappTip")}
                    className="absolute end-3 top-1/2 grid -translate-y-1/2 place-items-center text-muted outline-none transition-colors hover:text-terra focus:text-terra"
                  >
                    <Info size={16} aria-hidden />
                    <span className="pointer-events-none absolute bottom-full end-0 z-10 mb-2 hidden w-[230px] rounded-[8px] border border-line bg-ink px-3 py-2 text-start text-[11.5px] font-semibold leading-snug text-white shadow-card group-hover:block group-focus-within:block">
                      {t("bizWhatsappTip")}
                    </span>
                  </span>
                </div>
                {bizWhatsappErr && <p className="text-[11.5px] font-medium text-red-600">{t("bizContactPhoneErr")}</p>}
              </div>
            </div>
            <div className="flex flex-col gap-1">
                <input
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  maxLength={200}
                  type="email"
                  aria-invalid={contactEmailErr}
                  className={cn("field h-[46px]", contactEmailErr && "border-red-500 focus:border-red-500")}
                  placeholder={t("bizContactEmailPh")}
                  autoComplete="off"
                />
                {contactEmailErr && <p className="text-[11.5px] font-medium text-red-600">{t("bizContactEmailErr")}</p>}
            </div>
          </fieldset>

          {!bizComplete && (
            <p className="text-[12.5px] font-semibold text-terra/90">{t("bizRequiredHint")}</p>
          )}
          <div className="mt-1 grid grid-cols-[minmax(110px,.38fr)_minmax(0,1fr)] gap-2.5 max-[420px]:grid-cols-1">
            <Button type="button" variant="outline" onClick={goBack}>
              {t("back")}
            </Button>
            <Button type="button" disabled={!bizComplete} onClick={goNext}>
              {t("continueBtn")}
            </Button>
          </div>
        </div>
      )}

      {/* ADIM 4 — hesap bilgileri */}
      {step === 4 && (
        <form
          id="regform"
          key="step4"
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
          {/* Adım 3 işletme profili — metadata ile taşınır, işletme kaydı oluşurken uygulanır */}
          <input type="hidden" name="bizCountry" value={bizCountry} />
          <input type="hidden" name="bizCity" value={bizCity} />
          <input type="hidden" name="bizDistrict" value={bizDistrict} />
          <input type="hidden" name="bizDescription" value={bizDesc} />
          <input type="hidden" name="bizWhatsapp" value={fullBizWhatsapp} />
          <input type="hidden" name="contactName" value={contactName} />
          <input type="hidden" name="contactPhone" value={fullContactPhone} />
          <input type="hidden" name="contactEmail" value={contactEmail} />
          <input type="hidden" name="bizCoverDraft" value={coverPath} />

          <Input name="name" label={intent === "buyer" ? t("nameBuyer") : t("name")} type="text" required autoComplete="name" placeholder={t("namePh")} />

          <Input
            name="email"
            label={t("email")}
            type="email"
            required
            autoComplete="email"
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
                autoComplete="new-password"
                placeholder="••••••••"
                aria-invalid={!!pwErr}
                onChange={() => pwErr && setPwErr("")}
                onBlur={(e) => setPwErr(e.target.value && e.target.value.length < 6 ? t("vPassword") : "")}
                className={cn("field h-[46px] w-full pe-11", pwErr && "border-red-500 focus:border-red-500")}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? t("pwHide") : t("pwShow")}
                className="absolute end-3 top-1/2 grid -translate-y-1/2 place-items-center text-muted transition-colors hover:text-ink"
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
            <Button type="button" variant="outline" onClick={goBack}>
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
