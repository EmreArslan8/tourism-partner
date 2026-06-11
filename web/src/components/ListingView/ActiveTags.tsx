import { s } from "./styles";

export type FilterTag = { kind: string; value: string; label: string };

export default function ActiveTags({
  tags,
  onRemove,
  onClear,
}: {
  tags: FilterTag[];
  onRemove: (kind: string, value: string) => void;
  onClear: () => void;
}) {
  if (tags.length === 0) return null;
  return (
    <div className={s.active}>
      <span className={s.activeLabel}>Aktif filtreler:</span>
      {tags.map((t) => (
        <button key={`${t.kind}-${t.value}`} type="button" className={s.tag} onClick={() => onRemove(t.kind, t.value)}>
          {t.label} <span className={s.tagX} aria-hidden>×</span>
        </button>
      ))}
      <button type="button" className={s.clearTag} onClick={onClear}>Tümünü temizle</button>
    </div>
  );
}
