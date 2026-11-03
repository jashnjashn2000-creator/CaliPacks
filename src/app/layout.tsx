import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AgeGate } from "@/components/legal/AgeGate";
import { CartProvider } from "@/context/CartContext";
import { JsonLd } from "@/components/seo/JsonLd";
import { localBusinessJsonLd } from "@/lib/local-business";
import { SITE_LOGO, SITE_NAME, SITE_URL, pageUrl } from "@/lib/site";
import "./globals.css";

// Logo wordmark only — keeps the brand mark unchanged.
const inter = Inter({
  subsets: ["latin"],
  weight: ["800", "900"],
  display: "optional",
  variable: "--font-inter",
  preload: false,
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
  preload: true,
});

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT"],
  display: "swap",
  variable: "--font-fraunces",
  preload: true,
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
    default: `Smoke Cali | Cali Packs £0.20 · Manchester`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Smoke Cali is a Manchester smoke shop for wholesale Cali Packs. 111 HD designs, £0.20 per pack, minimum 50 pcs, UK delivery from £4.00. Visit us at 5 Sagar Street, Manchester, open daily 9:30–19:30.",
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
    title: "Smoke Cali | Cali Packs £0.20 · Manchester",
    description:
      "111 HD Cali Packs from Smoke Cali Manchester. £0.20 per pack, minimum 50 pcs. Shop online or visit Sagar Street.",
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
    title: "Smoke Cali | Cali Packs £0.20",
    description: "111 HD Cali Packs. £0.20 per pack, min 50 pcs. Manchester smoke shop.",
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
