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
