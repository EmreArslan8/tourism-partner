"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl"
import { Building2, Eye, FileText, LayoutDashboard, LogOut, PencilLine, Search, Sparkles } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { visibleFacets } from "@/lib/facets";
import { businessSlug } from "@/lib/business-slug";
import { cn } from "@/lib/utils";
import { getCityOptions, getCountryOptions, getDistrictOptions } from "@/lib/regions";
import type { GroupKey, BusinessDocument } from "@/lib/types";
import type { BusinessGroup } from "@/lib/supabase/database.types";
import { fieldsForGroup, docsForGroup } from "@/lib/business-fields";
import { BUSINESS_DOCUMENTS_BUCKET } from "@/lib/business-document-shape";
import { businessImageUrl, BUSINESS_IMAGES_BUCKET } from "@/lib/business-images";
import { upsertPanelDraftMedia } from "@/lib/business-drafts";
import styles from "./styles";
import { saveMyBusiness } from "@/lib/actions/panel";

export type PanelBusiness = {
  id: number;
  group: string;
  type: string;
  name: string;
  country: string;
  city: string;
  district: string;
  description: string | null;
  phone: string | null;
  website: string | null;
  image: string | null;
  images: string[] | null;
  attributes: string[] | null;
  details: Record<string, string> | null;
  documents: BusinessDocument[] | null;
  status: "pending" | "approved" | "rejected" | "active" | "expired" | "blacklisted" | "suspended";
  verified: boolean;
  sponsored: boolean;
  created_at: string;
};

export type PanelMembership = {
  id: number;
  plan: string;
  status: "trial" | "active" | "expired" | "cancelled";
  starts_at: string;
  ends_at: string;
};

export type PanelContact = {
  full_name: string;
  title: string | null;
  phone: string | null;
  email: string | null;
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
  people: number | null;
  message: string | null;
  status: string;
  created_at: string;
};

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
  membership,
  email,
  userId,
  group,
  meta,
  draft,
  contacts,
}: {
  mode: "overview" | "listings" | "edit";
  business: PanelBusiness | null;
  quotes: PanelQuote[];
  membership: PanelMembership | null;
  email: string;
  userId: string;
  group: string;
  meta: { firm_name: string; biz_type: string };
  draft: PanelDraft | null;
  contacts: PanelContact[];
}) => {
  const t = useTranslations("panel");
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

  const addContact = () =>
    setContactRows((rows) => (rows.length >= 10 ? rows : [...rows, { full_name: "", title: "", phone: "", email: "" }]));
  const removeContact = (index: number) => setContactRows((rows) => rows.filter((_, i) => i !== index));
  const updateContact = (index: number, key: keyof PanelContact, value: string) =>
    setContactRows((rows) => rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  const countryOptions = getCountryOptions();
  const defaultCountry = countryOptions.includes(b?.country ?? "") ? b?.country ?? "" : "Türkiye";
  const defaultCityOptions = getCityOptions(defaultCountry);
  const defaultCity = defaultCityOptions.includes(b?.city ?? "") ? b?.city ?? "" : "";
  const defaultDistrictOptions = getDistrictOptions(defaultCountry, defaultCity);
  const defaultDistrict = defaultDistrictOptions.includes(b?.district ?? "") ? b?.district ?? "" : "";
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
  const profileScore = getProfileScore(b, cover);
  const newQuoteCount = quotes.filter((quote) => quote.status === "new").length;
  const membershipDays = membership ? daysUntil(membership.ends_at) : null;
  const cityOptions = getCityOptions(selectedCountry);
  const districtOptions = getDistrictOptions(selectedCountry, selectedCity);
  const hasListingDashboard = !!b && (statusKey === "pending" || statusKey === "approved" || statusKey === "active");
  const showProfileForm = mode === "edit";
  const isOverview = mode === "overview";
  const localizedPanel = locale === "tr" ? "/tr/panel" : "/en/dashboard";
  const localizedListings = locale === "tr" ? "/tr/panel/ilanlar" : "/en/dashboard/listings";
  const localizedNewListing = locale === "tr" ? "/tr/panel/ilanlar/yeni" : "/en/dashboard/listings/new";
  const localizedEditListing = b
    ? locale === "tr"
      ? `/tr/panel/ilanlar/${b.id}/duzenle`
      : `/en/dashboard/listings/${b.id}/edit`
    : localizedNewListing;
  const localizedExplore = locale === "tr" ? "/tr/kesfet" : "/en/explore";
  const localizedQuote = locale === "tr" ? "/tr/teklif" : "/en/quote";
  const localizedRequests = locale === "tr" ? "/tr/panel/talepler" : "/en/dashboard/requests";
  const localizedHome = locale === "tr" ? "/tr" : "/en";

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
    const scope = b?.id ? `business-${b.id}` : `drafts/${ensureDraftKey()}`;
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
    <main className={styles.main}>
      <aside className={styles.sidebar}>
        <a href={localizedHome} className={styles.brandMark} aria-label="Tourism Partner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.svg" alt="Tourism Partner" className={styles.logoImg} />
        </a>

        <nav className={styles.sideNav} aria-label="Partner dashboard">
          <a href={localizedPanel} className={mode === "overview" ? styles.sideNavActive : undefined}>
            <LayoutDashboard size={17} aria-hidden />
            {t("overview")}
          </a>
          <a href={localizedListings} className={mode === "listings" ? styles.sideNavActive : undefined}>
            <Building2 size={17} aria-hidden />
            {t("listingDashboardTitle")}
          </a>
          <a href={localizedRequests}>
            <FileText size={17} aria-hidden />
            Talep &amp; Teklif
          </a>
          <a href={localizedExplore}>
            <Search size={17} aria-hidden />
            {t("searchSuppliers")}
          </a>
        </nav>

        <div className={styles.sidebarFoot}>
          <span>{t("signedInAs")}</span>
          <b>{email}</b>
        </div>
      </aside>

      <section className={styles.workspace}>
        <div className={styles.topbar}>
          <div>
            <h1 className={styles.title}>{isAgency ? t("agencyTitle") : t("supplierTitle")}</h1>
            <p className={styles.email}>
              {b?.name || meta.firm_name || email} · {isAgency ? t("agencyMode") : isGuide ? t("guideMode") : t("supplierMode")}
            </p>
          </div>
          <div className={styles.actions}>
            {b && (
              <a href={`/${locale === "tr" ? "tr/tedarikci" : "en/supplier"}/${businessSlug(b)}`} target="_blank" className="btn btn-outline btn-sm">
                <Eye size={15} aria-hidden />
                {t("preview")}
              </a>
            )}
            {mode !== "edit" && (
              <a href={localizedEditListing} className="btn btn-solid btn-sm">
                <PencilLine size={15} aria-hidden />
                {b ? t("editListing") : t("newListing")}
              </a>
            )}
            <form action={signOut}>
              <button type="submit" className="btn btn-outline btn-sm">
                <LogOut size={15} aria-hidden />
                {t("signOut")}
              </button>
            </form>
          </div>
        </div>

        <div className={styles.content}>

      {!showProfileForm && !isOverview && (
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
            <a href={localizedQuote} className="btn btn-solid btn-sm">
              {isAgency ? t("createRequest") : t("viewRequests")}
            </a>
            {hasListingDashboard ? (
              <a href={localizedEditListing} className="btn btn-outline btn-sm">
                {t("editListing")}
              </a>
            ) : (
              <a href={localizedEditListing} className="btn btn-outline btn-sm">
                {isAgency ? t("completeCompany") : t("completeProfile")}
              </a>
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

      {!showProfileForm && !isOverview && (statusKey === "pending" || isRestricted) && (
        <section className={cn(styles.notice, isRestricted && styles.noticeDanger)}>
          <b>{statusKey === "pending" ? t("pendingNoticeTitle") : t("restrictedNoticeTitle")}</b>
          <span>{statusKey === "pending" ? t("pendingNoticeText") : t("restrictedNoticeText")}</span>
        </section>
      )}

      {!showProfileForm && !isOverview && (
      <section className={styles.statsGrid}>
        <MetricCard label={t("profileScore")} value={`${profileScore}%`} detail={t("profileScoreSub")} />
        <MetricCard
          label={isAgency ? t("openRequests") : t("newQuotes")}
          value={isAgency ? 0 : newQuoteCount}
          detail={isAgency ? t("openRequestsSub") : t("quotesSub", { count: quotes.length })}
        />
        <MetricCard
          label={t("membership")}
          value={membership ? t(`membership_${membership.status}`) : t("membership_none")}
          detail={membershipDays === null ? t("membershipNoDate") : membershipDays < 0 ? t("membershipExpired") : t("membershipDays", { count: membershipDays })}
        />
      </section>
      )}

      <div className={cn(styles.grid, (showProfileForm || isOverview) && styles.editGrid)}>
        <section className={cn(isOverview ? styles.overviewSection : styles.section, showProfileForm && styles.editSection)} id="profile">
          {isOverview ? (
            <OverviewDashboard
              business={b}
              cover={cover}
              statusKey={visibleStatusKey}
              profileScore={profileScore}
              newQuoteCount={newQuoteCount}
              membership={membership}
              membershipDetail={
                membershipDays === null
                  ? t("membershipNoDate")
                  : membershipDays < 0
                    ? t("membershipExpired")
                    : t("membershipDays", { count: membershipDays })
              }
              listingsHref={localizedListings}
              editHref={localizedEditListing}
              quoteHref={localizedQuote}
              t={t}
            />
          ) : hasListingDashboard && !showProfileForm && b ? (
            <ListingDashboard
              business={b}
              cover={cover}
              galleryCount={gallery.length}
              documentsCount={documents.length}
              profileScore={profileScore}
              statusKey={visibleStatusKey}
              membership={membership}
              editHref={localizedEditListing}
              previewHref={`/${locale === "tr" ? "tr/tedarikci" : "en/supplier"}/${businessSlug(b)}`}
              t={t}
            />
          ) : (
            <>
              <div className={styles.editIntro}>
                <div>
                  <h2 className={styles.sectionTitle}>{isAgency ? t("agencyProfileTitle") : t("editTitle")}</h2>
                  <p className={styles.sectionSub}>{isAgency ? t("agencyProfileSub") : t("editSub")}</p>
                </div>
                {hasListingDashboard && (
                  <a href={localizedListings} className="btn btn-outline btn-sm">
                    {t("backToListingDashboard")}
                  </a>
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

            <div className={styles.formSection}>
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

            <div className={styles.formSection}>
              <h3 className={styles.formSectionTitle}>{t("basicInfoSectionTitle")}</h3>
            <label className={styles.labelCls}>
              {t("name")}
              <input name="name" required defaultValue={b?.name ?? meta.firm_name} className={styles.fieldCls} />
            </label>
            <label className={styles.labelCls}>
              {t("type")}
              <input name="type" defaultValue={b?.type ?? meta.biz_type} className={styles.fieldCls} />
            </label>
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
                  {countryOptions.map((country) => (
                    <option key={country} value={country}>{country}</option>
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
                {t("workRegions")}
                <span className={styles.dynHint}> · {t("workRegionsHint")}</span>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {getCityOptions(selectedCountry).map((city) => {
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
                            : "rounded-pill border-[1.5px] border-line bg-white px-3 py-1.5 text-[13px] font-medium text-ink transition-colors hover:border-terra/50"
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
            <label className={styles.labelCls}>
              {t("description")}
              <textarea name="description" rows={4} defaultValue={b?.description ?? ""} className={styles.textarea} />
            </label>
            </div>

            <div className={styles.formSection}>
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

            {/* Kategori-bazlı dinamik alanlar (vergi no, ünvan, kapasite, rehber TCKN/sicil…) */}
            {dynFields.length > 0 && (
              <div className={styles.formSection}>
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
                      {f.label[lang]}
                      {f.hint && <span className={styles.dynHint}> · {f.hint[lang]}</span>}
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
              <div className={styles.formSection}>
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
                          <button type="button" onClick={() => pickDoc(d.kind)} className="btn btn-outline btn-sm">
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
            <div className={styles.formSection}>
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
                        className="btn btn-outline btn-sm"
                        aria-label={t("contactRemove")}
                      >
                        {t("contactRemove")}
                      </button>
                    </div>
                  ))}
                </div>
                {contactRows.length < 10 && (
                  <button type="button" onClick={addContact} className="btn btn-outline btn-sm mt-2 w-fit">
                    + {t("contactAdd")}
                  </button>
                )}
              </div>
            </div>

            {state.ok && <p className={styles.success}>{t("saved")}</p>}
            {state.error && state.error !== "invalidTckn" && state.error !== "invalidTaxNo" && (
              <p className={styles.error}>{state.error === "invalidRegion" ? t("invalidRegion") : t("error")}</p>
            )}

            <div className={styles.formActions}>
              {hasListingDashboard && (
                <a href={localizedListings} className="btn btn-outline">
                  {t("cancel")}
                </a>
              )}
              <button type="submit" disabled={pending || uploading} className="btn btn-solid disabled:opacity-60">
                {pending ? t("saving") : t("save")}
              </button>
            </div>
              </form>
            </>
          )}
        </section>

        {!showProfileForm && !isOverview && (
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
            <h2 className={styles.sectionTitle}>{t("membershipTitle")}</h2>
            <p className={styles.sectionSub}>{t("membershipSub")}</p>
            <div className={styles.membershipBox}>
              <span>{membership ? membership.plan : t("membership_none")}</span>
              <b>{membership ? t(`membership_${membership.status}`) : "-"}</b>
              <small>
                {membership
                  ? `${new Date(membership.ends_at).toLocaleDateString("tr-TR")} ${t("membershipEnd")}`
                  : t("membershipNoDate")}
              </small>
            </div>
          </section>

          <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{isAgency ? t("agencyRequestsTitle") : t("quotesTitle")}</h2>
          <p className={styles.sectionSub}>{isAgency ? t("agencyRequestsSub") : t("quotesSub", { count: quotes.length })}</p>

          {isAgency ? (
            <div className={styles.requestBoard}>
              <p className={styles.emptyQuotes}>{t("noAgencyRequests")}</p>
              <a href={localizedQuote} className="btn btn-solid btn-sm">
                {t("createRequest")}
              </a>
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
                  <p className={styles.quoteSvc}>
                    {[q.category_type, q.country, q.city, q.district].filter(Boolean).join(" · ")}
                  </p>
                  {q.message && <p className={styles.quoteMsg}>{q.message}</p>}
                  <a href={`mailto:${q.email}?subject=${encodeURIComponent(t("replySubject"))}`} className="btn btn-outline btn-sm mt-2.5">
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
      </section>
    </main>
  );
};

const MetricCard = ({ label, value, detail }: { label: string; value: string | number; detail: string }) => (
  <div className={styles.metricCard}>
    <span>{label}</span>
    <strong>{value}</strong>
    <small>{detail}</small>
  </div>
);

const OverviewDashboard = ({
  business,
  cover,
  statusKey,
  profileScore,
  newQuoteCount,
  membership,
  membershipDetail,
  listingsHref,
  editHref,
  quoteHref,
  t,
}: {
  business: PanelBusiness | null;
  cover: string;
  statusKey: "pending" | "approved" | "rejected";
  profileScore: number;
  newQuoteCount: number;
  membership: PanelMembership | null;
  membershipDetail: string;
  listingsHref: string;
  editHref: string;
  quoteHref: string;
  t: ReturnType<typeof useTranslations>;
}) => (
  <div className={styles.overviewStack}>
    <section className={styles.overviewHero}>
      <div>
        <span className={styles.eyebrow}>{t("overview")}</span>
        <h2>{business ? t("panelReady") : t("panelSetup")}</h2>
        <p>{business ? t("panelReadySub") : t("panelSetupSub")}</p>
      </div>
      <div className={styles.overviewStatus}>
        <span>{t("statusLabel")}</span>
        <b className={cn(styles.statusBadge, styles.statusColors[statusKey])}>{t(`status_${statusKey}`)}</b>
      </div>
    </section>

    <div className={styles.overviewGrid}>
      <article className={styles.overviewListingCard}>
        <div className={styles.overviewCover}>
          <SafeCoverImage src={cover} fallback={t("addCover")} />
        </div>
        <div className={styles.overviewListingBody}>
          <span className={styles.homeCardHead}>{t("listingDashboardTitle")}</span>
          <h3>{business?.name || t("panelSetup")}</h3>
          <p>
            {business
              ? [business.type, business.city, business.country].filter(Boolean).join(" · ")
              : t("panelSetupSub")}
          </p>
          <div className={styles.overviewProgress}>
            <span>{t("profileScore")}</span>
            <b>{profileScore}%</b>
          </div>
          <div className={styles.listingActions}>
            <a href={listingsHref} className="btn btn-solid btn-sm">{t("listingDashboardTitle")}</a>
            <a href={editHref} className="btn btn-outline btn-sm">{business ? t("editListing") : t("newListing")}</a>
          </div>
        </div>
      </article>

      <aside className={styles.overviewSide}>
        <article className={styles.homeCard}>
          <div className={styles.homeCardHead}>
            <span>{t("quotesTitle")}</span>
          </div>
          <strong className={styles.homeNumber}>{newQuoteCount}</strong>
          <p>{t("quotesSub", { count: newQuoteCount })}</p>
          <a href={quoteHref} className="btn btn-outline btn-sm">{t("viewRequests")}</a>
        </article>

        <article className={styles.homeCard}>
          <div className={styles.homeCardHead}>
            <span>{t("membershipTitle")}</span>
          </div>
          <strong className={styles.homeNumber}>{membership ? t(`membership_${membership.status}`) : t("membership_none")}</strong>
          <p>{membershipDetail}</p>
        </article>
      </aside>
    </div>
  </div>
);

const SafeCoverImage = ({ src, fallback }: { src: string; fallback: string }) => {
  const [failed, setFailed] = useState(false);
  const url = businessImageUrl(src);
  if (!url || failed) return <span>{fallback}</span>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="" className="h-full w-full object-cover" onError={() => setFailed(true)} />
  );
};

const ListingDashboard = ({
  business,
  cover,
  galleryCount,
  documentsCount,
  profileScore,
  statusKey,
  membership,
  editHref,
  previewHref,
  t,
}: {
  business: PanelBusiness;
  cover: string;
  galleryCount: number;
  documentsCount: number;
  profileScore: number;
  statusKey: "pending" | "approved" | "rejected";
  membership: PanelMembership | null;
  editHref: string;
  previewHref: string;
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
          <span>{t("addCover")}</span>
        )}
      </div>
      <div className={styles.listingInfo}>
        <span className={styles.eyebrow}>{t("listingIdentity")}</span>
        <h3>{business.name}</h3>
        <p>{business.type} · {business.district}, {business.city} · {business.country}</p>
        <div className={styles.listingChips}>
          <span>{profileScore}% {t("profileScore")}</span>
          <span>{galleryCount} {t("listingGallery")}</span>
          <span>{documentsCount} {t("listingDocuments")}</span>
          <span>{membership ? t(`membership_${membership.status}`) : t("membership_none")}</span>
        </div>
      </div>
    </div>

    <div className={styles.listingNext}>
      <b>{statusKey === "pending" ? t("listingNextPendingTitle") : t("listingNextLiveTitle")}</b>
      <span>{statusKey === "pending" ? t("listingNextPendingText") : t("listingNextLiveText")}</span>
    </div>

    <div className={styles.listingActions}>
      <a href={editHref} className="btn btn-solid btn-sm">
        {t("editListing")}
      </a>
      <a href={previewHref} target="_blank" className="btn btn-outline btn-sm">
        {t("preview")}
      </a>
    </div>
  </div>
);

function getProfileScore(b: PanelBusiness | null, cover: string) {
  const checks = [
    b?.name,
    b?.type,
    b?.country,
    b?.city,
    b?.district,
    b?.description,
    b?.phone,
    b?.website,
    cover,
    b?.attributes?.length,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function daysUntil(value: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return Math.ceil((date.getTime() - today.getTime()) / 86_400_000);
}

export default DashboardView;
