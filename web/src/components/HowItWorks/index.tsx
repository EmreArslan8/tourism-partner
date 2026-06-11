import { s } from "./styles";

const STEPS = [
  { n: "1", t: "Kaydolun", d: "İşletmenizi otel, acente, rehber, eğlence veya sağlık kategorisinde ekleyin. İlk 200 acente ücretsiz." },
  { n: "2", t: "Onaydan geçin", d: "İlanınız yayına girmeden önce doğrulama ve onay sürecinden geçer — kalite korunur." },
  { n: "3", t: "Keşfedilin", d: "Üye acenteler sizi filtreleyip bulur; isterseniz doping ile listede öne çıkın." },
];

const FAQ = [
  { q: "Üyelik ücretli mi?", a: "Listelenme yıllık üyelik ile alınır. Lansman döneminde ilk 200 acente ücretsizdir; ilk yıl herkese ücretsiz olabilir." },
  { q: "Doping nedir?", a: "İşletmenizi listede ve vitrinde öne çıkaran tercihe bağlı bir yükseltmedir. İlk 24 saatte kaydolan işletmeler 1 günlük hediye doping kazanır." },
  { q: "Detayları neden göremiyorum?", a: "Tüm tedarikçi listesi ve iletişim/konum detayları üyelere özeldir. Ücretsiz üye olarak tüm verilere erişebilirsiniz." },
];

export default function HowItWorks() {
  return (
    <>
      <section className={s.section} id="nasil">
        <div className={s.head}>
          <p className="eyebrow">Nasıl Çalışır</p>
          <h2 className={s.headTitle}>Üç adımda iş birliği</h2>
        </div>
        <div className={s.grid}>
          {STEPS.map((step) => (
            <div className={s.card} key={step.n}>
              <span className={s.num}>{step.n}</span>
              <h3 className={s.cardTitle}>{step.t}</h3>
              <p className={s.cardText}>{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={s.section} id="sss">
        <div className={s.head}>
          <p className="eyebrow">SSS</p>
          <h2 className={s.headTitle}>Sık sorulan sorular</h2>
        </div>
        <div className={s.faqList}>
          {FAQ.map((f) => (
            <details className={s.faqItem} key={f.q}>
              <summary className={s.faqSummary}>{f.q}</summary>
              <p className={s.faqText}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
