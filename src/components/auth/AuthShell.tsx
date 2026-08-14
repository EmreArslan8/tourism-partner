import { connection } from "next/server";
import { ShieldCheck, LayoutGrid, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Logo from "@/components/Logo";
import styles from "./styles";

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
    <div className={styles.shell}>
      {/* Sol marka paneli — ekran kenarına bitişik; yalnızca forma bakan sağ köşeler yuvarlak */}
      <aside className={styles.brandPanel}>
        <div aria-hidden className={styles.glowTop} />
        <div aria-hidden className={styles.glowBottom} />

        {/* Logo (beyaz varyant, koyu panel) + slogan */}
        <div className={styles.brandIntro}>
          <Logo href="/" variant="light" height={58} priority />
          <p className={styles.slogan}>{t("brandSlogan")}</p>
        </div>

        <ul className={styles.benefits}>
          {bullets.map(({ Icon, title, desc }) => (
            <li key={title} className={styles.benefit}>
              <span className={styles.benefitIcon}>
                <Icon size={20} aria-hidden />
              </span>
              <span className={styles.benefitCopy}>
                <span className={styles.benefitTitle}>{title}</span>
                <span className={styles.benefitDescription}>{desc}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className={styles.footer}>
          <Link
            href={{ pathname: "/help" }}
            className={styles.helpLink}
          >
            {t("help")}
          </Link>
          <p className={styles.legal}>
            <span>© {year} {t("brandName")}.</span>
            <Link href={{ pathname: "/terms" }} className={styles.legalLink}>{t("terms")}</Link>
            <Link href={{ pathname: "/privacy" }} className={styles.legalLink}>{t("privacy")}</Link>
          </p>
        </div>
      </aside>

      {/* Sağ — kendi içinde dikey akış (başlık sabit, gövde scroll, CTA sticky) */}
      <section className={styles.content}>
        {/* Mobil header — sol panel yerine */}
        <header className={styles.mobileHeader}>
          <Logo href="/" variant="brand" height={36} />
          <span className={styles.mobileTrust}>{t("b1t")}</span>
        </header>
        <div className={styles.contentBody}>{children}</div>
      </section>
    </div>
  );
}
