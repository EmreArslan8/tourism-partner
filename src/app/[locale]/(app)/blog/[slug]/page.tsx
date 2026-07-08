import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPostBySlug } from "@/lib/blog";
import { localeAlternates } from "@/lib/seo";
import type { SiteLocale } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(locale, slug);
  if (!post) return { title: "Tourism Partner" };

  const title = post.seoTitle || `${post.title} · Tourism Partner`;
  const description = post.seoDescription || post.excerpt || post.title;
  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: localeAlternates(locale as SiteLocale, { pathname: "/blog/[slug]", params: { slug } }),
    openGraph: {
      title,
      description,
      type: "article",
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [t, post] = await Promise.all([getTranslations("blog"), getPostBySlug(locale, slug)]);
  if (!post) notFound();

  const dateLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(locale === "en" ? "en-US" : "tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="container-px mx-auto w-full max-w-[760px] py-12 max-[640px]:py-8">
      <Link href={{ pathname: "/blog" }} className="mb-6 inline-flex items-center gap-1 text-[13px] font-semibold text-muted transition-colors hover:text-terra-deep">
        ‹ {t("back")}
      </Link>

      <article>
        <header className="mb-6">
          {post.category && (
            <span className="mb-3 inline-flex rounded-pill bg-terra/10 px-2.5 py-1 text-[11.5px] font-bold uppercase tracking-[.06em] text-terra-deep">
              {post.category}
            </span>
          )}
          <h1 className="text-[34px] font-extrabold leading-tight tracking-tight text-ink max-[640px]:text-[26px]">
            {post.title}
          </h1>
          {dateLabel && <p className="mt-3 text-[13.5px] font-medium text-muted">{dateLabel}</p>}
        </header>

        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.title}
            className="mb-8 aspect-[16/9] w-full rounded-[16px] object-cover"
          />
        )}

        {/* Body is sanitized in the data layer before it reaches this public render path. */}
        {post.body && (
          <div
            className="prose-tp text-[16px] leading-[1.8] text-ink/90 [&_a]:text-terra [&_a]:underline [&_h2]:mt-8 [&_h2]:text-[22px] [&_h2]:font-extrabold [&_h3]:mt-6 [&_h3]:text-[18px] [&_h3]:font-bold [&_img]:my-4 [&_img]:rounded-[12px] [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        )}
      </article>
    </main>
  );
}
