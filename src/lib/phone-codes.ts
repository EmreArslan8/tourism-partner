/* Ülke arama kodları — kaynak veri yalnızca [ISO2, arama kodu] çiftleri (ITU E.164).
   Görünen ad ve bayrak ISO2'den türetilir: ad `Intl.DisplayNames` ile aktif locale'e
   göre (tr/en/ru/ar hepsi bedava gelir), bayrak ISO2 harflerinin regional indicator
   karşılığından. Böylece liste tek dile bağlı kalmaz ve elle çeviri gerekmez.

   Aynı kodu paylaşan ülkeler (NANP +1, RU/KZ +7 …) ayrı satırdır; seçim değeri kod
   olduğu için React key'i ISO2'dir. */

export type PhoneCode = { iso2: string; dial: string };

const RAW: string[] = [
  "AD:376", "AE:971", "AF:93", "AG:1", "AI:1", "AL:355", "AM:374", "AO:244", "AR:54", "AS:1",
  "AT:43", "AU:61", "AW:297", "AX:358", "AZ:994", "BA:387", "BB:1", "BD:880", "BE:32", "BF:226",
  "BG:359", "BH:973", "BI:257", "BJ:229", "BL:590", "BM:1", "BN:673", "BO:591", "BQ:599", "BR:55",
  "BS:1", "BT:975", "BW:267", "BY:375", "BZ:501", "CA:1", "CD:243", "CF:236", "CG:242", "CH:41",
  "CI:225", "CK:682", "CL:56", "CM:237", "CN:86", "CO:57", "CR:506", "CU:53", "CV:238", "CW:599",
  "CY:357", "CZ:420", "DE:49", "DJ:253", "DK:45", "DM:1", "DO:1", "DZ:213", "EC:593", "EE:372",
  "EG:20", "ER:291", "ES:34", "ET:251", "FI:358", "FJ:679", "FK:500", "FM:691", "FO:298", "FR:33",
  "GA:241", "GB:44", "GD:1", "GE:995", "GF:594", "GG:44", "GH:233", "GI:350", "GL:299", "GM:220",
  "GN:224", "GP:590", "GQ:240", "GR:30", "GT:502", "GU:1", "GW:245", "GY:592", "HK:852", "HN:504",
  "HR:385", "HT:509", "HU:36", "ID:62", "IE:353", "IL:972", "IM:44", "IN:91", "IO:246", "IQ:964",
  "IR:98", "IS:354", "IT:39", "JE:44", "JM:1", "JO:962", "JP:81", "KE:254", "KG:996", "KH:855",
  "KI:686", "KM:269", "KN:1", "KP:850", "KR:82", "KW:965", "KY:1", "KZ:7", "LA:856", "LB:961",
  "LC:1", "LI:423", "LK:94", "LR:231", "LS:266", "LT:370", "LU:352", "LV:371", "LY:218", "MA:212",
  "MC:377", "MD:373", "ME:382", "MF:590", "MG:261", "MH:692", "MK:389", "ML:223", "MM:95", "MN:976",
  "MO:853", "MP:1", "MQ:596", "MR:222", "MS:1", "MT:356", "MU:230", "MV:960", "MW:265", "MX:52",
  "MY:60", "MZ:258", "NA:264", "NC:687", "NE:227", "NF:672", "NG:234", "NI:505", "NL:31", "NO:47",
  "NP:977", "NR:674", "NU:683", "NZ:64", "OM:968", "PA:507", "PE:51", "PF:689", "PG:675", "PH:63",
  "PK:92", "PL:48", "PM:508", "PR:1", "PS:970", "PT:351", "PW:680", "PY:595", "QA:974", "RE:262",
  "RO:40", "RS:381", "RU:7", "RW:250", "SA:966", "SB:677", "SC:248", "SD:249", "SE:46", "SG:65",
  "SH:290", "SI:386", "SJ:47", "SK:421", "SL:232", "SM:378", "SN:221", "SO:252", "SR:597", "SS:211",
  "ST:239", "SV:503", "SX:1", "SY:963", "SZ:268", "TC:1", "TD:235", "TG:228", "TH:66", "TJ:992",
  "TK:690", "TL:670", "TM:993", "TN:216", "TO:676", "TR:90", "TT:1", "TV:688", "TW:886", "TZ:255",
  "UA:380", "UG:256", "US:1", "UY:598", "UZ:998", "VA:39", "VC:1", "VE:58", "VG:1", "VI:1",
  "VN:84", "VU:678", "WF:681", "WS:685", "XK:383", "YE:967", "YT:262", "ZA:27", "ZM:260", "ZW:263",
];

export const PHONE_CODES: PhoneCode[] = RAW.map((entry) => {
  const [iso2, dial] = entry.split(":");
  return { iso2, dial: `+${dial}` };
});

export const DEFAULT_PHONE_CODE = "+90";

/* ISO2 → bayrak emojisi (A → 🇦, regional indicator offset 127397). */
export function flagEmoji(iso2: string): string {
  return Array.from(iso2.toUpperCase())
    .map((char) => String.fromCodePoint((char.codePointAt(0) ?? 0) + 127397))
    .join("");
}

/* "🇹🇷 Türkiye" — ad aktif locale'de; Intl bilmediği kodu (XK) ISO2 olarak bırakır. */
export function phoneCodeLabel(iso2: string, locale: string): string {
  let name = iso2;
  try {
    name = new Intl.DisplayNames([locale], { type: "region" }).of(iso2) ?? iso2;
  } catch {
    /* geçersiz locale / desteklenmeyen bölge — ISO2 ile devam */
  }
  return `${flagEmoji(iso2)} ${name}`;
}

/* Serbest girişi "+<rakamlar>" biçimine indirger; boşsa "" döner. */
export function normalizePhoneCode(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits ? `+${digits}` : "";
}

/* Arama: locale'e göre ad, ISO2 ve kod üzerinden; sorgu yoksa ad sırası (Türkiye başta). */
export function filterPhoneCodes(query: string, locale: string): PhoneCode[] {
  const q = query.trim().toLocaleLowerCase(locale).replace(/^\+/, "");
  const collator = new Intl.Collator(locale);
  const sorted = PHONE_CODES.slice().sort((a, b) => {
    if (a.dial === DEFAULT_PHONE_CODE && a.iso2 === "TR") return -1;
    if (b.dial === DEFAULT_PHONE_CODE && b.iso2 === "TR") return 1;
    return collator.compare(phoneCodeLabel(a.iso2, locale), phoneCodeLabel(b.iso2, locale));
  });
  if (!q) return sorted;
  return sorted.filter((code) => {
    const text = `${phoneCodeLabel(code.iso2, locale)} ${code.iso2}`.toLocaleLowerCase(locale);
    return code.dial.replace("+", "").startsWith(q) || text.includes(q);
  });
}
