import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Form alanı sarmalı — label + (input/select/textarea children) + hint/error.
   Tutarlı form görünümü için tüm formlar bundan beslenir. */
export default function Field({
  label,
  hint,
  error,
  required,
  className,
  children,
}: {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <span className="text-[12px] font-semibold text-muted">
          {label}
          {required && <em className="not-italic text-red-500"> *</em>}
          {hint && <span className="ms-1 font-normal text-muted/70">· {hint}</span>}
        </span>
      )}
      {children}
      {error && <span className="text-[12px] font-medium text-red-600">{error}</span>}
    </label>
  );
}
