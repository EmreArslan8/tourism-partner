import styles from "./styles";


export type Region = { city: string; country: string; count: number };

const RegionSuggest = ({
  title,
  list,
  onPick,
}: {
  title: string;
  list: Region[];
  onPick: (city: string) => void;
}) => {
  if (list.length === 0) return null;
  return (
    <div className={styles.region}>
      <span className={styles.regionLabel}>📍 {title}</span>
      {list.map((e) => (
        <button key={e.city} type="button" className={styles.regionChip} onClick={() => onPick(e.city)}>
          {e.city}<span className={styles.regionCount}>{e.count}</span>
        </button>
      ))}
    </div>
  );
};

export default RegionSuggest;
