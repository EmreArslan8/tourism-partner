import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// 'unsafe-eval' yalnızca dev'de gerekir (turbopack/HMR); prod CSP'sinden çıkarılır.
// 'unsafe-inline' Next'in inline runtime script'leri için kalır — nonce'a geçiş ayrı iş.
const scriptSrc =
  process.env.NODE_ENV === "development"
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.supabase.co https://*.basemaps.cartocdn.com https://*.tile.openstreetmap.org",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Cache Components: 'use cache' direktifi + PPR (statik kabuk + dynamic stream).
  // Veri varsayılan olarak dynamic; neyin cache'leneceğini 'use cache' ile seçiyoruz.
  cacheComponents: true,
  turbopack: {
    root: __dirname,
  },
  images: {
    // Supabase Storage'daki public foto'lar next/image ile optimize edilsin.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Kullanılan görsel kaliteleri (Next 16 artık açıkça istiyor).
    qualities: [75, 85],
    // Optimize edilmiş görseller CDN'de daha uzun tutulsun (saniye).
    minimumCacheTTL: 2592000,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Coğrafya chunk'ları (ülke/şehir/ilçe) nadiren değişir — agresif cache.
        // Yenileme: scripts/build-geo.mjs + deploy; en geç 1 saat sonra taze veri.
        source: "/geo/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" }],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
