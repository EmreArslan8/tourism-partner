"use client";

import { useActionState } from "react";
import { Clock3, Mail, RefreshCw, Send, ShieldAlert, UserRoundCheck, XCircle } from "lucide-react";
import {
  cancelBusinessOwnerInvite,
  sendBusinessOwnerInvite,
  type BusinessInviteActionState,
} from "@/lib/actions/business-owner-invite";
import type { BusinessOwnershipView } from "@/lib/business-owner-invites";
import { cn } from "@/lib/utils";

const initialState: BusinessInviteActionState = { ok: false };

const messages: Record<string, string> = {
  invite_sent: "Davet e-postası gönderildi.",
  invite_cancelled: "Davet iptal edildi.",
  invalid_email: "Geçerli bir e-posta adresi girin.",
  already_claimed: "Bu işletmenin zaten bir sahibi var.",
  rate: "Saatlik davet gönderme sınırına ulaşıldı.",
  email_failed: "Davet oluşturuldu ancak e-posta gönderilemedi. Ayarları kontrol edip yeniden gönderin.",
  create_failed: "Davet kaydı oluşturulamadı.",
  cancel_failed: "Davet iptal edilemedi veya artık aktif değil.",
  supabase_url_missing: "NEXT_PUBLIC_SUPABASE_URL sunucu tarafından okunamadı. .env.local dosyasını kontrol edip npm run dev sunucusunu yeniden başlatın.",
  service_role_missing: "SUPABASE_SERVICE_ROLE_KEY sunucu tarafından okunamadı. Değişken adını ve .env.local değerini kontrol edip npm run dev sunucusunu yeniden başlatın.",
  service_unavailable: "Supabase admin istemcisi oluşturulamadı. Terminaldeki [business-owner-invite] yapılandırma logunu kontrol edin.",
};

function Feedback({ state }: { state: BusinessInviteActionState }) {
  const key = state.notice ?? state.error;
  if (!key) return null;
  const success = Boolean(state.notice);
  return (
    <p role={success ? "status" : "alert"} className={cn("rounded-[8px] border px-3 py-2.5 text-[12px] font-bold leading-5", success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700")}>
      {messages[key] ?? "İşlem tamamlanamadı."}
    </p>
  );
}

function SubmitButton({ pending, children, tone = "primary" }: { pending: boolean; children: React.ReactNode; tone?: "primary" | "danger" }) {
  return (
    <button type="submit" disabled={pending} className={cn("inline-flex h-10 items-center justify-center gap-2 rounded-[8px] px-3.5 text-[12.5px] font-extrabold transition disabled:cursor-wait disabled:opacity-60", tone === "danger" ? "border border-red-200 bg-white text-red-700 hover:bg-red-50" : "bg-brand text-white hover:bg-[#0b318f]")}>
      {pending ? <RefreshCw size={14} className="animate-spin" aria-hidden /> : null}
      {children}
    </button>
  );
}

export default function OwnerInviteCard({ businessId, locale, ownership }: { businessId: number; locale: string; ownership: BusinessOwnershipView }) {
  const [sendState, sendAction, sendPending] = useActionState(sendBusinessOwnerInvite, initialState);
  const [cancelState, cancelAction, cancelPending] = useActionState(cancelBusinessOwnerInvite, initialState);
  const invite = ownership.invite;
  const activeInvite = invite?.status === "pending";

  if (ownership.ownerId) {
    return (
      <section className="overflow-hidden rounded-[8px] border border-emerald-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,.04)]">
        <div className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50/70 px-4 py-3">
          <UserRoundCheck size={17} className="text-emerald-700" aria-hidden />
          <h3 className="text-[14px] font-extrabold text-ink">İşletme Sahipliği</h3>
          <span className="ms-auto rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[.06em] text-emerald-800">Teslim alındı</span>
        </div>
        <div className="p-4">
          <p className="text-[11px] font-bold uppercase tracking-[.07em] text-muted">Sahip hesabı</p>
          <p className="mt-1 break-all text-[13px] font-extrabold text-ink">{ownership.ownerEmail ?? "E-posta bilgisi alınamadı"}</p>
          <p className="mt-3 text-[12px] font-semibold leading-5 text-muted">İşletme bu kullanıcı hesabının paneline bağlıdır.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-[8px] border border-[#D8DFEA] bg-white shadow-[0_1px_2px_rgba(15,23,42,.04)]">
      <div className="flex items-center gap-2 border-b border-[#D8DFEA] bg-[#F8FAFD] px-4 py-3">
        <Mail size={17} className="text-brand" aria-hidden />
        <h3 className="text-[14px] font-extrabold text-ink">İşletme Sahipliği</h3>
        <StatusBadge status={invite?.status ?? "unclaimed"} />
      </div>
      <div className="grid gap-4 p-4">
        {invite && (
          <div className="rounded-[8px] border border-line bg-cream/45 p-3">
            <p className="break-all text-[13px] font-extrabold text-ink">{invite.email}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] font-semibold text-muted">
              <span className="inline-flex items-center gap-1.5"><Clock3 size={13} aria-hidden />{formatExpiry(invite.expiresAt, invite.status)}</span>
              {invite.deliveryStatus === "failed" && <span className="inline-flex items-center gap-1.5 text-red-700"><ShieldAlert size={13} aria-hidden />E-posta başarısız</span>}
            </div>
          </div>
        )}

        <form action={sendAction} className="grid gap-3">
          <input type="hidden" name="businessId" value={businessId} />
          <input type="hidden" name="locale" value={locale} />
          <label className="grid gap-1.5 text-[12px] font-extrabold text-ink">
            İşletme sahibinin e-postası
            <input name="email" type="email" required defaultValue={invite?.email ?? ""} placeholder="sahip@isletme.com" className="h-10 rounded-[8px] border border-line bg-white px-3 text-[13px] font-semibold outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10" />
          </label>
          <Feedback state={sendState} />
          <SubmitButton pending={sendPending}>{activeInvite ? <RefreshCw size={14} aria-hidden /> : <Send size={14} aria-hidden />}{activeInvite ? "Yeni bağlantı gönder" : "Sahibi davet et"}</SubmitButton>
        </form>

        {activeInvite && (
          <form action={cancelAction} className="grid gap-3 border-t border-line pt-3">
            <input type="hidden" name="businessId" value={businessId} />
            <input type="hidden" name="inviteId" value={invite.id} />
            <input type="hidden" name="locale" value={locale} />
            <Feedback state={cancelState} />
            <SubmitButton pending={cancelPending} tone="danger"><XCircle size={14} aria-hidden />Daveti iptal et</SubmitButton>
          </form>
        )}
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = status === "pending"
    ? { label: "Davet bekliyor", className: "bg-amber-100 text-amber-800" }
    : status === "expired"
      ? { label: "Süresi doldu", className: "bg-red-100 text-red-700" }
      : status === "revoked"
        ? { label: "İptal edildi", className: "bg-slate-100 text-slate-600" }
        : { label: "Sahipsiz", className: "bg-blue-100 text-brand" };
  return <span className={cn("ms-auto rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[.06em]", config.className)}>{config.label}</span>;
}

function formatExpiry(value: string, status: string) {
  if (status === "expired") return "Süresi doldu";
  const formatted = new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  return `${formatted} tarihine kadar geçerli`;
}
