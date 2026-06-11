import { useTranslations } from "next-intl";
import styles from "./styles";



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
  const t = useTranslations("listing");
  if (tags.length === 0) return null;
  return (
    <div className={styles.active}>
      <span className={styles.activeLabel}>{t("activeLabel")}</span>
      {tags.map((tag) => (
        <button key={`${tag.kind}-${tag.value}`} type="button" className={styles.tag} onClick={() => onRemove(tag.kind, tag.value)}>
          {tag.label} <span className={styles.tagX} aria-hidden>×</span>
        </button>
      ))}
      <button type="button" className={styles.clearTag} onClick={onClear}>{t("clearAll")}</button>
    </div>
  );
}
