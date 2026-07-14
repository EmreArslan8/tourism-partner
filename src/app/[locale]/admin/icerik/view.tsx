import { ArrowLeft, ExternalLink, FileText, Megaphone, Newspaper } from "lucide-react";
import { Link, type Href } from "@/i18n/navigation";
import { PageHeader, panel } from "../_components";
import { adminUi } from "../_ui";
import styles from "./styles";
import { Field, ConfirmAction, EmptyState, StatusBadge } from "@/components/common";
import { cn } from "@/lib/utils";
import { saveContentPage } from "@/lib/actions/admin";
import { savePopup, deletePopup, saveBlogPost, deleteBlogPost } from "@/lib/actions/platform";
import type { AdminPopupRow, BlogPostRow } from "@/lib/supabase/database.types";
import type { ContentPage } from "@/lib/types";

export type ContentTab = "pages" | "blog" | "popups";

interface Props {
  pages: ContentPage[];
  blogPosts: BlogPostRow[];
  popups: AdminPopupRow[];
  locale: string;
  tab: ContentTab;
  edit: string;
  statusFilter: string;
}

const AdminContentView = ({ pages, blogPosts, popups, locale, tab, edit, statusFilter }: Props) => {
  const tabs: Array<{ value: ContentTab; label: string; count: number }> = [
    { value: "pages", label: "Sayfalar", count: pages.length },
    { value: "blog", label: "Blog", count: blogPosts.length },
    { value: "popups", label: "Pop-up'lar", count: popups.length },
  ];
  const newLabel = tab === "pages" ? "+ Yeni Sayfa" : tab === "blog" ? "+ Yeni Yazı" : "+ Yeni Pop-up";

  return (
    <>
      <PageHeader
        eyebrow="İçerik"
        title="İçerik Yönetimi"
        description="Sayfa içerikleri, blog yayınları ve platform içi pop-up kampanyalarını yönetin."
        action={
          <Link href={{ pathname: "/admin/icerik", query: { tab, edit: "new" } }} className={adminUi.sapphireButton}>
            {newLabel}
          </Link>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <Link
            key={t.value}
            href={{ pathname: "/admin/icerik", query: t.value === "pages" ? {} : { tab: t.value } }}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-full border px-4 text-[13px] font-medium transition-colors",
              t.value === tab
                ? "border-sapphire bg-sapphire text-paper"
                : "border-line bg-paper text-brand hover:bg-cream",
            )}
          >
            {t.label}
            <span className={cn("rounded-full px-1.5 text-[11.5px] font-bold", t.value === tab ? "bg-paper/20" : "bg-cream")}>
              {t.count}
            </span>
          </Link>
        ))}
      </div>

      {tab === "pages" && <PagesTab pages={pages} locale={locale} edit={edit} />}
      {tab === "blog" && <BlogTab posts={blogPosts} locale={locale} edit={edit} statusFilter={statusFilter} />}
      {tab === "popups" && <PopupsTab popups={popups} locale={locale} edit={edit} />}
    </>
  );
};

/* ==================== SAYFALAR ==================== */

const PagesTab = ({ pages, locale, edit }: { pages: ContentPage[]; locale: string; edit: string }) => {
  const selected = edit !== "new" ? pages.find((p) => String(p.id) === edit) : undefined;
  const editorOpen = edit === "new" || Boolean(selected);

  const list = (
    <section className={panel}>
      <div className="mb-4">
        <h2 className={styles.sectionTitle}>Kayıtlı sayfalar</h2>
        <p className={styles.sectionSub}>Yayın/taslak durumu, SEO doluluğu ve son güncelleme.</p>
      </div>
      {pages.length === 0 ? (
        <EmptyState icon={<FileText size={20} aria-hidden />} title="Henüz içerik sayfası yok" description="Yeni Sayfa ile ilk kaydı oluşturun." />
      ) : (
        <div className="grid gap-2">
          {pages.map((page) => {
            const fill = seoFill(page);
            const active = selected?.id === page.id;
            return (
              <Link
                key={page.id}
                href={{ pathname: "/admin/icerik", query: { tab: "pages", edit: String(page.id) } }}
                className={cn(
                  "rounded-[8px] border px-3 py-2.5 transition-colors",
                  active ? "border-sapphire bg-cream/70" : "border-line/80 bg-cream/40 hover:border-sapphire/50 hover:bg-cream/60",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-[14px] font-extrabold text-ink">{page.title}</span>
                    <StatusBadge tone="blue">{page.locale}</StatusBadge>
                    <StatusBadge tone={page.status === "published" ? "green" : page.status === "archived" ? "red" : "amber"}>
                      {STATUS_LABEL[page.status] ?? page.status}
                    </StatusBadge>
                  </div>
                  <span className="text-[12px] font-semibold text-muted">{fmtDate(page.updatedAt)}</span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-[11.5px] font-bold text-muted">/{page.slug}</span>
                  <div className="h-1.5 w-28 rounded-full bg-cream">
                    <div className="h-1.5 rounded-full bg-sapphire" style={{ width: `${fill.pct}%` }} />
                  </div>
                  <span className="text-[11.5px] font-bold text-muted">SEO %{fill.pct}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );

  if (!editorOpen) return list;

  return (
    <div className={styles.editGrid}>
      {list}
      <section className={panel}>
        <div className="mb-1 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className={styles.formTitle}>{selected ? "Sayfayı Düzenle" : "Yeni Sayfa"}</h2>
            <p className={styles.formSub}>Slug aynıysa günceller, yeni slug ile yeni sayfa açar.</p>
          </div>
          <div className="flex items-center gap-2">
            <PagePreviewLink page={selected} />
            <Link href={{ pathname: "/admin/icerik", query: { tab: "pages" } }} className={adminUi.ghostButton}>
              Kapat
            </Link>
          </div>
        </div>
        <div className="mt-4">
          <PageForm locale={locale} page={selected} />
        </div>
      </section>
    </div>
  );
};

/* content_pages slug'ları statik sayfa meta override'ıdır (bkz. lib/pages.ts PAGE_SLUGS);
   bilinen slug'lar route'a eşlenir, bilinmeyende canonical_path'e düşülür. */
const SLUG_ROUTE: Record<string, Href> = {
  home: "/",
  explore: "/explore",
  blog: "/blog",
  help: "/help",
  kvkk: "/kvkk",
  privacy: "/privacy",
  terms: "/terms",
  quote: "/quote",
};

const PagePreviewLink = ({ page }: { page?: ContentPage }) => {
  if (!page) return null;
  const route = SLUG_ROUTE[page.slug];
  if (route) {
    return (
      <Link href={route} target="_blank" className={cn(adminUi.ghostButton, "gap-1.5")}>
        Önizle <ExternalLink size={14} aria-hidden />
      </Link>
    );
  }
  if (page.canonicalPath) {
    return (
      <a href={page.canonicalPath} target="_blank" rel="noreferrer" className={cn(adminUi.ghostButton, "gap-1.5")}>
        Önizle <ExternalLink size={14} aria-hidden />
      </a>
    );
  }
  return null;
};

const PageForm = ({ locale, page }: { locale: string; page?: ContentPage }) => (
  <form action={saveContentPage} className="grid gap-3">
    <input type="hidden" name="locale" value={locale} />
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Slug" required><input name="slug" required defaultValue={page?.slug ?? ""} className={adminUi.input} placeholder="homepage" /></Field>
      <Field label="Durum">
        <select name="status" defaultValue={page?.status ?? "draft"} className={adminUi.input}>
          <option value="draft">Taslak</option>
          <option value="published">Yayında</option>
          <option value="archived">Arşiv</option>
        </select>
      </Field>
    </div>
    <Field label="Başlık" required><input name="title" required defaultValue={page?.title ?? ""} className={adminUi.input} /></Field>
    <Field label="Özet"><textarea name="excerpt" defaultValue={page?.excerpt ?? ""} className={cn(adminUi.input, "min-h-[78px] py-2.5")} /></Field>
    <Field label="İçerik"><textarea name="body" defaultValue={page?.body ?? ""} className={cn(adminUi.input, "min-h-[180px] py-2.5")} /></Field>
    <details className="rounded-[8px] border border-line bg-cream/35" open={Boolean(page && seoFill(page).filled > 0)}>
      <summary className="cursor-pointer px-4 py-3 text-[13px] font-extrabold text-ink">
        SEO Ayarları {page ? `(%${seoFill(page).pct} dolu)` : ""}
      </summary>
      <div className="grid gap-3 border-t border-line/80 p-4">
        <Field label="SEO başlık"><input name="seoTitle" defaultValue={page?.seoTitle ?? ""} className={adminUi.input} /></Field>
        <Field label="SEO açıklama"><textarea name="seoDescription" defaultValue={page?.seoDescription ?? ""} className={cn(adminUi.input, "min-h-[78px] py-2.5")} /></Field>
        <Field label="Anahtar kelimeler" hint="virgülle ayır"><input name="seoKeywords" defaultValue={(page?.seoKeywords ?? []).join(", ")} className={adminUi.input} /></Field>
        <Field label="Canonical"><input name="canonicalPath" defaultValue={page?.canonicalPath ?? ""} className={adminUi.input} /></Field>
        <Field label="OG görsel"><input name="ogImage" defaultValue={page?.ogImage ?? ""} className={adminUi.input} /></Field>
      </div>
    </details>
    <button className={`${adminUi.sapphireButton} justify-self-start`} type="submit">İçeriği kaydet</button>
  </form>
);

/* ==================== BLOG ==================== */

const BLOG_STATUS_CHIPS = [
  { value: "", label: "Tümü" },
  { value: "published", label: "Yayında" },
  { value: "draft", label: "Taslak" },
  { value: "archived", label: "Arşiv" },
];

const BlogTab = ({
  posts,
  locale,
  edit,
  statusFilter,
}: {
  posts: BlogPostRow[];
  locale: string;
  edit: string;
  statusFilter: string;
}) => {
  const selected = edit !== "new" ? posts.find((p) => String(p.id) === edit) : undefined;

  // Editör modu: liste gizlenir, tam genişlik form (blog gövdesi uzun).
  if (edit === "new" || selected) {
    return (
      <section className={panel}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              href={{ pathname: "/admin/icerik", query: { tab: "blog" } }}
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-brand hover:underline"
            >
              <ArrowLeft size={15} aria-hidden /> Listeye dön
            </Link>
            <h2 className={cn(styles.formTitle, "mt-2")}>{selected ? "Yazıyı Düzenle" : "Yeni Yazı"}</h2>
            <p className={styles.formSub}>blog_posts tablosuna kaydedilir; yayına alınınca published_at otomatik dolar.</p>
          </div>
          {selected && (
            <ConfirmAction
              action={deleteBlogPost}
              fields={{ id: String(selected.id), locale }}
              title="Blog yazısını sil"
              description={`"${selected.title}" yazısı kalıcı olarak silinecek.`}
              confirmLabel="Sil"
              danger
              trigger={
                <button type="button" className="rounded-lg border border-red-200 px-3 py-1.5 text-[12px] font-semibold text-red-600 hover:bg-red-50">
                  Yazıyı Sil
                </button>
              }
            />
          )}
        </div>
        <BlogForm locale={locale} post={selected} />
      </section>
    );
  }

  const filtered = statusFilter ? posts.filter((p) => p.status === statusFilter) : posts;

  return (
    <section className={panel}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className={styles.sectionTitle}>Blog yayınları</h2>
          <p className={styles.sectionSub}>Satıra tıklayarak düzenleyin.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {BLOG_STATUS_CHIPS.map((chip) => (
            <Link
              key={chip.value}
              href={{ pathname: "/admin/icerik", query: chip.value ? { tab: "blog", status: chip.value } : { tab: "blog" } }}
              className={cn(
                "inline-flex h-8 items-center rounded-full border px-3 text-[12.5px] font-medium transition-colors",
                chip.value === statusFilter
                  ? "border-sapphire bg-sapphire text-paper"
                  : "border-line bg-paper text-brand hover:bg-cream",
              )}
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Newspaper size={20} aria-hidden />} title="Blog kaydı yok" description={statusFilter ? "Bu durumda yazı bulunamadı." : "Yeni Yazı ile ilk yayını oluşturun."} />
      ) : (
        <div className="grid gap-2">
          <div className="grid grid-cols-[minmax(0,1fr)_140px_60px_100px_110px] gap-3 px-3 pb-1 text-[11px] font-extrabold uppercase tracking-[.08em] text-muted max-[860px]:hidden">
            <span>Başlık</span>
            <span>Kategori</span>
            <span>Dil</span>
            <span>Durum</span>
            <span className="text-right">Güncelleme</span>
          </div>
          {filtered.map((post) => (
            <Link
              key={post.id}
              href={{ pathname: "/admin/icerik", query: { tab: "blog", edit: String(post.id) } }}
              className="grid grid-cols-[minmax(0,1fr)_140px_60px_100px_110px] items-center gap-3 rounded-[8px] border border-line/80 bg-cream/40 px-3 py-2.5 transition-colors hover:border-sapphire/50 hover:bg-cream/60 max-[860px]:grid-cols-1 max-[860px]:gap-1"
            >
              <span className="min-w-0">
                <span className="block truncate text-[14px] font-extrabold text-ink">{post.title}</span>
                <span className="block truncate text-[11.5px] font-bold text-muted">/{post.slug}</span>
              </span>
              <span className="truncate text-[13px] font-semibold text-ink/80">{post.category ?? "—"}</span>
              <span><StatusBadge tone="blue">{post.locale}</StatusBadge></span>
              <span>
                <StatusBadge tone={post.status === "published" ? "green" : post.status === "archived" ? "red" : "amber"}>
                  {STATUS_LABEL[post.status] ?? post.status}
                </StatusBadge>
              </span>
              <span className="text-right text-[12px] font-semibold text-muted max-[860px]:text-left">{fmtDate(post.updated_at)}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

const BlogForm = ({ locale, post }: { locale: string; post?: BlogPostRow }) => (
  <form action={saveBlogPost} className="grid gap-3">
    <input type="hidden" name="locale" value={post?.locale ?? locale} />
    {post && <input type="hidden" name="id" value={post.id} />}
    {post?.published_at && <input type="hidden" name="published_at" value={post.published_at} />}
    <div className="grid gap-3 md:grid-cols-3">
      <Field label="Başlık" required className="md:col-span-2">
        <input name="title" required defaultValue={post?.title ?? ""} className={adminUi.input} />
      </Field>
      <Field label="Slug" required>
        <input name="slug" required defaultValue={post?.slug ?? ""} className={adminUi.input} placeholder="yaz-sezonu-rehberi" />
      </Field>
      <Field label="Kategori">
        <input name="category" defaultValue={post?.category ?? ""} className={adminUi.input} placeholder="Rehber" />
      </Field>
      <Field label="Kapak görseli (URL)">
        <input name="cover_image" defaultValue={post?.cover_image ?? ""} className={adminUi.input} placeholder="https://..." />
      </Field>
      <Field label="Durum">
        <select name="status" defaultValue={post?.status ?? "draft"} className={adminUi.input}>
          <option value="draft">Taslak</option>
          <option value="published">Yayında</option>
          <option value="archived">Arşiv</option>
        </select>
      </Field>
    </div>
    <Field label="Özet"><textarea name="excerpt" defaultValue={post?.excerpt ?? ""} className={cn(adminUi.input, "min-h-[78px] py-2.5")} /></Field>
    <Field label="Gövde (zengin metin)">
      <textarea name="body" defaultValue={post?.body ?? ""} className={cn(adminUi.input, "min-h-[320px] py-2.5")} placeholder="<p>Yazı içeriği…</p>" />
    </Field>
    <details className="rounded-[8px] border border-line bg-cream/35">
      <summary className="cursor-pointer px-4 py-3 text-[13px] font-extrabold text-ink">SEO Ayarları</summary>
      <div className="grid gap-3 border-t border-line/80 p-4">
        <Field label="SEO başlık"><input name="seo_title" defaultValue={post?.seo_title ?? ""} className={adminUi.input} /></Field>
        <Field label="SEO açıklama"><textarea name="seo_description" defaultValue={post?.seo_description ?? ""} className={cn(adminUi.input, "min-h-[78px] py-2.5")} /></Field>
      </div>
    </details>
    <button className={`${adminUi.sapphireButton} justify-self-start`} type="submit">
      {post ? "Yazıyı Güncelle" : "Yazıyı Kaydet"}
    </button>
  </form>
);

/* ==================== POP-UP'LAR ==================== */

const PopupsTab = ({ popups, locale, edit }: { popups: AdminPopupRow[]; locale: string; edit: string }) => {
  const selected = edit !== "new" ? popups.find((p) => String(p.id) === edit) : undefined;
  const editorOpen = edit === "new" || Boolean(selected);
  const groups = groupPopups(popups);

  const cards = (
    <section className={panel}>
      <div className="mb-4">
        <h2 className={styles.sectionTitle}>Pop-up kampanyaları</h2>
        <p className={styles.sectionSub}>Karta tıklayarak düzenleyin; durum tarih planından türetilir.</p>
      </div>
      {popups.length === 0 ? (
        <EmptyState icon={<Megaphone size={20} aria-hidden />} title="Henüz pop-up kaydı yok" description="Yeni Pop-up ile ilk kampanyayı oluşturun." />
      ) : (
        <div className="grid gap-6">
          {(["active", "planned", "expired"] as const).map((key) =>
            groups[key].length === 0 ? null : (
              <div key={key}>
                <h3 className="mb-3 text-[12px] font-extrabold uppercase tracking-[.08em] text-muted">
                  {GROUP_LABEL[key]} ({groups[key].length})
                </h3>
                <div className={cn("grid gap-3", editorOpen ? "sm:grid-cols-1 2xl:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-3")}>
                  {groups[key].map((popup) => (
                    <PopupCard key={popup.id} popup={popup} dim={key === "expired"} active={selected?.id === popup.id} />
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </section>
  );

  if (!editorOpen) return cards;

  return (
    <div className={styles.editGrid}>
      {cards}
      <section className={panel}>
        <div className="mb-1 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className={styles.formTitle}>{selected ? "Pop-up Düzenle" : "Yeni Pop-up"}</h2>
            <p className={styles.formSub}>Kampanya görseli, CTA, tarih planı, rol hedefleme ve sıklık.</p>
          </div>
          <Link href={{ pathname: "/admin/icerik", query: { tab: "popups" } }} className={adminUi.ghostButton}>
            Kapat
          </Link>
        </div>
        <div className="mt-4">
          <PopupForm locale={locale} popup={selected} />
        </div>
        {selected && (
          <div className="mt-4 flex justify-end border-t border-line/80 pt-4">
            <ConfirmAction
              action={deletePopup}
              fields={{ id: String(selected.id), locale }}
              title="Pop-up sil"
              description={`"${selected.title}" pop-up'ı kalıcı olarak silinecek.`}
              confirmLabel="Sil"
              danger
              trigger={
                <button type="button" className="rounded-lg border border-red-200 px-3 py-1.5 text-[12px] font-semibold text-red-600 hover:bg-red-50">
                  Sil
                </button>
              }
            />
          </div>
        )}
      </section>
    </div>
  );
};

const PopupCard = ({ popup, dim, active }: { popup: AdminPopupRow; dim: boolean; active: boolean }) => (
  <Link
    href={{ pathname: "/admin/icerik", query: { tab: "popups", edit: String(popup.id) } }}
    className={cn(
      "overflow-hidden rounded-[10px] border transition-colors",
      active ? "border-sapphire" : "border-line/80 hover:border-sapphire/50",
      dim && "opacity-60",
    )}
  >
    {popup.image_url ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={popup.image_url} alt="" className="h-28 w-full object-cover" />
    ) : (
      <div className="grid h-28 w-full place-items-center bg-cream text-muted">
        <Megaphone size={22} aria-hidden />
      </div>
    )}
    <div className="grid gap-2 p-3">
      <h4 className="truncate text-[14px] font-extrabold text-ink">{popup.title}</h4>
      <div className="flex flex-wrap gap-1.5">
        <StatusBadge tone="blue">{ROLE_LABEL[popup.target_role] ?? popup.target_role}</StatusBadge>
        <StatusBadge tone="neutral">{FREQ_LABEL[popup.frequency] ?? popup.frequency}</StatusBadge>
        <StatusBadge tone={popup.status === "active" ? "green" : popup.status === "archived" ? "red" : "amber"}>
          {POPUP_STATUS_LABEL[popup.status] ?? popup.status}
        </StatusBadge>
      </div>
      <p className="text-[12px] font-semibold text-muted">
        {popup.starts_at ? fmtDate(popup.starts_at) : "Hemen"} – {popup.ends_at ? fmtDate(popup.ends_at) : "Süresiz"}
      </p>
    </div>
  </Link>
);

/* Aktif / Planlı / Süresi Dolmuş gruplaması — status + tarih planından. */
function groupPopups(popups: AdminPopupRow[]) {
  const now = Date.now();
  const groups: Record<"active" | "planned" | "expired", AdminPopupRow[]> = { active: [], planned: [], expired: [] };
  for (const popup of popups) {
    const ended = popup.ends_at ? new Date(popup.ends_at).getTime() < now : false;
    const started = popup.starts_at ? new Date(popup.starts_at).getTime() <= now : true;
    if (ended || popup.status === "archived") groups.expired.push(popup);
    else if (popup.status === "active" && started) groups.active.push(popup);
    else groups.planned.push(popup);
  }
  return groups;
}

const GROUP_LABEL: Record<"active" | "planned" | "expired", string> = {
  active: "Aktif",
  planned: "Planlı",
  expired: "Süresi Dolmuş",
};

/* ==================== Ortak ==================== */

function fmtDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(value));
}

/* SEO doluluğu: 5 alandan kaçı dolu. */
function seoFill(page: ContentPage) {
  const fields = [
    page.seoTitle,
    page.seoDescription,
    page.seoKeywords.length > 0 ? "x" : null,
    page.canonicalPath,
    page.ogImage,
  ];
  const filled = fields.filter(Boolean).length;
  return { filled, pct: Math.round((filled / fields.length) * 100) };
}

const STATUS_LABEL: Record<string, string> = { draft: "Taslak", published: "Yayında", archived: "Arşiv" };
const ROLE_LABEL: Record<string, string> = { all: "Herkes", supplier: "Tedarikçiler", buyer: "Alıcılar" };
const FREQ_LABEL: Record<string, string> = { always: "Her girişte", daily: "Günde 1 kez", session: "Oturum başına 1 kez" };
const POPUP_STATUS_LABEL: Record<string, string> = { draft: "Taslak", active: "Aktif", paused: "Duraklatıldı", archived: "Arşiv" };

// timestamptz → <input type="date"> için YYYY-MM-DD.
const toDateInput = (value: string | null | undefined) => (value ? value.slice(0, 10) : "");

function PopupForm({ locale, popup }: { locale: string; popup?: AdminPopupRow }) {
  return (
    <form action={savePopup} className="grid gap-3">
      <input type="hidden" name="locale" value={locale} />
      {popup && <input type="hidden" name="id" value={popup.id} />}
      <Field label="Başlık" required>
        <input name="title" required defaultValue={popup?.title ?? ""} className={adminUi.input} placeholder="Yaz kampanyası" />
      </Field>
      <Field label="Metin (zengin metin)">
        <textarea name="body" rows={3} defaultValue={popup?.body ?? ""} className={adminUi.input} placeholder="<p>Kampanya açıklaması…</p>" />
      </Field>
      <Field label="Görsel yolu">
        <input name="image_url" defaultValue={popup?.image_url ?? ""} className={adminUi.input} placeholder="https://...supabase.co/storage/..." />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="CTA metni">
          <input name="cta_label" defaultValue={popup?.cta_label ?? ""} className={adminUi.input} placeholder="Hemen keşfet" />
        </Field>
        <Field label="CTA linki (URL)">
          <input name="cta_url" defaultValue={popup?.cta_url ?? ""} className={adminUi.input} placeholder="https://..." />
        </Field>
        <Field label="Hedef rol">
          <select name="target_role" defaultValue={popup?.target_role ?? "all"} className={adminUi.input}>
            <option value="all">Herkes</option>
            <option value="supplier">Sadece Tedarikçiler</option>
            <option value="buyer">Sadece Alıcılar</option>
          </select>
        </Field>
        <Field label="Sıklık">
          <select name="frequency" defaultValue={popup?.frequency ?? "daily"} className={adminUi.input}>
            <option value="always">Her girişte</option>
            <option value="daily">Günde 1 kez</option>
            <option value="session">Oturum başına 1 kez</option>
          </select>
        </Field>
        <Field label="Başlangıç tarihi">
          <input name="starts_at" type="date" defaultValue={toDateInput(popup?.starts_at)} className={adminUi.input} />
        </Field>
        <Field label="Bitiş tarihi">
          <input name="ends_at" type="date" defaultValue={toDateInput(popup?.ends_at)} className={adminUi.input} />
        </Field>
        <Field label="Durum" className="sm:col-span-2">
          <select name="status" defaultValue={popup?.status ?? "draft"} className={adminUi.input}>
            <option value="draft">Taslak</option>
            <option value="active">Aktif</option>
            <option value="paused">Duraklatıldı</option>
            <option value="archived">Arşiv</option>
          </select>
        </Field>
      </div>
      <button type="submit" className={`mt-1 ${adminUi.sapphireButton}`}>
        {popup ? "Pop-up Güncelle" : "Pop-up Kaydet"}
      </button>
    </form>
  );
}

export default AdminContentView;
