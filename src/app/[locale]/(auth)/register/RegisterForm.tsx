"use client";

import { useActionState, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Building2, Check, Eye, EyeOff, FileCheck2, FileUp, ImagePlus, Loader2, UserRound, X } from "lucide-react";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { docsForGroup, OTHER_DOCUMENT_KIND } from "@/lib/business-fields";
import { useRegions } from "@/lib/geo";
import { signUp } from "@/lib/actions/auth";
import type { BusinessDocument, GroupKey } from "@/lib/types";
import { cn } from "@/lib/utils";
import styles from "./styles";
import { Link } from "@/i18n/navigation";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import PhoneCodeInput from "@/components/PhoneCodeInput";
import { DEFAULT_PHONE_CODE, normalizePhoneCode } from "@/lib/phone-codes";
import VerifyEmail from "./VerifyEmail";

type StepNo = 1 | 2 | 3 | 4 | 5;
type WorkMode = "freelancer" | "company";
type QueuedDocument = { id: string; file: File; kind: string };

function browserTimezone(): string {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone ?? ""; } catch { return ""; }
}

async function compressImage(file: File, maxDim = 1600, quality = 0.82): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  let { width, height } = bitmap;
  if (Math.max(width, height) > maxDim) {
    const ratio = maxDim / Math.max(width, height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height); bitmap.close?.();
  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  return blob && blob.size < file.size ? blob : file;
}

const GROUP_ICON_SRC: Record<string, string> = {
  konaklama: "/assets/icons/hotels.svg", acente: "/assets/icons/agencies.svg",
  rehber: "/assets/icons/guides.svg", ulasim: "/assets/icons/transfers.svg",
  aktivite: "/assets/icons/activities.svg", saglik: "/assets/icons/health-tourism.svg",
  gastronomi: "/assets/icons/gastronomy.svg",
};

const maskStyle = (src: string): CSSProperties => ({
  WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`, WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center",
  WebkitMaskSize: "contain", maskSize: "contain",
});

const RegisterForm = ({ defaultReferral = "" }: { defaultReferral?: string }) => {
  const [state, action, pending] = useActionState(signUp, { ok: false });
  const [step, setStep] = useState<StepNo>(1);
  const [workMode, setWorkMode] = useState<WorkMode>("freelancer");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneCode, setPhoneCode] = useState(DEFAULT_PHONE_CODE);
  const [phone, setPhone] = useState("");
  const [whatsappCode, setWhatsappCode] = useState(DEFAULT_PHONE_CODE);
  const [whatsapp, setWhatsapp] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [group, setGroup] = useState<GroupKey | "">("");
  const [services, setServices] = useState<string[]>([]);
  const category = services[0] ?? "";
  const [description, setDescription] = useState("");
  const [coverPath, setCoverPath] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [documents, setDocuments] = useState<BusinessDocument[]>([]);
  const [documentQueue, setDocumentQueue] = useState<QueuedDocument[]>([]);
  const [uploading, setUploading] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [referral, setReferral] = useState(defaultReferral);
  const [editingAgain, setEditingAgain] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLInputElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  const t = useTranslations("register");
  const locale = useLocale();
  const tc = useTranslations("cat");
  const ts = useTranslations("service");
  const { countries, cities, districts } = useRegions(country, city, district);

  useEffect(() => {
    if (mounted.current) stepRef.current?.focus(); else mounted.current = true;
  }, [step]);

  const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
  const fullPhone = `${normalizePhoneCode(phoneCode)} ${phone}`.trim();
  const fullWhatsapp = `${normalizePhoneCode(whatsappCode)} ${whatsapp}`.trim();
  const phoneValid = (value: string) => (value.match(/\d/g)?.length ?? 0) >= 7;
  const docFields = useMemo(() => group ? docsForGroup(group, category) : [], [group, category]);
  const queuedKinds = documentQueue.map((item) => item.kind).filter(Boolean);
  const classifiedQueuedKinds = queuedKinds.filter((kind) => kind !== OTHER_DOCUMENT_KIND);
  const documentQueueReady = documentQueue.length > 0 && queuedKinds.length === documentQueue.length && new Set(classifiedQueuedKinds).size === classifiedQueuedKinds.length;
  const stepReady: Record<StepNo, boolean> = {
    1: Boolean(firstName.trim() && lastName.trim() && phoneValid(fullPhone) && phoneValid(fullWhatsapp)),
    2: Boolean(country && city && address.trim() && (workMode === "freelancer" || businessName.trim())),
    3: Boolean(group && category),
    4: Boolean(coverPath && description.trim()),
    5: true,
  };

  if (state.ok && !editingAgain) return <VerifyEmail email={email} onBack={() => setEditingAgain(true)} />;

  const steps: { no: StepNo; label: string; shortLabel: string }[] = [
    { no: 1, label: t("flowPersonal"), shortLabel: t("flowPersonalShort") },
    { no: 2, label: t("flowWork"), shortLabel: t("flowWorkShort") },
    { no: 3, label: t("flowServices"), shortLabel: t("flowServicesShort") },
    { no: 4, label: t("flowProfile"), shortLabel: t("flowProfileShort") },
    { no: 5, label: t("flowAccount"), shortLabel: t("flowAccountShort") },
  ];
  const titles: Record<StepNo, string> = {
    1: t("personalTitle"), 2: workMode === "company" ? t("companyTitle") : t("freelancerTitle"),
    3: t("servicesTitle"), 4: t("profileDocsTitle"), 5: t("accountTitle"),
  };

  function go(next: StepNo) {
    if (next > step && !stepReady[step]) return;
    setStep(next);
  }

  async function uploadCover(file: File) {
    setUploading("cover"); setUploadError("");
    try {
      const blob = await compressImage(file);
      const body = new FormData(); body.append("file", new File([blob], "cover.jpg", { type: blob.type || "image/jpeg" }));
      const res = await fetch("/api/signup/cover", { method: "POST", body });
      const data = await res.json() as { path?: string };
      if (!res.ok || !data.path) throw new Error();
      setCoverPath(data.path); setCoverPreview(URL.createObjectURL(blob));
    } catch { setUploadError("cover"); } finally { setUploading(""); }
  }

  function addDocumentFiles(fileList: FileList | null) {
    if (!fileList) return;
    const selected = Array.from(fileList);
    const accepted = selected.filter((file) => file.size > 0 && file.size <= 10 * 1024 * 1024 && ["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(file.type));
    if (accepted.length !== selected.length) setUploadError("documents"); else setUploadError("");
    setDocumentQueue((current) => {
      const capacity = Math.max(0, 20 - documents.length - current.length);
      const missingKinds = docFields.map((doc) => doc.kind).filter((kind) => !documents.some((doc) => doc.kind === kind) && !current.some((doc) => doc.kind === kind));
      const additions = accepted.slice(0, capacity).map((file) => ({
        id: crypto.randomUUID(),
        file,
        kind: missingKinds.shift() ?? OTHER_DOCUMENT_KIND,
      }));
      return [...current, ...additions];
    });
  }

  async function uploadQueuedDocuments() {
    if (!documentQueueReady) return;
    setUploading("documents"); setUploadError("");
    const uploaded: BusinessDocument[] = [];
    const completed = new Set<string>();
    let failed = false;
    for (const item of documentQueue) {
      try {
        const body = new FormData(); body.append("file", item.file); body.append("kind", item.kind);
        const res = await fetch("/api/signup/document", { method: "POST", body });
        const data = await res.json() as { path?: string };
        if (!res.ok || !data.path) throw new Error();
        uploaded.push({ kind: item.kind, name: item.file.name, path: data.path });
        completed.add(item.id);
      } catch { failed = true; }
    }
    if (uploaded.length > 0) {
      const kinds = new Set(uploaded.filter((doc) => doc.kind !== OTHER_DOCUMENT_KIND).map((doc) => doc.kind));
      setDocuments((current) => [...current.filter((doc) => !kinds.has(doc.kind)), ...uploaded]);
      setDocumentQueue((current) => current.filter((item) => !completed.has(item.id)));
    }
    if (failed) setUploadError("documents");
    setUploading("");
  }

  function removeCover() {
    const path = coverPath;
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPath(""); setCoverPreview("");
    if (path) void fetch("/api/signup/cover", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ path }) });
  }

  function removeUploadedDocument(document: BusinessDocument) {
    setDocuments((current) => current.filter((item) => item.path !== document.path));
    if (document.path) void fetch("/api/signup/document", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ path: document.path }) });
  }

  const nav = (
    <div className="mt-5 grid grid-cols-[minmax(110px,.38fr)_minmax(0,1fr)] gap-2.5 max-[420px]:grid-cols-1">
      <Button type="button" variant="outline" onClick={() => go((step - 1) as StepNo)}>{t("back")}</Button>
      <Button type="button" disabled={!stepReady[step]} onClick={() => go((step + 1) as StepNo)}>{t("continueBtn")}</Button>
    </div>
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 px-5 pt-4 sm:px-8 lg:px-12 lg:pt-5">
        <div className="mx-auto w-full max-w-[760px]">
          <div>
            <div className="grid grid-cols-5">
              {steps.map((item) => (
                <button key={item.no} type="button" aria-current={item.no === step ? "step" : undefined} onClick={() => item.no <= step && go(item.no)} className={cn("flex min-w-0 items-center gap-1.5 transition-colors max-[520px]:justify-center max-[520px]:text-center", item.no === 1 ? "justify-start text-start" : item.no === steps.length ? "justify-end text-end" : "justify-center text-center", item.no === step ? "text-ink" : item.no < step ? "text-ink/70" : "text-muted/55")}>
                  <span className={cn("grid h-[19px] min-w-[19px] place-items-center rounded-full text-[8px] font-extrabold tabular-nums transition-colors max-[520px]:hidden", item.no === step ? "bg-terra text-white shadow-[0_0_0_3px_rgba(124,58,237,.16)]" : item.no < step ? "bg-terra/15 text-interactive" : "bg-cream/40 text-muted")}>{item.no < step ? <Check size={10} strokeWidth={3} /> : item.no}</span>
                  <strong className={cn("truncate text-[11px]", item.no === step ? "font-bold" : "font-medium", "max-[520px]:hidden")}>{item.label}</strong>
                  <strong className={cn("hidden truncate text-[9px] max-[520px]:block", item.no === step ? "font-extrabold" : "font-semibold")}>{item.shortLabel}</strong>
                </button>
              ))}
            </div>
            <div role="progressbar" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={step} className="mt-3 h-1 overflow-hidden rounded-full bg-line/60">
              <div className="h-full rounded-full bg-terra transition-[width] duration-500 ease-out" style={{ width: `${(step / steps.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 sm:px-8 lg:px-12">
        <div ref={stepRef} tabIndex={-1} className="mx-auto w-full max-w-[760px] pb-9 pt-6 outline-none">
          <h1 className="text-[27px] font-extrabold tracking-tight text-ink">{titles[step]}</h1>
          <div className="mt-2 flex items-baseline justify-between gap-4 max-[560px]:flex-col max-[560px]:items-start max-[560px]:gap-1.5">
            <p className="text-[13px] font-medium text-muted">{t(`flowLead${step}`)}</p>
            <span className="shrink-0 text-[11px] font-semibold text-muted">{t("haveAccount")} <Link href={{ pathname: "/login" }} className={styles.authLink}>{t("loginLink")}</Link></span>
          </div>

          {step === 1 && <div className="mt-6 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
              <Input label={t("firstName")} value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              <Input label={t("lastName")} value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-ink"><span>{t("phone")}</span><span className="flex"><PhoneCodeInput value={phoneCode} onChange={setPhoneCode} label={t("phoneCode")} /><input className="field h-[46px] min-w-0 flex-1 rounded-s-none" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></span></label>
              <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-ink"><span>{t("whatsapp")}</span><span className="flex"><PhoneCodeInput value={whatsappCode} onChange={setWhatsappCode} label={t("phoneCode")} /><input className="field h-[46px] min-w-0 flex-1 rounded-s-none" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} /></span></label>
            </div>
            <section aria-labelledby="work-mode-heading"><h3 id="work-mode-heading" className="mb-3 text-[13px] font-bold text-ink">{t("hasCompanyQuestion")}</h3><div className="grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
              {(["freelancer", "company"] as WorkMode[]).map((mode) => <button key={mode} type="button" onClick={() => { setWorkMode(mode); setDocuments([]); setDocumentQueue([]); }} className={cn(styles.intentCard, "!px-4 !py-4", workMode === mode ? styles.intentCardActive : styles.intentCardIdle)}><span className={cn(styles.intentIcon, "!h-10 !w-10", workMode === mode ? styles.intentIconActive : styles.intentIconIdle)}>{mode === "company" ? <Building2 size={19} /> : <UserRound size={19} />}</span><span><strong className="block text-[14px]">{t(mode === "company" ? "companyYes" : "companyNo")}</strong><small className="mt-1 block text-[11px] text-muted">{t(mode === "company" ? "companyYesDesc" : "companyNoDesc")}</small></span></button>)}
            </div></section>{nav}
          </div>}

          {step === 2 && <div className="mt-6 flex flex-col gap-4">
            {workMode === "company" && <Input label={t("name")} value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />}
            <div className="grid grid-cols-3 gap-3 max-[560px]:grid-cols-1">
              <label className="flex min-w-0 flex-col text-[12px] font-semibold"><span>{t("bizCountryPh")}</span><select className="field mt-1.5 h-[46px] w-full min-w-0" value={country} onChange={(e) => { setCountry(e.target.value); setCity(""); setDistrict(""); }}><option value="">{t("bizCountryPh")}</option>{countries.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></label>
              <label className="flex min-w-0 flex-col text-[12px] font-semibold"><span>{t("bizCityPh")}</span><select className="field mt-1.5 h-[46px] w-full min-w-0" value={city} disabled={!country} onChange={(e) => { setCity(e.target.value); setDistrict(""); }}><option value="">{t("bizCityPh")}</option>{cities.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
              <label className="flex min-w-0 flex-col text-[12px] font-semibold"><span>{t("bizDistrictPh")}</span><select className="field mt-1.5 h-[46px] w-full min-w-0" value={district} disabled={!city} onChange={(e) => setDistrict(e.target.value)}><option value="">{t("bizDistrictPh")}</option>{districts.map((d) => <option key={d} value={d}>{d}</option>)}</select></label>
            </div>
            <label className="flex min-w-0 flex-col text-[12px] font-semibold"><span>{workMode === "company" ? t("bizOpenAddressLabel") : t("serviceArea")}</span><textarea className="field mt-1.5 min-h-[78px] w-full min-w-0 py-2.5" value={address} onChange={(e) => setAddress(e.target.value)} /></label>
            <Input label={t("websiteLabel")} type="url" inputMode="url" value={website} onChange={(e) => setWebsite(e.target.value)} onBlur={(e) => { const value = e.target.value.trim(); if (value && !/^https?:\/\//i.test(value)) setWebsite(`https://${value}`); }} />{nav}
          </div>}

          {step === 3 && <div className="mt-6 flex flex-col gap-4 max-[560px]:mt-4 max-[560px]:gap-3">
            {!group ? <div className="grid grid-cols-3 gap-3 max-[560px]:grid-cols-3 max-[560px]:gap-2 max-[360px]:grid-cols-2">{CATEGORY_GROUPS.map((g) => <button key={g.key} type="button" onClick={() => { setGroup(g.key); setServices([]); setDocuments([]); setDocumentQueue([]); }} className={cn(styles.choiceCard, styles.choiceCardIdle, "min-h-[112px] py-4 max-[560px]:min-h-[76px] max-[560px]:px-2 max-[560px]:py-2.5")}>{GROUP_ICON_SRC[g.key] && <span className={cn(styles.categoryIcon, "max-[560px]:mb-1.5 max-[560px]:h-6 max-[560px]:w-6")} style={maskStyle(GROUP_ICON_SRC[g.key])} />}<span className={cn(styles.choiceLabel, "max-[560px]:text-[10.5px]")}>{tc(g.key)}</span></button>)}</div> : <><button type="button" className={cn(styles.subBack, "max-[560px]:text-[11px]")} onClick={() => { setGroup(""); setServices([]); setDocuments([]); setDocumentQueue([]); }}>‹ {tc(group)}</button><div className="grid grid-cols-3 gap-3 max-[560px]:grid-cols-3 max-[560px]:gap-2 max-[360px]:grid-cols-2">{CATEGORY_GROUPS.find((g) => g.key === group)?.children.map((item) => { const selected = services.includes(item.slug); return <button key={item.slug} type="button" onClick={() => { setServices((current) => selected ? current.filter((x) => x !== item.slug) : [...current, item.slug]); setDocuments([]); setDocumentQueue([]); }} className={cn(styles.choiceCard, "min-h-[88px] py-3 max-[560px]:min-h-[62px] max-[560px]:px-2 max-[560px]:py-2", selected ? styles.choiceCardActive : styles.choiceCardIdle)}><span className={cn(styles.choiceIndicator, "max-[560px]:mb-1 max-[560px]:h-5 max-[560px]:w-5", selected ? styles.choiceIndicatorActive : styles.choiceIndicatorIdle)}>{selected && <Check size={14} className="max-[560px]:h-3 max-[560px]:w-3" />}</span><span className={cn(styles.choiceLabel, "text-[13px] max-[560px]:text-[10.5px]")}>{ts(item.slug)}</span></button>})}</div></>}{nav}
          </div>}

          {step === 4 && <div className="mt-6 flex flex-col gap-4">
            <div className="grid grid-cols-[250px_minmax(0,1fr)] items-end gap-4 max-[620px]:grid-cols-1">
              <div className="relative"><button type="button" onClick={() => coverRef.current?.click()} className="relative grid h-[132px] w-full place-items-center overflow-hidden rounded-[14px] border border-line bg-cream/20 px-4 transition-colors hover:border-interactive/55 hover:bg-cream/35">{coverPreview ? <Image src={coverPreview} alt="" fill unoptimized className="object-cover" /> : <span className="flex flex-col items-center gap-2 text-center text-[12px] font-bold text-interactive">{uploading === "cover" ? <Loader2 className="animate-spin" /> : <span className="grid h-9 w-9 place-items-center rounded-full bg-terra/10"><ImagePlus size={19} /></span>} {t(workMode === "company" ? "bizCoverPick" : "profilePhotoPick")}</span>}</button>{coverPreview && <button type="button" aria-label={t("removeImage")} onClick={removeCover} className="absolute end-2.5 top-2.5 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/65 text-white shadow-md backdrop-blur-sm transition-colors hover:bg-black/85"><X size={17} /></button>}</div>
              <label className="flex min-w-0 flex-col text-[12px] font-semibold"><span>{workMode === "company" ? t("bizDescLegend") : t("freelancerDesc")}</span><textarea className="field mt-1.5 h-[132px] w-full min-w-0 resize-none py-3" value={description} onChange={(e) => setDescription(e.target.value)} /></label>
            </div>
            <input ref={coverRef} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => { const file = e.target.files?.[0]; if (file) void uploadCover(file); e.target.value = ""; }} />
            {workMode === "company" && docFields.length > 0 && <section aria-labelledby="documents-heading" className="flex flex-col gap-3 rounded-[14px] border border-line bg-paper/45 p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-terra/10 text-interactive"><FileCheck2 size={18} /></span>
                <span className="min-w-0"><span id="documents-heading" className="block text-[12.5px] font-bold text-ink">{t("documentsTitle")}</span><span className="mt-0.5 block text-[10.5px] font-medium text-muted">{t("documentsPrivate")}</span></span>
              </div>
              <button type="button" onClick={() => docRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); addDocumentFiles(event.dataTransfer.files); }} className="grid min-h-[82px] place-items-center rounded-[11px] border border-dashed border-interactive/40 bg-cream/15 px-4 py-3 text-center transition-colors hover:border-interactive/70 hover:bg-cream/30"><span className="flex items-center gap-3 max-[480px]:flex-col max-[480px]:gap-1.5"><FileUp size={20} className="shrink-0 text-interactive" /><span><strong className="block text-[12px] text-ink">{t("documentDropTitle")}</strong><small className="mt-0.5 block text-[10px] font-medium text-muted">{t("documentDropHint")}</small></span></span></button><input ref={docRef} hidden multiple type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(event) => { addDocumentFiles(event.target.files); event.target.value = ""; }} />
              {documentQueue.length > 0 && <div className="grid gap-2">{documentQueue.map((item) => <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_minmax(170px,.7fr)_34px] items-center gap-2 rounded-[10px] border border-line bg-paper p-2.5 max-[560px]:grid-cols-[minmax(0,1fr)_34px]"><span className="flex min-w-0 items-center gap-2"><FileCheck2 size={17} className="shrink-0 text-interactive" /><span className="truncate text-[11.5px] font-semibold">{item.file.name}</span></span><select aria-label={t("documentType")} value={item.kind} onChange={(event) => setDocumentQueue((current) => current.map((row) => row.id === item.id ? { ...row, kind: event.target.value } : row))} className="field h-[38px] min-w-0 text-[11.5px] max-[560px]:col-span-2 max-[560px]:row-start-2"><option value="">{t("documentType")}</option>{docFields.map((doc) => <option key={doc.kind} value={doc.kind} disabled={documentQueue.some((row) => row.id !== item.id && row.kind === doc.kind)}>{locale === "tr" ? doc.label.tr : doc.label.en}</option>)}<option value={OTHER_DOCUMENT_KIND}>{t("documentOther")}</option></select><button type="button" aria-label={t("removeDocument")} onClick={() => setDocumentQueue((current) => current.filter((row) => row.id !== item.id))} className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-cream hover:text-ink"><X size={16} /></button></div>)}</div>}
              {documents.length > 0 && <div className="grid gap-2">{documents.map((document) => { const field = docFields.find((doc) => doc.kind === document.kind); return <div key={document.path ?? `${document.kind}-${document.name}`} className="flex items-center justify-between gap-3 rounded-[10px] border border-emerald-700/25 bg-emerald-500/5 px-3 py-2.5"><span className="flex min-w-0 items-center gap-2"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-600 text-white"><Check size={12} /></span><span className="min-w-0"><strong className="block truncate text-[11.5px] text-ink">{field ? (locale === "tr" ? field.label.tr : field.label.en) : t("documentOther")}</strong><small className="block truncate text-[10px] text-muted">{document.name}</small></span></span><button type="button" aria-label={t("removeDocument")} onClick={() => removeUploadedDocument(document)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-red-500/10 hover:text-red-600"><X size={16} /></button></div> })}</div>}
              {documentQueue.length > 0 && <Button type="button" block loading={uploading === "documents"} disabled={!documentQueueReady} onClick={() => void uploadQueuedDocuments()} icon={<FileUp size={16} />}>{t("uploadDocuments")}</Button>}
            </section>}
            {uploadError && <p className="text-[12px] font-semibold text-red-600">{t("uploadError")}</p>}{nav}
          </div>}

          {step === 5 && <form className="mt-6 flex flex-col gap-4" action={(formData) => { setEditingAgain(false); const tz = browserTimezone(); if (tz) formData.set("timezone", tz); action(formData); }}>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
            <input type="hidden" name="accountType" value="supplier" /><input type="hidden" name="workMode" value={workMode} /><input type="hidden" name="firstName" value={firstName} /><input type="hidden" name="lastName" value={lastName} /><input type="hidden" name="name" value={workMode === "company" ? businessName : fullName} /><input type="hidden" name="category" value={category} /><input type="hidden" name="services" value={services.join(",")} /><input type="hidden" name="bizCountry" value={country} /><input type="hidden" name="bizCity" value={city} /><input type="hidden" name="bizDistrict" value={district} /><input type="hidden" name="bizAddress" value={address} /><input type="hidden" name="bizWebsite" value={website} /><input type="hidden" name="bizDescription" value={description} /><input type="hidden" name="bizWhatsapp" value={fullWhatsapp} /><input type="hidden" name="contactName" value={fullName} /><input type="hidden" name="contactPhone" value={fullPhone} /><input type="hidden" name="bizCoverDraft" value={coverPath} /><input type="hidden" name="documents" value={JSON.stringify(documents)} />
            <Input name="email" label={t("email")} type="email" required autoComplete="email" error={emailErr} onChange={(e) => { setEmail(e.target.value); setEmailErr(""); }} onBlur={(e) => setEmailErr(e.target.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value) ? t("vEmail") : "")} />
            <div className="flex flex-col gap-1.5"><label className="text-[13px] font-semibold">{t("password")}</label><div className="relative"><input name="password" type={showPw ? "text" : "password"} required minLength={6} autoComplete="new-password" className="field h-[46px] w-full pe-11" onChange={() => setPwErr("")} onBlur={(e) => setPwErr(e.target.value && e.target.value.length < 6 ? t("vPassword") : "")} /><button type="button" onClick={() => setShowPw((v) => !v)} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted">{showPw ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>{pwErr && <p className="text-[12px] text-red-600">{pwErr}</p>}</div>
            <Input name="referral" label={t("referral")} value={referral} onChange={(e) => setReferral(e.target.value)} />
            {state.error && <p className="text-[13px] font-medium text-red-600">{["rate", "exists", "email", "password", "businessExists"].includes(state.error) ? t(`error_${state.error}`) : t("error")}</p>}
            <div className="grid grid-cols-[minmax(110px,.38fr)_minmax(0,1fr)] gap-2.5"><Button type="button" variant="outline" onClick={() => go(4)}>{t("back")}</Button><Button type="submit" loading={pending} disabled={!!emailErr || !!pwErr}>{t("submit")}</Button></div>
          </form>}
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
