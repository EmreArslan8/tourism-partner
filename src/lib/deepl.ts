const TARGET_LANG = {
  tr: "TR",
  en: "EN-US",
  ru: "RU",
  ar: "AR",
} as const;

export type DeepLLocale = keyof typeof TARGET_LANG;

export type DeepLResult =
  | { ok: true; text: string }
  | { ok: false; error: string };

export async function translateWithDeepL(text: string, locale: DeepLLocale): Promise<DeepLResult> {
  const key = process.env.DEEPL_API_KEY;
  const endpoint = process.env.DEEPL_API_ENDPOINT || (key?.endsWith(":fx") ? "https://api-free.deepl.com" : "https://api.deepl.com");
  if (!key) return { ok: false, error: "DEEPL_API_KEY eksik" };

  const body = new URLSearchParams({
    text,
    target_lang: TARGET_LANG[locale],
    preserve_formatting: "1",
  });

  try {
    const res = await fetch(`${endpoint}/v2/translate`, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    const json = await res.json().catch(() => null) as { translations?: Array<{ text?: string }>; message?: string } | null;
    if (!res.ok) return { ok: false, error: json?.message || `DeepL ${res.status}` };

    const translated = json?.translations?.[0]?.text?.trim();
    return translated ? { ok: true, text: translated } : { ok: false, error: "DeepL boş çeviri döndürdü" };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "DeepL isteği başarısız" };
  }
}
