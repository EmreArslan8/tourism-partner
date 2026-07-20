"use client";

import { useActionState, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ImagePlus, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { BUSINESS_IMAGES_BUCKET } from "@/lib/business-images";
import { businessSlug } from "@/lib/business-slug";
import { setBusinessCover } from "@/lib/actions/onboarding";
import { cn } from "@/lib/utils";
import Button from "@/components/common/Button";

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

const OnboardingCover = ({
  userId,
  businessId,
  businessName,
}: {
  userId: string;
  businessId: number;
  businessName: string;
}) => {
  const t = useTranslations("onboarding");
  const [state, action, pending] = useActionState(setBusinessCover, { ok: false });
  const [preview, setPreview] = useState<string>("");
  const [path, setPath] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onPick(file: File) {
    setUploadErr(false);
    setUploading(true);
    try {
      const supabase = createClient();
      const blob = await compressImage(file);
      const slug = businessSlug({ name: businessName }) || `business-${businessId}`;
      const storagePath = `${userId}/businesses/${businessId}-${slug}/cover/${crypto.randomUUID()}.jpg`;
      const { error } = await supabase.storage.from(BUSINESS_IMAGES_BUCKET).upload(storagePath, blob, {
        contentType: blob.type || "image/jpeg",
        upsert: false,
      });
      if (error) {
        setUploadErr(true);
        return;
      }
      setPath(storagePath);
      setPreview(URL.createObjectURL(blob));
    } catch {
      setUploadErr(true);
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-cream px-5 py-10">
      <div className="w-full max-w-[560px]">
        <p className="text-[13px] font-bold uppercase tracking-[.08em] text-terra">{t("businessLabel")}: {businessName}</p>
        <h1 className="mt-2 text-[26px] font-extrabold leading-tight tracking-tight text-ink lg:text-[30px]">{t("title")}</h1>
        <p className="mt-2 text-[14.5px] font-medium leading-relaxed text-ink/75">{t("sub")}</p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "group mt-6 grid aspect-[16/9] w-full place-items-center overflow-hidden rounded-[16px] border-2 border-dashed transition-colors",
            preview ? "border-terra/40" : "border-line hover:border-terra/55 hover:bg-terra/[.03]",
          )}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="grid place-items-center gap-2 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-terra/10 text-terra">
                {uploading ? <Loader2 size={26} className="animate-spin" aria-hidden /> : <ImagePlus size={26} aria-hidden />}
              </span>
              <span className="text-[14px] font-bold text-ink">{uploading ? t("uploading") : t("pick")}</span>
              <span className="text-[12.5px] font-medium text-ink/55">{t("hint")}</span>
            </span>
          )}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onPick(file);
            e.target.value = "";
          }}
        />

        {preview && !uploading && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-brand hover:underline"
          >
            <ImagePlus size={15} aria-hidden />
            {t("change")}
          </button>
        )}

        {uploadErr && <p className="mt-3 text-[13px] font-semibold text-red-600">{t("error")}</p>}
        {state.error && <p className="mt-3 text-[13px] font-semibold text-red-600">{t("error")}</p>}

        <form action={action} className="mt-6">
          <input type="hidden" name="path" value={path} />
          <input type="hidden" name="businessId" value={businessId} />
          <Button type="submit" loading={pending} disabled={!path || uploading} className="w-full">
            <span className="inline-flex items-center gap-2">
              {path && <CheckCircle2 size={17} aria-hidden />}
              {t("finish")}
            </span>
          </Button>
        </form>
      </div>
    </main>
  );
};

export default OnboardingCover;
