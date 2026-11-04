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
    id: "bongs",
    name: "Bongs",
    slug: "bongs",
    tagline: "From £7.99",
    description:
      "Large, medium and small glass bongs from the Manchester shop. Beakers and sculpted pieces, each photographed, with postage shown on the product.",
    image: "/shop/bong-l-7502-blue-octopus.webp",
    productCount: 27,
  },
  {
    id: "large-bongs",
    name: "Large Bongs",
    slug: "large-bongs",
    parentSlug: "bongs",
    tagline: "£24.99 · postage £3.99",
    description:
      "Large glass bongs at £24.99 each, postage £3.99. Beakers and sculpted pieces from shop stock, sold individually.",
    image: "/shop/bong-l-7502-blue-octopus.webp",
    productCount: 16,
  },
  {
    id: "medium-bongs",
    name: "Medium Bongs",
    slug: "medium-bongs",
    parentSlug: "bongs",
    tagline: "£14.99 · postage £3.50",
    description:
      "Medium glass beaker bongs at £14.99 each, postage £3.50. Printed candy, cartoon and portrait designs, sold individually.",
    image: "/shop/bong-m-7461-runtz-green-apple.webp",
    productCount: 8,
  },
  {
    id: "small-bongs",
    name: "Small Bongs",
    slug: "small-bongs",
    parentSlug: "bongs",
    tagline: "From £7.99",
    description:
      "Small glass bubblers and a hand pipe from the Manchester shop. Compact pieces, sold each, with postage shown on the product.",
    image: "/shop/mini-glass-bubblers.webp",
    productCount: 3,
  },
  {
    id: "accessories",
    name: "Accessories",
    slug: "accessories",
    tagline: "From £7.99",
    description:
      "Vacuum sealers, sealer and grinder bundles, travel kits, and ashtrays from real Smoke Cali shop stock.",
    image: "/shop/vacuum-sealer.webp",
    productCount: 6,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

/** Categories shown as top-level shop filters. Subcategories stay under their parent. */
export function topLevelCategories(): Category[] {
  return categories.filter((category) => !category.parentSlug);
}

export function childCategories(parentSlug: string): Category[] {
  return categories.filter((category) => category.parentSlug === parentSlug);
}

/**
 * Slugs whose products belong on this category page.
 * A parent with children lists those children and does not have products of its own.
 */
export function listingSlugs(slug: string): string[] {
  const children = childCategories(slug).map((category) => category.slug);
  return children.length ? children : [slug];
}
