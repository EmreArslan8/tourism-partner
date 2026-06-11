import Link from "next/link";
import type { Metadata } from "next";
import { CATEGORY_GROUPS } from "@/lib/categories";

export const metadata: Metadata = { title: "Firma Ekle — Tourism Partner" };

const fieldCls = "field h-[46px] font-normal";
const labelCls = "flex flex-col gap-1.5 text-[13px] font-semibold";

/* Faz 1 yer tutucu — kayıt + onay akışı Faz 2-3'te. İşletme kategorisini seçer. */
export default function KayitPage() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-5 py-[60px]">
      <div className="w-full max-w-[480px] rounded-[18px] border border-line bg-paper p-[34px] shadow-card">
        <p className="eyebrow">Firma Ekle</p>
        <h1 className="mb-2 text-[28px]">İşletmenizi listeleyin</h1>
        <p className="mb-[22px] text-[14.5px] text-muted">
          İlk 200 acente ücretsiz. İlanınız onaydan sonra yayına girer; ilk 24 saatte
          kaydolursanız 1 günlük hediye doping kazanırsınız.
        </p>
        <form className="flex flex-col gap-3.5">
          <label className={labelCls}>
            İşletme adı
            <input type="text" placeholder="Örn. Kaya Palas Hotel" className={fieldCls} />
          </label>
          <label className={labelCls}>
            Kategori
            <select defaultValue="" className={fieldCls}>
              <option value="" disabled>Seçin…</option>
              {CATEGORY_GROUPS.flatMap((g) =>
                g.children.map((c) => (
                  <option key={c.slug} value={c.slug}>{g.label} › {c.label}</option>
                ))
              )}
            </select>
          </label>
          <label className={labelCls}>
            E-posta
            <input type="email" placeholder="ornek@isletme.com" className={fieldCls} />
          </label>
          <button type="button" className="btn btn-solid btn-block mt-1.5 disabled:opacity-60" disabled>
            Kaydı Tamamla (yakında)
          </button>
        </form>
        <p className="mt-[18px] text-center text-[14px] text-muted">
          Zaten üye misiniz? <Link href="/giris" className="font-semibold text-terra">Giriş yapın</Link>
        </p>
      </div>
    </main>
  );
}
