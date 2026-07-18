import Script from "next/script";
import PageViewTracker from "./PageViewTracker";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();

export function AnalyticsScripts() {
  if (!gaMeasurementId && !gtmId) return null;

  return (
    <>
      {gtmId ? (
        <Script id="gtm-base" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </Script>
      ) : null}

      {gaMeasurementId ? (
        <>
          <Script
            id="ga4-library"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${gaMeasurementId}', { send_page_view: false });
            `}
          </Script>
        </>
      ) : null}

      <PageViewTracker gaMeasurementId={gaMeasurementId} gtmId={gtmId} />
    </>
  );
}

export function GoogleTagManagerNoScript() {
  if (!gtmId) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        className="hidden invisible"
        title="Google Tag Manager"
      />
    </noscript>
  );
}
