"use client";

import { ArrowRight, BadgeCheck, Building2, Handshake, Search, Users } from "lucide-react";
import HomeTourButton from "@/components/ProductTour/HomeTourButton";
import styles from "./styles";

export default function PlatformTour() {
  return (
    <section className={styles.section} id="platform-turu">
      <div className={styles.copy}>
        <span className={styles.eyebrow}>Platform özeti</span>
        <h2 className={styles.title}>Turizm iş ortaklığı tek akışta.</h2>
        <p className={styles.lead}>
          Tourism Partner; acente ve firmaların güvenilir tedarikçi bulduğu, tedarikçilerin de görünür olup
          teklif fırsatlarını yönettiği B2B turizm ağıdır.
        </p>
        <HomeTourButton />
      </div>

      <div className={styles.visual} data-tour="overview-map">
        <div className={styles.visualTop}>
          <span>Platform akışı</span>
          <strong>Arayan taraf ile hizmet veren taraf aynı hatta buluşur.</strong>
        </div>

        <div className={styles.flow} data-tour="overview-flow">
          <div className={styles.flowNode} data-tour="overview-buyer">
            <span>
              <Users size={22} strokeWidth={2.35} aria-hidden />
            </span>
            <small>Acente / Firma</small>
            <strong>İhtiyacı tanımlar</strong>
          </div>

          <span className={styles.connector} aria-hidden>
            <ArrowRight size={20} strokeWidth={2.4} />
          </span>

          <div className={styles.hub} data-tour="overview-platform">
            <span>
              <Handshake size={24} strokeWidth={2.35} aria-hidden />
            </span>
            <small>Tourism Partner</small>
            <strong>Eşleştirir</strong>
            <p>Arama, kısa liste, teklif ve güven kontrolü tek akışta çalışır.</p>
          </div>

          <span className={styles.connector} aria-hidden>
            <ArrowRight size={20} strokeWidth={2.4} />
          </span>

          <div className={styles.flowNode} data-tour="overview-supplier">
            <span>
              <Building2 size={22} strokeWidth={2.35} aria-hidden />
            </span>
            <small>Tedarikçi</small>
            <strong>Teklif verir</strong>
          </div>
        </div>

        <div className={styles.roles}>
          <div>
            <Search size={17} strokeWidth={2.35} aria-hidden />
            <strong>Arayan taraf</strong>
            <span>Doğru otel, rehber, transfer veya hizmet sağlayıcıyı daha hızlı bulur.</span>
          </div>
          <div>
            <BadgeCheck size={17} strokeWidth={2.35} aria-hidden />
            <strong>Hizmet veren taraf</strong>
            <span>Profilini görünür yapar, uygun taleplere daha düzenli yanıt verir.</span>
          </div>
        </div>

        <div className={styles.value} data-tour="overview-value">
          <span>Onaylı kayıt</span>
          <span>Kontrollü iletişim</span>
          <span>Net teklif akışı</span>
        </div>
      </div>
    </section>
  );
}
