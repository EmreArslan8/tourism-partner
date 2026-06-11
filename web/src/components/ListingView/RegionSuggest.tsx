import { s } from "./styles";

export type Region = { city: string; country: string; count: number };

export default function RegionSuggest({
  title,
  list,
  onPick,
}: {
  title: string;
  list: Region[];
  onPick: (city: string) => void;
}) {
  if (list.length === 0) return null;
  return (
    <div className={s.region}>
      <span className={s.regionLabel}>📍 {title}</span>
      {list.map((e) => (
        <button key={e.city} type="button" className={s.regionChip} onClick={() => onPick(e.city)}>
          {e.city}<span className={s.regionCount}>{e.count}</span>
        </button>
      ))}
    </div>
  );
}
