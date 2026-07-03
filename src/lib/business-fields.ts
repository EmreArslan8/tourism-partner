/* Kategori-bazlı dinamik kayıt/profil alanları (Brief §5 / El Kitabı §3 / Quick Ref §2).
   Firma paneli, seçilen ana gruba (GroupKey) göre buradan beslenen alanları render eder.
   Değerler businesses.details (jsonb) içinde detail_<key> olarak; evraklar
   businesses.documents (jsonb) içinde private storage path'iyle saklanır.

   Etiketler iki dillidir (panel client'ı useLocale ile seçer); böylece ayrıca
   onlarca i18n anahtarı eklemeye gerek kalmaz. */
import type { GroupKey } from "./types";

export type Bilingual = { tr: string; en: string };

export type BizFieldType = "text" | "number" | "tel" | "date" | "select";

export type BizField = {
  /** details içindeki anahtar. Form alanı adı: detail_<key> */
  key: string;
  label: Bilingual;
  type: BizFieldType;
  placeholder?: string;
  maxLength?: number;
  /** type === "select" için seçenekler */
  options?: { value: string; label: Bilingual }[];
  /** İstemci tarafı ipucu (ör. 10 haneli vergi no) */
  hint?: Bilingual;
};

export type BizDocField = {
  kind: string;
  label: Bilingual;
  required?: boolean;
};

/* Tüzel kişiler (rehber HARİÇ) için ortak resmi şirket bilgileri. */
export const COMPANY_FIELDS: BizField[] = [
  {
    key: "legal_name",
    type: "text",
    maxLength: 200,
    label: { tr: "Resmi Şirket Ünvanı", en: "Legal Company Name" },
    placeholder: "Örn. Kaya Turizm A.Ş.",
  },
  {
    key: "company_type",
    type: "select",
    label: { tr: "Şirket Türü", en: "Company Type" },
    options: [
      { value: "anonim", label: { tr: "Anonim Şirket", en: "Joint-Stock (A.Ş.)" } },
      { value: "limited", label: { tr: "Limited Şirket", en: "Limited (Ltd.)" } },
      { value: "sahis", label: { tr: "Şahıs Şirketi", en: "Sole Proprietorship" } },
      { value: "diger", label: { tr: "Diğer", en: "Other" } },
    ],
  },
  {
    key: "tax_office",
    type: "text",
    maxLength: 120,
    label: { tr: "Vergi Dairesi", en: "Tax Office" },
  },
  {
    key: "tax_no",
    type: "text",
    maxLength: 10,
    label: { tr: "Vergi No", en: "Tax Number" },
    hint: { tr: "10 haneli", en: "10 digits" },
  },
];

/* Rehber: gerçek kişi — şirket bilgileri istenmez, kişisel alanlar istenir. */
export const GUIDE_FIELDS: BizField[] = [
  {
    key: "tckn",
    type: "text",
    maxLength: 11,
    label: { tr: "T.C. Kimlik No", en: "National ID (TCKN)" },
    hint: { tr: "11 haneli", en: "11 digits" },
  },
  {
    key: "birth_date",
    type: "date",
    label: { tr: "Doğum Tarihi", en: "Date of Birth" },
  },
  {
    key: "residence",
    type: "text",
    maxLength: 240,
    label: { tr: "İkametgah Adresi", en: "Residence Address" },
  },
  {
    key: "license_no",
    type: "text",
    maxLength: 60,
    label: { tr: "Rehber Sicil No", en: "Guide License No" },
    hint: { tr: "TUREB / Bakanlık", en: "TUREB / Ministry" },
  },
];

/* Gruba özel ek alanlar (rehber dışındakiler için, şirket alanlarına eklenir). */
export const GROUP_FIELDS: Record<GroupKey, BizField[]> = {
  konaklama: [
    {
      key: "capacity",
      type: "number",
      label: { tr: "Maks. Kişi Kapasitesi", en: "Max Guest Capacity" },
    },
    {
      key: "parking",
      type: "select",
      label: { tr: "Otopark", en: "Parking" },
      options: [
        { value: "var", label: { tr: "Var", en: "Yes" } },
        { value: "yok", label: { tr: "Yok", en: "No" } },
      ],
    },
  ],
  acente: [],
  ulasim: [
    {
      key: "fleet_size",
      type: "number",
      label: { tr: "Filo Araç Sayısı", en: "Fleet Size" },
    },
    {
      key: "vehicle_capacity",
      type: "number",
      label: { tr: "Toplam Yolcu Kapasitesi", en: "Total Passenger Capacity" },
    },
    {
      key: "kabis_status",
      type: "select",
      label: { tr: "KABİS Beyanı", en: "KABIS Declaration" },
      options: [
        { value: "var", label: { tr: "KABİS kaydı var", en: "KABIS registered" } },
        { value: "yok", label: { tr: "KABİS kaydı yok", en: "Not registered" } },
      ],
    },
  ],
  rehber: [], // rehber alanları GUIDE_FIELDS'ten gelir
  aktivite: [
    {
      key: "capacity",
      type: "number",
      label: { tr: "Günlük / Etkinlik Kapasitesi", en: "Daily / Event Capacity" },
    },
  ],
  saglik: [],
};

/* Gruba özel zorunlu/opsiyonel evraklar. */
export const GROUP_DOCS: Record<GroupKey, BizDocField[]> = {
  konaklama: [
    { kind: "isletme_belgesi", label: { tr: "İşletme Belgesi", en: "Operating Certificate" } },
  ],
  acente: [
    { kind: "tursab", label: { tr: "TÜRSAB Belgesi", en: "TÜRSAB Certificate" }, required: true },
    { kind: "saglik_yetki", label: { tr: "Uluslararası Sağlık Turizmi Yetki Belgesi (sağlık turizmi yapıyorsanız)", en: "Health Tourism Authorization (if applicable)" } },
  ],
  ulasim: [
    { kind: "faaliyet_belgesi", label: { tr: "Şirket Faaliyet Belgesi", en: "Company Activity Certificate" }, required: true },
    { kind: "d2_belgesi", label: { tr: "D2 Belgesi (transfer/taşımacılık için)", en: "D2 Certificate (for transport/transfer)" } },
    { kind: "kabis_beyani", label: { tr: "KABİS Beyanı (Rent A Car için)", en: "KABIS Declaration (for Rent A Car)" } },
  ],
  rehber: [
    { kind: "dil_sertifikasi", label: { tr: "Dil Sertifikası", en: "Language Certificate" } },
  ],
  aktivite: [
    { kind: "faaliyet_belgesi", label: { tr: "Resmi Faaliyet / Acente Evrakı", en: "Activity / Agency Document" }, required: true },
  ],
  saglik: [
    { kind: "uzmanlik", label: { tr: "Uzmanlık Belgesi", en: "Specialization Certificate" }, required: true },
    { kind: "klinik_acma", label: { tr: "Klinik Açma Belgesi", en: "Clinic Opening Permit" }, required: true },
    { kind: "saglik_yetki", label: { tr: "Uluslararası Sağlık Turizmi Yetki Belgesi", en: "Health Tourism Authorization" }, required: true },
  ],
};

/** Bir grup için gösterilecek dinamik alanlar (rehber/tüzel ayrımıyla). */
export function fieldsForGroup(group: GroupKey): BizField[] {
  if (group === "rehber") return GUIDE_FIELDS;
  return [...COMPANY_FIELDS, ...GROUP_FIELDS[group]];
}

/** Bir grup için evrak listesi. */
export function docsForGroup(group: GroupKey): BizDocField[] {
  return GROUP_DOCS[group] ?? [];
}

/** Tüm bilinen detail anahtarları (server action güvenli ayrıştırma için). */
export const ALL_DETAIL_KEYS: Set<string> = new Set(
  [
    ...COMPANY_FIELDS,
    ...GUIDE_FIELDS,
    ...Object.values(GROUP_FIELDS).flat(),
  ].map((f) => f.key),
);
