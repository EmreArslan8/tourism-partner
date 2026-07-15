"use client";

import type { ReactNode } from "react";
import * as D from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

/* Erişilebilir modal — Radix Dialog sarmalı (focus-trap, ESC, scroll-lock, ARIA bedava).
   Tema/görsel bizim. Davranışı zor olan TEK yer olduğu için Radix burada kullanılır. */

export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;

export function DialogContent({
  title,
  description,
  className,
  children,
}: {
  title?: string;
  description?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-[80] bg-ink/45 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
      <D.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-[81] w-[92vw] max-w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-white p-6 shadow-[0_24px_70px_-20px_rgba(15,23,42,.4)]",
          "focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className,
        )}
      >
        {title && <D.Title className="text-[18px] font-bold text-ink">{title}</D.Title>}
        {description && <D.Description className="mt-1 text-[14px] text-muted">{description}</D.Description>}
        {children}
        <D.Close
          className="absolute end-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-cream hover:text-ink"
          aria-label="Kapat"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden><path d="M18 6 6 18M6 6l12 12" /></svg>
        </D.Close>
      </D.Content>
    </D.Portal>
  );
}
