"use client";

import { useActionState, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { saveMyBusiness } from "@/lib/actions/panel";
import { signOut } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { visibleFacets } from "@/lib/facets";
import { businessSlug } from "@/lib/business-slug";
import type { GroupKey } from "@/lib/types";

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
  status: "pending" | "approved" | "rejected";
  verified: boolean;
  sponsored: boolean;
  created_at: string;
};

export type PanelQuote = {
  id: number;
  name: string;
  company: string | null;
  email: string;
  service: string | null;
  date_range: string | null;
  people: number | null;
  message: string | null;
  status: string;
  created_at: string;
};

const fieldCls = "field h-[44px] font-normal";
const labelCls = "flex flex-col gap-1 text-[12.5px] font-semibold text-muted";
const BUCKET = "business-images";

/* Yüklemeden önce istemcide küçült + sıkıştır (storage + egress tasarrufu).
   Maks. 1600px kenar, JPEG ~0.82. Raster olmayan/okunamayan dosyada orijinali döner. */
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

export default function PanelClient({
  business,
  quotes,
  email,
  userId,
  group,
  meta,
}: {
  business: PanelBusiness | null;
  quotes: PanelQuote[];
  email: string;
  userId: string;
  group: string;
  meta: { firm_name: string; biz_type: string };
}) {
  const t = useTranslations("panel");
  const [state, action, pending] = useActionState(saveMyBusiness, { ok: false });

  const b = business;
  const statusKey = b?.status ?? "pending";

  // Foto durumları
  const [cover, setCover] = useState<string>(b?.image ?? "");
  const [gallery, setGallery] = useState<string[]>(b?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState(false);
  const coverInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);

  const facets = visibleFacets([group as GroupKey]);
  const selectedAttrs = new Set(b?.attributes ?? []);

  async function upload(file: File): Promise<string | null> {
    const supabase = createClient();
    const blob = await compressImage(file);
    const isJpeg = blob.type === "image/jpeg" || blob !== file;
    const ext = isJpeg ? "jpg" : file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
      contentType: blob.type || "image/jpeg",
      upsert: false,
    });
    if (error) return null;
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }

  async function onCoverPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadErr(false);
    const url = await upload(file);
    setUploading(false);
    if (url) setCover(url);
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
      const u = await upload(f);
      if (u) urls.push(u);
      else setUploadErr(true);
    }
    setGallery((g) => [...g, ...urls].slice(0, 12));
    setUploading(false);
    if (galleryInput.current) galleryInput.current.value = "";
  }

  return (
    <main className="container-px mx-auto w-full max-w-[1080px] pb-16 pt-[104px]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[28px]">{t("title")}</h1>
          <p className="mt-1 text-[13.5px] text-muted">{email}</p>
        </div>
        <div className="flex items-center gap-2">
          {b && (
            <a href={`/tedarikci/${businessSlug(b)}`} target="_blank" className="btn btn-outline btn-sm">
              {t("preview")}
            </a>
          )}
          <form action={signOut}>
            <button type="submit" className="btn btn-outline btn-sm">{t("signOut")}</button>
          </form>
        </div>
      </div>

      {/* Durum şeridi */}
      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-[14px] border border-line bg-cream px-5 py-3.5 text-[13.5px]">
        <span className="font-semibold">{t("statusLabel")}:</span>
        <span
          className={
            "rounded-pill px-2.5 py-0.5 text-[12px] font-bold " +
            (statusKey === "approved"
              ? "bg-group-acente/15 text-group-acente"
              : statusKey === "rejected"
                ? "bg-red-100 text-red-700"
                : "bg-gold/15 text-[#9a7b00]")
          }
        >
          {t(`status_${statusKey}`)}
        </span>
        {b?.verified && <span className="font-semibold text-group-acente">✓ {t("verified")}</span>}
        {statusKey === "pending" && <span className="text-muted">— {t("pendingHint")}</span>}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,400px)] items-start gap-7 max-[860px]:grid-cols-1">
        {/* İlan düzenleme */}
        <section className="rounded-[16px] border border-line bg-paper p-6 shadow-card">
          <h2 className="mb-1 text-[20px]">{t("editTitle")}</h2>
          <p className="mb-4 text-[13px] text-muted">{t("editSub")}</p>

          <form action={action} className="flex flex-col gap-4">
            {b && <input type="hidden" name="id" value={b.id} />}
            <input type="hidden" name="image" value={cover} />
            <input type="hidden" name="images" value={JSON.stringify(gallery)} />

            {/* Fotoğraflar */}
            <div className="flex flex-col gap-2">
              <span className="text-[12.5px] font-semibold text-muted">{t("photos")}</span>
              <div className="flex flex-wrap gap-2.5">
                {/* Kapak */}
                <button
                  type="button"
                  onClick={() => coverInput.current?.click()}
                  className="relative h-[88px] w-[120px] overflow-hidden rounded-[10px] border border-line bg-cream text-[11px] text-muted hover:border-terra"
                >
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="grid h-full place-items-center px-2 text-center">{t("addCover")}</span>
                  )}
                  <span className="absolute bottom-0 left-0 right-0 bg-ink/55 py-0.5 text-center text-[10px] font-semibold text-white">
                    {t("cover")}
                  </span>
                </button>

                {/* Galeri küçük resimleri */}
                {gallery.map((url, i) => (
                  <div key={url} className="relative h-[88px] w-[120px] overflow-hidden rounded-[10px] border border-line">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setGallery((g) => g.filter((_, j) => j !== i))}
                      className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-ink/70 text-[12px] font-bold text-white hover:bg-red-600"
                      aria-label="Sil"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* Galeri ekle */}
                {gallery.length < 12 && (
                  <button
                    type="button"
                    onClick={() => galleryInput.current?.click()}
                    className="grid h-[88px] w-[120px] place-items-center rounded-[10px] border border-dashed border-line bg-cream text-[12px] text-muted hover:border-terra"
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

            <label className={labelCls}>
              {t("name")}
              <input name="name" required defaultValue={b?.name ?? meta.firm_name} className={fieldCls} />
            </label>
            <label className={labelCls}>
              {t("type")}
              <input name="type" defaultValue={b?.type ?? meta.biz_type} className={fieldCls} />
            </label>
            <div className="grid grid-cols-3 gap-3 max-[480px]:grid-cols-1">
              <label className={labelCls}>{t("country")}<input name="country" defaultValue={b?.country ?? ""} className={fieldCls} /></label>
              <label className={labelCls}>{t("city")}<input name="city" defaultValue={b?.city ?? ""} className={fieldCls} /></label>
              <label className={labelCls}>{t("district")}<input name="district" defaultValue={b?.district ?? ""} className={fieldCls} /></label>
            </div>
            <div className="grid grid-cols-2 gap-3 max-[480px]:grid-cols-1">
              <label className={labelCls}>{t("phone")}<input name="phone" defaultValue={b?.phone ?? ""} className={fieldCls} placeholder="+90…" /></label>
              <label className={labelCls}>{t("website")}<input name="website" defaultValue={b?.website ?? ""} className={fieldCls} placeholder="https://" /></label>
            </div>
            <label className={labelCls}>
              {t("description")}
              <textarea name="description" rows={4} defaultValue={b?.description ?? ""} className="field min-h-[96px] py-2.5 font-normal" />
            </label>

            {/* Hizmet / özellik checklist */}
            <div className="flex flex-col gap-3">
              <span className="text-[12.5px] font-semibold text-muted">{t("services")}</span>
              {facets.map((f) => (
                <div key={f.key}>
                  <p className="mb-1 text-[12px] font-semibold text-ink/70">{f.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {f.options.map((o) => (
                      <label
                        key={o.slug}
                        className="flex cursor-pointer items-center gap-1.5 rounded-pill border border-line px-2.5 py-1 text-[12.5px] has-[:checked]:border-terra has-[:checked]:bg-terra/10"
                      >
                        <input type="checkbox" name="attr" value={o.slug} defaultChecked={selectedAttrs.has(o.slug)} className="accent-terra" />
                        {o.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {state.ok && <p className="text-[13px] font-medium text-group-acente">{t("saved")}</p>}
            {state.error && <p className="text-[13px] font-medium text-red-600">{t("error")}</p>}

            <button type="submit" disabled={pending || uploading} className="btn btn-solid mt-1 self-start disabled:opacity-60">
              {pending ? t("saving") : t("save")}
            </button>
          </form>
        </section>

        {/* Gelen teklifler */}
        <section className="rounded-[16px] border border-line bg-paper p-6 shadow-card">
          <h2 className="mb-1 text-[20px]">{t("quotesTitle")}</h2>
          <p className="mb-4 text-[13px] text-muted">{t("quotesSub", { count: quotes.length })}</p>

          {quotes.length === 0 ? (
            <p className="rounded-[12px] border border-dashed border-line bg-cream px-4 py-6 text-center text-[13.5px] text-muted">
              {t("noQuotes")}
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {quotes.map((q) => (
                <li key={q.id} className="rounded-[12px] border border-line p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[14px] font-semibold">{q.name}</span>
                    <span className="text-[11.5px] text-muted">{new Date(q.created_at).toLocaleDateString("tr-TR")}</span>
                  </div>
                  <p className="mt-0.5 text-[12.5px] text-muted">
                    {q.company ? `${q.company} · ` : ""}
                    <a href={`mailto:${q.email}`} className="text-terra hover:underline">{q.email}</a>
                  </p>
                  <p className="mt-1.5 text-[12.5px]">
                    {[q.service, q.date_range, q.people ? `${q.people} ${t("people")}` : null].filter(Boolean).join(" · ")}
                  </p>
                  {q.message && <p className="mt-1.5 text-[13px] text-ink/80">{q.message}</p>}
                  <a href={`mailto:${q.email}?subject=${encodeURIComponent(t("replySubject"))}`} className="btn btn-outline btn-sm mt-2.5">
                    {t("reply")}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
