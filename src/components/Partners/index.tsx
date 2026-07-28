import styles from "./styles";

/* Admin onayından geçmiş gerçek işletmeler için kenar fade maskeli marquee. */
const Partners = ({ brands }: { brands: string[] }) => {
  const uniqueBrands = Array.from(
    new Map(
      brands
        .map((brand) => brand.trim())
        .filter(Boolean)
        .map((brand) => [brand.toLocaleLowerCase("tr"), brand]),
    ).values(),
  );
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
            <span key={`${brand}-${i}`} className={styles.item} aria-hidden={i >= cycle.length}>
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
