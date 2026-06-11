import Link from "next/link";
import Splash from "@/components/Splash";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Showcase from "@/components/Showcase";
import HowItWorks from "@/components/HowItWorks";

export default function Home() {
  return (
    <>
      <Splash />
      <main>
        <Hero />

        <div className="container-px">
          <Categories />
          <Showcase />
          <HowItWorks />
        </div>

        <section className="bg-pine">
          <div className="container-px flex flex-wrap items-center justify-between gap-6 py-14">
            <div>
              <h2 className="text-[clamp(24px,3vw,34px)] text-cream">İşletmenizi bugün listeleyin</h2>
              <p className="mt-2 max-w-[520px] text-[15px] text-cream/70">
                İlk 200 acente ücretsiz. İlk 24 saatte kaydolan işletmeler 1 günlük hediye doping kazanır.
              </p>
            </div>
            <Link href="/kayit" className="btn btn-cream">+ Firma Ekle</Link>
          </div>
        </section>
      </main>
    </>
  );
}
