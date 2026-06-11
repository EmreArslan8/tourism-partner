import Link from "next/link";
import MobileMenu from "@/components/MobileMenu";
import { s } from "./styles";

/* Sunucu bileşeni — statik. Giriş/üyelik butonları (auth Faz 2'de bağlanacak). */
export default function SiteHeader() {
  return (
    <header className={s.header}>
      <div className={s.inner}>
        <Link href="/" className={s.logo} aria-label="Tourism Partner">
          <span className={s.logoType}>
            <span className={s.logoTop}>TOURISM</span>
            <span className={s.logoBottom}>PARTNER</span>
          </span>
          <svg viewBox="0 -8 98 86" className={s.mark} aria-hidden focusable="false">
            <path d="M6 24C27 4 60 5 78 28c10 13 11 30 4 44 13-20 8-48-11-62C49-7 21 2 6 24Z" />
            <path d="M17 31c19-10 44-5 58 13 7 10 9 23 5 33 9-17 3-38-13-49-15-10-34-10-50 3Z" />
          </svg>
        </Link>

        <nav className={s.nav}>
          <Link href="/" className={s.navLink}>Anasayfa</Link>
          <Link href="/listeleme" className={s.navLink}>Keşfet</Link>
          <Link href="/#nasil" className={s.navLink}>Nasıl Çalışır</Link>
          <Link href="/teklif" className={s.navLink}>Teklif Al</Link>
          <Link href="/#sss" className={s.navLink}>SSS</Link>
        </nav>

        <div className={s.actions}>
          <Link href="/giris" className="btn btn-outline btn-sm">Giriş Yap</Link>
          <Link href="/kayit" className="btn btn-solid btn-sm">+ Firma Ekle</Link>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
