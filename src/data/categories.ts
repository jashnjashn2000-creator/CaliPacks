import { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "cali-packs",
    name: "Cali Packs",
    slug: "cali-packs",
    tagline: "£0.22 each · Min 25 · Postage from £2.99",
    description:
      "111 HD-photographed Cali Packs. £0.22 each, minimum order 25 pcs. Buy 50 or more of the same design for £0.20 each. Postage £2.99 up to 200 packs, £3.50 over 200 packs. Smell-proof 3.5g designs, dispatched within 2–3 business days by Evri tracked delivery.",
    image: "/products/pack-001.webp",
    productCount: 111,
  },
  {
    id: "stash-cans",
    name: "Stash Cans",
    slug: "stash-cans",
    tagline: "Packs of 10 £7.50 · Tins from £5.99",
    description:
      "Plastic stash cans in ten designs, sold as packs of 10. Each can holds 3.5 g, 75p per can (£7.50 a pack), minimum 10 cans. Postage £2.99, or £3.99 for 5 or more packs. Also candy-tin stash cans from the Manchester shop, sold each from £5.99.",
    image: "/shop/can-cherry-pie-gelato.webp",
    productCount: 11,
  },
  {
    id: "grinders",
    name: "Grinders",
    slug: "grinders",
    tagline: "From £6.99",
    description:
      "Metal, crystal, and 4-piece herb grinders photographed from shop stock. The Gold Honeycomb is £7.99 with free UK delivery. The other grinders are postage £3.99.",
    image: "/shop/gold-honeycomb-grinder.webp",
    productCount: 4,
  },
  {
    id: "lighters",
    name: "Lighters",
    slug: "lighters",
    tagline: "From £1.79",
    description:
      "Clipper lighters sold each, plus full boxes of 50. 4smoke plain disposable lighters in five colours are £12.99. Blu Flame Click lighter boxes are £15.99. Free UK delivery on every box.",
    image: "/shop/lighter-skulls.webp",
    productCount: 14,
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
    tagline: "From £8.99",
    description:
      "Large, medium and small glass bongs from the Manchester shop. Beakers, recyclers and sculpted pieces, each photographed, with postage shown on the product.",
    image: "/shop/bong-l-7502-blue-octopus.webp",
    productCount: 56,
  },
  {
    id: "large-bongs",
    name: "Large Bongs",
    slug: "large-bongs",
    parentSlug: "bongs",
    tagline: "£24.99 · 35 cm · postage £3.99",
    description:
      "Large glass bongs, 35 cm tall, at £24.99 each, postage £3.99. Beakers and sculpted pieces from shop stock, sold individually.",
    image: "/shop/bong-l-7502-blue-octopus.webp",
    productCount: 16,
  },
  {
    id: "medium-bongs",
    name: "Medium Bongs",
    slug: "medium-bongs",
    parentSlug: "bongs",
    tagline: "From £14.99 · postage £3.50",
    description:
      "Medium glass bongs from £14.99, postage £3.50. Beakers, recyclers, soda-can pieces and sculpted glass. The pink one-eye monster, yellow-teeth monster and peach face are £16.99. Sold individually.",
    image: "/shop/bong-m-18-beaker-yellow-gold.webp",
    productCount: 29,
  },
  {
    id: "small-bongs",
    name: "Small Bongs",
    slug: "small-bongs",
    parentSlug: "bongs",
    tagline: "£8.99 · postage £3.99",
    description:
      "Small glass bubblers, a hand pipe and rigs sold with a mouthpiece pipe. £8.99 each, postage £3.99.",
    image: "/shop/bong-s-22-swan-rig-with-pipe.webp",
    productCount: 11,
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
