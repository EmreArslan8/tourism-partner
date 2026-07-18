import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";
import type { SiteLocale } from "@/lib/site";

const values = [
  {
    title: "Güven ve Prestij",
    text: "Sektör profesyonellerinin bir araya geldiği bir platformda güvenin en büyük sermaye olduğuna inanıyoruz. Network'ümüze dahil olan her bir üyenin niteliğini ve güvenirliğini önemsiyor; ticari ilişkilerin şeffaf, prestijli ve güvenli bir zeminde yürümesini sağlıyoruz.",
  },
  {
    title: "İnovasyon ve Gelecek Odaklılık",
    text: "Turizm dünyası hızla dijitalleşirken, geleneksel iş yapış şekillerini modern teknolojiyle entegre ediyoruz. Akıllı eşleştirme altyapımız ve sürekli güncellenen dijital çözümlerimizle, üyelerimizin geleceğin turizm trendlerine bugünden hazır olmalarını sağlıyoruz.",
  },
  {
    title: "Tam Şeffaflık ve Özgür Ticaret",
    text: "Gizli maliyetlere, sürpriz komisyonlara ve sınırlandırıcı kurallara karşıyız. Üyelerimizin kendi aralarında doğrudan, aracısız ve komisyonsuz ticaret yapabilmesini savunuyor; tüm iş süreçlerimizi açık, net ve dürüst bir şeffaflık politikasıyla yönetiyoruz.",
  },
  {
    title: "Sınır Tanımayan İş Birliği",
    text: "Farklı ülkelerden, farklı uzmanlık alanlarından turizm profesyonellerini ortak bir akılla birleştiriyoruz. Yerel güçlerin küresel bağlantılarla bir araya geldiğinde büyük bir sinerji yaratacağına inanıyor; sınırları ve mesafeleri iş birliğinin önünden kaldırıyoruz.",
  },
  {
    title: "Üye Odaklılık ve Kârlılık",
    text: "Başarımızı, üyelerimizin başarısı ve kârlılığı ile ölçüyoruz. Platformumuza katılan her işletmenin verimliliğini artırmak, operasyonel esneklik kazanmasını sağlamak ve hedef pazarlarda maksimum kârlılığa ulaşmasını desteklemek için kesintisiz çalışıyoruz.",
  },
] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Hakkımızda · Tourism Partner",
    description:
      "Tourism Partner B2B Network; turizm profesyonellerini güvenilir, şeffaf ve komisyonsuz iş birlikleri için tek çatı altında buluşturan küresel network platformudur.",
    alternates: localeAlternates(locale as SiteLocale, "/about"),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen">
      <article className="container-px mx-auto max-w-[940px] py-12 min-[1440px]:py-16 max-[640px]:py-8">
        <div className="rounded-card-lg border border-line bg-paper p-8 min-[1440px]:p-10 max-[640px]:p-5">
          <header className="border-b border-line pb-7">
            <p className="text-[12px] font-extrabold uppercase tracking-[.14em] text-terra">
              Tourism Partner B2B Network
            </p>
            <h1 className="mt-3 text-[34px] font-extrabold leading-tight text-ink min-[1440px]:text-[42px] max-[640px]:text-[29px]">
              Hakkımızda
            </h1>
            <p className="mt-4 text-[16px] font-medium leading-8 text-[#4b5875]">
              Tourism Partner B2B Network, küresel turizm endüstrisinin dinamik ihtiyaçlarına yanıt vermek,
              sektörün her branşından profesyonelleri tek bir çatı altında toplamak ve iş birliklerini daha verimli
              hale getirmek amacıyla kurulmuş yeni nesil bir B2B iş ortaklığı ve network platformudur.
            </p>
          </header>

          <div className="mt-8 space-y-10">
            <section aria-labelledby="about-approach">
              <h2 id="about-approach" className="text-[24px] font-extrabold leading-tight text-ink">
                Doğru Partnerle Buluşma Yaklaşımı
              </h2>
              <p className="mt-4 text-[15.5px] font-medium leading-8 text-[#4b5875]">
                Günümüz turizm dünyasında başarının anahtarının doğru zamanda, doğru partnerle buluşmak olduğunun
                bilincindeyiz. Bu doğrultuda; konaklamadan ulaşıma, sağlık turizminden profesyonel rehberliğe kadar
                sektörün tüm yapı taşlarını; güvenilir, inovatif ve uçtan uca çözümler sunan küresel bir iş ağında bir
                araya getiriyoruz.
              </p>
            </section>

            <section aria-labelledby="mission-title">
              <h2 id="mission-title" className="text-[24px] font-extrabold leading-tight text-ink">
                Misyonumuz
              </h2>
              <div className="mt-4 space-y-4 text-[15.5px] font-medium leading-8 text-[#4b5875]">
                <p>
                  Farklı uzmanlık alanlarına sahip küresel turizm profesyonellerinin aracısız ve komisyon ödemeden
                  doğrudan çalışmasını sağlayarak, işletmelerini maksimum kârlılık hedeflerine ulaştırmaktır.
                </p>
                <p>
                  Üyelerimize sunduğumuz geniş ve güvenilir network sayesinde; daha önce operasyon yapmadıkları
                  coğrafyalarda bile yerel partnerlerle sıfır riskle, esnek ve eksiksiz iş birlikleri kurmalarını
                  sağlıyoruz. Sektördeki en son trendleri ve pazar fırsatlarını tek bir dijital merkezden sunarak,
                  turizm ekosistemini üyelerimizle birlikte büyütmeyi amaçlıyoruz.
                </p>
              </div>
            </section>

            <section aria-labelledby="vision-title">
              <h2 id="vision-title" className="text-[24px] font-extrabold leading-tight text-ink">
                Vizyonumuz
              </h2>
              <div className="mt-4 space-y-4 text-[15.5px] font-medium leading-8 text-[#4b5875]">
                <p>
                  Teknoloji ve güveni tek bir çatı altında harmanlayarak; dünya genelindeki tüm turizm aktörlerinin
                  aracılara ihtiyaç duymadan, özgürce ve yüksek kârlılıkla ticaret yapabildiği sınırların ötesinde,
                  küresel bir dijital turizm ekosistemi inşa etmek.
                </p>
                <p>
                  Geliştirdiğimiz akıllı B2B network altyapısıyla, operasyonel engelleri ve coğrafi sınırları tamamen
                  ortadan kaldırarak; en küçük yerel tedarikçiden en büyük küresel tur operatörüne kadar herkesin
                  dünya standartlarında, güvenle iş birliği yaptığı küresel turizm ticaretinin bir numaralı ortak dili
                  ve standardı olmak.
                </p>
              </div>
            </section>

            <section aria-labelledby="values-title">
              <h2 id="values-title" className="text-[24px] font-extrabold leading-tight text-ink">
                Değerlerimiz
              </h2>
              <div className="mt-5 space-y-5">
                {values.map((value) => (
                  <div key={value.title} className="border-t border-line pt-5 first:border-t-0 first:pt-0">
                    <h3 className="text-[18px] font-extrabold leading-snug text-ink">{value.title}</h3>
                    <p className="mt-2 text-[15.5px] font-medium leading-8 text-[#4b5875]">{value.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </article>
    </main>
  );
}
