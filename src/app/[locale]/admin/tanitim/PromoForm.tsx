"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { Check, Eye, ImagePlus, Mail, Pencil, Plus, Save, Send, Trash2, X } from "lucide-react";
import { sendPromoInvites, type PromoInviteState } from "@/lib/actions/promo-invite";
import { savePromoTemplate } from "@/lib/actions/promo-templates";
import { DEFAULT_PROMO_TEMPLATE_ID, PROMO_TEMPLATES, type PromoTemplate } from "@/lib/promo-templates";
import { adminUi } from "../_ui";

/* Tanıtım maili gönderim formu. Şablon seçimi içerik alanlarını otomatik doldurur;
   alıcı, yanıt adresi ve gönderen bilgileri admin tarafından girilir. Önizleme,
   gönderim yapmayan ayrı bir uçtan HTML alıp iframe'e basar. */

const label = "flex flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-[.06em] text-muted";

const ERROR_TEXT: Record<string, string> = {
  forbidden: "Bu işlem için admin yetkisi gerekli.",
  missing_content: "Konu, başlık, gövde ve buton yazısı zorunlu.",
  invalid_reply_to: "Geçerli bir yanıt adresi girin.",
  no_recipients: "Geçerli en az bir alıcı adresi girin.",
  too_many_recipients: "Tek seferde en fazla 50 adrese gönderilebilir. Listeyi bölün.",
  all_failed: "Hiçbir mail gönderilemedi. Resend ayarlarını (RESEND_API_KEY / EMAIL_FROM) kontrol edin.",
};

type TemplateDraft = Omit<PromoTemplate, "bullets"> & { bulletsText: string };

const EMPTY_TEMPLATE: TemplateDraft = {
  id: "",
  label: "",
  subject: "",
  preheader: "",
  headline: "",
  intro: "",
  bulletsText: "",
  outro: "",
  ctaLabel: "",
  campaign: "",
  imageUrl: "",
  backgroundColor: "#ffffff",
  textColor: "#334155",
  accentColor: "#004fe6",
};

const toDraft = (template: PromoTemplate): TemplateDraft => ({
  ...template,
  bulletsText: template.bullets.join("\n"),
});

export default function PromoForm({ initialTemplates }: { initialTemplates: PromoTemplate[] }) {
  const [state, action, pending] = useActionState<PromoInviteState, FormData>(sendPromoInvites, {
    ok: false,
  });
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [templates, setTemplates] = useState(() => initialTemplates.length ? initialTemplates : PROMO_TEMPLATES);
  const [templateId, setTemplateId] = useState(initialTemplates[0]?.id ?? DEFAULT_PROMO_TEMPLATE_ID);
  const [editor, setEditor] = useState<TemplateDraft | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [templateError, setTemplateError] = useState<string | null>(null);
  const [savingTemplate, startSavingTemplate] = useTransition();
  const template = templates.find((item) => item.id === templateId) ?? templates[0] ?? PROMO_TEMPLATES[0];

  function releaseLocalImagePreview() {
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
  }

  function openEditor(draft: TemplateDraft) {
    releaseLocalImagePreview();
    setTemplateError(null);
    setImageFile(null);
    setImagePreview(draft.imageUrl || null);
    setEditor(draft);
  }

  function closeEditor() {
    releaseLocalImagePreview();
    setImageFile(null);
    setImagePreview(null);
    setEditor(null);
  }

  useEffect(() => {
    if (!editor) return;

    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - root.clientWidth;

    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.paddingRight = previousBodyPaddingRight;
    };
  }, [editor]);

  function updateEditor(field: keyof TemplateDraft, value: string) {
    setEditor((current) => current ? { ...current, [field]: value } : current);
  }

  function persistTemplate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor) return;
    setTemplateError(null);

    startSavingTemplate(async () => {
      let imageUrl = editor.imageUrl;

      if (imageFile) {
        const upload = new FormData();
        upload.set("file", imageFile);
        const response = await fetch("/api/admin/promo-image", { method: "POST", body: upload });
        const payload = await response.json().catch(() => null) as { url?: string; error?: string } | null;

        if (!response.ok || !payload?.url) {
          setTemplateError(
            payload?.error === "size"
              ? "Görsel en fazla 8 MB olabilir."
              : payload?.error === "type"
                ? "Görsel JPG, PNG, WebP veya GIF olmalı."
                : "Görsel yüklenemedi. Storage ayarlarını kontrol edin.",
          );
          return;
        }
        imageUrl = payload.url;
      }

      const result = await savePromoTemplate({
        ...editor,
        imageUrl,
        bullets: editor.bulletsText.split("\n").map((item) => item.trim()).filter(Boolean),
      });

      if (!result.ok) {
        setTemplateError(
          result.error === "invalid"
            ? "Zorunlu alanları eksiksiz doldurun."
            : result.error === "forbidden"
              ? "Bu işlem için admin yetkisi gerekli."
              : "Şablon kaydedilemedi. Veritabanı migration'ını ve bağlantıyı kontrol edin.",
        );
        return;
      }

      setTemplates((current) => {
        const exists = current.some((item) => item.id === result.template.id);
        return exists
          ? current.map((item) => item.id === result.template.id ? result.template : item)
          : [result.template, ...current];
      });
      setTemplateId(result.template.id);
      setPreview(null);
      closeEditor();
    });
  }

  async function showPreview() {
    if (!formRef.current) return;
    setPreviewing(true);
    try {
      // Önizlemenin alıcı listesine ihtiyacı yok; sunucuya gereksiz taşınmasın.
      const payload = new FormData(formRef.current);
      payload.delete("recipients");
      const res = await fetch("/api/admin/promo-preview", { method: "POST", body: payload });
      setPreview(res.ok ? await res.text() : "<p>Önizleme alınamadı.</p>");
    } catch {
      setPreview("<p>Önizleme alınamadı.</p>");
    } finally {
      setPreviewing(false);
    }
  }

  return (
    <>
      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
      <form ref={formRef} action={action} className="grid gap-4">
        <section className="rounded-[14px] border border-[#d9e1f0] bg-[linear-gradient(135deg,#f8fbff_0%,#f3f6fc_100%)] p-4 shadow-[0_10px_30px_-24px_rgba(1,20,93,.5)]" aria-labelledby="template-picker-title">
          <input type="hidden" name="templateId" value={templateId} />
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.12em] text-brand/70">Hazır içerik</p>
              <h2 id="template-picker-title" className="mt-1 text-[16px] font-extrabold tracking-[-.02em] text-ink">
                Göndermek istediğiniz şablonu seçin
              </h2>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden rounded-full border border-[#cbd7ee] bg-white/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.08em] text-muted sm:inline-flex">
                {templates.length} seçenek{templates.length > 2 ? " · sağa kaydırın" : ""}
              </span>
              <button
                type="button"
                onClick={() => openEditor({ ...EMPTY_TEMPLATE })}
                className={`${adminUi.secondaryButton} h-9 px-3`}
              >
                <Plus size={14} strokeWidth={2.5} aria-hidden />
                Yeni şablon
              </button>
            </div>
          </div>

          <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2 [scrollbar-color:#b8c5df_transparent]" role="radiogroup" aria-label="Mail şablonları">
            {templates.map((option) => {
              const selected = option.id === templateId;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => {
                    setTemplateId(option.id);
                    setPreview(null);
                  }}
                  className={`group relative min-w-[240px] flex-1 snap-start rounded-[12px] border p-4 text-left transition-all duration-200 ${
                    selected
                      ? "border-brand bg-white shadow-[0_12px_24px_-18px_rgba(0,79,230,.75)] ring-2 ring-brand/10"
                      : "border-[#dfe5ef] bg-white/55 hover:-translate-y-0.5 hover:border-[#aebfdf] hover:bg-white"
                  }`}
                >
                  <span className={`mb-3 flex h-9 w-9 items-center justify-center rounded-[10px] ${selected ? "bg-brand text-white" : "bg-[#eaf0fb] text-brand"}`}>
                    <Mail size={17} aria-hidden />
                  </span>
                  <span className="block pr-7 text-[13px] font-extrabold text-ink">{option.label}</span>
                  <span className="mt-1 block text-[12px] leading-5 text-muted">{option.subject}</span>
                  {selected ? (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand px-2 py-1 text-[10px] font-bold text-white">
                      <Check size={11} strokeWidth={3} aria-hidden /> Seçili
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="mt-3 rounded-[10px] border border-[#dfe5ef] bg-white/75 px-3.5 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[.1em] text-muted">Seçilen içeriğin özeti</p>
                <p className="mt-1 truncate text-[13px] font-extrabold text-ink">{template.label}</p>
                <p className="mt-0.5 text-[12px] font-semibold text-muted">{template.headline}</p>
              </div>
              <button
                type="button"
                onClick={() => openEditor(toDraft(template))}
                className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[8px] border border-[#cbd7ee] bg-white px-2.5 text-[11px] font-bold text-brand transition-colors hover:border-brand hover:bg-[#edf3ff]"
              >
                <Pencil size={13} aria-hidden /> Düzenle
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {template.bullets.map((bullet) => (
                <span key={bullet} className="rounded-full bg-[#edf3ff] px-2.5 py-1 text-[11px] font-semibold text-[#2452a5]">
                  {bullet.replace(/^✔️\s*/, "")}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={label}>
            Mail dili
            <select name="locale" defaultValue="en" className={adminUi.input}>
              <option value="tr">Türkçe</option>
              <option value="en">İngilizce</option>
              <option value="ru">Rusça</option>
              <option value="ar">Arapça</option>
            </select>
          </label>
          <label className={label}>
            Kampanya kodu (utm)
            <input name="campaign" value={template.campaign} readOnly className={adminUi.input} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={label}>
            Yanıt adresi (reply-to)
            <input
              name="replyTo"
              type="email"
              required
              defaultValue="sales@tourismpartner.com"
              className={adminUi.input}
            />
          </label>
          <label className={label}>
            Alt bilgi — firma adı
            <input name="senderName" defaultValue="Tourism Partner" className={adminUi.input} />
          </label>
        </div>

        <label className={label}>
          Alt bilgi — açık adres (ticari iletide zorunlu)
          <input name="senderAddress" className={adminUi.input} placeholder="Örn. Konyaaltı Cad. No:1, Antalya, Türkiye" />
        </label>

        <label className={label}>
          Alıcı e-posta adresleri — alt alta, virgül veya noktalı virgülle (en fazla 50)
          <textarea
            name="recipients"
            required
            rows={7}
            className={`${adminUi.input} font-mono text-[12.5px]`}
            placeholder={"ornek@otel.com\nKaya Palas <bilgi@acente.com.tr>"}
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={pending} className={`${adminUi.sapphireButton} disabled:opacity-60`}>
            <Send size={15} aria-hidden />
            {pending ? "Gönderiliyor…" : "Gönder"}
          </button>
          <button
            type="button"
            onClick={showPreview}
            disabled={previewing}
            className={`${adminUi.secondaryButton} disabled:opacity-60`}
          >
            <Eye size={15} aria-hidden />
            {previewing ? "Hazırlanıyor…" : "Önizle"}
          </button>

          {state.ok && (
            <span className="text-[12.5px] font-semibold text-emerald-700">
              {state.sent} adrese gönderildi.
            </span>
          )}
          {state.error && (
            <span className="text-[12.5px] font-semibold text-red-600">
              {ERROR_TEXT[state.error] ?? "Gönderim başarısız."}
            </span>
          )}
        </div>

        {(state.failed?.length || state.invalid?.length) ? (
          <div className="rounded-[8px] border border-line bg-cream/40 p-3 text-[12px] leading-5 text-muted">
            {state.invalid?.length ? (
              <p>
                <strong className="text-ink">Geçersiz adresler (atlandı):</strong>{" "}
                <span className="font-mono">{state.invalid.join(", ")}</span>
              </p>
            ) : null}
            {state.failed?.length ? (
              <p className="mt-1">
                <strong className="text-ink">Gönderilemeyenler:</strong>{" "}
                <span className="font-mono">{state.failed.join(", ")}</span>
              </p>
            ) : null}
          </div>
        ) : null}
      </form>

      <div className="min-h-[420px] rounded-[10px] border border-line bg-cream/30 p-3">
        <div className="mb-2 flex items-center justify-between gap-2 px-1">
          <p className="text-[10px] font-bold uppercase tracking-[.1em] text-muted">Mail önizlemesi</p>
          <p className="truncate text-[11px] font-bold text-brand" title={template.label}>{template.label}</p>
        </div>
        {preview ? (
          <iframe
            title="Mail önizleme"
            srcDoc={preview}
            sandbox=""
            className="h-[720px] w-full rounded-[8px] border border-line bg-white"
          />
        ) : (
          <div className="flex h-full min-h-[400px] items-center justify-center px-6 text-center text-[13px] text-muted">
            Metinleri doldurup <strong className="mx-1 text-ink">Önizle</strong>ye basın — mailin alıcıda nasıl
            görüneceği burada çıkar.
          </div>
        )}
      </div>
      </div>

      {editor ? createPortal(
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[#071432]/55 p-4 backdrop-blur-[3px]"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target && !savingTemplate) closeEditor();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="promo-template-editor-title"
            className="max-h-[92vh] w-full max-w-[760px] overscroll-contain overflow-y-auto rounded-[16px] border border-white/50 bg-[#f8faff] shadow-[0_28px_90px_-30px_rgba(1,20,93,.8)]"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[#dce4f1] bg-[#f8faff]/95 px-5 py-4 backdrop-blur">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.12em] text-brand/70">Mail şablonu</p>
                <h2 id="promo-template-editor-title" className="mt-0.5 text-[18px] font-extrabold tracking-[-.02em] text-ink">
                  {editor.id ? "Şablonu düzenle" : "Yeni şablon ekle"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeEditor}
                disabled={savingTemplate}
                aria-label="Şablon editörünü kapat"
                className="grid h-9 w-9 place-items-center rounded-[9px] text-muted transition-colors hover:bg-[#e8eef9] hover:text-brand disabled:opacity-50"
              >
                <X size={18} aria-hidden />
              </button>
            </div>

            <form onSubmit={persistTemplate} className="grid gap-4 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={label}>
                  Şablon adı
                  <input required value={editor.label} onChange={(event) => updateEditor("label", event.target.value)} className={adminUi.input} placeholder="Örn. Yaz sezonu daveti" />
                </label>
                <label className={label}>
                  Kampanya kodu (utm)
                  <input required value={editor.campaign} onChange={(event) => updateEditor("campaign", event.target.value)} className={adminUi.input} placeholder="yaz-sezonu-2026" />
                </label>
              </div>

              <label className={label}>
                Mail konusu
                <input required value={editor.subject} onChange={(event) => updateEditor("subject", event.target.value)} className={adminUi.input} />
              </label>

              <label className={label}>
                Ön başlık (preheader)
                <input value={editor.preheader} onChange={(event) => updateEditor("preheader", event.target.value)} className={adminUi.input} />
              </label>

              <section className="grid gap-4 rounded-[12px] border border-[#dce4f1] bg-white/65 p-4" aria-labelledby="template-visual-title">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.12em] text-brand/70">Görsel tasarım</p>
                  <h3 id="template-visual-title" className="mt-1 text-[15px] font-extrabold text-ink">Kampanya görseli ve renkler</h3>
                </div>

                <label className="group relative flex min-h-[116px] cursor-pointer flex-col items-center justify-center rounded-[11px] border border-dashed border-[#b8c6dd] bg-[#f8fbff] px-4 py-5 text-center transition-colors hover:border-brand hover:bg-[#edf3ff]">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      releaseLocalImagePreview();
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                      updateEditor("imageUrl", "");
                    }}
                  />
                  <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-[#e5edfb] text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                    <ImagePlus size={18} aria-hidden />
                  </span>
                  <span className="mt-2 text-[12px] font-extrabold text-ink">
                    {imageFile ? imageFile.name : imagePreview ? "Görseli değiştir" : "Kampanya görseli seç"}
                  </span>
                  <span className="mt-1 text-[11px] font-semibold text-muted">JPG, PNG, WebP veya GIF · en fazla 8 MB</span>
                </label>

                {imagePreview ? (
                  <div className="overflow-hidden rounded-[10px] border border-[#dce4f1] bg-[#edf2f9]">
                    <div
                      role="img"
                      aria-label="Kampanya görseli önizlemesi"
                      className="aspect-[16/7] w-full bg-contain bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${JSON.stringify(imagePreview)})` }}
                    />
                    <div className="flex items-center justify-between gap-3 border-t border-[#dce4f1] bg-white px-3 py-2">
                      <span className="truncate text-[11px] font-semibold text-muted">
                        {imageFile?.name ?? "Kayıtlı kampanya görseli"}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          releaseLocalImagePreview();
                          setImageFile(null);
                          setImagePreview(null);
                          updateEditor("imageUrl", "");
                        }}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-[7px] px-2 py-1 text-[11px] font-bold text-red-600 transition-colors hover:bg-red-50"
                      >
                        <Trash2 size={12} aria-hidden /> Görseli kaldır
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="grid gap-3 sm:grid-cols-3">
                  {([
                    ["backgroundColor", "Arka plan"],
                    ["textColor", "Yazı rengi"],
                    ["accentColor", "CTA rengi"],
                  ] as const).map(([field, title]) => (
                    <label key={field} className={label}>
                      {title}
                      <span className="flex h-11 items-center gap-2 rounded-[8px] border border-line bg-white px-2">
                        <input
                          type="color"
                          value={editor[field]}
                          onChange={(event) => updateEditor(field, event.target.value)}
                          className="h-7 w-9 cursor-pointer border-0 bg-transparent p-0"
                        />
                        <span className="font-mono text-[12px] font-semibold normal-case tracking-normal text-ink">{editor[field]}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              <label className={label}>
                Mail içi başlık
                <input required value={editor.headline} onChange={(event) => updateEditor("headline", event.target.value)} className={adminUi.input} />
              </label>

              <label className={label}>
                Giriş metni
                <textarea required rows={7} value={editor.intro} onChange={(event) => updateEditor("intro", event.target.value)} className={`${adminUi.input} resize-y py-3 normal-case tracking-normal`} />
              </label>

              <label className={label}>
                Madde listesi — her satıra bir madde
                <textarea rows={5} value={editor.bulletsText} onChange={(event) => updateEditor("bulletsText", event.target.value)} className={`${adminUi.input} resize-y py-3 normal-case tracking-normal`} placeholder={"No commission\nFree registration\nGlobal connections"} />
              </label>

              <label className={label}>
                Kapanış metni
                <textarea rows={6} value={editor.outro} onChange={(event) => updateEditor("outro", event.target.value)} className={`${adminUi.input} resize-y py-3 normal-case tracking-normal`} />
              </label>

              <label className={label}>
                Buton yazısı
                <input required value={editor.ctaLabel} onChange={(event) => updateEditor("ctaLabel", event.target.value)} className={adminUi.input} placeholder="Ücretsiz kayıt ol" />
              </label>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#dce4f1] pt-4">
                <p className="text-[12px] font-semibold text-red-600" role="alert">{templateError}</p>
                <div className="ml-auto flex gap-2">
                  <button type="button" onClick={closeEditor} disabled={savingTemplate} className={adminUi.secondaryButton}>
                    Vazgeç
                  </button>
                  <button type="submit" disabled={savingTemplate} className={`${adminUi.sapphireButton} disabled:opacity-60`}>
                    <Save size={15} aria-hidden />
                    {savingTemplate ? "Kaydediliyor…" : "Şablonu kaydet"}
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>,
        document.body,
      ) : null}
    </>
  );
}
