import { CALI_PACK_COUNT } from "@/data/products";

export interface HeroBanner {
  id: string;
  image: string;
  imageAlt: string;
  mood: "pink" | "purple" | "teal";
  headline: string;
  subline: string;
  ctaLabel: string;
  ctaHref: string;
  floatingImages: string[];
}

export const heroBanners: HeroBanner[] = [
  {
    id: "hero-wall",
    image: "/hero-cali-packs.jpg",
    imageAlt: `Cali Packs wholesale wall — ${CALI_PACK_COUNT} HD designs`,
    mood: "pink",
    headline: `${CALI_PACK_COUNT} Cali Packs. Studio HD.`,
    subline:
      "£0.22 each · minimum 25 pcs · 50+ for £0.20 each. Smell-proof 3.5g designs photographed for the web.",
    ctaLabel: "Shop Cali Packs",
    ctaHref: "/shop/cali-packs",
    floatingImages: [],
  },
  {
    id: "hero-rainbow",
    image: "/products/pack-027.webp",
    imageAlt: "Rainbow Nerds Handbag Cali Pack",
    mood: "purple",
    headline: "Packs That Stop the Scroll.",
    subline:
      "Loud die-cut Cali Packs at £0.22 each. Minimum 25 pcs, or £0.20 each from 50 — UK dispatch in 2–3 days.",
    ctaLabel: "Browse the Catalogue",
      ctaHref: "/shop/cali-packs",
    floatingImages: [],
  },
  {
    id: "hero-gelato",
    image: "/products/pack-008.webp",
    imageAlt: "Blue Guava Gelato Cali Pack",
    mood: "teal",
    headline: "Wholesale Ready. £0.22 a Pack.",
    subline:
      "Every design is named, priced and photographed in HD. Minimum 25 pcs, and £0.20 each from 50. We ship across the UK.",
    ctaLabel: `View All ${CALI_PACK_COUNT} Packs`,
    ctaHref: "/shop/cali-packs",
    floatingImages: [],
  },
];
