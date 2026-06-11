import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Giriş Yap — Tourism Partner" };

/* Faz 1 yer tutucu — gerçek kimlik doğrulama Faz 2'de Supabase ile bağlanacak. */
export default function GirisPage() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-5 py-[60px]">
      <div className="w-full max-w-[420px] rounded-[18px] border border-line bg-paper p-[34px] shadow-card">
        <p className="eyebrow">Üye Girişi</p>
        <h1 className="mb-2 text-[28px]">Tekrar hoş geldiniz</h1>
        <p className="mb-[22px] text-[14.5px] text-muted">
          Tam tedarikçi listesine ve detaylara erişmek için giriş yapın.
        </p>
        <form className="flex flex-col gap-3.5">
          <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
            E-posta
            <input type="email" placeholder="ornek@acente.com" className="field h-[46px] font-normal" />
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
            Şifre
            <input type="password" placeholder="••••••••" className="field h-[46px] font-normal" />
          </label>
          <button type="button" className="btn btn-solid btn-block mt-1.5 disabled:opacity-60" disabled>
            Giriş Yap (yakında)
          </button>
        </form>
        <p className="mt-[18px] text-center text-[14px] text-muted">
          Hesabınız yok mu? <Link href="/kayit" className="font-semibold text-terra">Ücretsiz üye olun</Link>
        </p>
      </div>
    </main>
  );
}
