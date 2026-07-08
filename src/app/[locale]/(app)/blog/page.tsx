import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPublishedPosts } from "@/lib/blog";
import { localeAlternates } from "@/lib/seo";
import type { SiteLocale } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: { index: true, follow: true },
    alternates: localeAlternates(locale as SiteLocale, "/blog"),
  };
}

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, posts] = await Promise.all([
    getTranslations("blog"),
    getPublishedPosts(locale),
  ]);

  return (
    <main className="container-px mx-auto w-full max-w-[1080px] py-12 max-[640px]:py-8">
      <header className="mb-8 max-w-[680px]">
        <p className="eyebrow mb-2 text-terra-deep">{t("eyebrow")}</p>
        <h1 className="heading-section text-ink">{t("title")}</h1>
        <p className="body-muted mt-2">{t("subtitle")}</p>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-[16px] border border-dashed border-line bg-paper px-6 py-16 text-center">
          <p className="text-[15px] font-semibold text-ink">{t("emptyTitle")}</p>
          <p className="mt-1.5 text-[14px] text-muted">{t("emptyText")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
              className="group flex flex-col overflow-hidden rounded-[16px] border border-line bg-paper shadow-[0_18px_54px_-48px_rgba(7,9,42,.7)] transition-all hover:-translate-y-0.5 hover:border-terra/40"
            >
              <div className="aspect-[16/10] overflow-hidden bg-cream-deep">
                {post.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                ) : (
                  <div className="grid h-full place-items-center bg-[linear-gradient(135deg,rgba(15,59,176,.14),rgba(10,36,114,.08))] text-[13px] font-semibold text-terra-deep/60">
                    Tourism Partner
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                {post.category && (
                  <span className="mb-2 inline-flex w-fit rounded-pill bg-terra/10 px-2.5 py-1 text-[11.5px] font-bold uppercase tracking-[.06em] text-terra-deep">
                    {post.category}
                  </span>
                )}
                <h2 className="text-[16.5px] font-extrabold leading-snug text-ink group-hover:text-terra-deep">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-1.5 line-clamp-3 text-[13.5px] leading-6 text-muted">{post.excerpt}</p>
                )}
                <span className="mt-auto pt-3 text-[13px] font-bold text-terra">{t("readMore")} ›</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
