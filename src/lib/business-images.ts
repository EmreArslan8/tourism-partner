export const BUSINESS_IMAGES_BUCKET = "business-images";

const PUBLIC_OBJECT_MARKER = `/storage/v1/object/public/${BUSINESS_IMAGES_BUCKET}/`;
const PUBLIC_RENDER_MARKER = `/storage/v1/render/image/public/${BUSINESS_IMAGES_BUCKET}/`;

export function storagePathFromBusinessImage(value?: string | null): string | null {
  const raw = value?.trim();
  if (!raw) return null;
  if (raw.startsWith("/assets/") || raw.startsWith("/") || raw.includes("..") || raw.includes("\\")) return null;
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    const marker = raw.includes(PUBLIC_RENDER_MARKER) ? PUBLIC_RENDER_MARKER : PUBLIC_OBJECT_MARKER;
    if (!raw.includes(marker)) return null;
    const path = raw.split(marker)[1]?.split("?")[0];
    return path ? decodeURIComponent(path) : null;
  }
  return raw;
}

export function businessImageUrl(value?: string | null): string | null {
  const raw = value?.trim();
  if (!raw) return null;
  if (raw.startsWith("/assets/")) return raw;
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return storagePathFromBusinessImage(raw) ? raw : null;
  }
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  const path = storagePathFromBusinessImage(raw);
  return path ? `${base}/storage/v1/object/public/${BUSINESS_IMAGES_BUCKET}/${encodeURI(path)}` : null;
}

export function isRealBusinessImage(src?: string | null): src is string {
  const value = src?.trim();
  if (!value) return false;
  return Boolean(businessImageUrl(value));
}

export function realBusinessImages(image?: string | null, images: string[] = []): string[] {
  return Array.from(new Set([image, ...images].map(businessImageUrl).filter((src): src is string => Boolean(src))));
}

export function realBusinessGalleryImages(cover?: string | null, images: string[] = []): string[] {
  const coverUrl = businessImageUrl(cover);
  return Array.from(
    new Set(
      images
        .map(businessImageUrl)
        .filter((src): src is string => Boolean(src) && src !== coverUrl)
    )
  );
}
