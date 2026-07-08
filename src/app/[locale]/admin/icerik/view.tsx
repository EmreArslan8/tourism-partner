import { ContentForm, ContentTable, PageHeader, panel } from "../_components";
import { adminUi } from "../_ui";
import styles from "./styles";
import type { AdminPopupRow, BlogPostRow } from "@/lib/supabase/database.types";
import type { ContentPage } from "@/lib/types";

interface Props {
  pages: ContentPage[];
  blogPosts: BlogPostRow[];
  popups: AdminPopupRow[];
  locale: string;
}

const AdminContentView = ({ pages, blogPosts, popups, locale }: Props) => {
  const firstPage = pages[0];

  return (
    <>
      <PageHeader
        eyebrow="İçerik"
        title="İçerik Yönetimi"
        description="Sayfa içerikleri, blog yayınları ve platform içi pop-up kampanyalarını yönetin."
      />

      <div className={styles.grid}>
        <section className={panel}>
          <div className="mb-4">
            <h2 className={styles.sectionTitle}>Kayıtlı sayfalar</h2>
            <p className={styles.sectionSub}>Yayın/taslak durumu ve SEO doluluğu.</p>
          </div>
          <ContentTable pages={pages} />
        </section>

        <section className={panel}>
          <h2 className={styles.formTitle}>İçerik formu</h2>
          <p className={styles.formSub}>Slug aynıysa günceller, yeni slug ile yeni sayfa açar.</p>
          <div className="mt-4">
            <ContentForm locale={locale} page={firstPage} />
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className={panel}>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className={styles.sectionTitle}>Blog Düzenleme</h2>
              <p className={styles.sectionSub}>blog_posts tablosundaki yayınlar.</p>
            </div>
            <button type="button" className={adminUi.sapphireButton}>
              Yeni Blog
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left text-[13px]">
              <thead className="bg-cream/70 text-[11px] font-extrabold uppercase tracking-[.08em] text-ink/80">
                <tr>
                  <th className="border-b border-line px-4 py-3">Başlık</th>
                  <th className="border-b border-line px-4 py-3">Kategori</th>
                  <th className="border-b border-line px-4 py-3">Dil</th>
                  <th className="border-b border-line px-4 py-3">Durum</th>
                  <th className="border-b border-line px-4 py-3">Güncelleme</th>
                </tr>
              </thead>
              <tbody>
                {blogPosts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-[13px] font-semibold text-muted">
                      Henüz blog kaydı yok.
                    </td>
                  </tr>
                )}
                {blogPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-cream/45">
                    <td className="border-b border-line px-4 py-3 font-extrabold text-ink">{post.title}</td>
                    <td className="border-b border-line px-4 py-3 font-semibold text-ink/80">{post.category ?? "-"}</td>
                    <td className="border-b border-line px-4 py-3 font-semibold text-ink/80">{post.locale}</td>
                    <td className="border-b border-line px-4 py-3 font-semibold text-ink/80">{post.status}</td>
                    <td className="border-b border-line px-4 py-3 font-semibold text-muted">{fmtDate(post.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={panel}>
          <h2 className={styles.formTitle}>Pop-up Yönetimi</h2>
          <p className={styles.formSub}>admin_popups tablosundaki kampanyalar.</p>
          <div className="mt-4 grid gap-3">
            {popups.length === 0 ? (
              <p className="rounded-[8px] border border-dashed border-line px-4 py-8 text-center text-[13px] font-semibold text-muted">
                Henüz pop-up kaydı yok.
              </p>
            ) : (
              popups.map((popup) => (
                <article key={popup.id} className="rounded-[8px] border border-line bg-cream/45 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-[14px] font-extrabold text-ink">{popup.title}</h3>
                      <p className="mt-1 text-[12px] font-semibold text-muted">
                        {popup.target_role} · {popup.frequency} · {popup.status}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-cream/70 px-2.5 py-1 text-[11px] font-extrabold text-brand">
                      {popup.starts_at ? fmtDate(popup.starts_at) : "Hemen"}
                    </span>
                  </div>
                  {popup.cta_url && (
                    <a href={popup.cta_url} target="_blank" rel="noreferrer" className="mt-2 block truncate text-[12px] font-bold text-brand hover:underline">
                      {popup.cta_label ?? popup.cta_url}
                    </a>
                  )}
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </>
  );
};

function fmtDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(value));
}

export default AdminContentView;
