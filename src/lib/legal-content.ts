/* Hukuki sayfa içerikleri — TEMPLATE metinler. Köşeli parantezli alanlar
   ([Şirket Unvanı] vb.) yayına almadan önce gerçek bilgilerle doldurulmalı ve
   metinler hukuk danışmanına onaylatılmalıdır. */

export type LegalDocKey = "terms" | "privacy" | "kvkk";

export type LegalSection = { heading: string; paragraphs: string[] };
export type LegalDoc = { title: string; updated: string; intro: string; sections: LegalSection[] };

const COMPANY = "[Şirket Unvanı] ([Adres], [Mersis No])";

const tr: Record<LegalDocKey, LegalDoc> = {
  terms: {
    title: "Kullanım Koşulları",
    updated: "Son güncelleme: 10 Temmuz 2026",
    intro:
      "Bu Kullanım Koşulları, Tourism Partner platformunu (\"Platform\") kullanan tüm ziyaretçi ve üyeler için geçerlidir. Platformu kullanarak bu koşulları kabul etmiş sayılırsınız.",
    sections: [
      {
        heading: "1. Taraflar ve Tanımlar",
        paragraphs: [
          `Platform, ${COMPANY} tarafından işletilmektedir. "Üye", Platforma kayıt olan işletmeleri; "Ziyaretçi", kayıt olmaksızın Platformu görüntüleyen kişileri ifade eder.`,
        ],
      },
      {
        heading: "2. Hizmetin Kapsamı",
        paragraphs: [
          "Platform, turizm sektöründe faaliyet gösteren işletmeleri (konaklama, acente, rehber, ulaşım, aktivite, sağlık, gastronomi) bir araya getiren bir B2B tanıtım ve iletişim ağıdır.",
          "Platform, üyeler arasında kurulan ticari ilişkilerin tarafı değildir; üyeler arasındaki sözleşme, ödeme ve hizmet iferları ilgili üyelerin kendi sorumluluğundadır.",
        ],
      },
      {
        heading: "3. Üyelik ve Hesap Güvenliği",
        paragraphs: [
          "Üyelik kaydı ücretsizdir. Üye, kayıt sırasında verdiği bilgilerin doğru ve güncel olduğunu taahhüt eder. Profillerin yayına alınması admin onayına tabidir.",
          "Hesap bilgilerinin (e-posta, şifre) gizliliği üyenin sorumluluğundadır. Hesap üzerinden yapılan tüm işlemlerden üye sorumludur.",
        ],
      },
      {
        heading: "4. İçerik ve Fikri Mülkiyet",
        paragraphs: [
          "Üye, profiline yüklediği içeriklerin (metin, görsel, belge) hak sahibi olduğunu veya kullanım iznine sahip olduğunu beyan eder. Hukuka aykırı, yanıltıcı veya üçüncü kişi haklarını ihlal eden içerikler kaldırılabilir ve üyelik askıya alınabilir.",
          "Platformun tasarımı, yazılımı ve markası işletmecinin mülkiyetindedir; izinsiz kopyalanamaz.",
        ],
      },
      {
        heading: "5. Ücretlendirme",
        paragraphs: [
          "Temel üyelik ücretsizdir. Doping / Premium Partner gibi ücretli görünürlük hizmetlerinin kapsamı ve bedeli, satın alma öncesinde ayrıca bildirilir.",
        ],
      },
      {
        heading: "6. Sorumluluğun Sınırlandırılması",
        paragraphs: [
          "Platformda yer alan işletme bilgileri ilgili üyeler tarafından sağlanır; işletmecinin bu bilgilerin doğruluğuna ilişkin garantisi yoktur. Platform \"olduğu gibi\" sunulur; kesintisiz erişim taahhüt edilmez.",
        ],
      },
      {
        heading: "7. Değişiklikler ve Uygulanacak Hukuk",
        paragraphs: [
          "İşletmeci bu koşulları güncelleyebilir; güncel sürüm bu sayfada yayımlanır. İşbu koşullar Türkiye Cumhuriyeti hukukuna tabidir; uyuşmazlıklarda [Şehir] mahkemeleri ve icra daireleri yetkilidir.",
        ],
      },
    ],
  },
  privacy: {
    title: "Gizlilik Politikası",
    updated: "Son güncelleme: 10 Temmuz 2026",
    intro:
      "Bu Gizlilik Politikası, Tourism Partner platformunda hangi verilerin hangi amaçlarla işlendiğini ve haklarınızı açıklar. KVKK kapsamındaki ayrıntılı bilgilendirme için KVKK Aydınlatma Metni'ne bakınız.",
    sections: [
      {
        heading: "1. Toplanan Veriler",
        paragraphs: [
          "Üyelik sırasında: işletme adı, e-posta, telefon, kategori ve bölge bilgileri. Profil doldurulurken: açıklama, görseller, belgeler ve iletişim bilgileri. Platform kullanımı sırasında: çerezler aracılığıyla oturum ve kullanım verileri.",
        ],
      },
      {
        heading: "2. Kullanım Amaçları",
        paragraphs: [
          "Veriler; üyelik işlemlerinin yürütülmesi, profillerin yayımlanması, teklif taleplerinin iletilmesi, destek süreçleri ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenir.",
          "Veriler üçüncü kişilere pazarlama amacıyla satılmaz. Barındırma ve e-posta altyapısı gibi hizmet sağlayıcılarla, hizmetin gerektirdiği ölçüde paylaşım yapılabilir.",
        ],
      },
      {
        heading: "3. Çerezler",
        paragraphs: [
          "Platform; oturum yönetimi, dil tercihi ve temel analitik için çerez kullanır. Tarayıcı ayarlarından çerezleri sınırlandırabilirsiniz; bu durumda bazı özellikler çalışmayabilir.",
        ],
      },
      {
        heading: "4. Veri Güvenliği ve Saklama",
        paragraphs: [
          "Veriler, endüstri standardı teknik ve idari tedbirlerle korunur; üyelik sona erdikten sonra yasal saklama süreleri boyunca muhafaza edilir ve ardından silinir veya anonimleştirilir.",
        ],
      },
      {
        heading: "5. Haklarınız ve İletişim",
        paragraphs: [
          "Verilerinize erişme, düzeltme, silme ve işlemeye itiraz haklarınız için [e-posta adresi] üzerinden bize ulaşabilirsiniz.",
        ],
      },
    ],
  },
  kvkk: {
    title: "KVKK Aydınlatma Metni",
    updated: "Son güncelleme: 10 Temmuz 2026",
    intro:
      "6698 sayılı Kişisel Verilerin Korunması Kanunu (\"KVKK\") uyarınca, veri sorumlusu sıfatıyla hareket eden " +
      COMPANY +
      " tarafından kişisel verilerinizin işlenmesine ilişkin olarak aşağıdaki hususlarda bilgilendirilirsiniz.",
    sections: [
      {
        heading: "1. İşlenen Kişisel Veriler",
        paragraphs: [
          "Kimlik ve iletişim verileri (ad soyad, e-posta, telefon), işletme bilgileri, belge verileri (ör. TÜRSAB belgesi, vergi levhası), işlem güvenliği verileri (IP, oturum kayıtları) ve görsel veriler (profil/galeri görselleri).",
        ],
      },
      {
        heading: "2. İşleme Amaçları ve Hukuki Sebepler",
        paragraphs: [
          "Verileriniz; üyelik sözleşmesinin kurulması ve ifası (KVKK m.5/2-c), hukuki yükümlülüklerin yerine getirilmesi (m.5/2-ç), meşru menfaat (m.5/2-f) ve gerektiğinde açık rızanız (m.5/1) hukuki sebeplerine dayanarak işlenir.",
        ],
      },
      {
        heading: "3. Verilerin Aktarılması",
        paragraphs: [
          "Verileriniz; barındırma, veri tabanı ve e-posta hizmeti sağlayıcılarına hizmetin gerektirdiği ölçüde, yetkili kamu kurumlarına ise yasal zorunluluk hâlinde aktarılabilir. Sunucuların yurt dışında bulunması hâlinde aktarım, KVKK m.9'a uygun şekilde yapılır.",
        ],
      },
      {
        heading: "4. Toplama Yöntemi",
        paragraphs: [
          "Kişisel veriler; kayıt ve profil formları, destek/iletişim formları ve çerezler aracılığıyla elektronik ortamda toplanır.",
        ],
      },
      {
        heading: "5. KVKK m.11 Kapsamındaki Haklarınız",
        paragraphs: [
          "Kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, amacına uygun kullanılıp kullanılmadığını öğrenme, eksik/yanlış işlenmişse düzeltilmesini isteme, silinmesini veya yok edilmesini isteme, otomatik sistemlerle analiz sonucu aleyhinize çıkan sonuçlara itiraz etme ve zarara uğramanız hâlinde tazminat talep etme haklarına sahipsiniz.",
          "Başvurularınızı [e-posta adresi] adresine veya [Adres] posta adresine iletebilirsiniz. Başvurular en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.",
        ],
      },
    ],
  },
};

const en: Record<LegalDocKey, LegalDoc> = {
  terms: {
    title: "Terms of Use",
    updated: "Last updated: 10 July 2026",
    intro:
      "These Terms of Use apply to all visitors and members of the Tourism Partner platform (the \"Platform\"). By using the Platform you agree to these terms.",
    sections: [
      {
        heading: "1. Parties and Definitions",
        paragraphs: [
          `The Platform is operated by ${COMPANY}. "Member" refers to businesses registered on the Platform; "Visitor" refers to anyone browsing without registration.`,
        ],
      },
      {
        heading: "2. Scope of Service",
        paragraphs: [
          "The Platform is a B2B visibility and communication network bringing together tourism businesses (accommodation, agencies, guides, transport, activities, health, gastronomy).",
          "The Platform is not a party to commercial relationships formed between members; contracts, payments and service delivery are the sole responsibility of the members involved.",
        ],
      },
      {
        heading: "3. Membership and Account Security",
        paragraphs: [
          "Registration is free. Members warrant that the information they provide is accurate and up to date. Profiles go live subject to admin approval.",
          "Members are responsible for keeping their credentials confidential and for all activity under their account.",
        ],
      },
      {
        heading: "4. Content and Intellectual Property",
        paragraphs: [
          "Members represent that they own or are licensed to use all content they upload. Unlawful, misleading or infringing content may be removed and memberships may be suspended.",
          "The Platform's design, software and brand belong to the operator and may not be copied without permission.",
        ],
      },
      {
        heading: "5. Fees",
        paragraphs: [
          "Basic membership is free. The scope and price of paid visibility services (Boost / Premium Partner) are communicated before purchase.",
        ],
      },
      {
        heading: "6. Limitation of Liability",
        paragraphs: [
          "Business information on the Platform is provided by the respective members; the operator does not guarantee its accuracy. The Platform is provided \"as is\" and uninterrupted access is not warranted.",
        ],
      },
      {
        heading: "7. Changes and Governing Law",
        paragraphs: [
          "The operator may update these terms; the current version is published on this page. These terms are governed by the laws of the Republic of Türkiye; the courts of [City] have jurisdiction.",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    updated: "Last updated: 10 July 2026",
    intro:
      "This Privacy Policy explains what data is processed on the Tourism Partner platform, for what purposes, and your rights. For detailed disclosure under Turkish data protection law, see the KVKK Notice.",
    sections: [
      {
        heading: "1. Data We Collect",
        paragraphs: [
          "At registration: business name, email, phone, category and region. While completing a profile: description, images, documents and contact details. During use: session and usage data via cookies.",
        ],
      },
      {
        heading: "2. Purposes of Use",
        paragraphs: [
          "Data is processed to run memberships, publish profiles, deliver quote requests, provide support and meet legal obligations.",
          "Data is not sold to third parties for marketing. It may be shared with service providers (hosting, email infrastructure) to the extent required to deliver the service.",
        ],
      },
      {
        heading: "3. Cookies",
        paragraphs: [
          "The Platform uses cookies for session management, language preference and basic analytics. You can restrict cookies in your browser settings; some features may stop working.",
        ],
      },
      {
        heading: "4. Security and Retention",
        paragraphs: [
          "Data is protected with industry-standard technical and organisational measures, retained for statutory periods after membership ends, and then deleted or anonymised.",
        ],
      },
      {
        heading: "5. Your Rights and Contact",
        paragraphs: [
          "To access, correct, delete or object to the processing of your data, contact us at [email address].",
        ],
      },
    ],
  },
  kvkk: {
    title: "KVKK Notice (Turkish Data Protection)",
    updated: "Last updated: 10 July 2026",
    intro:
      "Under Turkish Personal Data Protection Law No. 6698 (\"KVKK\"), " +
      COMPANY +
      ", acting as data controller, informs you about the processing of your personal data as follows.",
    sections: [
      {
        heading: "1. Personal Data Processed",
        paragraphs: [
          "Identity and contact data (name, email, phone), business information, document data (e.g. TÜRSAB licence, tax certificate), transaction security data (IP, session logs) and visual data (profile/gallery images).",
        ],
      },
      {
        heading: "2. Purposes and Legal Bases",
        paragraphs: [
          "Your data is processed based on performance of the membership agreement (KVKK art. 5/2-c), compliance with legal obligations (art. 5/2-ç), legitimate interest (art. 5/2-f) and, where required, your explicit consent (art. 5/1).",
        ],
      },
      {
        heading: "3. Data Transfers",
        paragraphs: [
          "Data may be transferred to hosting, database and email service providers to the extent required, and to competent public authorities where legally mandated. Transfers abroad are carried out in accordance with KVKK art. 9.",
        ],
      },
      {
        heading: "4. Collection Method",
        paragraphs: [
          "Personal data is collected electronically via registration and profile forms, support/contact forms and cookies.",
        ],
      },
      {
        heading: "5. Your Rights under KVKK art. 11",
        paragraphs: [
          "You have the right to learn whether your data is processed, request information, learn the purpose of processing, request correction of incomplete/inaccurate data, request deletion or destruction, object to results arising from automated analysis, and claim compensation for damages.",
          "Submit requests to [email address] or by post to [Address]. Requests are concluded free of charge within 30 days at the latest.",
        ],
      },
    ],
  },
};

export const LEGAL_CONTENT: Record<"tr" | "en", Record<LegalDocKey, LegalDoc>> = { tr, en };

export function getLegalDoc(locale: string, key: LegalDocKey): LegalDoc {
  return (locale === "en" ? en : tr)[key];
}
