import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "./supabase/public";

/* Statik sayfa meta override'ı — admin `/admin/icerik`'ten content_pages'e yazar,
   statik sayfalar (home/explore/blog) buradan okur. Kayıt yoksa/taslaksa null →
   sayfa kod içindeki varsayılan meta'ya düşer. Slug sabitleri: PAGE_SLUGS. */
export const PAGE_SLUGS = { home: "home", explore: "explore", blog: "blog" } as const;

export type PageSeo = {
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[];
  canonicalPath: string | null;
  ogImage: string | null;
};

const hasEnv = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Yayınlanmış content_pages kaydından SEO override'ı; yoksa null. */
export async function getPageSeo(locale: string, slug: string): Promise<PageSeo | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("content_pages");
  if (!hasEnv()) return null;

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("content_pages")
    .select("seo_title, seo_description, seo_keywords, canonical_path, og_image, status")
    .eq("locale", locale)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data || data.status !== "published") return null;
  return {
    seoTitle: data.seo_title,
    seoDescription: data.seo_description,
    seoKeywords: data.seo_keywords ?? [],
    canonicalPath: data.canonical_path,
    ogImage: data.og_image,
  };
}
