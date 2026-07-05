"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

/* Admin global arama — topbar'da inline kutu. Odaklanınca genişler, Enter'a
   basınca İşletmeler (CRM) sayfasına ?q ile gider; orada server-side filtrelenir. */
export default function AdminSearch() {
  const [q, setQ] = useState("");
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    router.push({ pathname: "/admin/tedarikciler", query: term ? { q: term } : {} });
  };

  return (
    <form onSubmit={submit} className="relative flex min-w-0 flex-1 items-center">
      <Search className="pointer-events-none absolute left-3.5 h-[18px] w-[18px] text-[#475569]" aria-hidden />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="İşletme adı, VKN veya ID ile ara…"
        aria-label="Ara"
        className="h-10 w-full rounded-full border border-line bg-paper pl-10 pr-4 text-[14px] font-medium text-ink placeholder:text-muted/65 focus:border-terra focus:outline-none focus:ring-2 focus:ring-terra/15"
      />
    </form>
  );
}
