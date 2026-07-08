import { connection } from "next/server";
import { ShieldCheck, LayoutGrid, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Logo from "@/components/Logo";

/*
 * Auth split-screen kabuğu (kayıt/giriş için yeniden kullanılır).
 * - Tüm ekran yüksekliği; sayfa scroll etmez. Sol panel + sağ üst başlık sabit,
 *   sadece sağdaki gövde (children içindeki orta bölge) scroll eder.
 * - Sol: daraltılmış marka paneli (~340px) — masaüstünde. Mobilde tamamen kalkar,
 *   yerine üstte küçük bir marka/güven header'ı gelir.
 * - Görsel/foto yok; ikon + renk + gölge ile.
 */
export default async function AuthShell({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("register");
  // new Date() (deterministik olmayan) — Cache Components için önce dinamik kaynağı oku.
  await connection();
  const year = new Date().getFullYear();

  const bullets = [
    { Icon: ShieldCheck, title: t("b1t"), desc: t("b1d") },
    { Icon: LayoutGrid, title: t("b2t"), desc: t("b2d") },
    { Icon: Sparkles, title: t("b3t"), desc: t("b3d") },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      {/* Sol marka paneli — ekran kenarına bitişik; yalnızca forma bakan sağ köşeler yuvarlak */}
      <aside className="relative hidden w-[400px] shrink-0 flex-col justify-between overflow-hidden rounded-r-[36px] bg-[linear-gradient(158deg,#0a2472_0%,#0f3bb0_100%)] p-10 text-white shadow-[0_24px_70px_-34px_rgba(10,36,114,.75)] lg:flex">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-white/5 blur-2xl" />

        {/* Logo (beyaz varyant, koyu panel) + slogan */}
        <div className="relative">
          <Logo href="/" variant="light" height={58} priority />
          <p className="mt-3 text-[15px] font-medium ">{t("brandSlogan")}</p>
        </div>

        <ul className="relative flex flex-col gap-8">
          {bullets.map(({ Icon, title, desc }) => (
            <li key={title} className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-terra shadow-[0_8px_18px_-8px_rgba(0,0,0,.45)]">
                <Icon size={20} aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-[14.5px] font-bold leading-snug">{title}</span>
                <span className="mt-1.5 block text-[12.5px] leading-relaxed text-white/65">{desc}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="relative flex flex-col gap-3">
          <Link
            href={{ pathname: "/" }}
            className="inline-flex w-fit items-center rounded-pill bg-white/12 px-4 py-2 text-[13px] font-semibold text-white ring-1 ring-white/15 transition-colors hover:bg-white/20"
          >
            {t("help")}
          </Link>
          <p className="flex items-center gap-3 text-[11.5px] text-white/45">
            <span>© {year} {t("brandName")}.</span>
            <Link href={{ pathname: "/" }} className="transition-colors hover:text-white/80">{t("terms")}</Link>
            <Link href={{ pathname: "/" }} className="transition-colors hover:text-white/80">{t("privacy")}</Link>
          </p>
        </div>
      </aside>

      {/* Sağ — kendi içinde dikey akış (başlık sabit, gövde scroll, CTA sticky) */}
      <section className="flex min-h-0 min-w-0 flex-1 flex-col">
        {/* Mobil header — sol panel yerine */}
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-line bg-paper px-5 py-3 lg:hidden">
          <Logo href="/" variant="brand" height={36} />
          <span className="text-[11.5px] font-medium text-muted">{t("b1t")}</span>
        </header>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </section>
    </div>
  );
}
