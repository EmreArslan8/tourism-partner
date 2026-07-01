import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

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
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.supabase.co https://*.tile.openstreetmap.org",
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
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
