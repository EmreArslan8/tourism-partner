"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl"
import { AlertCircle, ArrowLeft, BriefcaseBusiness, Building2, CheckCircle2, Eye, FileCheck2, ImagePlus, Images, LoaderCircle, PencilLine, Plus, Search, SlidersHorizontal, Sparkles, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { visibleFacets } from "@/lib/facets";
import { businessSlug } from "@/lib/business-slug";
import { serviceTranslationKey } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { useRegions } from "@/lib/geo";
import { SOCIAL_PLATFORMS, type GroupKey, type BusinessDocument, type SocialPlatform } from "@/lib/types";
import type { BusinessGroup } from "@/lib/supabase/database.types";
import { fieldsForGroup, docsForGroup } from "@/lib/business-fields";
import { BUSINESS_DOCUMENTS_BUCKET } from "@/lib/business-document-shape";
import { businessImageUrl, BUSINESS_IMAGES_BUCKET } from "@/lib/business-images";
import { upsertPanelDraftMedia } from "@/lib/business-drafts";
import styles from "./styles";
import { Link, type Href } from "@/i18n/navigation";
import { cancelPartnerRequest, respondPartnerRequest, saveMyBusiness, sendPartnerRequest } from "@/lib/actions/panel";
import type { PartnerRequestActionState } from "@/lib/actions/panel";
import { Dialog, DialogContent, DialogTrigger } from "@/components/common/Dialog";
import ServiceMultiSelect from "@/components/ServiceMultiSelect";
import { OverviewDashboard, getProfileScore, type PanelViewStats } from "./Overview";

/* Sosyal medya platform etiketleri/örnekleri — özel isimler, çeviri gerekmez. */
const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  x: "X (Twitter)",
};
const SOCIAL_PLACEHOLDERS: Record<SocialPlatform, string> = {
  instagram: "https://instagram.com/…",
  facebook: "https://facebook.com/…",
  linkedin: "https://linkedin.com/company/…",
  youtube: "https://youtube.com/@…",
  x: "https://x.com/…",
};

type EditSection = "basic" | "media" | "services" | "partners" | "company" | "documents" | "contacts";

export type PanelBusiness = {
  id: number;
  group: string;
  type: string;
  serviceTypes?: string[];
  name: string;
  country: string;
  city: string;
  district: string;
  description: string | null;
  phone: string | null;
  website: string | null;
  socials: Record<string, string> | null;
  image: string | null;
  images: string[] | null;
  attributes: string[] | null;
  details: Record<string, string> | null;
  documents: BusinessDocument[] | null;
  status: "pending" | "approved" | "rejected" | "active" | "expired" | "blacklisted" | "suspended";
  verified: boolean;
  sponsored: boolean;
  founderPartner?: boolean;
  contactCount?: number;
  partnerActionCount?: number;
  created_at: string;
};

export type PanelContact = {
  full_name: string;
  title: string | null;
  phone: string | null;
  email: string | null;
};

export type PanelPartnerOption = {
  id: number;
  name: string;
  group: string;
  type: string;
  city: string;
};

export type PanelPartnerRequest = {
  id: number;
  business: PanelPartnerOption;
};

export type PanelDraft = {
  draftKey: string;
  group: string;
  cover: string;
  gallery: string[];
  documents: BusinessDocument[];
};

export type PanelQuote = {
  id: number;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  service: string | null;
  category_group: string | null;
  category_type: string | null;
  country: string | null;
  city: string | null;
  district: string | null;
  date_range: string | null;
  valid_until: string | null;
  people: number | null;
  message: string | null;
  status: string;
  created_at: string;
};

function PartnerPickerDialog({ partnerOptions }: { partnerOptions: PanelPartnerOption[] }) {
  const t = useTranslations("panel");
  const tc = useTranslations("cat");
  const ts = useTranslations("service");
  const serviceName = (value: string) => {
    const key = serviceTranslationKey(value);
    return key ? ts(key) : value;
  };
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("");
  const [city, setCity] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<PanelPartnerOption | null>(null);
  const [requestState, requestAction, requestPending] = useActionState(sendPartnerRequest, {
    status: "idle",
    partnerBusinessId: null,
  } satisfies PartnerRequestActionState);

  const groups = Array.from(new Set(partnerOptions.map((partner) => partner.group))).sort();
  const cities = Array.from(new Set(partnerOptions.map((partner) => partner.city).filter(Boolean))).sort((a, b) => a.localeCompare(b, "tr"));
  const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");
  const filteredPartners = partnerOptions.filter((partner) => {
    const matchesQuery = !normalizedQuery || [partner.name, partner.type, serviceName(partner.type), partner.city]
      .filter(Boolean)
      .some((value) => value.toLocaleLowerCase("tr-TR").includes(normalizedQuery));
    return matchesQuery && (!group || partner.group === group) && (!city || partner.city === city);
  });

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSelectedPartner(null);
      setQuery("");
      setGroup("");
      setCity("");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button type="button" disabled={partnerOptions.length === 0} className={styles.partnerAddButton}>
          <Plus size={16} aria-hidden />
          {t("partnerAdd")}
        </button>
      </DialogTrigger>
      <DialogContent
        title={selectedPartner ? t("partnerConfirmTitle") : t("partnerPickerTitle")}
        description={selectedPartner ? t("partnerConfirmSub", { name: selectedPartner.name }) : t("partnerPickerSub")}
        className={styles.partnerDialog}
      >
        {selectedPartner && requestState.status === "success" && requestState.partnerBusinessId === selectedPartner.id ? (
          <div className={styles.partnerResultState} role="status" aria-live="polite">
            <span className={styles.partnerSuccessIcon}><CheckCircle2 size={24} aria-hidden /></span>
            <div>
              <h3>{t("partnerSendSuccessTitle")}</h3>
              <p>{t("partnerSendSuccessSub", { name: selectedPartner.name })}</p>
            </div>
            <button type="button" onClick={() => handleOpenChange(false)} className={styles.compactPrimaryButton}>
              {t("partnerDone")}
            </button>
          </div>
        ) : selectedPartner ? (
          <div className={styles.partnerConfirm}>
            <div className={styles.partnerConfirmCard}>
              <span className={styles.partnerPickName}>{selectedPartner.name}</span>
              <span className={styles.partnerPickMeta}>
                {[tc(selectedPartner.group), serviceName(selectedPartner.type), selectedPartner.city].filter(Boolean).join(" · ")}
              </span>
            </div>
            <p>{t("partnerConfirmHint")}</p>
            <div className={styles.partnerDialogActions}>
              <button type="button" onClick={() => setSelectedPartner(null)} className={styles.compactSecondaryButton}>
                <ArrowLeft size={15} className="rtl:rotate-180" aria-hidden />
                {t("partnerBack")}
              </button>
              <form action={requestAction}>
                <input type="hidden" name="partnerBusinessId" value={selectedPartner.id} />
                <button type="submit" disabled={requestPending} className={styles.compactPrimaryButton}>
                  {requestPending && <LoaderCircle size={15} className="animate-spin" aria-hidden />}
                  {requestPending ? t("partnerSending") : t("partnerConfirmSend")}
                </button>
              </form>
            </div>
            {requestState.status === "error" && requestState.partnerBusinessId === selectedPartner.id && (
              <p className={styles.partnerSendError} role="alert">
                <AlertCircle size={16} aria-hidden />
                {requestState.reason === "exists" ? t("partnerAlreadyExists") : t("partnerSendError")}
              </p>
            )}
          </div>
        ) : (
          <div className={styles.partnerPicker}>
            <label className={styles.partnerSearch}>
              <Search size={17} aria-hidden />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("partnerSearchPlaceholder")}
                autoFocus
              />
            </label>
            <div className={styles.partnerFilters}>
              <select value={group} onChange={(event) => setGroup(event.target.value)} aria-label={t("partnerGroupFilter")}>
                <option value="">{t("partnerAllGroups")}</option>
                {groups.map((item) => <option key={item} value={item}>{tc(item)}</option>)}
              </select>
              <select value={city} onChange={(event) => setCity(event.target.value)} aria-label={t("partnerCityFilter")}>
                <option value="">{t("partnerAllCities")}</option>
                {cities.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <p className={styles.partnerResultCount}>{t("partnerResultCount", { count: filteredPartners.length })}</p>
            <div className={styles.partnerResultList}>
              {filteredPartners.map((partner) => (
                <button key={partner.id} type="button" onClick={() => setSelectedPartner(partner)} className={styles.partnerResultItem}>
                  <span className={styles.partnerPickName}>{partner.name}</span>
                  <span className={styles.partnerPickMeta}>{[tc(partner.group), serviceName(partner.type), partner.city].filter(Boolean).join(" · ")}</span>
                  <span className={styles.partnerResultAction}>{t("partnerSelect")}</span>
                </button>
              ))}
              {filteredPartners.length === 0 && <p className={styles.partnerNoResult}>{t("partnerNoResults")}</p>}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

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

function resolveInitialDraftKey(businessId: number | undefined, draft: PanelDraft | null) {
  if (businessId) return `business-${businessId}`;
  if (draft?.draftKey) return draft.draftKey;
  if (typeof window === "undefined") return "";
  const stored = window.localStorage.getItem("tp-panel-draft-key");
  const next = stored || crypto.randomUUID();
  if (!stored) window.localStorage.setItem("tp-panel-draft-key", next);
  return next;
}

const DashboardView = ({
  mode,
  business,
  quotes,
  userId,
  group,
  meta,
  draft,
  contacts,
  partnerOptions,
  acceptedPartners,
  incomingPartnerRequests,
  outgoingPartnerRequests,
  viewStats,
}: {
  mode: "overview" | "listings" | "edit";
  business: PanelBusiness | null;
  quotes: PanelQuote[];
  email: string;
  userId: string;
  group: string;
  meta: { firm_name: string; biz_type: string };
  draft: PanelDraft | null;
  contacts: PanelContact[];
  partnerOptions: PanelPartnerOption[];
  acceptedPartners: PanelPartnerOption[];
  incomingPartnerRequests: PanelPartnerRequest[];
  outgoingPartnerRequests: PanelPartnerRequest[];
  viewStats: PanelViewStats;
}) => {
  const t = useTranslations("panel");
  const tc = useTranslations("cat");
  const ts = useTranslations("service");
  const serviceName = (value: string) => {
    const key = serviceTranslationKey(value);
    return key ? ts(key) : value;
  };
  const locale = useLocale();
  const lang: "tr" | "en" = locale === "en" ? "en" : "tr";
  const [state, action, pending] = useActionState(saveMyBusiness, { ok: false });

  const b = business;
  const isAgency = group === "acente";
  const isGuide = group === "rehber";
  const bizType = b?.type ?? meta.biz_type ?? "";
  const dynFields = fieldsForGroup(group as GroupKey, bizType);
  const docFields = docsForGroup(group as GroupKey, bizType);
  const detailValues = b?.details ?? {};
  const statusKey = b?.status ?? "pending";
  const visibleStatusKey =
    statusKey === "active" ? "approved" : statusKey === "expired" || statusKey === "blacklisted" || statusKey === "suspended" ? "rejected" : statusKey;
  const isRestricted = statusKey === "expired" || statusKey === "blacklisted" || statusKey === "suspended" || statusKey === "rejected";

  const [draftKey, setDraftKey] = useState(() => resolveInitialDraftKey(b?.id, draft));
  const draftKeyRef = useRef<string>(draftKey);
  const [cover, setCover] = useState<string>(b?.image ?? draft?.cover ?? "");
  const [gallery, setGallery] = useState<string[]>(b?.images ?? draft?.gallery ?? []);
  const [documents, setDocuments] = useState<BusinessDocument[]>(b?.documents ?? draft?.documents ?? []);
  const [contactRows, setContactRows] = useState<PanelContact[]>(contacts ?? []);
  const [activeEditSection, setActiveEditSection] = useState<EditSection>("basic");

  const addContact = () =>
    setContactRows((rows) => (rows.length >= 10 ? rows : [...rows, { full_name: "", title: "", phone: "", email: "" }]));
  const removeContact = (index: number) => setContactRows((rows) => rows.filter((_, i) => i !== index));
  const updateContact = (index: number, key: keyof PanelContact, value: string) =>
    setContactRows((rows) => rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  const defaultCountry = b?.country || "Türkiye";
  const defaultCity = b?.city ?? "";
  const defaultDistrict = b?.district ?? "";
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [selectedCity, setSelectedCity] = useState(defaultCity);
  const [selectedDistrict, setSelectedDistrict] = useState(defaultDistrict);
  // Rehber çalışma bölgeleri (çoklu şehir) — details.work_regions'a virgülle yazılır.
  const [workRegions, setWorkRegions] = useState<string[]>(() =>
    String(detailValues.work_regions ?? "").split(",").map((s) => s.trim()).filter(Boolean),
  );
  const toggleWorkRegion = (city: string) =>
    setWorkRegions((prev) => (prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]));
  const [docKind, setDocKind] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState(false);
  const coverInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const docInput = useRef<HTMLInputElement>(null);

  const facets = visibleFacets([group as GroupKey]);
  const selectedAttrs = new Set(b?.attributes ?? []);
  const hasContactPerson = contactRows.some((contact) => contact.full_name.trim().length > 0);
  const hasPartnerAction =
    acceptedPartners.length > 0 || incomingPartnerRequests.length > 0 || outgoingPartnerRequests.length > 0;
  const scoredBusiness = b
    ? {
        ...b,
        contactCount: hasContactPerson ? 1 : 0,
        partnerActionCount: hasPartnerAction ? 1 : 0,
      }
    : null;
  const profileScore = getProfileScore(scoredBusiness, cover);
  const newQuoteCount = quotes.filter((quote) => quote.status === "new").length;
  const { countries: countryOptions, cities: cityOptions, districts: districtOptions } =
    useRegions(selectedCountry, selectedCity, selectedDistrict);
  const hasListingDashboard = !!b && (statusKey === "pending" || statusKey === "approved" || statusKey === "active");
  const showProfileForm = mode === "edit";
  const isOverview = mode === "overview";
  const isListingForm = showProfileForm || (!isOverview && !hasListingDashboard);
  const editListingHref: Href = b
    ? { pathname: "/dashboard/listings/[id]/edit", params: { id: String(b.id) } }
    : "/dashboard/listings/new";
  // Public /supplier/[id] yalnızca onaylı ilanları gösterir; sahip kendi ilanını
  // (pending dahil) gerçek görünümüyle ?preview=1 ile önizler (sayfa sahiplik doğrular).
  const previewHref: Href | null = b
    ? { pathname: "/supplier/[id]", params: { id: businessSlug(b) }, query: { preview: "1" } }
    : null;
  const editSections = [
    { key: "basic" as const, label: t("editTabBasic"), Icon: Building2, complete: Boolean((b?.name || meta.firm_name) && selectedCountry && selectedCity && selectedDistrict) },
    { key: "media" as const, label: t("editTabMedia"), Icon: Images, complete: Boolean(cover) },
    { key: "services" as const, label: t("editTabServices"), Icon: SlidersHorizontal, complete: selectedAttrs.size > 0 },
    { key: "partners" as const, label: t("editTabPartners"), Icon: Users, complete: hasPartnerAction },
    ...(dynFields.length > 0 ? [{ key: "company" as const, label: isGuide ? t("guideFieldsTitle") : t("editTabCompany"), Icon: BriefcaseBusiness, complete: dynFields.every((field) => Boolean(detailValues[field.key])) }] : []),
    ...(docFields.length > 0 ? [{ key: "documents" as const, label: t("editTabDocuments"), Icon: FileCheck2, complete: docFields.filter((field) => field.required).every((field) => documents.some((doc) => doc.kind === field.kind)) }] : []),
    { key: "contacts" as const, label: t("editTabContacts"), Icon: Users, complete: hasContactPerson },
  ];
  const completedEditSections = editSections.filter((section) => section.complete).length;

  useEffect(() => {
    if (!state.ok || typeof window === "undefined") return;
    window.localStorage.removeItem("tp-panel-draft-key");
  }, [state.ok]);

  function ensureDraftKey() {
    if (b?.id) return `business-${b.id}`;
    if (draftKeyRef.current) return draftKeyRef.current;
    if (draftKey) {
      draftKeyRef.current = draftKey;
      return draftKey;
    }
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("tp-panel-draft-key");
      const next = stored || crypto.randomUUID();
      if (!stored) window.localStorage.setItem("tp-panel-draft-key", next);
      draftKeyRef.current = next;
      setDraftKey(next);
      return next;
    }
    const next = crypto.randomUUID();
    draftKeyRef.current = next;
    return next;
  }

  async function persistDraft(nextCover: string, nextGallery: string[], nextDocuments: BusinessDocument[]) {
    if (b?.id) return;
    const key = ensureDraftKey();
    try {
      await upsertPanelDraftMedia(userId, key, group as BusinessGroup, {
        cover: nextCover,
        gallery: nextGallery,
        documents: nextDocuments,
      });
    } catch (error) {
      console.warn("draft save failed", error);
    }
  }

  async function uploadImage(file: File, folder: "cover" | "gallery"): Promise<string | null> {
    const supabase = createClient();
    const blob = await compressImage(file);
    const isJpeg = blob.type === "image/jpeg" || blob !== file;
    const ext = isJpeg ? "jpg" : file.name.split(".").pop()?.toLowerCase() || "jpg";
    const scope = b?.id ? `businesses/${b.id}-${businessSlug(b) || `business-${b.id}`}` : `drafts/${ensureDraftKey()}`;
    const path = `${userId}/${scope}/${folder}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(BUSINESS_IMAGES_BUCKET).upload(path, blob, {
      contentType: blob.type || "image/jpeg",
      upsert: false,
    });
    if (error) return null;
    return path;
  }

  async function uploadDocument(file: File, kind: string): Promise<BusinessDocument | null> {
    const supabase = createClient();
    const blob = await compressImage(file);
    const isJpeg = blob.type === "image/jpeg" || blob !== file;
    const ext = isJpeg ? "jpg" : file.name.split(".").pop()?.toLowerCase() || "bin";
    const scope = b?.id ? `businesses/${b.id}` : `drafts/${ensureDraftKey()}`;
    const path = `${userId}/${scope}/documents/${kind}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(BUSINESS_DOCUMENTS_BUCKET).upload(path, blob, {
      contentType: blob.type || file.type || "application/octet-stream",
      upsert: false,
    });
    if (error) return null;
    const signed = await supabase.storage.from(BUSINESS_DOCUMENTS_BUCKET).createSignedUrl(path, 60 * 60);
    if (signed.error || !signed.data?.signedUrl) return null;
    return { kind, name: file.name, path, url: signed.data.signedUrl };
  }

  async function onCoverPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadErr(false);
    const url = await uploadImage(file, "cover");
    setUploading(false);
    if (url) {
      setCover(url);
      void persistDraft(url, gallery, documents);
    }
    else setUploadErr(true);
    if (coverInput.current) coverInput.current.value = "";
  }

  async function onGalleryPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 12 - gallery.length);
    if (files.length === 0) return;
    setUploading(true);
    setUploadErr(false);
    const urls: string[] = [];
    for (const f of files) {
      const u = await uploadImage(f, "gallery");
      if (u) urls.push(u);
      else setUploadErr(true);
    }
    const next = [...gallery, ...urls].slice(0, 12);
    setGallery(next);
    void persistDraft(cover, next, documents);
    setUploading(false);
    if (galleryInput.current) galleryInput.current.value = "";
  }

  function pickDoc(kind: string) {
    setDocKind(kind);
    docInput.current?.click();
  }

  async function onDocPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !docKind) return;
    setUploading(true);
    setUploadErr(false);
    const uploaded = await uploadDocument(file, docKind);
    setUploading(false);
    if (uploaded) {
      const next = [...documents.filter((x) => x.kind !== docKind), uploaded];
      setDocuments(next);
      void persistDraft(cover, gallery, next);
    } else {
      setUploadErr(true);
    }
    setDocKind("");
    if (docInput.current) docInput.current.value = "";
  }

  return (
    <>
        <div className={styles.topbar}>
          <div className={styles.topbarInner}>
            <div className={styles.topbarText}>
              <h1 className={styles.title}>{isAgency ? t("agencyTitle") : t("supplierTitle")}</h1>
              <p className={styles.email}>
                {b?.name || meta.firm_name || (isAgency ? t("agencyMode") : isGuide ? t("guideMode") : t("supplierMode"))}
              </p>
            </div>
            <div className={styles.actions}>
              {b && (
                <Link href={previewHref!} target="_blank" className={styles.compactSecondaryButton}>
                  <Eye size={15} aria-hidden />
                  <span className="max-[680px]:hidden">{t("preview")}</span>
                </Link>
              )}
              {mode !== "edit" && (
                <Link href={editListingHref} className={styles.compactPrimaryButton}>
                  <PencilLine size={15} aria-hidden />
                  <span className="max-[680px]:hidden">{b ? t("editListing") : t("newListing")}</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className={styles.content}>

      {!isListingForm && !isOverview && (
      <section className={styles.hero} id="overview">
        <div>
          <span className={styles.eyebrow}><Sparkles size={13} aria-hidden />{t("overview")}</span>
          <h2 className={styles.heroTitle}>
            {isAgency ? t("agencyHero") : b ? t("panelReady") : t("panelSetup")}
          </h2>
          <p className={styles.heroText}>
            {isAgency ? t("agencyHeroSub") : b ? t("panelReadySub") : t("panelSetupSub")}
          </p>
          <div className={styles.quickActions}>
            <Link href="/quote" className={styles.compactPrimaryButton}>
              {isAgency ? t("createRequest") : t("viewRequests")}
            </Link>
            {hasListingDashboard ? (
              <Link href={editListingHref} className={styles.compactSecondaryButton}>
                {t("editListing")}
              </Link>
            ) : (
              <Link href={editListingHref} className={styles.compactSecondaryButton}>
                {isAgency ? t("completeCompany") : t("completeProfile")}
              </Link>
            )}
          </div>
        </div>
        <div className={styles.statusBox}>
          <span className={styles.statusLabel}>{t("statusLabel")}</span>
          <span className={cn(styles.statusBadge, styles.statusColors[visibleStatusKey])}>
            {t(`status_${visibleStatusKey}`)}
          </span>
          {b?.verified && <span className={styles.verified}>{t("verified")}</span>}
        </div>
      </section>
      )}

      {!isListingForm && !isOverview && (statusKey === "pending" || isRestricted) && (
        <section className={cn(styles.notice, isRestricted && styles.noticeDanger)}>
          <b>{statusKey === "pending" ? t("pendingNoticeTitle") : t("restrictedNoticeTitle")}</b>
          <span>{statusKey === "pending" ? t("pendingNoticeText") : t("restrictedNoticeText")}</span>
        </section>
      )}

      {!isListingForm && !isOverview && (
      <section className={styles.statsGrid}>
        <MetricCard label={t("profileScore")} value={`${profileScore}%`} detail={t("profileScoreSub")} />
        <MetricCard
          label={isAgency ? t("openRequests") : t("newQuotes")}
          value={isAgency ? 0 : newQuoteCount}
          detail={isAgency ? t("openRequestsSub") : t("quotesSub", { count: quotes.length })}
        />
        <MetricCard
          label={t("visibility")}
          value={t(`status_${visibleStatusKey}`)}
          detail={visibleStatusKey === "approved" ? t("visibilityPublic") : visibleStatusKey === "pending" ? t("visibilityPending") : t("visibilityRestricted")}
        />
      </section>
      )}

      <div className={cn(styles.grid, (isListingForm || isOverview) && styles.editGrid)}>
        <section className={cn(isOverview ? styles.overviewSection : isListingForm ? styles.editSection : styles.section)} id="profile">
          {isOverview ? (
            <OverviewDashboard
              business={scoredBusiness}
              cover={cover}
              statusKey={visibleStatusKey}
              profileScore={profileScore}
              newQuoteCount={newQuoteCount}
              editHref={editListingHref}
              viewStats={viewStats}
              quotes={quotes}
              isAgency={isAgency}
            />
          ) : hasListingDashboard && !showProfileForm && b ? (
            <ListingDashboard
              business={b}
              cover={cover}
              galleryCount={gallery.length}
              documentsCount={documents.length}
              profileScore={profileScore}
              statusKey={visibleStatusKey}
              editHref={editListingHref}
              previewHref={previewHref}
              businessTypeLabel={serviceName(b.type)}
              t={t}
            />
          ) : (
            <>
              <div className={styles.editIntro}>
                <div>
                  <span className={styles.editIntroEyebrow}>{t("listingDashboardTitle")}</span>
                  <h2 className={styles.sectionTitle}>{isAgency ? t("agencyProfileTitle") : t("editTitle")}</h2>
                  <p className={styles.sectionSub}>{isAgency ? t("agencyProfileSub") : t("editSub")}</p>
                </div>
                {hasListingDashboard && (
                  <Link href="/dashboard/listings" className={styles.compactSecondaryButton}>
                    {t("backToListingDashboard")}
                  </Link>
                )}
              </div>

              <form action={action} className={styles.form}>
            {b && <input type="hidden" name="id" value={b.id} />}
            <input type="hidden" name="draft_key" value={draftKey} />
            <input type="hidden" name="image" value={cover} />
            <input type="hidden" name="images" value={JSON.stringify(gallery)} />
            <input type="hidden" name="documents" value={JSON.stringify(documents)} />
            <input
              type="hidden"
              name="contacts"
              value={JSON.stringify(contactRows.filter((row) => row.full_name.trim()))}
            />

            <div className={styles.editProgress}>
              <div>
                <span>{t("profileScore")}</span>
                <strong>{profileScore}%</strong>
              </div>
              <div className={styles.editProgressTrack} aria-hidden>
                <i style={{ width: `${profileScore}%` }} />
              </div>
              <p>{t("sectionsComplete", { completed: completedEditSections, total: editSections.length })}</p>
            </div>

            <div className={styles.editTabs} role="tablist" aria-label={t("listingSections")}>
              {editSections.map(({ key, label, Icon, complete }) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={activeEditSection === key}
                  aria-controls={`listing-panel-${key}`}
                  onClick={() => setActiveEditSection(key)}
                  className={cn(styles.editTab, activeEditSection === key && styles.editTabActive)}
                >
                  <Icon size={16} aria-hidden />
                  <span>{label}</span>
                  {complete && <CheckCircle2 size={14} className={styles.editTabCheck} aria-label={t("complete")} />}
                </button>
              ))}
            </div>

            <div className={styles.editFormLayout}>
              <div className={styles.editFormMain}>

            <div id="listing-panel-media" role="tabpanel" className={cn(styles.formSection, activeEditSection !== "media" && styles.hiddenSection)}>
              <h3 className={styles.formSectionTitle}>{t("mediaSectionTitle")}</h3>
            <div className={styles.photoWrap}>
              <span className={styles.labelCls}>{t("photos")}</span>
              <div className={styles.photoList}>
                <button
                  type="button"
                  onClick={() => coverInput.current?.click()}
                  className={styles.photoBtn}
                >
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={businessImageUrl(cover) ?? ""} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="grid h-full place-items-center px-2 text-center">{t("addCover")}</span>
                  )}
                  <span className={styles.photoBadge}>{t("cover")}</span>
                </button>

                {gallery.map((url, i) => (
                  <div key={url} className={styles.photoItem}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={businessImageUrl(url) ?? ""} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        const next = gallery.filter((_, j) => j !== i);
                        setGallery(next);
                        void persistDraft(cover, next, documents);
                      }}
                      className={styles.photoDelete}
                      aria-label="Sil"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {gallery.length < 12 && (
                  <button
                    type="button"
                    onClick={() => galleryInput.current?.click()}
                    className={styles.photoAdd}
                  >
                    + {t("addPhoto")}
                  </button>
                )}
              </div>
              <input ref={coverInput} type="file" accept="image/*" hidden onChange={onCoverPick} />
              <input ref={galleryInput} type="file" accept="image/*" multiple hidden onChange={onGalleryPick} />
              {uploading && <span className="text-[12px] text-muted">{t("uploading")}</span>}
              {uploadErr && <span className="text-[12px] text-red-600">{t("uploadError")}</span>}
            </div>
            </div>

            <div id="listing-panel-basic" role="tabpanel" className={cn(styles.basicFormSection, activeEditSection !== "basic" && styles.hiddenSection)}>
              <h3 className={styles.formSectionTitle}>{t("basicInfoSectionTitle")}</h3>
            <label className={styles.labelCls}>
              {t("name")}
              <input name="name" required defaultValue={b?.name ?? meta.firm_name} className={styles.fieldCls} />
            </label>
            <div className={styles.labelCls}>
              <span>{t("servicesMultiLabel")}</span>
              <ServiceMultiSelect
                group={group as GroupKey}
                initialServices={b?.serviceTypes ?? []}
                initialType={b?.type ?? meta.biz_type ?? ""}
                className="mt-1.5"
              />
            </div>
            <div className="mt-2 grid gap-2">
              <h4 className="text-[13px] font-semibold text-muted">{t("addressSectionTitle")}</h4>
            </div>
            <div className={styles.threeCol}>
              <label className={styles.labelCls}>
                {t("country")}
                <select
                  name="country"
                  required
                  value={selectedCountry}
                  className={styles.fieldCls}
                  onChange={(event) => {
                    setSelectedCountry(event.target.value);
                    setSelectedCity("");
                    setSelectedDistrict("");
                  }}
                >
                  <option value="">{t("countryPlaceholder")}</option>
                  {countryOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
              <label className={styles.labelCls}>
                {t("city")}
                <select
                  name="city"
                  required
                  disabled={!selectedCountry}
                  value={selectedCity}
                  className={styles.fieldCls}
                  onChange={(event) => {
                    setSelectedCity(event.target.value);
                    setSelectedDistrict("");
                  }}
                >
                  <option value="">{selectedCountry ? t("cityPlaceholder") : t("countryFirst")}</option>
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </label>
              <label className={styles.labelCls}>
                {t("district")}
                <select
                  name="district"
                  required
                  disabled={!selectedCity}
                  value={selectedDistrict}
                  className={styles.fieldCls}
                  onChange={(event) => setSelectedDistrict(event.target.value)}
                >
                  <option value="">{selectedCity ? t("districtPlaceholder") : t("cityFirst")}</option>
                  {districtOptions.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </label>
            </div>

            {/* Rehber çalışma bölgeleri (Brief §2.7): birden çok şehir; acente araması eşleşir */}
            {isGuide && (
              <label className={styles.labelCls}>
                <span className={styles.dynLabelText}>
                  {t("workRegions")}
                  <span className={styles.dynHint}>· {t("workRegionsHint")}</span>
                </span>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {cityOptions.map((city) => {
                    const on = workRegions.includes(city);
                    return (
                      <button
                        type="button"
                        key={city}
                        aria-pressed={on}
                        onClick={() => toggleWorkRegion(city)}
                        className={
                          on
                            ? "rounded-pill border-[1.5px] border-terra bg-terra/10 px-3 py-1.5 text-[13px] font-semibold text-terra-deep"
                            : "rounded-pill border-[1.5px] border-line bg-paper px-3 py-1.5 text-[13px] font-medium text-ink transition-colors hover:border-terra/50"
                        }
                      >
                        {city}
                      </button>
                    );
                  })}
                </div>
                <input type="hidden" name="detail_work_regions" value={workRegions.join(",")} />
              </label>
            )}

            <div className={styles.twoCol}>
              <label className={styles.labelCls}>{t("phone")}<input name="phone" defaultValue={b?.phone ?? ""} className={styles.fieldCls} placeholder="+90…" /></label>
              <label className={styles.labelCls}>{t("website")}<input name="website" defaultValue={b?.website ?? ""} className={styles.fieldCls} placeholder="https://" /></label>
            </div>
            <span className={styles.labelCls}>{t("socialsTitle")}</span>
            <div className={styles.twoCol}>
              {SOCIAL_PLATFORMS.map((platform) => (
                <label key={platform} className={styles.labelCls}>
                  {SOCIAL_LABELS[platform]}
                  <input
                    name={`social_${platform}`}
                    type="url"
                    defaultValue={b?.socials?.[platform] ?? ""}
                    className={styles.fieldCls}
                    placeholder={SOCIAL_PLACEHOLDERS[platform]}
                  />
                </label>
              ))}
            </div>
            <label className={styles.labelCls}>
              {t("description")}
              <textarea name="description" rows={4} defaultValue={b?.description ?? ""} className={styles.textarea} />
            </label>
            </div>

            <div id="listing-panel-services" role="tabpanel" className={cn(styles.formSection, activeEditSection !== "services" && styles.hiddenSection)}>
              <h3 className={styles.formSectionTitle}>{t("servicesSectionTitle")}</h3>
            <div className={styles.checklist}>
              <span className={styles.labelCls}>{isAgency ? t("agencyServices") : t("services")}</span>
              {facets.map((f) => (
                <div key={f.key}>
                  <p className={styles.checkGroup}>{f.label}</p>
                  <div className={styles.checkList}>
                    {f.options.map((o) => (
                      <label key={o.slug} className={styles.checkLabel}>
                        <input type="checkbox" name="attr" value={o.slug} defaultChecked={selectedAttrs.has(o.slug)} className="accent-terra" />
                        {o.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            </div>

            <div id="listing-panel-partners" role="tabpanel" className={cn(styles.formSection, activeEditSection !== "partners" && styles.hiddenSection)}>
              <h3 className={styles.formSectionTitle}>{t("partnersTitle")}</h3>
              <div className={styles.dynBox}>
                <span className={styles.labelCls}>{t("partnersTitle")}</span>
                <p className={styles.sectionSub}>{t("partnersSub")}</p>

                {acceptedPartners.length > 0 && (
                  <div className={styles.partnerPickGrid}>
                    {acceptedPartners.map((partner) => (
                      <div key={partner.id} className={cn(styles.partnerPickItem, styles.partnerPickItemActive)}>
                        <span className={styles.partnerPickName}>{partner.name}</span>
                        <span className={styles.partnerPickMeta}>
                          {[t("partnerAccepted"), tc(partner.group), serviceName(partner.type), partner.city].filter(Boolean).join(" · ")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {incomingPartnerRequests.length > 0 && (
                  <div className={styles.partnerRequestList}>
                    <span className={styles.partnerRequestTitle}>{t("partnerIncomingTitle")}</span>
                    {incomingPartnerRequests.map((request) => (
                      <div key={request.id} className={styles.partnerRequestItem}>
                        <div className="min-w-0">
                          <span className={styles.partnerPickName}>{request.business.name}</span>
                          <span className={styles.partnerPickMeta}>
                            {[tc(request.business.group), serviceName(request.business.type), request.business.city].filter(Boolean).join(" · ")}
                          </span>
                        </div>
                        <div className={styles.partnerRequestActions}>
                          <button
                            type="submit"
                            formAction={respondPartnerRequest.bind(null, request.id, "accepted")}
                            className={styles.compactPrimaryButton}
                          >
                            {t("partnerAccept")}
                          </button>
                          <button
                            type="submit"
                            formAction={respondPartnerRequest.bind(null, request.id, "rejected")}
                            className={styles.compactSecondaryButton}
                          >
                            {t("partnerReject")}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {outgoingPartnerRequests.length > 0 && (
                  <div className={styles.partnerRequestList}>
                    <span className={styles.partnerRequestTitle}>{t("partnerOutgoingTitle")}</span>
                    {outgoingPartnerRequests.map((request) => (
                      <div key={request.id} className={styles.partnerRequestItem}>
                        <div className="min-w-0">
                          <span className={styles.partnerPickName}>{request.business.name}</span>
                          <span className={styles.partnerPickMeta}>
                            {[t("partnerPending"), tc(request.business.group), serviceName(request.business.type), request.business.city].filter(Boolean).join(" · ")}
                          </span>
                        </div>
                        <button
                          type="submit"
                          formAction={cancelPartnerRequest.bind(null, request.id)}
                          className={styles.compactSecondaryButton}
                        >
                          {t("partnerCancel")}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className={styles.partnerAddRow}>
                  <PartnerPickerDialog partnerOptions={partnerOptions} />
                  <span>{t("partnerAddHint")}</span>
                </div>
                {partnerOptions.length === 0 && <p className="mt-3 text-[13px] text-muted">{t("partnersEmpty")}</p>}
              </div>
            </div>

            {/* Kategori-bazlı dinamik alanlar (vergi no, ünvan, kapasite, rehber TCKN/sicil…) */}
            {dynFields.length > 0 && (
              <div id="listing-panel-company" role="tabpanel" className={cn(styles.formSection, activeEditSection !== "company" && styles.hiddenSection)}>
                <h3 className={styles.formSectionTitle}>{isGuide ? t("guideFieldsTitle") : t("companyFieldsTitle")}</h3>
              <div className={styles.dynBox}>
                <span className={styles.labelCls}>
                  {isGuide ? t("guideFieldsTitle") : t("companyFieldsTitle")}
                </span>
                <div className={styles.dynGrid}>
                  {dynFields.map((f) => {
                    const fieldError =
                      (f.key === "tckn" && state.error === "invalidTckn") ||
                      (f.key === "tax_no" && state.error === "invalidTaxNo");
                    return (
                    <label key={f.key} className={styles.labelCls}>
                      <span className={styles.dynLabelText}>
                        {f.label[lang]}
                        {f.hint && <span className={styles.dynHint}>· {f.hint[lang]}</span>}
                      </span>
                      {f.type === "select" ? (
                        <select
                          name={`detail_${f.key}`}
                          defaultValue={detailValues[f.key] ?? ""}
                          className={styles.fieldCls}
                        >
                          <option value="">{t("select")}</option>
                          {f.options?.map((o) => (
                            <option key={o.value} value={o.value}>{o.label[lang]}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          name={`detail_${f.key}`}
                          type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "tel" ? "tel" : "text"}
                          maxLength={f.maxLength}
                          defaultValue={detailValues[f.key] ?? ""}
                          placeholder={f.placeholder}
                          className={styles.fieldCls}
                          aria-invalid={fieldError || undefined}
                        />
                      )}
                      {fieldError && (
                        <span className={styles.error}>
                          {f.key === "tckn" ? t("invalidTckn") : t("invalidTaxNo")}
                        </span>
                      )}
                    </label>
                    );
                  })}
                </div>
              </div>
              </div>
            )}

            {/* Evrak yükleme — kategoriye göre zorunlu/opsiyonel belgeler */}
            {docFields.length > 0 && (
              <div id="listing-panel-documents" role="tabpanel" className={cn(styles.formSection, activeEditSection !== "documents" && styles.hiddenSection)}>
                <h3 className={styles.formSectionTitle}>{t("documentsTitle")}</h3>
              <div className={styles.dynBox}>
                <span className={styles.labelCls}>{t("documentsTitle")}</span>
                <p className={styles.sectionSub}>{t("documentsSub")}</p>
                <div className={styles.docList}>
                  {docFields.map((d) => {
                    const uploaded = documents.find((x) => x.kind === d.kind);
                    return (
                      <div key={d.kind} className={styles.docRow}>
                        <div className={styles.docInfo}>
                          <span className={styles.docLabel}>
                            {d.label[lang]}
                            {d.required && <em className={styles.docReq}> *</em>}
                          </span>
                          {uploaded?.url && (
                            <a href={uploaded.url} target="_blank" rel="noreferrer" className={styles.docFile}>
                              {uploaded.name}
                            </a>
                          )}
                        </div>
                        <div className={styles.docActions}>
                          <button type="button" onClick={() => pickDoc(d.kind)} className={styles.compactSecondaryButton}>
                            {uploaded ? t("docReplace") : t("docUpload")}
                          </button>
                          {uploaded && (
                            <button
                              type="button"
                              onClick={() => {
                                const next = documents.filter((x) => x.kind !== d.kind);
                                setDocuments(next);
                                void persistDraft(cover, gallery, next);
                              }}
                              className={styles.docDelete}
                              aria-label={t("docRemove")}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <input
                  ref={docInput}
                  type="file"
                  accept="image/*,application/pdf"
                  hidden
                  onChange={onDocPick}
                />
              </div>
              </div>
            )}

            {/* Yetkili kişiler — one-to-many; ASLA public profilde gösterilmez. */}
            <div id="listing-panel-contacts" role="tabpanel" className={cn(styles.formSection, activeEditSection !== "contacts" && styles.hiddenSection)}>
              <h3 className={styles.formSectionTitle}>{t("contactsTitle")}</h3>
              <div className={styles.dynBox}>
                <span className={styles.labelCls}>{t("contactsTitle")}</span>
                <p className={styles.sectionSub}>{t("contactsSub")}</p>
                <div className="grid gap-3">
                  {contactRows.length === 0 && (
                    <p className="text-[13px] text-muted">{t("contactsEmpty")}</p>
                  )}
                  {contactRows.map((row, i) => (
                    <div key={i} className="grid gap-2 rounded-[10px] border border-line bg-cream/40 p-3 md:grid-cols-[1.2fr_1fr_1fr_1.2fr_auto] md:items-end">
                      <label className={styles.labelCls}>
                        {t("contactName")}
                        <input
                          value={row.full_name}
                          onChange={(e) => updateContact(i, "full_name", e.target.value)}
                          maxLength={160}
                          className={styles.fieldCls}
                        />
                      </label>
                      <label className={styles.labelCls}>
                        {t("contactTitle")}
                        <input
                          value={row.title ?? ""}
                          onChange={(e) => updateContact(i, "title", e.target.value)}
                          maxLength={120}
                          className={styles.fieldCls}
                        />
                      </label>
                      <label className={styles.labelCls}>
                        {t("contactPhone")}
                        <input
                          value={row.phone ?? ""}
                          onChange={(e) => updateContact(i, "phone", e.target.value)}
                          maxLength={40}
                          placeholder="+90…"
                          className={styles.fieldCls}
                        />
                      </label>
                      <label className={styles.labelCls}>
                        {t("contactEmail")}
                        <input
                          type="email"
                          value={row.email ?? ""}
                          onChange={(e) => updateContact(i, "email", e.target.value)}
                          maxLength={200}
                          className={styles.fieldCls}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => removeContact(i)}
                        className={styles.compactSecondaryButton}
                        aria-label={t("contactRemove")}
                      >
                        {t("contactRemove")}
                      </button>
                    </div>
                  ))}
                </div>
                {contactRows.length < 10 && (
                  <button type="button" onClick={addContact} className={`mt-2 w-fit ${styles.compactSecondaryButton}`}>
                    + {t("contactAdd")}
                  </button>
                )}
              </div>
            </div>

              </div>

              <aside className={styles.publishChecklist} aria-label={t("publishChecklist")}>
                <div className={styles.publishChecklistHead}>
                  <span>{t("publishChecklist")}</span>
                  <strong>{completedEditSections}/{editSections.length}</strong>
                </div>
                <p>{t("formProgressHint")}</p>
                <p>{t("founderBadgeRequirement")}</p>
                <div className={styles.publishChecklistItems}>
                  {editSections.map(({ key, label, complete }) => (
                    <button key={key} type="button" onClick={() => setActiveEditSection(key)}>
                      {complete ? <CheckCircle2 size={16} aria-hidden /> : <AlertCircle size={16} aria-hidden />}
                      <span>{label}</span>
                      <small>{complete ? t("complete") : t("incomplete")}</small>
                    </button>
                  ))}
                </div>
                {previewHref && (
                  <Link href={previewHref} target="_blank" className={styles.compactSecondaryButton}>
                    <Eye size={15} aria-hidden />
                    {t("preview")}
                  </Link>
                )}
              </aside>
            </div>

            {state.ok && <p className={styles.success}>{t("saved")}</p>}
            {state.error && state.error !== "invalidTckn" && state.error !== "invalidTaxNo" && (
              <p className={styles.error}>{state.error === "invalidRegion" ? t("invalidRegion") : t("error")}</p>
            )}

            <div className={styles.formActions}>
              {hasListingDashboard && (
                <Link href="/dashboard/listings" className={styles.secondaryButton}>
                  {t("cancel")}
                </Link>
              )}
              <button type="submit" disabled={pending || uploading} className={`${styles.primaryButton} disabled:opacity-60`}>
                {pending ? t("saving") : t("save")}
              </button>
            </div>
              </form>
            </>
          )}
        </section>

        {!isListingForm && !isOverview && (
        <aside className={styles.sideStack}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{isAgency ? t("agencyWorkTitle") : t("supplierWorkTitle")}</h2>
            <p className={styles.sectionSub}>{isAgency ? t("agencyWorkSub") : t("supplierWorkSub")}</p>
            <div className={styles.workflowList}>
              {(isAgency ? ["agencyStep1", "agencyStep2", "agencyStep3"] : ["supplierStep1", "supplierStep2", "supplierStep3"]).map((key) => (
                <div key={key} className={styles.workflowItem}>
                  <span />
                  <p>{t(key)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t("visibilityTitle")}</h2>
            <p className={styles.sectionSub}>{t("visibilitySub")}</p>
            <div className={styles.membershipBox}>
              <span>{t("visibility")}</span>
              <b>{t(`status_${visibleStatusKey}`)}</b>
              <small>{visibleStatusKey === "approved" ? t("visibilityPublic") : visibleStatusKey === "pending" ? t("visibilityPending") : t("visibilityRestricted")}</small>
            </div>
          </section>

          <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{isAgency ? t("agencyRequestsTitle") : t("quotesTitle")}</h2>
          <p className={styles.sectionSub}>{isAgency ? t("agencyRequestsSub") : t("quotesSub", { count: quotes.length })}</p>

          {isAgency ? (
            <div className={styles.requestBoard}>
              <p className={styles.emptyQuotes}>{t("noAgencyRequests")}</p>
              <Link href="/quote" className={styles.compactPrimaryButton}>
                {t("createRequest")}
              </Link>
            </div>
          ) : quotes.length === 0 ? (
            <p className={styles.emptyQuotes}>{t("noQuotes")}</p>
          ) : (
            <ul className={styles.quoteList}>
              {quotes.map((q) => (
                <li key={q.id} className={styles.quoteItem}>
                  <div className={styles.quoteHead}>
                    <span className={styles.quoteName}>{q.name}</span>
                    <span className={styles.quoteDate}>{new Date(q.created_at).toLocaleDateString("tr-TR")}</span>
                  </div>
                  <p className={styles.quoteMeta}>
                    {q.company ? `${q.company} · ` : ""}
                    <a href={`mailto:${q.email}`} className="text-terra hover:underline">{q.email}</a>
                    {q.phone ? ` · ${q.phone}` : ""}
                  </p>
                  <p className={styles.quoteSvc}>
                    {[q.service, q.date_range, q.people ? `${q.people} ${t("people")}` : null].filter(Boolean).join(" · ")}
                  </p>
                  {q.valid_until && (
                    <p className={styles.quoteDeadline}>
                      {t("quoteValidUntil")}: {new Date(`${q.valid_until}T12:00:00`).toLocaleDateString("tr-TR")}
                    </p>
                  )}
                  <p className={styles.quoteSvc}>
                    {[q.category_type ? serviceName(q.category_type) : null, q.country, q.city, q.district].filter(Boolean).join(" · ")}
                  </p>
                  {q.message && <p className={styles.quoteMsg}>{q.message}</p>}
                  <a href={`mailto:${q.email}?subject=${encodeURIComponent(t("replySubject"))}`} className={`mt-2.5 ${styles.compactSecondaryButton}`}>
                    {t("reply")}
                  </a>
                </li>
              ))}
            </ul>
          )}
          </section>
        </aside>
        )}
      </div>
        </div>
    </>
  );
};

const MetricCard = ({ label, value, detail }: { label: string; value: string | number; detail: string }) => (
  <div className={styles.metricCard}>
    <span>{label}</span>
    <strong>{value}</strong>
    <small>{detail}</small>
  </div>
);

const ListingDashboard = ({
  business,
  cover,
  galleryCount,
  documentsCount,
  profileScore,
  statusKey,
  editHref,
  previewHref,
  businessTypeLabel,
  t,
}: {
  business: PanelBusiness;
  cover: string;
  galleryCount: number;
  documentsCount: number;
  profileScore: number;
  statusKey: "pending" | "approved" | "rejected";
  editHref: Href;
  previewHref: Href | null;
  businessTypeLabel: string;
  t: ReturnType<typeof useTranslations>;
}) => (
  <div className={styles.listingDashboard}>
    <div className={styles.listingHead}>
      <div>
        <h2 className={styles.sectionTitle}>{t("listingDashboardTitle")}</h2>
        <p className={styles.sectionSub}>
          {statusKey === "pending" ? t("listingDashboardPendingSub") : t("listingDashboardLiveSub")}
        </p>
      </div>
      <span className={cn(styles.statusBadge, styles.statusColors[statusKey])}>
        {t(`status_${statusKey}`)}
      </span>
    </div>

    <div className={styles.listingSummary}>
      <div className={styles.listingCover}>
        {businessImageUrl(cover) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={businessImageUrl(cover) ?? ""} alt="" className="h-full w-full object-cover" />
        ) : (
          <span><ImagePlus size={22} aria-hidden />{t("addCover")}</span>
        )}
      </div>
      <div className={styles.listingInfo}>
        <span className={styles.eyebrow}>{t("listingIdentity")}</span>
        <h3>{business.name}</h3>
        <p>{businessTypeLabel} · {business.district}, {business.city} · {business.country}</p>
        <div className={styles.listingMetrics}>
          <div className={styles.listingProgress}>
            <span>{t("profileScore")}</span>
            <strong>{profileScore}%</strong>
            <i><i style={{ width: `${profileScore}%` }} /></i>
          </div>
          <div className={styles.listingMetric}><span>{t("listingGallery")}</span><strong>{galleryCount}</strong></div>
          <div className={styles.listingMetric}><span>{t("listingDocuments")}</span><strong>{documentsCount}</strong></div>
        </div>
        <div className={styles.listingActions}>
          <Link href={editHref} className={styles.compactPrimaryButton}>
            <PencilLine size={15} aria-hidden />
            {t("editListing")}
          </Link>
          {previewHref && (
            <Link href={previewHref} target="_blank" className={styles.compactSecondaryButton}>
              <Eye size={15} aria-hidden />
              {t("preview")}
            </Link>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default DashboardView;
