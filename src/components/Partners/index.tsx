import styles from "./styles";

/* Global havayolu / seyahat markaları — algı olarak daha kurumsal bir şerit.
   Yerel markalar yok. Not: bunlar bilinen markaların isimleridir; "iş ortağı"
   iddiası taşımaz, yalnızca sektör vitrini olarak dekoratif gösterilir. */
const BRANDS = [
  "Emirates",
  "Qatar Airways",
  "Lufthansa",
  "Singapore Airlines",
  "Air France",
  "British Airways",
  "Etihad Airways",
  "KLM",
  "Qantas",
  "Swiss",
  "Cathay Pacific",
  "ANA",
];

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
