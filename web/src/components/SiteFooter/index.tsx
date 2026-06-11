import Link from "next/link";
import { s } from "./styles";

export default function SiteFooter() {
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <div>
          <span className={s.brandType}>
            <span className={s.brandTop}>TOURISM</span>
            <span className={s.brandBottom}>PARTNER</span>
          </span>
          <p className={s.brandText}>
            B2B turizm tedarikçi ağı. Oteller, acenteler, rehberler, tur firmaları,
            eğlence ve sağlık turizmi için ortak vitrin.
          </p>
        </div>
        <div>
          <h4 className={s.colTitle}>Kategoriler</h4>
          <Link href="/listeleme?cat=konaklama" className={s.colLink}>Konaklama</Link>
          <Link href="/listeleme?cat=acente" className={s.colLink}>Acente &amp; Tur</Link>
          <Link href="/listeleme?cat=eglence" className={s.colLink}>Eğlence</Link>
          <Link href="/listeleme?cat=saglik" className={s.colLink}>Sağlık Turizmi</Link>
        </div>
        <div>
          <h4 className={s.colTitle}>Platform</h4>
          <Link href="/#nasil" className={s.colLink}>Nasıl çalışır?</Link>
          <Link href="/kayit" className={s.colLink}>Firma ekle</Link>
          <Link href="/giris" className={s.colLink}>Üye girişi</Link>
        </div>
        <div>
          <h4 className={s.colTitle}>Üyelik</h4>
          <p className={s.noteSm}>
            İlk 200 acenteye <strong className={s.noteStrong}>ücretsiz</strong> kayıt.
            Listelenme yıllık üyelik ile; doping tercihe bağlı.
          </p>
        </div>
      </div>
      <div className={s.base}>
        <span>© 2026 Tourism Partner — Demo</span>
        <span>Ülke · Şehir · İlçe bazlı B2B listeleme</span>
      </div>
    </footer>
  );
}
