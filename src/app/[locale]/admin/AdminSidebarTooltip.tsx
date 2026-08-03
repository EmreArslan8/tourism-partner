"use client";

import { createPortal } from "react-dom";

export type AdminSidebarTooltipState = {
  label: string;
  top: number;
} | null;

export function getAdminSidebarTooltip(label: string, element: HTMLElement): AdminSidebarTooltipState {
  const rect = element.getBoundingClientRect();

  return {
    label,
    top: rect.top + rect.height / 2,
  };
}

export default function AdminSidebarTooltip({ tooltip }: { tooltip: AdminSidebarTooltipState }) {
  if (!tooltip) return null;

  return createPortal(
    <span
      role="tooltip"
      className="pointer-events-none fixed left-[92px] z-[100] -translate-y-1/2 whitespace-nowrap rounded-[7px] bg-sapphire px-2.5 py-1.5 text-[11px] font-bold text-white shadow-[0_8px_20px_-8px_rgba(1,20,93,.7)]"
      style={{ top: tooltip.top }}
    >
      {tooltip.label}
    </span>,
    document.body,
  );
}
