import { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "cali-packs",
    name: "Cali Packs",
    slug: "cali-packs",
    tagline: "£0.22 each · Min 25 · 50+ for £0.20",
    description:
      "111 HD-photographed Cali Packs. £0.22 each, minimum order 25 pcs. Buy 50 or more of the same design for £0.20 each. Smell-proof 3.5g designs ready for UK shops.",
    image: "/products/pack-001.webp",
    productCount: 111,
  },
  {
    id: "stash-cans",
    name: "Stash Cans",
    slug: "stash-cans",
    tagline: "From £5.99",
    description:
      "Novelty candy-tin diversion cans from the Manchester shop. Hidden stash, supermarket-style labels, sold each.",
    image: "/shop/candy-stash-cans.webp",
    productCount: 1,
  },
  {
    id: "grinders",
    name: "Grinders",
    slug: "grinders",
    tagline: "From £6.99",
    description:
      "Metal, crystal, and 4-piece herb grinders photographed from shop stock. Competitive UK high-street prices.",
    image: "/shop/gold-honeycomb-grinder.webp",
    productCount: 4,
  },
  {
    id: "lighters",
    name: "Lighters",
    slug: "lighters",
    tagline: "From £1.79",
    description:
      "Clipper and graphic-print lighters from the Smoke Cali counter. Refillable, sold each.",
    image: "/shop/clipper-lighters.webp",
    productCount: 2,
  },
  {
    id: "scales",
    name: "Scales",
    slug: "scales",
    tagline: "From £12.99",
    description:
      "OnBalance MZ-100 and MyWeight Triton T3 pocket scales. Shop-floor stock, UK-competitive retail.",
    image: "/shop/onbalance-mz100.webp",
    productCount: 2,
  },
  {
    id: "hookahs",
    name: "Hookahs",
    slug: "hookahs",
    tagline: "From £49.99",
    description:
      "Glass-stem and colour novelty shisha hookahs from the Manchester display. Decorative pieces for shisha use.",
    image: "/shop/colour-novelty-hookah.webp",
    productCount: 3,
  },
  {
    id: "glass",
    name: "Glass",
    slug: "glass",
    tagline: "From £16.99",
    description:
      "Mini bubblers, spiral perc pieces, swan pipes, and beaker bongs. HD shop-floor photography.",
    image: "/shop/mini-glass-bubblers.webp",
    productCount: 4,
  },
  {
    id: "accessories",
    name: "Accessories",
    slug: "accessories",
    tagline: "From £7.99",
    description:
      "Vacuum sealers, travel kits, and ashtrays from real Smoke Cali shop stock.",
    image: "/shop/vacuum-sealer.webp",
    productCount: 4,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
