import Image from "next/image";
import Link from "next/link";
import HeroSearch from "@/components/HeroSearch";
import { s } from "./styles";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E\")";

const POPULAR = [
  { href: "/listeleme?city=İstanbul&cat=konaklama", label: "İstanbul otelleri" },
  { href: "/listeleme?city=Nevşehir&q=balon", label: "Kapadokya turları" },
  { href: "/listeleme?city=Antalya&cat=acente", label: "Antalya acenteleri" },
  { href: "/listeleme?cat=saglik&city=Ankara", label: "Ankara sağlık" },
];

const STATS = [
  { n: "4.700+", l: "kayıtlı tedarikçi" },
  { n: "18", l: "il / bölge" },
  { n: "3", l: "ülke" },
  { n: "~4 sa", l: "ort. yanıt" },
];

/* Eski HTML'deki hero görseli + degrade + grain + güven şeridi (Next/Image ile). */
export default function Hero() {
  return (
    <section className={s.section}>
      <Image
        src="/assets/hero-turizm-b2b-v2.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className={`-z-10 ${s.image}`}
      />
      <div className={s.overlay} />
      <div className={s.grain} style={{ backgroundImage: GRAIN }} />

      <div className={s.inner}>
        <p className={s.eyebrow}>B2B Turizm Tedarikçi Ağı</p>
        <h1 className={s.title}>
          Turizm tedarikçilerini <em>tek panoda</em> keşfedin.
        </h1>
        <p className={s.sub}>
          Konaklama, acente, rehber, eğlence ve sağlık turizmi tedarikçilerini filtreleyin.
          Üye acenteler tam listeye ve detaylara erişir.
        </p>

        <div className={s.searchWrap}>
          <HeroSearch />
        </div>

        <div className={s.pop}>
          <span className={s.popLabel}>Popüler:</span>
          {POPULAR.map((p) => (
            <Link key={p.href} href={p.href} className={s.popLink}>{p.label}</Link>
          ))}
        </div>

        <div className={s.stats} aria-label="Platform istatistikleri">
          {STATS.map((st) => (
            <div key={st.l} className={s.stat}>
              <strong className={s.statNum}>{st.n}</strong>
              <span className={s.statLabel}>{st.l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
