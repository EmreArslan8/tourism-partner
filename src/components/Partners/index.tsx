import { s } from "./styles";

const BRANDS = [
  "Turkish Airlines",
  "Marriott Bonvoy",
  "Hilton Honors",
  "SunExpress",
  "Setur",
  "Jolly Tur",
  "Pegasus",
  "Corendon",
  "Coral Travel",
  "Etihad Airways",
  "Emirates",
  "Accor Hotels",
];

export default function Partners() {
  // Sonsuz döngü için listeyi ikiye katlıyoruz
  const list = [...BRANDS, ...BRANDS];

  return (
    <section className={s.section}>
      <div className={s.container}>
        <div className={s.track}>
          {list.map((brand, i) => (
            <div key={i} className={s.item}>
              {/* Demo olduğu için gerçek logo yerine isim + ikonumsu yapı */}
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-[12px] font-bold text-cream">
                {brand.charAt(0)}
              </div>
              <span className={s.name}>{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
