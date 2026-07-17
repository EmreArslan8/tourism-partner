"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, KeyRound, Loader2, ShieldCheck, ShieldOff, UserCog } from "lucide-react";
import { changePassword, disableTotp, enrollTotp, verifyTotp } from "@/lib/actions/account";
import { setUserRole } from "@/lib/actions/roles";
import type { AdminUser } from "@/lib/admin-users";
import { adminUi } from "../_ui";
import { cn } from "@/lib/utils";

/* Client-safe yerel kart (admin _components server-only zincir çektiği için
   burada import edilemez). */
const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <section className={cn("overflow-hidden", adminUi.panel, className)}>{children}</section>
);

const CardHeader = ({ icon, title, action }: { icon?: React.ReactNode; tone?: string; title: string; action?: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-3 border-b border-line/80 px-5 py-4">
    <div className="flex min-w-0 items-center gap-3">
      {icon && <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-cream text-brand">{icon}</span>}
      <h3 className="truncate text-[15px] font-medium text-ink">{title}</h3>
    </div>
    {action}
  </div>
);

/* -------------------- İki Faktörlü Doğrulama (2FA / TOTP) -------------------- */
export function TwoFactorPanel({ enabled, factorId }: { enabled: boolean; factorId: string | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [enroll, setEnroll] = useState<{ factorId: string; qrCode: string; secret: string } | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const beginEnroll = () =>
    startTransition(async () => {
      setError(null);
      const res = await enrollTotp();
      if (res.ok) setEnroll({ factorId: res.factorId, qrCode: res.qrCode, secret: res.secret });
      else setError("2FA başlatılamadı: " + res.error);
    });

  const submitVerify = () =>
    startTransition(async () => {
      setError(null);
      if (!enroll) return;
      const fd = new FormData();
      fd.set("factorId", enroll.factorId);
      fd.set("code", code);
      const res = await verifyTotp(fd);
      if (res.ok) {
        setEnroll(null);
        setCode("");
        router.refresh();
      } else {
        setError(res.error === "invalid_code" ? "Kod 6 haneli olmalı." : "Doğrulama başarısız: " + res.error);
      }
    });

  const remove = () =>
    startTransition(async () => {
      setError(null);
      if (!factorId) return;
      const fd = new FormData();
      fd.set("factorId", factorId);
      const res = await disableTotp(fd);
      if (res.ok) router.refresh();
      else setError("Kaldırılamadı: " + res.error);
    });

  return (
    <Card className="overflow-hidden hover:translate-y-0">
      <CardHeader title="İki Faktörlü Doğrulama (2FA)" tone="blue" icon={<ShieldCheck size={18} aria-hidden />} action={
        <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[12px] font-extrabold", enabled ? "bg-emerald-100 text-emerald-700" : "bg-cream text-muted")}>
          {enabled ? "Aktif" : "Kapalı"}
        </span>
      } />

      <div className="grid gap-3 p-4">
        {enabled ? (
          <>
            <p className="text-[13px] font-medium text-muted">
              Hesabın authenticator uygulaması ile korunuyor. Girişte 6 haneli kod istenir.
            </p>
            <button type="button" onClick={remove} disabled={pending} className={cn(adminUi.ghostButton, "justify-self-start text-red-600")}>
              {pending ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <ShieldOff size={15} aria-hidden />}
              {"2FA'yı Kaldır"}
            </button>
          </>
        ) : enroll ? (
          <div className="grid gap-3">
            <p className="text-[13px] font-medium text-muted">
              {"1) Google Authenticator / Authy ile QR'ı okut. 2) Uygulamadaki 6 haneli kodu gir."}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div
                className="grid h-[168px] w-[168px] shrink-0 place-items-center rounded-[8px] border border-line bg-white p-2 [&_svg]:h-full [&_svg]:w-full"
                // Supabase QR'ı ham SVG döner; data URI ise img'e düşülür.
                dangerouslySetInnerHTML={enroll.qrCode.trim().startsWith("<svg") ? { __html: enroll.qrCode } : undefined}
              >
                {enroll.qrCode.trim().startsWith("<svg") ? undefined : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={enroll.qrCode} alt="2FA QR kodu" className="h-full w-full" />
                )}
              </div>
              <div className="min-w-[200px] flex-1">
                <p className="text-[12px] font-bold uppercase tracking-[.06em] text-muted">Manuel kod</p>
                <code className="mt-1 block break-all rounded-[7px] border border-line bg-cream/50 px-2.5 py-2 text-[13px] font-bold text-ink">{enroll.secret}</code>
                <input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="6 haneli kod"
                  className={cn(adminUi.input, "mt-3 h-11 tracking-[.3em]")}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={submitVerify} disabled={pending || code.length !== 6} className={adminUi.sapphireButton}>
                {pending ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <Check size={15} aria-hidden />}
                Doğrula ve Etkinleştir
              </button>
              <button type="button" onClick={() => { setEnroll(null); setCode(""); setError(null); }} disabled={pending} className={adminUi.ghostButton}>
                Vazgeç
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-[13px] font-medium text-muted">
              Admin hesabını authenticator uygulamasıyla koru. Etkinleştirdikten sonra her girişte tek kullanımlık kod istenir.
            </p>
            <button type="button" onClick={beginEnroll} disabled={pending} className={cn(adminUi.sapphireButton, "justify-self-start")}>
              {pending ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <ShieldCheck size={15} aria-hidden />}
              {"2FA'yı Etkinleştir"}
            </button>
          </>
        )}

        {error && <p className="text-[13px] font-medium text-red-600">{error}</p>}
      </div>
    </Card>
  );
}

/* -------------------- Rol / Yetki Yönetimi -------------------- */
export function RolesPanel({ users, currentUserId }: { users: AdminUser[]; currentUserId?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const changeRole = (userId: string, role: string) =>
    startTransition(async () => {
      setError(null);
      setBusyId(userId);
      const fd = new FormData();
      fd.set("userId", userId);
      fd.set("role", role);
      const res = await setUserRole(fd);
      setBusyId(null);
      if (res.ok) router.refresh();
      else
        setError(
          res.error === "self_demote" ? "Kendi admin yetkini kaldıramazsın." : "Güncellenemedi: " + res.error,
        );
    });

  return (
    <Card className="overflow-hidden hover:translate-y-0">
      <CardHeader title="Yetki Yönetimi (Admin/Personel)" tone="blue" icon={<UserCog size={18} aria-hidden />} action={
        <span className="shrink-0 text-[12px] font-semibold text-muted">{users.length} kullanıcı</span>
      } />
      <div className="grid gap-2 p-4">
        {users.length === 0 ? (
          <p className="rounded-[8px] bg-cream/50 p-3 text-[13px] font-semibold text-muted">Kullanıcı bulunamadı.</p>
        ) : (
          users.map((user) => {
            const isAdmin = user.role === "admin";
            const isSelf = user.id === currentUserId;
            return (
              <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-line bg-cream/35 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-extrabold text-ink">
                    {user.email ?? user.fullName ?? user.id.slice(0, 8)}
                    {isSelf && <span className="ml-2 text-[11px] font-bold text-muted">(sen)</span>}
                  </p>
                  <p className="mt-0.5 text-[12px] font-medium text-muted">
                    {user.fullName ? `${user.fullName} · ` : ""}{user.accountType}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("rounded-full px-2.5 py-1 text-[11.5px] font-extrabold", isAdmin ? "bg-sapphire/15 text-sapphire" : "bg-cream text-muted")}>
                    {isAdmin ? "Admin" : "Partner"}
                  </span>
                  <button
                    type="button"
                    disabled={pending || (isSelf && isAdmin)}
                    onClick={() => changeRole(user.id, isAdmin ? "partner" : "admin")}
                    className={cn(adminUi.ghostButton, "h-8 px-2.5 text-[12.5px]", isSelf && isAdmin && "opacity-40")}
                    title={isSelf && isAdmin ? "Kendi admin yetkini kaldıramazsın" : undefined}
                  >
                    {busyId === user.id ? <Loader2 size={14} className="animate-spin" aria-hidden /> : isAdmin ? "Admin'i kaldır" : "Admin yap"}
                  </button>
                </div>
              </div>
            );
          })
        )}
        {error && <p className="text-[13px] font-medium text-red-600">{error}</p>}
      </div>
    </Card>
  );
}

/* -------------------- Şifre Değiştirme -------------------- */
export function PasswordPanel() {
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = (formData: FormData) =>
    startTransition(async () => {
      setMsg(null);
      const res = await changePassword(formData);
      if (res.ok) setMsg({ ok: true, text: "Şifre güncellendi." });
      else
        setMsg({
          ok: false,
          text:
            res.error === "too_short" ? "Şifre en az 8 karakter olmalı." :
            res.error === "mismatch" ? "Şifreler eşleşmiyor." :
            "Güncellenemedi: " + res.error,
        });
    });

  return (
    <Card className="overflow-hidden hover:translate-y-0">
      <CardHeader title="Şifre Değiştir" tone="amber" icon={<KeyRound size={18} aria-hidden />} />
      <form action={submit} className="grid max-w-[420px] gap-3 p-4">
        <input name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="Yeni şifre (min 8)" className={cn(adminUi.input, "h-11")} />
        <input name="confirm" type="password" required minLength={8} autoComplete="new-password" placeholder="Yeni şifre (tekrar)" className={cn(adminUi.input, "h-11")} />
        <button type="submit" disabled={pending} className={cn(adminUi.sapphireButton, "justify-self-start")}>
          {pending ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <Check size={15} aria-hidden />}
          Şifreyi Güncelle
        </button>
        {msg && <p className={cn("text-[13px] font-medium", msg.ok ? "text-emerald-700" : "text-red-600")}>{msg.text}</p>}
      </form>
    </Card>
  );
}
