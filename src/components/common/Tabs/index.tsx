"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Composition tabanlı Tabs (compound + context). Erişilebilir: role=tablist/tab,
   aria-selected. tone ile public (terra) / admin (blue) renk ayrımı yapılır.

   <Tabs defaultValue="a" tone="blue">
     <TabList>
       <Tab value="a" count={12}>Bekleyen</Tab>
       <Tab value="b">Reddedilen</Tab>
     </TabList>
     <TabPanel value="a">…</TabPanel>
     <TabPanel value="b">…</TabPanel>
   </Tabs>
*/

type Tone = "terra" | "blue";
type Ctx = { active: string; setActive: (v: string) => void; tone: Tone };
const TabsCtx = createContext<Ctx | null>(null);
const useTabs = () => {
  const c = useContext(TabsCtx);
  if (!c) throw new Error("Tab bileşenleri <Tabs> içinde kullanılmalı.");
  return c;
};

const TONES: Record<Tone, { active: string; idle: string; badgeOn: string; badgeOff: string }> = {
  terra: {
    active: "border-terra text-terra-deep",
    idle: "border-transparent text-muted hover:text-ink",
    badgeOn: "bg-terra/10 text-terra-deep",
    badgeOff: "bg-white text-[#4b5875]",
  },
  blue: {
    active: "border-[#2563EB] text-[#2563EB]",
    idle: "border-transparent text-[#64748B] hover:text-[#0B1C30]",
    badgeOn: "bg-[#DAE2FD] text-[#1E3A8A]",
    badgeOff: "bg-white text-[#4b5875]",
  },
};

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  tone = "terra",
  className,
  children,
}: {
  defaultValue: string;
  value?: string;
  onValueChange?: (v: string) => void;
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  const [internal, setInternal] = useState(defaultValue);
  const active = value ?? internal;
  const setActive = (v: string) => {
    setInternal(v);
    onValueChange?.(v);
  };
  return (
    <TabsCtx.Provider value={{ active, setActive, tone }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabList({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div role="tablist" className={cn("flex items-center gap-6 border-b border-line", className)}>
      {children}
    </div>
  );
}

export function Tab({ value, count, children }: { value: string; count?: number; children: ReactNode }) {
  const { active, setActive, tone } = useTabs();
  const on = active === value;
  const t = TONES[tone];
  return (
    <button
      type="button"
      role="tab"
      aria-selected={on}
      onClick={() => setActive(value)}
      className={cn(
        "-mb-px flex items-center gap-2 border-b-2 px-1 pb-3 text-[14px] font-semibold transition-colors",
        on ? t.active : t.idle,
      )}
    >
      {children}
      {count != null && count > 0 && (
        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-bold", on ? t.badgeOn : t.badgeOff)}>
          {count}
        </span>
      )}
    </button>
  );
}

export function TabPanel({ value, className, children }: { value: string; className?: string; children: ReactNode }) {
  const { active } = useTabs();
  if (active !== value) return null;
  return (
    <div role="tabpanel" className={cn("pt-6", className)}>
      {children}
    </div>
  );
}

export default Tabs;
