import Link from "next/link";
import { SPONSORED } from "@/lib/data";
import SupplierCard from "@/components/SupplierCard";
import { s } from "./styles";

/* Landing vitrini — yalnızca bizim seçtiğimiz (sponsored) işletmeler reklam olarak.
   Giriş öncesi görünür; detay için giriş gerekir. Server bileşeni (sıfır JS). */
export default function Showcase() {
  return (
    <section id="vitrin">
      <div className={s.head}>
        <div>
          <p className="eyebrow">Vitrin</p>
          <h2 className={s.title}>Öne çıkan iş ortakları</h2>
          <p className={s.sub}>Reklam alanı — editör seçkisi</p>
        </div>
        <Link href="/listeleme" className={s.more}>Tümünü gör →</Link>
      </div>

      <div className={s.rail}>
        {SPONSORED.slice(0, 4).map((b) => (
          <SupplierCard key={b.id} business={b} flag="Reklam">
            <span className="mr-auto text-[14px] font-bold text-gold">
              ★ {b.rating.toFixed(1)} <small className="font-medium text-muted">({b.reviews})</small>
            </span>
            <Link href="/giris" className="btn btn-outline btn-sm">Detay için giriş</Link>
          </SupplierCard>
        ))}
      </div>
    </section>
  );
}
