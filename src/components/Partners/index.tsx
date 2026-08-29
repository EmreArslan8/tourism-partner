import styles from "./styles";

export type PartnerBrand = { name: string; premium: boolean };

/* Admin onayından geçmiş gerçek işletmeler için kenar fade maskeli marquee. */
const Partners = ({ brands }: { brands: PartnerBrand[] }) => {
  const uniqueBrandMap = new Map<string, PartnerBrand>();
  for (const rawBrand of brands) {
    const name = rawBrand.name.trim();
    if (!name) continue;
    const key = name.toLocaleLowerCase("tr");
    const current = uniqueBrandMap.get(key);
    uniqueBrandMap.set(key, { name: current?.name ?? name, premium: Boolean(current?.premium || rawBrand.premium) });
  }
  const uniqueBrands = Array.from(uniqueBrandMap.values());
  if (uniqueBrands.length === 0) return null;

  // Az işletme olduğunda da şerit ekranı doldursun; ikinci kopya sonsuz döngüyü sağlar.
  const minimumCycleLength = 8;
  const cycle = Array.from(
    { length: Math.max(minimumCycleLength, uniqueBrands.length) },
    (_, index) => uniqueBrands[index % uniqueBrands.length],
  );
  const list = [...cycle, ...cycle];

  return (
    <section className={styles.section}>
      <div className={styles.viewport}>
        <div className={styles.track}>
          {list.map((brand, i) => (
            <span
              key={`${brand.name}-${i}`}
              className={brand.premium ? styles.itemPremium : styles.item}
              aria-hidden={i >= cycle.length}
            >
              {brand.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
