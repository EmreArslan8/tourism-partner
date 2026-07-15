import styles from "./styles";

const BRANDS = Array.from({ length: 12 }, () => "Tourism Partner");

/* Modern "güvenilen markalar" şeridi — kenar fade maskeli sonsuz marquee. */
const Partners = () => {
  // Sonsuz döngü için listeyi ikiye katlıyoruz
  const list = [...BRANDS, ...BRANDS];

  return (
    <section className={styles.section}>
      <div className={styles.viewport}>
        <div className={styles.track}>
          {list.map((brand, i) => (
            <span key={i} className={styles.item} aria-hidden={i >= BRANDS.length}>
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
