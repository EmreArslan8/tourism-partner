/* Admin incelemesi, tedarikçinin ticari sürecinden bağımsızdır. */
export const REQUEST_STATUS = {
  new: { label: "İnceleme bekliyor", tone: "amber" },
  reviewed: { label: "İncelendi", tone: "blue" },
  closed: { label: "Kapatıldı", tone: "neutral" },
  archived: { label: "Arşiv", tone: "neutral" },
} as const;
export type RequestStatus = keyof typeof REQUEST_STATUS;
export const isRequestStatus = (value: string): value is RequestStatus =>
  Object.hasOwn(REQUEST_STATUS, value);

export const SUPPLIER_STATUS = {
  new: "Yanıt bekleniyor",
  contacted: "İletişime geçildi",
  quoted: "Teklif verildi",
  won: "Kazanıldı",
  lost: "Kaybedildi",
  archived: "Arşiv",
} as const;
export const isSupplierStatus = (value: string): value is keyof typeof SUPPLIER_STATUS =>
  Object.hasOwn(SUPPLIER_STATUS, value);
export const supplierStatusLabel = (value: string) =>
  isSupplierStatus(value) ? SUPPLIER_STATUS[value] : "Bilinmeyen durum";

// Mevcut RFQ gönderimi tüm hedef satırlarını aynı transaction'da oluşturur.
export const quoteRequestKey = (email: string, submittedAt: string) => `${email}|${submittedAt}`;
export const isAwaitingQuote = (status: RequestStatus, responseCount: number) =>
  (status === "new" || status === "reviewed") && responseCount === 0;

export function countQuoteResponses(rows: { quote_id: number }[]) {
  const counts = new Map<number, number>();
  for (const row of rows) counts.set(row.quote_id, (counts.get(row.quote_id) ?? 0) + 1);
  return counts;
}
