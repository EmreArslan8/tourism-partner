"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/* Hakkında metni — uzun açıklamalarda 4 satırda kırpılır, "Devamını oku" ile açılır. */
const CLAMP_THRESHOLD = 420;

const AboutText = ({ text, className }: { text: string; className: string }) => {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations("supplier");
  const isLong = text.length > CLAMP_THRESHOLD;

  return (
    <div>
      <p className={`${className} ${isLong && !expanded ? "line-clamp-4" : ""}`}>{text}</p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 text-[14px] font-bold text-terra hover:underline"
        >
          {expanded ? t("readLess") : t("readMore")}
        </button>
      )}
    </div>
  );
};

export default AboutText;
