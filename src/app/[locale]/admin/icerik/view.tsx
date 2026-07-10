import { ContentForm, ContentTable, PageHeader, panel } from "../_components";
import { adminUi } from "../_ui";
import styles from "./styles";
import { Field, ConfirmAction } from "@/components/common";
import { savePopup, deletePopup } from "@/lib/actions/platform";
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
          <p className={styles.formSub}>Kampanya görseli, CTA, tarih planı, rol hedefleme ve sıklık.</p>

          <div className="mt-4">
            <PopupForm locale={locale} />
          </div>

          <div className="mt-6 grid gap-3">
            <h3 className="text-[13px] font-extrabold uppercase tracking-[.06em] text-ink/70">
              Kayıtlı pop-up&apos;lar
            </h3>
            {popups.length === 0 ? (
              <p className="rounded-[8px] border border-dashed border-line px-4 py-8 text-center text-[13px] font-semibold text-muted">
                Henüz pop-up kaydı yok.
              </p>
            ) : (
              popups.map((popup) => (
                <details key={popup.id} className="rounded-[8px] border border-line bg-cream/45 p-3">
                  <summary className="flex cursor-pointer items-start justify-between gap-3 list-none">
                    <div className="min-w-0">
                      <h4 className="truncate text-[14px] font-extrabold text-ink">{popup.title}</h4>
                      <p className="mt-1 text-[12px] font-semibold text-muted">
                        {ROLE_LABEL[popup.target_role] ?? popup.target_role} · {FREQ_LABEL[popup.frequency] ?? popup.frequency} · {STATUS_LABEL[popup.status] ?? popup.status}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-cream/70 px-2.5 py-1 text-[11px] font-extrabold text-brand">
                      {popup.starts_at ? fmtDate(popup.starts_at) : "Hemen"}
                    </span>
                  </summary>
                  <div className="mt-3 border-t border-line pt-3">
                    <PopupForm locale={locale} popup={popup} />
                    <div className="mt-3 flex justify-end">
                      <ConfirmAction
                        action={deletePopup}
                        fields={{ id: String(popup.id), locale }}
                        title="Pop-up sil"
                        description={`"${popup.title}" pop-up'ı kalıcı olarak silinecek.`}
                        confirmLabel="Sil"
                        danger
                        trigger={
                          <button type="button" className="rounded-lg border border-red-200 px-3 py-1.5 text-[12px] font-semibold text-red-600 hover:bg-red-50">
                            Sil
                          </button>
                        }
                      />
                    </div>
                  </div>
                </details>
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

const ROLE_LABEL: Record<string, string> = { all: "Herkes", supplier: "Tedarikçiler", buyer: "Alıcılar" };
const FREQ_LABEL: Record<string, string> = { always: "Her girişte", daily: "Günde 1 kez", session: "Oturum başına 1 kez" };
const STATUS_LABEL: Record<string, string> = { draft: "Taslak", active: "Aktif", paused: "Duraklatıldı", archived: "Arşiv" };

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
