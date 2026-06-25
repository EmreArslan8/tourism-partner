"use client";

import { useActionState, useRef, useState } from "react";
import { useTranslations } from "next-intl"
import { signOut } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { visibleFacets } from "@/lib/facets";
import { businessSlug } from "@/lib/business-slug";
import { cn } from "@/lib/utils";
import type { GroupKey } from "@/lib/types";
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

const BUCKET = "business-images";

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

const DashboardView = ({
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
}) => {
  const t = useTranslations("panel");
  const [state, action, pending] = useActionState(saveMyBusiness, { ok: false });

  const b = business;
  const statusKey = b?.status ?? "pending";

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
    <main className={styles.main}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.email}>{email}</p>
        </div>
        <div className={styles.actions}>
          {b && (
            <a href={`/supplier/${businessSlug(b)}`} target="_blank" className="btn btn-outline btn-sm">
              {t("preview")}
            </a>
          )}
          <form action={signOut}>
            <button type="submit" className="btn btn-outline btn-sm">{t("signOut")}</button>
          </form>
        </div>
      </div>

      <div className={styles.statusStrip}>
        <span className={styles.statusLabel}>{t("statusLabel")}:</span>
        <span className={cn(styles.statusBadge, styles.statusColors[statusKey])}>
          {t(`status_${statusKey}`)}
        </span>
        {b?.verified && <span className={styles.verified}>✓ {t("verified")}</span>}
        {statusKey === "pending" && <span className={styles.pendingHint}>— {t("pendingHint")}</span>}
      </div>

      <div className={styles.grid}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("editTitle")}</h2>
          <p className={styles.sectionSub}>{t("editSub")}</p>

          <form action={action} className={styles.form}>
            {b && <input type="hidden" name="id" value={b.id} />}
            <input type="hidden" name="image" value={cover} />
            <input type="hidden" name="images" value={JSON.stringify(gallery)} />

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
                    <img src={cover} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="grid h-full place-items-center px-2 text-center">{t("addCover")}</span>
                  )}
                  <span className={styles.photoBadge}>{t("cover")}</span>
                </button>

                {gallery.map((url, i) => (
                  <div key={url} className={styles.photoItem}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setGallery((g) => g.filter((_, j) => j !== i))}
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

            <label className={styles.labelCls}>
              {t("name")}
              <input name="name" required defaultValue={b?.name ?? meta.firm_name} className={styles.fieldCls} />
            </label>
            <label className={styles.labelCls}>
              {t("type")}
              <input name="type" defaultValue={b?.type ?? meta.biz_type} className={styles.fieldCls} />
            </label>
            <div className={styles.threeCol}>
              <label className={styles.labelCls}>{t("country")}<input name="country" defaultValue={b?.country ?? ""} className={styles.fieldCls} /></label>
              <label className={styles.labelCls}>{t("city")}<input name="city" defaultValue={b?.city ?? ""} className={styles.fieldCls} /></label>
              <label className={styles.labelCls}>{t("district")}<input name="district" defaultValue={b?.district ?? ""} className={styles.fieldCls} /></label>
            </div>
            <div className={styles.twoCol}>
              <label className={styles.labelCls}>{t("phone")}<input name="phone" defaultValue={b?.phone ?? ""} className={styles.fieldCls} placeholder="+90…" /></label>
              <label className={styles.labelCls}>{t("website")}<input name="website" defaultValue={b?.website ?? ""} className={styles.fieldCls} placeholder="https://" /></label>
            </div>
            <label className={styles.labelCls}>
              {t("description")}
              <textarea name="description" rows={4} defaultValue={b?.description ?? ""} className={styles.textarea} />
            </label>

            <div className={styles.checklist}>
              <span className={styles.labelCls}>{t("services")}</span>
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

            {state.ok && <p className={styles.success}>{t("saved")}</p>}
            {state.error && <p className={styles.error}>{t("error")}</p>}

            <button type="submit" disabled={pending || uploading} className="btn btn-solid mt-1 self-start disabled:opacity-60">
              {pending ? t("saving") : t("save")}
            </button>
          </form>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("quotesTitle")}</h2>
          <p className={styles.sectionSub}>{t("quotesSub", { count: quotes.length })}</p>

          {quotes.length === 0 ? (
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
                  </p>
                  <p className={styles.quoteSvc}>
                    {[q.service, q.date_range, q.people ? `${q.people} ${t("people")}` : null].filter(Boolean).join(" · ")}
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
      </div>
    </main>
  );
};

export default DashboardView;