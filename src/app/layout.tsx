import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AgeGate } from "@/components/legal/AgeGate";
import { CartProvider } from "@/context/CartContext";
import { JsonLd } from "@/components/seo/JsonLd";
import { localBusinessJsonLd } from "@/lib/local-business";
import { SITE_LOGO, SITE_NAME, SITE_URL, pageUrl } from "@/lib/site";
import { CALI_PACK_COUNT } from "@/data/products";
import "./globals.css";

// Logo wordmark only — keeps the brand mark unchanged.
// Latin woff2 files are committed so production builds never call fonts.googleapis.com.
const inter = localFont({
  src: [
    { path: "../fonts/inter-latin.woff2", weight: "800", style: "normal" },
    { path: "../fonts/inter-latin.woff2", weight: "900", style: "normal" },
  ],
  display: "optional",
  variable: "--font-inter",
  preload: false,
  adjustFontFallback: "Arial",
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});

const jakarta = localFont({
  src: "../fonts/plus-jakarta-sans-latin.woff2",
  weight: "200 800",
  style: "normal",
  display: "swap",
  variable: "--font-jakarta",
  preload: true,
  adjustFontFallback: "Arial",
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});

const fraunces = localFont({
  src: "../fonts/fraunces-latin.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-fraunces",
  preload: true,
  adjustFontFallback: "Times New Roman",
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});

export const viewport: Viewport = {
  themeColor: "#051f20",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  formatDetection: { telephone: true, email: true, address: true },
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "shopping",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "48x48" },
      { url: "/favicon.svg?v=2", type: "image/svg+xml" },
      { url: "/icon-32.png?v=2", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png?v=2", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png?v=2", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: [{ url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" }],
  },
  title: {
    default: `Smoke Cali | Cali Packs £0.22 · Manchester`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    `Smoke Cali is a Manchester smoke shop for wholesale Cali Packs. ${CALI_PACK_COUNT} HD designs, £0.22 each, minimum 25 pcs, or £0.20 each from 50. UK postage is shown on each product. Visit us at 5 Sagar Street, Manchester, open daily 9:30–19:30.`,
  keywords: [
    "Smoke Cali",
    "Cali Packs UK",
    "Cali Packs wholesale",
    "Cali Packs Manchester",
    "3.5g mylar bags UK",
    "smoke shop Manchester",
    "mylar bags UK",
    "wholesale cali packs",
  ],
  // Canonicals are set per-page so cart/checkout don't inherit the homepage URL.
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: pageUrl("/"),
    siteName: SITE_NAME,
    title: "Smoke Cali | Cali Packs £0.22 · Manchester",
    description:
      `${CALI_PACK_COUNT} HD Cali Packs from Smoke Cali Manchester. £0.22 each, minimum 25 pcs, or £0.20 each from 50. Shop online or visit Sagar Street.`,
    images: [
      {
        url: "/hero-cali-packs.webp",
        width: 1280,
        height: 720,
        alt: "Smoke Cali Cali Packs wholesale wall",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smoke Cali | Cali Packs £0.22",
    description: `${CALI_PACK_COUNT} HD Cali Packs. £0.22 each, min 25 pcs, 50+ for £0.20. Manchester smoke shop.`,
    images: ["/hero-cali-packs.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${jakarta.variable} ${fraunces.variable}`}>
      <body className="antialiased">
        <JsonLd data={localBusinessJsonLd()} />
        <CartProvider>
          <AgeGate />
          <AnnouncementBar />
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
