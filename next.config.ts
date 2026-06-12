import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

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
    // Optimize edilmiş görseller CDN'de daha uzun tutulsun (saniye).
    minimumCacheTTL: 2592000,
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
