import Link from "next/link";
import { CATEGORY_GROUPS, GROUP_COLORS } from "@/lib/categories";
import { BUSINESSES } from "@/lib/data";
import type { GroupKey } from "@/lib/types";
import { s } from "./styles";

const ICONS: Record<GroupKey, React.ReactNode> = {
  konaklama: <path d="M3 20V8l7-3v15M10 9l11 3v8M2 20h20M6 11h1.5M6 14h1.5M14 14h1.5M17 15h1.5" />,
  acente: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c-2.6 2.4-4 5.5-4 9s1.4 6.6 4 9c2.6-2.4 4-5.5 4-9s-1.4-6.6-4-9Z" /></>,
  rehber: <path d="M6 3v18M6 4h12l-2.5 3.5L18 11H6" />,
  eglence: <><circle cx="12" cy="9" r="6" /><path d="M12 15v4M10 21h4" /></>,
  saglik: <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10ZM12 9v4M10 11h4" />,
};

/* Ana sayfa kategori girişi — yatay kartlar, /listeleme'ye yönlendirir. */
export default function Categories() {
  const counts = BUSINESSES.reduce<Record<string, number>>((acc, b) => {
    acc[b.group] = (acc[b.group] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className={s.section} id="kategoriler">
      <div className={s.head}>
        <div>
          <p className="eyebrow">Keşfet</p>
          <h2 className={s.headTitle}>Kategoriye göz atın</h2>
        </div>
        <Link href="/listeleme" className={s.more}>Tümünü gör →</Link>
      </div>
      <div className={s.grid}>
        {CATEGORY_GROUPS.map((g) => (
          <Link key={g.key} href={`/listeleme?cat=${g.key}`} className={s.card}>
            <span className={s.icon} style={{ background: `${GROUP_COLORS[g.key]}1a`, color: GROUP_COLORS[g.key] }}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                {ICONS[g.key]}
              </svg>
            </span>
            <h3 className={s.name}>{g.label}</h3>
            <p className={s.count}>{counts[g.key] ?? 0} tedarikçi</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
