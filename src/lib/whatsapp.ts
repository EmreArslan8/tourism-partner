/* WhatsApp gönderimi — Meta WhatsApp Cloud API (ekstra paket gerektirmez, fetch ile).
   Anahtarlar tanımlı değilse sessizce atlanır (uygulama akışı bozulmaz).

   WhatsApp'ta işletme ilk teması SERBEST METİNLE kuramaz; Meta tarafından onaylı
   bir şablonla başlamak zorunludur. Bu yüzden gövde değil, şablon adı + sıralı
   değişkenler gönderiyoruz.

   Gönderici numara: +90 538 484 87 90 (sitedeki iletişim numarası, bkz. Footer).
   Cloud API'ye kayıtlı numara normal WhatsApp uygulamasında kullanılamaz.

   Üretim için gerekli env:
     WHATSAPP_PHONE_NUMBER_ID=1234567890      (yukarıdaki numaranın Cloud API kimliği)
     WHATSAPP_ACCESS_TOKEN=EAAxxx             (kalıcı System User token'ı)
     WHATSAPP_TEMPLATE_NAME=quote_notification (onaylı utility şablonu)
   İsteğe bağlı:
     WHATSAPP_TEMPLATE_LANGS=tr,en            (Meta'da ONAYLI dil sürümleri;
                                               varsayılan: tr. Listedeki ilk dil
                                               yedek dildir.)
     WHATSAPP_GRAPH_VERSION=v21.0             (varsayılan: v21.0) */

type SendArgs = {
  to: string;
  /* Şablon gövdesindeki {{1}}, {{2}} … yerine sırayla geçer. */
  bodyParams: string[];
  /* Meta'da onaylı dil sürümü kodu (bkz. resolveTemplateLanguage). */
  language: string;
  /* Dinamik URL butonu varsa: şablondaki taban adrese eklenecek son parça. */
  buttonUrlSuffix?: string;
};
type SendResult = { ok: boolean; skipped?: boolean; error?: string; id?: string };

/* E.164'e indirger: "+90 532 123 45 67" → "+905321234567".
   Ülke kodu olmayan numara reddedilir; yanlış ülkeye mesaj gitmesindense
   gönderilmemesi yeğdir. */
export function toE164(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;
  const normalized = trimmed.startsWith("+")
    ? digits
    : trimmed.startsWith("00")
      ? digits.slice(2)
      : null;
  if (!normalized) return null;
  if (normalized.length < 8 || normalized.length > 15) return null;
  return `+${normalized}`;
}

/* Şablon değişkeni kuralları: boş olamaz, satır sonu/sekme ve art arda boşluk
   içeremez. İhlal eden mesajı Meta 131008 ile reddeder. */
export function templateParam(value: string | number | null | undefined, max = 120): string {
  const text = value == null ? "" : String(value).replace(/\s+/g, " ").trim();
  if (!text) return "—";
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

/* Alıcının dilini Meta'da ONAYLI şablon dillerine eşler. Onaylı olmayan bir
   dil kodu göndermek 132001 ile reddedilir; bu yüzden listede yoksa yedek dile
   (listenin ilki) düşeriz — mesajın yanlış dilde gitmesi, hiç gitmemesinden iyidir. */
export function resolveTemplateLanguage(locale: string | null | undefined): string {
  const approved = (process.env.WHATSAPP_TEMPLATE_LANGS ?? "tr")
    .split(",")
    .map((code) => code.trim().toLowerCase())
    .filter(Boolean);
  const fallback = approved[0] ?? "tr";
  const requested = locale?.trim().toLowerCase().split(/[-_]/)[0];
  return requested && approved.includes(requested) ? requested : fallback;
}

function maskPhone(value: string) {
  return value.length > 6 ? `${value.slice(0, 5)}***${value.slice(-2)}` : "<invalid-phone>";
}

export function whatsappConfigured() {
  return Boolean(
    process.env.WHATSAPP_PHONE_NUMBER_ID &&
      process.env.WHATSAPP_ACCESS_TOKEN &&
      process.env.WHATSAPP_TEMPLATE_NAME,
  );
}

export async function sendWhatsapp({ to, bodyParams, language, buttonUrlSuffix }: SendArgs): Promise<SendResult> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const template = process.env.WHATSAPP_TEMPLATE_NAME;
  const version = process.env.WHATSAPP_GRAPH_VERSION?.trim() || "v21.0";
  const startedAt = Date.now();
  console.info("[whatsapp] request başlıyor", {
    to: maskPhone(to),
    configured: whatsappConfigured(),
    template,
    language,
  });
  if (!phoneNumberId || !token || !template) {
    const error = "WHATSAPP_* env değerleri eksik";
    console.error("[whatsapp] request gönderilmedi", { error });
    return { ok: false, skipped: true, error };
  }

  const components: unknown[] = [
    {
      type: "body",
      parameters: bodyParams.map((text) => ({ type: "text", text })),
    },
  ];
  if (buttonUrlSuffix) {
    components.push({
      type: "button",
      sub_type: "url",
      index: "0",
      parameters: [{ type: "text", text: buttonUrlSuffix }],
    });
  }

  try {
    const res = await fetch(`https://graph.facebook.com/${version}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "template",
        template: { name: template, language: { code: language }, components },
      }),
    });
    if (!res.ok) {
      const error = `WhatsApp ${res.status}: ${await res.text()}`;
      console.error("[whatsapp] API başarısız", { status: res.status, durationMs: Date.now() - startedAt, error });
      return { ok: false, error };
    }
    const payload = (await res.json()) as { messages?: { id?: string }[] };
    const id = payload.messages?.[0]?.id;
    console.info("[whatsapp] API başarılı", { status: res.status, durationMs: Date.now() - startedAt, id, to: maskPhone(to) });
    return { ok: true, id };
  } catch (e) {
    const error = e instanceof Error ? e.message : "unknown";
    console.error("[whatsapp] network/exception", { durationMs: Date.now() - startedAt, error });
    return { ok: false, error };
  }
}
