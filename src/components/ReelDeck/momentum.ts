/*
 * Momentum tespiti — fullPage.js'in kayan ortalama yöntemi (bağımsız port).
 *
 * Trackpad/serbest tekerlek tek bir fiziksel kaydırmada onlarca olay üretir ve
 * parmak kalktıktan sonra "momentum" ile yavaşlayarak devam eder. Tek kaydırmayı
 * tek panele indirmek için son |deltaY| örneklerini tutar ve karşılaştırırız:
 * son birkaç örneğin ortalaması, daha geniş pencereye göre düşmüyorsa kullanıcı
 * hâlâ aktif kaydırıyordur (geçişe izin); düşüyorsa momentum sönümleniyordur (yok say).
 */

/** Dizinin sonundan `n` örneğin ortalaması (fullPage.js ile birebir: her zaman `n`'e böler). */
export function getAverage(samples: number[], n: number): number {
  const window = samples.slice(Math.max(samples.length - n, 1));
  let sum = 0;
  for (let i = 0; i < window.length; i++) sum += window[i];
  return Math.ceil(sum / n);
}

/** Son 10 örneğin ortalaması ≥ son 70 örneğin ortalaması → aktif kaydırma (momentum değil). */
export function isAccelerating(samples: number[]): boolean {
  return getAverage(samples, 10) >= getAverage(samples, 70);
}
