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
      <Search className="pointer-events-none absolute left-3.5 h-[18px] w-[18px] text-[#64748B]" aria-hidden />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="İşletme adı, VKN veya ID ile ara…"
        aria-label="Ara"
        className="h-10 w-full rounded-full border border-[#C9D3E5] bg-white pl-10 pr-4 text-[14px] font-medium text-[#0B1C30] placeholder:text-[#94A3B8] focus:border-[#0057D9] focus:outline-none focus:ring-2 focus:ring-[#0057D9]/15"
      />
    </form>
  );
}
