"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, Eye, EyeOff, KeyRound, LockKeyhole, Mail, UserRoundPlus } from "lucide-react";
import {
  acceptBusinessOwnerInvite,
  signInAndAcceptBusinessInvite,
  signUpAndAcceptBusinessInvite,
  switchBusinessInviteAccount,
  type BusinessInviteActionState,
} from "@/lib/actions/business-owner-invite";
import type { PublicBusinessInvite } from "@/lib/business-owner-invites";
import { cn } from "@/lib/utils";

const initialState: BusinessInviteActionState = { ok: false };

const errorText: Record<string, string> = {
  invalid: "Bu davet bağlantısı geçersiz.",
  expired: "Bu davetin süresi dolmuş. İşletme yöneticisinden yeni davet isteyin.",
  revoked: "Bu davet iptal edilmiş.",
  email_mismatch: "Giriş yaptığınız hesap bu davetin gönderildiği e-posta ile eşleşmiyor.",
  already_has_business: "Bu hesap zaten başka bir işletmeye bağlı.",
  business_claimed: "Bu işletme başka bir hesap tarafından teslim alınmış.",
  credentials: "Şifre hatalı. Tekrar deneyin.",
  password_required: "Şifrenizi girin.",
  name_required: "Adınızı ve soyadınızı girin.",
  password_short: "Şifre en az 8 karakter olmalı.",
  password_mismatch: "Şifreler birbiriyle eşleşmiyor.",
  account_exists: "Bu e-posta ile bir hesap zaten var. ‘Hesabım var’ bölümünden giriş yapın.",
  rate: "Çok fazla deneme yapıldı. Lütfen bir süre sonra tekrar deneyin.",
  signup_failed: "Hesap oluşturulamadı. Lütfen tekrar deneyin.",
  accept_failed: "İşletme teslim alınamadı. Lütfen tekrar deneyin.",
};

function Feedback({ state }: { state: BusinessInviteActionState }) {
  if (state.notice === "verify_email") {
    return (
      <div className="flex gap-3 rounded-[10px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900">
        <Mail size={18} className="mt-0.5 shrink-0" aria-hidden />
        <p className="text-[13px] font-semibold leading-5">Doğrulama e-postası gönderildi. E-postadaki bağlantıya tıkladığınızda işletmeniz hesabınıza bağlanacak.</p>
      </div>
    );
  }
  if (!state.error) return null;
  return <p role="alert" className="rounded-[9px] border border-red-200 bg-red-50 px-3.5 py-3 text-[13px] font-semibold leading-5 text-red-700">{errorText[state.error] ?? "İşlem tamamlanamadı. Lütfen tekrar deneyin."}</p>;
}

function PasswordField({ name, label, autoComplete }: { name: string; label: string; autoComplete: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="grid gap-2 text-[13.5px] font-bold text-ink">
      {label}
      <span className="relative">
        <input
          name={name}
          type={visible ? "text" : "password"}
          required
          minLength={name === "password" && autoComplete === "new-password" ? 8 : undefined}
          autoComplete={autoComplete}
          className="field h-[52px] w-full pe-12 text-[15px] font-semibold"
          placeholder="••••••••"
        />
        <button type="button" onClick={() => setVisible((value) => !value)} className="absolute end-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-brand" aria-label={visible ? "Şifreyi gizle" : "Şifreyi göster"}>
          {visible ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
        </button>
      </span>
    </label>
  );
}

function SubmitButton({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={pending} className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[9px] bg-brand px-5 text-[14px] font-extrabold text-white shadow-[0_12px_26px_-16px_rgba(15,59,176,.8)] transition hover:bg-[#0b318f] disabled:cursor-wait disabled:opacity-65">
      {pending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" aria-hidden /> : null}
      {children}
    </button>
  );
}

export default function BusinessInviteForm({ invite, locale, token }: { invite: PublicBusinessInvite; locale: string; token: string }) {
  const [loginState, loginAction, loginPending] = useActionState(signInAndAcceptBusinessInvite, initialState);
  const [registerState, registerAction, registerPending] = useActionState(signUpAndAcceptBusinessInvite, initialState);
  const [acceptState, acceptAction, acceptPending] = useActionState(acceptBusinessOwnerInvite, initialState);
  const viewerMatches = Boolean(invite.viewerEmail && invite.viewerEmail === invite.email.toLowerCase());
  const existingAccount = registerState.error === "account_exists";

  if (invite.viewerId) {
    return (
      <div className="grid gap-5">
        <div className={cn("rounded-[12px] border p-4", viewerMatches ? "border-emerald-200 bg-emerald-50/70" : "border-amber-200 bg-amber-50/70")}>
          <div className="flex items-start gap-3">
            {viewerMatches ? <CheckCircle2 size={21} className="mt-0.5 shrink-0 text-emerald-700" aria-hidden /> : <LockKeyhole size={21} className="mt-0.5 shrink-0 text-amber-700" aria-hidden />}
            <div>
              <p className="text-[14px] font-extrabold text-ink">{viewerMatches ? "E-posta eşleşti" : "Farklı bir hesapla giriş yapılmış"}</p>
              <p className="mt-1 text-[13px] font-semibold leading-5 text-muted">Şu an: {invite.viewerEmail}</p>
            </div>
          </div>
        </div>

        {viewerMatches ? (
          <form action={acceptAction} className="grid gap-4">
            <input type="hidden" name="token" value={token} />
            <input type="hidden" name="locale" value={locale} />
            <Feedback state={acceptState} />
            <SubmitButton pending={acceptPending}>İşletmeyi teslim al ve panele geç</SubmitButton>
          </form>
        ) : (
          <form action={switchBusinessInviteAccount}>
            <input type="hidden" name="token" value={token} />
            <input type="hidden" name="locale" value={locale} />
            <SubmitButton pending={false}>Doğru hesapla giriş yap</SubmitButton>
          </form>
        )}
      </div>
    );
  }

  if (registerState.notice === "verify_email") {
    return (
      <div className="grid gap-5 rounded-[12px] border border-emerald-200 bg-emerald-50/75 p-5 text-emerald-950">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <Mail size={21} aria-hidden />
        </span>
        <div>
          <h2 className="text-[19px] font-extrabold text-ink">E-postanızı doğrulayın</h2>
          <p className="mt-2 text-[13.5px] font-semibold leading-6 text-muted">
            Doğrulama bağlantısını <strong className="text-ink">{invite.email}</strong> adresine gönderdik. Bağlantıya tıkladığınızda işletme otomatik olarak hesabınıza bağlanacak.
          </p>
        </div>
        <p className="rounded-[9px] border border-emerald-200 bg-white/70 px-3.5 py-3 text-[12px] font-bold leading-5 text-emerald-800">
          E-posta gelmediyse spam klasörünü kontrol edin. Yeni gönderim için sayfayı yenileyebilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <div className="flex items-center gap-3 rounded-[10px] border border-line bg-cream/45 px-4 py-3">
        <Mail size={18} className="shrink-0 text-brand" aria-hidden />
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[.08em] text-muted">Davet e-postası</p>
          <p className="truncate text-[14px] font-extrabold text-ink">{invite.email}</p>
        </div>
      </div>

      {existingAccount ? (
        <div className="grid gap-4">
          <div className="rounded-[10px] border border-blue-200 bg-blue-50 px-4 py-3">
            <p className="text-[13px] font-extrabold text-ink">Bu e-postaya bağlı bir hesap bulundu</p>
            <p className="mt-1 text-[12.5px] font-semibold leading-5 text-muted">Yeni hesap açmak yerine mevcut şifrenizi girerek işletmeyi teslim alabilirsiniz.</p>
          </div>
          <form action={loginAction} className="grid gap-4">
            <input type="hidden" name="token" value={token} />
            <input type="hidden" name="locale" value={locale} />
            <PasswordField name="password" label="Mevcut hesap şifreniz" autoComplete="current-password" />
            <Feedback state={loginState} />
            <SubmitButton pending={loginPending}><KeyRound size={17} aria-hidden /> Giriş yap ve teslim al</SubmitButton>
          </form>
        </div>
      ) : (
        <form action={registerAction} className="grid gap-4">
          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="locale" value={locale} />
          <label className="grid gap-2 text-[13.5px] font-bold text-ink">
            Adınız ve soyadınız
            <input name="fullName" required minLength={2} autoComplete="name" className="field h-[52px] w-full text-[15px] font-semibold" placeholder="Ad Soyad" />
          </label>
          <PasswordField name="password" label="Şifre oluşturun" autoComplete="new-password" />
          <PasswordField name="confirm" label="Şifreyi tekrar girin" autoComplete="new-password" />
          <Feedback state={registerState} />
          <SubmitButton pending={registerPending}><UserRoundPlus size={17} aria-hidden /> Hesap oluştur ve teslim al</SubmitButton>
        </form>
      )}
    </div>
  );
}
