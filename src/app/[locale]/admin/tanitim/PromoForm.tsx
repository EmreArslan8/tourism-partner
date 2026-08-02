"use client";

import { useActionState, useRef, useState } from "react";
import { Eye, Send } from "lucide-react";
import { sendPromoInvites, type PromoInviteState } from "@/lib/actions/promo-invite";
import { adminUi } from "../_ui";

/* Tanıtım maili gönderim formu. Tüm metin alanları serbest — şablon yalnızca
   kurumsal çerçeveyi çizer. Önizleme, gönderim yapmayan ayrı bir uçtan HTML
   alıp iframe'e basar; böylece admin maili göndermeden görebilir. */

const label = "flex flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-[.06em] text-muted";

const ERROR_TEXT: Record<string, string> = {
  forbidden: "Bu işlem için admin yetkisi gerekli.",
  missing_content: "Konu, başlık, gövde ve buton yazısı zorunlu.",
  invalid_reply_to: "Geçerli bir yanıt adresi girin.",
  no_recipients: "Geçerli en az bir alıcı adresi girin.",
  too_many_recipients: "Tek seferde en fazla 50 adrese gönderilebilir. Listeyi bölün.",
  all_failed: "Hiçbir mail gönderilemedi. Resend ayarlarını (RESEND_API_KEY / EMAIL_FROM) kontrol edin.",
};

const DEFAULT_INTRO = `Hello,

Tourism Partner is a B2B network that connects tourism businesses directly — no intermediaries, no commission. Agencies, hotels, transfer companies and guides send each other quote requests first-hand.

List your business for free and start receiving quote requests today.`;

const DEFAULT_BULLETS = `No commission — you close the deal directly with the other party
Verified business profiles
Manage every quote request from a single dashboard`;

export default function PromoForm() {
  const [state, action, pending] = useActionState<PromoInviteState, FormData>(sendPromoInvites, {
    ok: false,
  });
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);

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
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
      <form ref={formRef} action={action} className="grid gap-4">
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
            <input name="campaign" defaultValue="outreach" className={adminUi.input} />
          </label>
        </div>


        <label className={label}>
          Konu (subject)
          <input
            name="subject"
            required
            defaultValue="List your business on Tourism Partner — free"
            className={adminUi.input}
          />
        </label>

        <label className={label}>
          Ön izleme satırı (preheader)
          <input
            name="preheader"
            defaultValue="The B2B tourism network with no intermediaries and no commission."
            className={adminUi.input}
          />
        </label>

        <label className={label}>
          Mail başlığı
          <input
            name="headline"
            required
            defaultValue="Direct business connections in tourism"
            className={adminUi.input}
          />
        </label>

        <label className={label}>
          Gövde metni (boş satır = yeni paragraf)
          <textarea name="intro" required rows={9} defaultValue={DEFAULT_INTRO} className={adminUi.input} />
        </label>

        <label className={label}>
          Maddeler (her satır bir madde — boş bırakılabilir)
          <textarea name="bullets" rows={4} defaultValue={DEFAULT_BULLETS} className={adminUi.input} />
        </label>

        <label className={label}>
          Buton yazısı — kayıt ekranına yönlendirir
          <input name="ctaLabel" required defaultValue="Sign up for free" className={adminUi.input} />
        </label>

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
  );
}
