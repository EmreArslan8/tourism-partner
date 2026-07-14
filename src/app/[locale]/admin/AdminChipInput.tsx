"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminChipInputProps = {
  name: string;
  label: string;
  hint?: string;
  initialValue?: string | string[];
  placeholder?: string;
  maxItems?: number;
};

const splitItems = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value : String(value ?? "").split(",");
  return raw.map((item) => item.trim()).filter(Boolean);
};

export default function AdminChipInput({
  name,
  label,
  hint,
  initialValue,
  placeholder,
  maxItems,
}: AdminChipInputProps) {
  const initialItems = useMemo(() => splitItems(initialValue), [initialValue]);
  const [items, setItems] = useState<string[]>(initialItems);
  const [draft, setDraft] = useState("");
  const hiddenValue = items.join(", ");
  const isFull = typeof maxItems === "number" && items.length >= maxItems;

  function commit(value = draft) {
    const nextItems = splitItems(value);
    if (nextItems.length === 0 || isFull) {
      setDraft("");
      return;
    }
    setItems((current) => {
      const merged = [...current];
      for (const item of nextItems) {
        if (!merged.some((existing) => existing.toLocaleLowerCase("tr") === item.toLocaleLowerCase("tr"))) {
          merged.push(item);
        }
      }
      return typeof maxItems === "number" ? merged.slice(0, maxItems) : merged;
    });
    setDraft("");
  }

  function remove(index: number) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function edit(index: number) {
    const item = items[index];
    remove(index);
    setDraft(item);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12px] font-semibold text-muted">
        {label}
        {hint && <span className="ml-1 font-normal text-muted/70">· {hint}</span>}
      </span>
      <input type="hidden" name={name} value={hiddenValue} />
      <div className="min-h-11 rounded-[8px] border border-line bg-white px-2.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,.75)] focus-within:border-sapphire/45 focus-within:ring-2 focus-within:ring-sapphire/10">
        <div className="flex flex-wrap items-center gap-1.5">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#C9D4EA] bg-[#F2F6FF] px-2.5 py-1 text-[12px] font-bold text-[#23345D]"
            >
              <button type="button" onClick={() => edit(index)} className="max-w-[180px] truncate text-left hover:text-sapphire" title="Düzenle">
                {item}
              </button>
              <button type="button" onClick={() => remove(index)} className="grid h-4 w-4 shrink-0 place-items-center rounded-full text-[#68748F] transition-colors hover:bg-white hover:text-red-600" aria-label={`${item} sil`}>
                <X size={11} aria-hidden />
              </button>
            </span>
          ))}
          {!isFull && (
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onBlur={() => commit()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === ",") {
                  event.preventDefault();
                  commit();
                }
                if (event.key === "Backspace" && !draft && items.length > 0) {
                  setItems((current) => current.slice(0, -1));
                }
              }}
              placeholder={items.length === 0 ? placeholder : ""}
              className={cn(
                "h-7 min-w-[150px] flex-1 border-0 bg-transparent px-1 text-[13px] font-medium text-ink outline-none placeholder:text-muted/55",
                maxItems === 1 && items.length === 0 && "min-w-0",
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
}
