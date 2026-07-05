import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "./supabase/public";
import { sanitizePublicHtml } from "./sanitize-public-html";

/* Blog veri erişim katmanı (public/SEO). Yayınlanan yazıları çerezsiz anon client ile
   okur; 'use cache' + 'blog' tag'i ile cache'lenir (admin mutasyonu revalidateTag ile tazeler).
   RLS: "blog posts public read" (status = 'published') — bkz. admin_backoffice_schema.sql. */

export type BlogPost = {
  slug: string;
  locale: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  category: string | null;
  coverImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
};

type Row = {
  slug: string;
  locale: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  category: string | null;
  cover_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
};

const COLS =
  "slug,locale,title,excerpt,body,category,cover_image,seo_title,seo_description,published_at" as const;

const hasEnv = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function toPost(r: Row): BlogPost {
  return {
    slug: r.slug,
    locale: r.locale,
    title: r.title,
    excerpt: r.excerpt,
    body: sanitizePublicHtml(r.body),
    category: r.category,
    coverImage: r.cover_image,
    seoTitle: r.seo_title,
    seoDescription: r.seo_description,
    publishedAt: r.published_at,
  };
}

export async function getPublishedPosts(locale: string): Promise<BlogPost[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("blog");
  if (!hasEnv()) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(COLS)
    .eq("status", "published")
    .eq("locale", locale)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(100);
  if (error || !data) return [];
  return (data as Row[]).map(toPost);
}

export async function getPostBySlug(locale: string, slug: string): Promise<BlogPost | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("blog");
  if (!hasEnv()) return null;
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(COLS)
    .eq("status", "published")
    .eq("locale", locale)
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return toPost(data as Row);
}
