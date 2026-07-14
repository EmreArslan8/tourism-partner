import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Boş durum kutusu — liste/tablo veri yokken. Tema renkleriyle. */
export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border border-dashed border-line bg-paper px-6 py-12 text-center",
        className,
      )}
    >
      {icon && <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-cream-deep text-muted">{icon}</div>}
      {title && <h3 className="text-[16px] font-bold text-ink">{title}</h3>}
      {description && <p className="mt-1 max-w-[380px] text-[14px] text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
