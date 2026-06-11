import { useTranslations } from "next-intl";
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
  const t = useTranslations("listing");
  if (tags.length === 0) return null;
  return (
    <div className={s.active}>
      <span className={s.activeLabel}>{t("activeLabel")}</span>
      {tags.map((tag) => (
        <button key={`${tag.kind}-${tag.value}`} type="button" className={s.tag} onClick={() => onRemove(tag.kind, tag.value)}>
          {tag.label} <span className={s.tagX} aria-hidden>×</span>
        </button>
      ))}
      <button type="button" className={s.clearTag} onClick={onClear}>{t("clearAll")}</button>
    </div>
  );
}
