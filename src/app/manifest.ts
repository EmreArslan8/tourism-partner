import type { MetadataRoute } from "next";

/*
 * Web App Manifest — /manifest.webmanifest olarak servis edilir.
 * Favicon denetiminin "No web app manifest" bulgusunu kapatır; PWA/ana ekrana
 * ekleme ikonlarını (192/512 + maskable) tanımlar.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tourism Partner",
    short_name: "Tourism Partner",
    description:
      "Global turizm tedarikçileriyle doğrudan bağlantı kurun — network, expo ve iş ortaklığı platformu.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#5910A6",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
