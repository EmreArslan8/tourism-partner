/* Kimlik/vergi numarası doğrulama yardımcıları (defense-in-depth).
   Server action'larda (panel kaydetme) ve istenirse istemci tarafında kullanılır.
   Not: Boş değer kontrolü çağıran tarafın sorumluluğu — buradaki fonksiyonlar
   yalnızca dolu bir değerin biçimsel/algoritmik geçerliliğini döner. */

/** T.C. Kimlik No doğrulaması (11 hane + resmi checksum).
    - 11 hane, tümü rakam
    - ilk hane 0 olamaz
    - 10. hane = ((1,3,5,7,9. hane toplamı × 7) − (2,4,6,8. hane toplamı)) mod 10
    - 11. hane = ilk 10 hane toplamı mod 10 */
export function isValidTCKN(value: string): boolean {
  const v = value.trim();
  if (!/^\d{11}$/.test(v)) return false;
  if (v[0] === "0") return false;

  const d = v.split("").map(Number);
  const oddSum = d[0] + d[2] + d[4] + d[6] + d[8]; // 1,3,5,7,9. haneler
  const evenSum = d[1] + d[3] + d[5] + d[7]; // 2,4,6,8. haneler
  const digit10 = ((oddSum * 7 - evenSum) % 10 + 10) % 10;
  if (digit10 !== d[9]) return false;

  const firstTenSum = d.slice(0, 10).reduce((a, b) => a + b, 0);
  const digit11 = firstTenSum % 10;
  return digit11 === d[10];
}

/** Vergi Kimlik No doğrulaması — 10 haneli nümerik (basit biçim kontrolü). */
export function isValidVKN(value: string): boolean {
  return /^\d{10}$/.test(value.trim());
}
