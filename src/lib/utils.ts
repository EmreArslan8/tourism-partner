/* Küçük ortak yardımcılar. */

/** Koşullu className birleştirici. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** İsimden baş harf(ler) — kapak monogramları için (ör. "Kaya Palas" → "KP"). */
export function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

/**
 * Türkçe-duyarlı arama normalizasyonu: küçük harfe çevirir + aksanları katlar
 * (ş→s, ı/İ→i, ğ→g, ö→o, ü→u, ç→c) ki "sehir" → "şehir", "cankaya" → "Çankaya"
 * eşleşsin. Hem aranan metne hem de aranan alanlara uygulanır.
 */
const TR_FOLD: Record<string, string> = {
  ş: "s", ı: "i", ğ: "g", ö: "o", ü: "u", ç: "c", â: "a", î: "i", û: "u",
};
export function normalizeTr(input: string): string {
  return input
    .toLocaleLowerCase("tr")
    .replace(/[şığöüçâîû]/g, (ch) => TR_FOLD[ch] ?? ch)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}
