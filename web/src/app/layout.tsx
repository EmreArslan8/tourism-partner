import type { Metadata } from "next";
import { Fraunces, Archivo } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const display = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  style: ["normal", "italic"],
  display: "swap",
});

const body = Archivo({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tourism Partner — B2B Turizm Tedarikçi Ağı",
  description:
    "Oteller, acenteler, rehberler, tur firmaları, eğlence ve sağlık turizmi için B2B tedarikçi ağı. Filtreleyin, üye olun, iş ortağı bulun.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${display.variable} ${body.variable}`}>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
