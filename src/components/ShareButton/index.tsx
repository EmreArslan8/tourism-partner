"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ShareButton({ title }: { title: string }) {
  const t = useTranslations("common");
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const field = document.createElement("textarea");
        field.value = url;
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        document.execCommand("copy");
        field.remove();
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="relative inline-flex h-10 items-center gap-2 rounded-[9px] px-3 text-[13px] font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <Share2 size={17} aria-hidden />
      <span className="underline decoration-white/40 underline-offset-2">{t("share")}</span>
      {copied && (
        <span role="status" className="absolute end-0 top-11 z-10 whitespace-nowrap rounded-[8px] bg-ink px-3 py-1.5 text-[11.5px] font-semibold text-paper shadow-card">
          {t("linkCopied")}
        </span>
      )}
    </button>
  );
}
