type QueryError = { message: string } | null;

/*
 * PostgREST tek yanıtta en fazla `db.max_rows` (Supabase varsayılanı 1000) satır döner
 * ve bunu SESSİZCE yapar: `.limit(20_000)` yazsanız bile 1000 satır alırsınız, hata da
 * almazsınız. Toplama/sayım yapan sorgularda bu, veriyi fark edilmeden eksik sayar —
 * admin raporlarında tam olarak bu oluyordu (30 günlük pencerede 1.336 kaydın 336'sı
 * hesaba girmiyordu; sıralama `viewed_at` azalan olduğu için kesilen kısım hep en eski
 * veri, yani "önceki dönem" karşılaştırmasıydı).
 *
 * Bu yardımcı sorguyu `.range()` ile sayfalayarak tüm satırları toplar. Dönüş şekli
 * Supabase yanıtıyla aynı ({ data, error }) — çağıran taraflar değişmeden kullanabilir.
 *
 * Not: sayfalama yalnızca DETERMİNİSTİK sıralamayla doğrudur; çağıran sorguda mutlaka
 * `.order(...)` bulunmalıdır, aksi hâlde satırlar tekrarlayabilir veya atlanabilir.
 *
 * Ölçek notu: bu yaklaşım satır sayısıyla doğru orantılı istek üretir. Rapor
 * penceresindeki kayıt ~10.000'e yaklaştığında toplamayı SQL tarafına (view/RPC ile
 * `group by`) indirmek gerekir; o noktada tek istekte birkaç düzine satır döner.
 */

const SERVER_PAGE_LIMIT = 1000;
const DEFAULT_MAX_ROWS = 100_000;

export async function selectAll<T>(
  makePage: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: QueryError }>,
  options: { pageSize?: number; maxRows?: number; label?: string } = {},
): Promise<{ data: T[]; error: QueryError }> {
  const pageSize = Math.max(1, Math.min(options.pageSize ?? SERVER_PAGE_LIMIT, SERVER_PAGE_LIMIT));
  const maxRows = options.maxRows ?? DEFAULT_MAX_ROWS;
  const rows: T[] = [];

  let from = 0;
  while (from < maxRows) {
    const to = Math.min(from + pageSize, maxRows) - 1;
    const { data, error } = await makePage(from, to);
    if (error) return { data: rows, error };

    const batch = data ?? [];
    // Boş sayfa = veri bitti. Sunucunun sayfa tavanı beklediğimizden küçük olsa bile
    // (ör. max_rows düşürülmüşse) ilerlemeyi gelen satır sayısına göre yaptığımız için
    // döngü doğru çalışır.
    if (batch.length === 0) return { data: rows, error: null };
    rows.push(...batch);
    from += batch.length;
  }

  console.warn(
    `[select-all] ${options.label ?? "sorgu"} ${maxRows} satır tavanına ulaştı; sonuç eksik olabilir.`,
  );
  return { data: rows, error: null };
}
