import { Product } from "@/types";

function shopItem(
  partial: Omit<Product, "inStock" | "isNew" | "images"> & { isFeatured?: boolean; images?: string[] }
): Product {
  const { images, ...rest } = partial;
  return {
    ...rest,
    images: images?.length ? images : [partial.image],
    inStock: true,
    isNew: true,
  };
}

function bong(
  size: "medium" | "large" | "small",
  code: string,
  name: string,
  slug: string,
  file: string,
  description: string,
  shortDescription: string,
  extras?: { price?: number; heightCm?: number }
): Product {
  const sizeCode = size === "medium" ? "m" : size === "large" ? "l" : "s";
  const skuSize = size === "medium" ? "M" : size === "large" ? "L" : "S";
  const category = size === "medium" ? "medium-bongs" : size === "large" ? "large-bongs" : "small-bongs";
  const price = extras?.price ?? (size === "medium" ? 14.99 : size === "large" ? 24.99 : 8.99);
  const heightCm = size === "large" ? 35 : extras?.heightCm;
  const heightLine = heightCm == null ? "" : ` Height ${heightCm} cm.`;
  return shopItem({
    id: `shop-bong-${sizeCode}-${code}`,
    name,
    slug,
    description: `${description}${heightLine}`,
    shortDescription,
    price,
    postage: size === "medium" ? 3.5 : 3.99,
    categoryId: category,
    categorySlug: category,
    image: `/shop/${file}`,
    tags: ["bongs", category, "shop-stock"],
    minOrder: 1,
    sku: `SC-BNG-${skuSize}-${code}`,
  });
}

const BLU_FLAME_BOX =
  "Blu Flame click lighters in a counter display box of 50: five designs, ten of each. Sold as a full box, with free UK delivery.";

function bluFlame(key: string, title: string, detail: string): Product {
  return shopItem({
    id: `shop-lgt-${key}`,
    name: `Blu Flame Click Lighters – ${title} (Box of 50)`,
    slug: `blu-flame-click-lighters-${key}`,
    description: `${detail} ${BLU_FLAME_BOX}`,
    shortDescription: `Blu Flame click lighters, ${title.toLowerCase()} — full box of 50, free UK delivery.`,
    price: 15.99,
    postage: 0,
    categoryId: "lighters",
    categorySlug: "lighters",
    image: `/shop/lighter-${key}.webp`,
    tags: ["lighters", "blu-flame", "box", "shop-stock"],
    minOrder: 1,
    sku: `SC-LGT-${key.toUpperCase()}`,
  });
}

/** Round to pence so bundle "was" prices stay exact. */
function money(amount: number) {
  return Math.round(amount * 100) / 100;
}

/**
 * The Gold Honeycomb grinder is £7.99 with free delivery on its own listing.
 * The other grinders omit postage, so checkout charges the £3.99 default.
 * Scales are free delivery. Bought together, the basket pays the highest once.
 *
 * The Grinder + Digital Scale bundle listing is left as published. Its
 * "bought separately" figures still use £3.99 postage for every grinder,
 * including the Gold Honeycomb.
 */
const GRINDER_CHOICES = [
  { key: "gold", label: "Gold Honeycomb", piece: "Gold Honeycomb Grinder", price: 7.99, postage: 3.99 },
  { key: "teal", label: "Teal 4-Piece", piece: "Teal 4-Piece Grinder", price: 6.99, postage: 3.99 },
  { key: "clover", label: "Crystal Clover", piece: "Crystal Clover Grinder", price: 9.99, postage: 3.99 },
  { key: "charm", label: "Crystal Charm", piece: "Crystal Charm Grinder", price: 9.99, postage: 3.99 },
] as const;

const SCALE_CHOICES = [
  { key: "mz", label: "On Balance MZ-100", piece: "On Balance MZ-100 Digital Scale", price: 8.99, postage: 0 },
  { key: "t3", label: "Triton T3", piece: "My Weigh Triton T3 Digital Scale", price: 16.99, postage: 0 },
] as const;

const GRINDER_SCALE_PRICE = 16.99;
const grinderScaleOptions = GRINDER_CHOICES.flatMap((grinder) =>
  SCALE_CHOICES.map((scale) => ({
    id: `shop-bnd-gr-${grinder.key}-${scale.key}`,
    label: `${grinder.label} + ${scale.label}`,
    name: `Grinder + Digital Scale Bundle — ${grinder.piece} and ${scale.piece}`,
    price: GRINDER_SCALE_PRICE,
    postage: 0,
    sku: `SC-BND-GR-${grinder.key.toUpperCase()}-${scale.key.toUpperCase()}`,
    originalPrice: money(grinder.price + scale.price + Math.max(grinder.postage, scale.postage)),
  }))
);

const VACUUM_SEPARATE = money(19.99 + 5.99 + 6.99 + 7.99 + 3.99);


const STASH_CAN_PACK_POSTAGE = 2.99;
const STASH_CAN_PACK_PRICE = 7.5;

function stashCanPack(
  slug: string,
  name: string,
  sku: string
): Product {
  const front = `/shop/can-${slug}.webp`;
  const pack = `/shop/can-${slug}-pack.webp`;
  return shopItem({
    id: `shop-can-${slug}`,
    name: `${name} Stash Can – Pack of 10`,
    slug: `${slug}-stash-can`,
    description:
      `${name} plastic stash can, sold as a pack of 10. Each can holds 3.5 g. 75p per can, so the pack is £7.50. The minimum you can buy is 10 cans (one pack). Opens by twisting the top: the silver lid and the coloured cap attached to it twist open together. A novelty can for hidden storage. UK postage is £2.99, or £3.99 if you order 5 or more packs.`,
    shortDescription: `${name} stash can — pack of 10, 75p per can (£7.50). Holds 3.5 g. Opens by twisting the top. Minimum 10 cans.`,
    price: STASH_CAN_PACK_PRICE,
    postage: STASH_CAN_PACK_POSTAGE,
    categoryId: "stash-cans",
    categorySlug: "stash-cans",
    image: front,
    images: [front, pack],
    tags: ["stash-cans", "stash-can-pack", "shop-stock", "accessories", "novelty"],
    isFeatured: true,
    minOrder: 1,
    sku,
  });
}

const stashCanPackProducts: Product[] = [
  stashCanPack("cherry-pie-gelato", "Cherry Pie Gelato", "SC-CAN-CHERRY"),
  stashCanPack("alien-space", "Alien Space", "SC-CAN-ALIEN"),
  stashCanPack("gorilla-glue", "Gorilla Glue", "SC-CAN-GORILLA"),
  stashCanPack("zkittles", "Zkittles", "SC-CAN-ZKITTLES"),
  stashCanPack("blue-cheese", "Blue Cheese", "SC-CAN-BLUECHEESE"),
  stashCanPack("gush", "Gush", "SC-CAN-GUSH"),
  stashCanPack("skittlez", "Skittlez", "SC-CAN-SKITTLEZ"),
  stashCanPack("rainbow-belts", "Rainbow Belts", "SC-CAN-RAINBOW"),
  stashCanPack("gelato-45", "Gelato 45", "SC-CAN-GELATO45"),
  stashCanPack("lemonhead", "Lemonhead", "SC-CAN-LEMONHEAD"),
];

/** In-store Smoke Cali stock from shop-floor photos. UK-competitive retail. */
export const shopStockProducts: Product[] = [
  ...stashCanPackProducts,
  shopItem({
    id: "shop-stash-cans",
    name: "Candy Stash Cans",
    slug: "candy-stash-cans",
    description:
      "Novelty candy-tin diversion cans from the Manchester shop. Hidden stash compartment, supermarket-style labels, sold individually. A popular counter item at UK smoke shops.",
    shortDescription: "Novelty candy-tin stash cans — hidden compartment, sold each.",
    price: 5.99,
    originalPrice: 7.99,
    categoryId: "stash-cans",
    categorySlug: "stash-cans",
    image: "/shop/candy-stash-cans.webp",
    tags: ["stash-cans", "shop-stock", "accessories"],
    isFeatured: true,
    minOrder: 1,
    sku: "SC-STASH-01",
  }),
  shopItem({
    id: "shop-vacuum-rolls",
    name: "Black Vacuum Sealer Rolls",
    slug: "vacuum-sealer-rolls",
    description:
      "Black food-grade vacuum sealer rolls for airtight packing. Fits standard domestic sealers. Widths are 15 cm, 20 cm and 28 cm. Choose one width, or all three widths, which includes free UK delivery. Roll length is not listed. Black rolls only.",
    shortDescription: "Black vacuum sealer rolls — 15 cm, 20 cm or 28 cm wide, or all three.",
    price: 5.99,
    postage: 3.99,
    categoryId: "accessories",
    categorySlug: "accessories",
    image: "/shop/vacuum-sealer-rolls.webp",
    tags: ["accessories", "vacuum", "shop-stock", "black"],
    minOrder: 1,
    sku: "SC-VAC-ROLL-S",
    options: [
      {
        id: "shop-vacuum-rolls",
        label: "15 cm wide",
        name: "Black Vacuum Sealer Rolls — 15 cm wide",
        price: 5.99,
        postage: 3.99,
        sku: "SC-VAC-ROLL-S",
      },
      {
        id: "shop-vacuum-rolls-m",
        label: "20 cm wide",
        name: "Black Vacuum Sealer Rolls — 20 cm wide",
        price: 6.99,
        postage: 3.99,
        sku: "SC-VAC-ROLL-M",
      },
      {
        id: "shop-vacuum-rolls-l",
        label: "28 cm wide",
        name: "Black Vacuum Sealer Rolls — 28 cm wide",
        price: 7.99,
        postage: 3.99,
        sku: "SC-VAC-ROLL-L",
      },
      {
        id: "shop-vacuum-rolls-all",
        label: "All 3 widths",
        name: "Black Vacuum Sealer Rolls — 15 cm, 20 cm and 28 cm wide",
        price: 21.99,
        postage: 0,
        sku: "SC-VAC-ROLL-ALL",
      },
    ],
  }),
  shopItem({
    id: "shop-vacuum-sealer",
    name: "Compact Vacuum Sealer Machine",
    slug: "compact-vacuum-sealer",
    description:
      "Compact household vacuum sealer machine, boxed as sold in store. Keeps herbs, snacks and shop stock fresh and smell-contained. A regular UK smoke-shop counter seller.",
    shortDescription: "Compact boxed vacuum sealer machine for airtight packing.",
    price: 19.99,
    postage: 3.99,
    categoryId: "accessories",
    categorySlug: "accessories",
    image: "/shop/vacuum-sealer.webp",
    images: ["/shop/vacuum-sealer.webp", "/shop/sealer-machine.webp"],
    tags: ["accessories", "vacuum", "shop-stock"],
    isFeatured: true,
    minOrder: 1,
    sku: "SC-VAC-SEAL",
  }),
  shopItem({
    id: "shop-bnd-vac-rolls",
    name: "Vacuum Sealer + 3 Black Rolls Bundle",
    slug: "vacuum-sealer-black-rolls-bundle",
    description:
      "Compact Vacuum Sealer Machine with the small, medium and large black vacuum sealer rolls. £36.99 with free UK delivery. Buying them separately is £44.95: £19.99 for the sealer, £5.99, £6.99 and £7.99 for the three black rolls, plus the £3.99 postage charged once. Save £7.96.",
    shortDescription: "Compact sealer plus small, medium and large black rolls. Save £7.96, free UK delivery.",
    price: 36.99,
    originalPrice: VACUUM_SEPARATE,
    postage: 0,
    saveAsAmount: true,
    categoryId: "accessories",
    categorySlug: "accessories",
    image: "/shop/sealer-machine.webp",
    images: ["/shop/sealer-machine.webp", "/shop/vacuum-sealer-rolls.webp"],
    tags: ["accessories", "vacuum", "bundle", "shop-stock"],
    isFeatured: true,
    minOrder: 1,
    sku: "SC-BND-VAC",
  }),
  shopItem({
    id: grinderScaleOptions[0].id,
    name: "Grinder + Digital Scale Bundle",
    slug: "grinder-digital-scale-bundle",
    description:
      "Choose any grinder from the shop (Gold Honeycomb, Teal 4-Piece, Crystal Clover or Crystal Charm) and either digital scale (On Balance MZ-100 or My Weigh Triton T3). £16.99 with free UK delivery. The crossed-out price is those two items bought separately, including the highest postage once — grinders are £3.99 postage and both scales are free delivery, so the separate postage is £3.99. Saving depends on the pair: from £2.98 (Teal 4-Piece + MZ-100, £19.97 separately) up to £13.98 (Crystal Clover or Crystal Charm + Triton T3, £30.97 separately).",
    shortDescription: "Any shop grinder plus either digital scale. Free UK delivery. Save from £2.98.",
    price: GRINDER_SCALE_PRICE,
    postage: 0,
    saveAsAmount: true,
    categoryId: "accessories",
    categorySlug: "accessories",
    image: "/shop/bundle-grinder-scale.webp",
    images: [
      "/shop/bundle-grinder-scale.webp",
      "/shop/gold-honeycomb-grinder.webp",
      "/shop/teal-four-piece-grinder.webp",
      "/shop/crystal-clover-grinders.webp",
      "/shop/crystal-charm-grinders.webp",
      "/shop/onbalance-mz100.webp",
      "/shop/triton-t3-scale.webp",
    ],
    tags: ["accessories", "grinders", "scales", "bundle", "shop-stock"],
    isFeatured: true,
    minOrder: 1,
    sku: grinderScaleOptions[0].sku,
    options: grinderScaleOptions,
  }),
  shopItem({
    id: "shop-travel-kit",
    name: "Cartoon Smoking Travel Kit",
    slug: "cartoon-travel-kit",
    description:
      "Portable cartoon-print smoking travel kit in a zip case, with a torch lighter, grinder, ashtray and a small glass piece. Gift-ready set from shop stock.",
    shortDescription: "Cartoon-print smoking kit — torch, grinder, ashtray and glass, in a zip case.",
    price: 15.99,
    postage: 3.99,
    categoryId: "accessories",
    categorySlug: "accessories",
    image: "/shop/cartoon-travel-kit.webp",
    tags: ["accessories", "kit", "shop-stock"],
    isFeatured: true,
    minOrder: 1,
    sku: "SC-KIT-01",
  }),
  shopItem({
    id: "shop-gold-grinder",
    name: "Gold Honeycomb Grinder",
    slug: "gold-honeycomb-grinder",
    description:
      "Gold honeycomb herb grinder from the Smoke Cali counter. Sharp teeth, metal build, for tobacco and herb. £7.99 with free UK delivery.",
    shortDescription: "Gold honeycomb metal herb grinder. £7.99, free UK delivery.",
    price: 7.99,
    postage: 0,
    originalPrice: 9.99,
    categoryId: "grinders",
    categorySlug: "grinders",
    image: "/shop/gold-honeycomb-grinder.webp",
    tags: ["grinders", "shop-stock"],
    isFeatured: true,
    minOrder: 1,
    sku: "SC-GR-GOLD",
  }),
  shopItem({
    id: "shop-mz100",
    name: "On Balance MZ-100 Digital Scale",
    slug: "onbalance-mz-100-scale",
    description:
      "On Balance MZ-100 pocket digital scale, 100 g × 0.01 g. Compact, backlit, and priced in line with UK head-shop retail.",
    shortDescription: "On Balance MZ-100 digital scale — 100 g × 0.01 g.",
    price: 8.99,
    postage: 0,
    categoryId: "scales",
    categorySlug: "scales",
    image: "/shop/onbalance-mz100.webp",
    tags: ["scales", "shop-stock"],
    isFeatured: true,
    minOrder: 1,
    sku: "SC-SCL-MZ100",
  }),
  shopItem({
    id: "shop-triton-t3",
    name: "My Weigh Triton T3 Digital Scale",
    slug: "myweight-triton-t3-scale",
    description:
      "My Weigh Triton T3 digital scale, 400 g × 0.01 g. Stainless tray, shop-floor stock, competitive with UK online listings.",
    shortDescription: "My Weigh Triton T3 digital scale — 400 g × 0.01 g.",
    price: 16.99,
    postage: 0,
    categoryId: "scales",
    categorySlug: "scales",
    image: "/shop/triton-front.webp",
    images: ["/shop/triton-front.webp", "/shop/triton-back.webp"],
    tags: ["scales", "shop-stock"],
    isFeatured: true,
    minOrder: 1,
    sku: "SC-SCL-T3",
  }),
  shopItem({
    id: "shop-colour-hookah",
    name: "Pink AK-47 Hookah",
    slug: "colour-novelty-hookah",
    description:
      "Pink AK-47 style shisha hookah from the Manchester display. Decorative rifle-style body for shisha use only — not a weapon. Complete with hose.",
    shortDescription: "Pink AK-47 style shisha hookah with hose.",
    price: 54.99,
    postage: 3.99,
    categoryId: "hookahs",
    categorySlug: "hookahs",
    image: "/shop/colour-novelty-hookah.webp",
    tags: ["hookahs", "shisha", "shop-stock"],
    isFeatured: true,
    minOrder: 1,
    sku: "SC-HK-COL",
  }),
  shopItem({
    id: "shop-glass-hookah",
    name: "Glass Stem Hookah",
    slug: "glass-stem-hookah",
    description:
      "Glass-stem hookah with boxed sets and spare hoses as stocked in store. A mid-size shisha for home or shop display.",
    shortDescription: "Glass-stem hookah with hose — mid-size shisha.",
    price: 49.99,
    originalPrice: 64.99,
    categoryId: "hookahs",
    categorySlug: "hookahs",
    image: "/shop/glass-hookah.webp",
    tags: ["hookahs", "shisha", "shop-stock"],
    minOrder: 1,
    sku: "SC-HK-GLS",
  }),
  shopItem({
    id: "shop-chrome-hookah",
    name: "Chrome Novelty Hookah",
    slug: "chrome-novelty-hookah",
    description:
      "Chrome novelty shisha hookah with glass-stem pieces on the same shelf. Decorative novelty body for shisha use only.",
    shortDescription: "Chrome novelty shisha hookah from shop stock.",
    price: 94.99,
    originalPrice: 119.99,
    categoryId: "hookahs",
    categorySlug: "hookahs",
    image: "/shop/chrome-novelty-hookah.webp",
    tags: ["hookahs", "shisha", "shop-stock"],
    minOrder: 1,
    sku: "SC-HK-CHR",
  }),
  shopItem({
    id: "shop-mini-bubblers",
    name: "Mini Glass Bubblers",
    slug: "mini-glass-bubblers",
    description:
      "Mini glass bubblers with zip carry cases. Compact percolator pieces photographed from the shop glass wall.",
    shortDescription: "Mini glass bubblers with zip cases — sold each.",
    price: 8.99,
    postage: 3.99,
    categoryId: "small-bongs",
    categorySlug: "small-bongs",
    image: "/shop/mini-glass-bubblers.webp",
    tags: ["bongs", "small-bongs", "bubbler", "shop-stock"],
    isFeatured: true,
    minOrder: 1,
    sku: "SC-GL-MINI",
  }),
  shopItem({
    id: "shop-spiral-bubblers",
    name: "Spiral Perc Glass Bubbler",
    slug: "spiral-perc-bubblers",
    description:
      "Spiral percolator glass bubbler. Clear borosilicate with a coloured spiral perc, compact rig-in-one style, sold individually.",
    shortDescription: "Spiral perc glass bubbler — clear borosilicate, sold each.",
    price: 8.99,
    postage: 3.99,
    categoryId: "small-bongs",
    categorySlug: "small-bongs",
    image: "/shop/spiral-glass-bubblers.webp",
    tags: ["bongs", "small-bongs", "bubbler", "shop-stock"],
    minOrder: 1,
    sku: "SC-GL-SPIRAL",
  }),
  shopItem({
    id: "shop-swan-pipe",
    name: "Swan Shape Glass Pipe",
    slug: "swan-glass-pipe",
    description:
      "Hand-blown swan shape glass pipe from shop stock. Sculptural borosilicate piece with an amber head and coloured wing, sold individually.",
    shortDescription: "Hand-blown swan shape glass pipe — sold each.",
    price: 8.99,
    postage: 3.99,
    categoryId: "small-bongs",
    categorySlug: "small-bongs",
    image: "/shop/swan-glass-pipe.webp",
    tags: ["bongs", "small-bongs", "pipe", "shop-stock"],
    minOrder: 1,
    sku: "SC-GL-SWAN",
  }),
  shopItem({
    id: "shop-clipper-lighters",
    name: "Clipper Lighters",
    slug: "clipper-lighters",
    description:
      "Genuine Clipper lighters from the shop counter. Refillable, flint replaceable, sold each at a competitive UK price.",
    shortDescription: "Refillable Clipper lighters — sold each.",
    price: 1.79,
    originalPrice: 2.29,
    categoryId: "lighters",
    categorySlug: "lighters",
    image: "/shop/clipper-lighters.webp",
    tags: ["lighters", "clipper", "shop-stock"],
    isFeatured: true,
    minOrder: 1,
    sku: "SC-LGT-CLIP",
  }),
  shopItem({
    id: "shop-character-ashtray",
    name: "Character Statue Ashtray",
    slug: "character-statue-ashtray",
    description:
      "Character statue ashtray from the Manchester display. Heavy resin figure with built-in ash well — a gift-counter favourite.",
    shortDescription: "Character statue ashtray — resin figure with ash well.",
    price: 14.99,
    originalPrice: 19.99,
    categoryId: "accessories",
    categorySlug: "accessories",
    image: "/shop/character-ashtray.webp",
    tags: ["accessories", "ashtray", "shop-stock"],
    minOrder: 1,
    sku: "SC-ASH-01",
  }),
  shopItem({
    id: "shop-teal-grinder",
    name: "Teal 4-Piece Grinder",
    slug: "teal-four-piece-grinder",
    description:
      "Teal four-piece herb grinder shown open with catch chamber and pollen screen. Sharp teeth, shop-floor stock.",
    shortDescription: "Teal 4-piece herb grinder with pollen screen.",
    price: 6.99,
    originalPrice: 8.99,
    categoryId: "grinders",
    categorySlug: "grinders",
    image: "/shop/teal-four-piece-grinder.webp",
    tags: ["grinders", "shop-stock"],
    minOrder: 1,
    sku: "SC-GR-TEAL",
  }),
  shopItem({
    id: "shop-clover-grinders",
    name: "Crystal Clover Grinders",
    slug: "crystal-clover-grinders",
    description:
      "Crystal clover-style herb grinders, boxed set of six as displayed in store. Sold each from the box at a UK high-street price.",
    shortDescription: "Crystal clover herb grinders — sold each.",
    price: 9.99,
    originalPrice: 12.99,
    categoryId: "grinders",
    categorySlug: "grinders",
    image: "/shop/crystal-clover-grinders.webp",
    tags: ["grinders", "shop-stock"],
    minOrder: 1,
    sku: "SC-GR-CLOVER",
  }),
  shopItem({
    id: "shop-charm-grinders",
    name: "Crystal Charm Grinders",
    slug: "crystal-charm-grinders",
    description:
      "Crystal charm herb grinders, boxed dozen as stocked in store. Compact, colourful, sold each.",
    shortDescription: "Crystal charm herb grinders — sold each.",
    price: 9.99,
    originalPrice: 12.99,
    categoryId: "grinders",
    categorySlug: "grinders",
    image: "/shop/crystal-charm-grinders.webp",
    tags: ["grinders", "shop-stock"],
    minOrder: 1,
    sku: "SC-GR-CHARM",
  }),
  bong(
    "medium",
    "7461",
    "Medium Runtz Green Apple Glass Beaker Bong with Ice Catcher",
    "medium-runtz-green-apple-glass-beaker-bong",
    "bong-m-7461-runtz-green-apple.webp",
    "Medium clear glass beaker bong with a yellow and green Runtz Green Apple neck label, a matching base decal and a printed downstem. Ice catcher under the neck, with a glass bowl. Sold each.",
    "Medium Runtz Green Apple beaker with ice catcher, printed downstem and base decal."
  ),
  bong(
    "medium",
    "7462",
    "Medium Nerds Big Chewy Glass Beaker Bong with Ice Catcher",
    "medium-nerds-big-chewy-glass-beaker-bong",
    "bong-m-7462-nerds-big-chewy.webp",
    "Medium clear glass beaker bong with Nerds Big Chewy artwork on the neck, a matching base decal and a printed downstem. Ice catcher under the neck, with a glass bowl. Sold each.",
    "Medium Nerds Big Chewy beaker with ice catcher and matching base decal."
  ),
  bong(
    "medium",
    "7463",
    "Medium Nerds Gummy Clusters Rainbow Glass Beaker Bong with Ice Catcher",
    "medium-nerds-gummy-clusters-rainbow-glass-beaker-bong",
    "bong-m-7463-nerds-gummy-clusters-rainbow.webp",
    "Medium clear glass beaker bong with a red and blue Nerds Gummy Clusters Rainbow neck label, a matching base decal and a printed downstem. Ice catcher under the neck, with a glass bowl. Sold each.",
    "Medium Nerds Gummy Clusters Rainbow beaker with ice catcher and printed downstem."
  ),
  bong(
    "medium",
    "7464",
    "Medium Skittles Glass Beaker Bong with Ice Catcher",
    "medium-skittles-glass-beaker-bong",
    "bong-m-7464-skittles.webp",
    "Medium clear glass beaker bong with a green Skittles neck label, rainbow sweet artwork, a matching base decal and a printed downstem. Ice catcher under the neck, with a glass bowl. Sold each.",
    "Medium Skittles beaker with ice catcher, rainbow artwork and base decal."
  ),
  bong(
    "medium",
    "7467",
    "Medium Nerds Gummy Clusters Blue Glass Beaker Bong with Ice Catcher",
    "medium-nerds-gummy-clusters-blue-glass-beaker-bong",
    "bong-m-7467-nerds-gummy-clusters-blue.webp",
    "Medium clear glass beaker bong with a blue Nerds Gummy Clusters neck label, cluster artwork, a matching base decal and a printed downstem. Ice catcher under the neck, with a glass bowl. Sold each.",
    "Medium blue Nerds Gummy Clusters beaker with ice catcher and base decal."
  ),
  bong(
    "medium",
    "7468",
    "Medium Bob Marley Glass Beaker Bong with Ice Catcher",
    "medium-bob-marley-glass-beaker-bong",
    "bong-m-7468-bob-marley.webp",
    "Medium clear glass beaker bong with a gold-trimmed navy neck showing a yellow Bob Marley portrait, and a green and red base decal. Ice catcher under the neck, clear downstem and glass bowl. Sold each.",
    "Medium Bob Marley beaker with gold-trimmed portrait neck and ice catcher."
  ),
  bong(
    "medium",
    "7469",
    "Medium Orange Rick and Morty Honeycomb Glass Beaker Bong",
    "medium-orange-rick-and-morty-honeycomb-glass-beaker-bong",
    "bong-m-7469-orange-rick-honeycomb.webp",
    "Medium glass beaker bong with an orange honeycomb print and Rick and Morty cartoon artwork across the neck and base. Ice catcher under the neck, with a glass bowl. Sold each.",
    "Medium orange Rick and Morty honeycomb beaker with ice catcher."
  ),
  bong(
    "medium",
    "7471",
    "Medium Blue Rick and Morty Honeycomb Glass Beaker Bong",
    "medium-blue-rick-and-morty-honeycomb-glass-beaker-bong",
    "bong-m-7471-blue-rick-honeycomb.webp",
    "Medium glass beaker bong with a blue honeycomb print, Rick and Morty cartoon artwork and a pickle character on the neck. Ice catcher under the neck, with a glass bowl. Sold each.",
    "Medium blue Rick and Morty honeycomb beaker with ice catcher."
  ),
  bong(
    "large",
    "7474",
    "Large Skittles Glass Beaker Bong with Ice Catcher",
    "large-skittles-glass-beaker-bong",
    "bong-l-7474-skittles.webp",
    "Large clear glass beaker bong with a green Skittles neck label, rainbow sweet artwork, a matching base decal and a printed downstem. Ice catcher under the neck, with a glass bowl. Sold each.",
    "Large Skittles beaker with ice catcher, printed downstem and base decal."
  ),
  bong(
    "large",
    "7475",
    "Large Green Rick and Morty Honeycomb Glass Beaker Bong",
    "large-green-rick-and-morty-honeycomb-glass-beaker-bong",
    "bong-l-7475-green-rick-honeycomb.webp",
    "Large glass beaker bong with a green honeycomb print and Rick and Morty cartoon artwork, including a rainbow-glasses character and a bee. Ice catcher under the neck, with a glass bowl. Sold each.",
    "Large green Rick and Morty honeycomb beaker with ice catcher."
  ),
  bong(
    "large",
    "7476",
    "Large Bob Marley Glass Beaker Bong with Ice Catcher",
    "large-bob-marley-glass-beaker-bong",
    "bong-l-7476-bob-marley.webp",
    "Large clear glass beaker bong with a gold-trimmed Bob Marley portrait on the neck, bold lettering, and a red, gold and green base decal. Ice catcher under the neck, clear downstem and glass bowl. Sold each.",
    "Large Bob Marley beaker with portrait neck, base decal and ice catcher."
  ),
  bong(
    "large",
    "7477",
    "Large Red Rick and Morty Skull Honeycomb Glass Beaker Bong",
    "large-red-rick-and-morty-skull-honeycomb-glass-beaker-bong",
    "bong-l-7477-red-rick-skull.webp",
    "Large glass beaker bong with a red honeycomb print and Rick and Morty cartoon artwork, including a skull-style face and a bee. Ice catcher under the neck, with a glass bowl. Sold each.",
    "Large red Rick and Morty skull honeycomb beaker with ice catcher."
  ),
  bong(
    "large",
    "7479",
    "Large Pink Runtz Glass Beaker Bong with Ice Catcher",
    "large-pink-runtz-glass-beaker-bong",
    "bong-l-7479-pink-runtz.webp",
    "Large clear glass beaker bong with a pink Runtz neck label, cloud artwork, a matching base decal and a pink printed downstem. Ice catcher under the neck, with a glass bowl. Sold each.",
    "Large Pink Runtz beaker with ice catcher, pink downstem and base decal."
  ),
  bong(
    "large",
    "7481",
    "Large Pink Sculpted Face Glass Bong",
    "large-pink-sculpted-face-glass-bong",
    "bong-l-7481-pink-sculpted-face.webp",
    "Large pink sculpted glass bong shaped as a face, with three eyes and a wide toothy grin. The bowl sits through the cheek. Sold each.",
    "Large pink sculpted face bong with three eyes and a toothy grin."
  ),
  bong(
    "large",
    "7483",
    "Large Blue Mushroom Monster Glass Bong",
    "large-blue-mushroom-monster-glass-bong",
    "bong-l-7483-blue-mushroom-monster.webp",
    "Large blue sculpted monster bong with a green spotted mushroom cap, one large eye, and an open mouth with teeth and a red tongue around a clear chamber. Glass bowl included. Sold each.",
    "Large blue mushroom monster bong with one eye and an open mouth."
  ),
  bong(
    "large",
    "7485",
    "Large Purple Galaxy Sculpted Glass Bong",
    "large-purple-galaxy-sculpted-glass-bong",
    "bong-l-7485-purple-galaxy.webp",
    "Large sculpted bong with a riveted purple and blue galaxy neck, a blue glass eye, gold-tone gears and twisted side ropes over a clear chamber. Glass bowl included. Sold each.",
    "Large purple galaxy sculpted bong with a glass eye, gears and side ropes."
  ),
  bong(
    "large",
    "7486",
    "Large Clown Wizard Glass Bong",
    "large-clown-wizard-glass-bong",
    "bong-l-7486-clown-wizard.webp",
    "Large clear glass bong with a sculpted clown in a purple wizard hat, yellow curls, a red nose and a blue textured robe. Pink stars and dots run down the tube, with a purple lip and base. Glass bowl included. Sold each.",
    "Large clown wizard bong with a purple hat, yellow curls and pink stars."
  ),
  bong(
    "large",
    "7487",
    "Large Lime Green Black Cat Glass Bong",
    "large-lime-green-black-cat-glass-bong",
    "bong-l-7487-lime-black-cat.webp",
    "Large glass bong with a ribbed lime green neck, a clinging black cat with a yellow eye, green dots on the clear chamber and a black base ring. Glass bowl included. Sold each.",
    "Large lime green bong with a clinging black cat and green dots."
  ),
  bong(
    "large",
    "7490",
    "Large Mushroom Drip Glass Bong",
    "large-mushroom-drip-glass-bong",
    "bong-l-7490-mushroom-drip.webp",
    "Large glass bong with colourful mushroom caps and white stems dripping down a clear tube onto a dark textured base. Pink mouthpiece and glass bowl. Sold each.",
    "Large mushroom drip bong with colourful caps and a dark base."
  ),
  bong(
    "large",
    "7491",
    "Large Cosmic Planets Glass Bong",
    "large-cosmic-planets-glass-bong",
    "bong-l-7491-cosmic-planets.webp",
    "Large glass bong with a blue, pink and orange gradient, raised planets, stars and shooting-star lines, and a pink bowl joint. Sold each.",
    "Large cosmic planets bong with a sunset gradient and raised planets."
  ),
  bong(
    "large",
    "7493",
    "Large Brown Tree Eye Glass Bong",
    "large-brown-tree-eye-glass-bong",
    "bong-l-7493-brown-tree-eye.webp",
    "Large sculpted bong with bark-textured brown glass, a spiderweb window, a purple eye, yellow mushrooms, green vines and small red-capped mushrooms at the base. Clear chamber and glass bowl. Sold each.",
    "Large brown tree bong with a purple eye, spiderweb and mushrooms."
  ),
  bong(
    "large",
    "7495",
    "Large Ocean Starfish Glass Bong",
    "large-ocean-starfish-glass-bong",
    "bong-l-7495-ocean-starfish.webp",
    "Large glass bong with a blue-to-yellow gradient, raised starfish, seaweed and bubble dots, and a blue base with dripping green lines. Glass bowl included. Sold each.",
    "Large ocean starfish bong with seaweed, bubbles and a blue base."
  ),
  bong(
    "large",
    "7496",
    "Large Green Slime Eyeball Glass Bong",
    "large-green-slime-eyeball-glass-bong",
    "bong-l-7496-green-slime-eyeball.webp",
    "Large green ribbed glass bong with white slime drips at the mouth and base, one large eyeball and a smaller eye. Glass bowl included. Sold each.",
    "Large green slime eyeball bong with white drips at the mouth and base."
  ),
  bong(
    "large",
    "7502",
    "Large Blue Octopus Glass Bong",
    "large-blue-octopus-glass-bong",
    "bong-l-7502-blue-octopus.webp",
    "Large sculpted bong with a blue octopus, purple and yellow eyes and yellow suckers. The tentacles wrap a clear straight tube and round base, and one holds the glass bowl. Sold each.",
    "Large blue octopus bong with purple eyes and tentacles around a clear tube."
  ),
  shopItem({
    id: "shop-lgt-4smoke",
    name: "4smoke Disposable Lighters – Clear, 5 Colours (Box of 50)",
    slug: "4smoke-disposable-lighters-clear-5-colours",
    description:
      "Plain 4smoke disposable lighters in five translucent colours: green, clear, red, blue and amber. Full counter display box of 50. Free UK delivery.",
    shortDescription: "4smoke plain disposable lighters in five colours — full box of 50, free UK delivery.",
    price: 12.99,
    postage: 0,
    categoryId: "lighters",
    categorySlug: "lighters",
    image: "/shop/lighter-4smoke.webp",
    tags: ["lighters", "disposable", "box", "shop-stock"],
    minOrder: 1,
    sku: "SC-LGT-4SMOKE",
  }),
  bluFlame(
    "skulls",
    "Skull Designs",
    "Skull artwork across the box, including a yellow skull, a crowned skull, a red mask, a snake and a green skull."
  ),
  bluFlame(
    "portraits",
    "Portrait Designs",
    "Illustrated portrait designs in bold colour, five prints to the box."
  ),
  bluFlame(
    "aces",
    "Ace Designs",
    "Playing-card aces in hearts, clubs, diamonds and spades, printed over flame and colour backgrounds."
  ),
  bluFlame(
    "rasta",
    "Rasta Designs",
    "Red, gold and green skull designs with striped hats and dreadlocks."
  ),
  bluFlame(
    "cardsuits",
    "Card Suit Designs",
    "Hearts, diamonds, clubs and spades in repeating black, white and red patterns."
  ),
  bluFlame(
    "unionjack",
    "Union Jack Designs",
    "Union Jack flag prints across the box."
  ),
  bluFlame(
    "glamour",
    "Glamour Designs",
    "Glamour portrait prints, five designs to the box."
  ),
  bluFlame(
    "leaf",
    "Leaf Designs",
    "Leaf artwork in green, yellow, pink and red, with pop-art lettering."
  ),
  bluFlame(
    "bigben",
    "Big Ben Designs",
    "Elizabeth Tower and Palace of Westminster prints, five London designs to the box."
  ),
  bluFlame(
    "casino",
    "Casino Designs",
    "Casino prints with sevens, cards, chips and a roulette wheel."
  ),
  bluFlame(
    "london",
    "London Designs",
    "London scene prints, including the clock tower, a red telephone box, a red bridge, a red umbrella and a flower."
  ),
  bluFlame(
    "love",
    "Love Designs",
    "Heart and love prints, including gem hearts, a kiss, and a heart of stones."
  ),
  bong(
    "medium",
    "01",
    "Medium Green Frog Glass Bong",
    "medium-green-frog-glass-bong",
    "bong-m-01-frog-green-sculpted.webp",
    "Medium sculpted glass bong shaped as a seated green frog on a black scrolled base. Curved green neck, black bowl arm and a clear glass bowl. Sold each.",
    "Medium green frog bong with a curved neck and black base."
  ),
  bong(
    "medium",
    "02",
    "Medium Teal and Lime Recycler Glass Bong",
    "medium-teal-lime-recycler-glass-bong",
    "bong-m-02-recycler-teal-lime.webp",
    "Medium teal recycler with a lime bent neck, a side chamber and a clear glass bowl. Round foot and a fixed handle. Sold each.",
    "Medium teal and lime recycler with a side chamber."
  ),
  bong(
    "medium",
    "03",
    "Medium Amber and Purple Recycler Glass Bong",
    "medium-amber-purple-recycler-glass-bong",
    "bong-m-03-recycler-yellow-purple.webp",
    "Medium amber recycler with a purple bent neck, a side chamber and a clear glass bowl. Round foot and a fixed handle. Sold each.",
    "Medium amber and purple recycler with a side chamber."
  ),
  bong(
    "medium",
    "04",
    "Medium Pink and Teal Recycler Glass Bong",
    "medium-pink-teal-recycler-glass-bong",
    "bong-m-04-recycler-pink-teal.webp",
    "Medium pink recycler with a teal bent neck, a side chamber and a clear glass bowl. Round foot and a fixed handle. Sold each.",
    "Medium pink and teal recycler with a side chamber."
  ),
  bong(
    "medium",
    "05",
    "Medium Green and Lime Recycler Glass Bong",
    "medium-green-lime-recycler-glass-bong",
    "bong-m-05-recycler-green-lime.webp",
    "Medium green recycler with a lime bent neck, a side chamber and a clear glass bowl. Round foot and a fixed handle. Sold each.",
    "Medium green and lime recycler with a side chamber."
  ),
  bong(
    "medium",
    "06",
    "Medium Yellow Coca-Cola Can Glass Bong",
    "medium-yellow-coca-cola-can-glass-bong",
    "bong-m-06-can-coca-cola-yellow.webp",
    "Medium soda-can glass bong with a yellow Coca-Cola orange-soda label, a bent clear mouthpiece and a glass bowl on the lid. Sold each.",
    "Medium yellow Coca-Cola can bong with a bent mouthpiece."
  ),
  bong(
    "medium",
    "07",
    "Medium Orange Fanta Can Glass Bong",
    "medium-orange-fanta-can-glass-bong",
    "bong-m-07-can-fanta-orange.webp",
    "Medium soda-can glass bong with an orange Fanta label, a bent clear mouthpiece and a glass bowl on the lid. Sold each.",
    "Medium orange Fanta can bong with a bent mouthpiece."
  ),
  bong(
    "medium",
    "08",
    "Medium Purple Fanta Cherry Can Glass Bong",
    "medium-purple-fanta-cherry-can-glass-bong",
    "bong-m-08-can-fanta-cherry.webp",
    "Medium soda-can glass bong with a purple Fanta Cherry label, a bent clear mouthpiece and a glass bowl on the lid. Sold each.",
    "Medium purple Fanta Cherry can bong with a bent mouthpiece."
  ),
  bong(
    "medium",
    "09",
    "Medium Green Sprite Can Glass Bong",
    "medium-green-sprite-can-glass-bong",
    "bong-m-09-can-sprite.webp",
    "Medium soda-can glass bong with a green Sprite lemon-lime label, a bent clear mouthpiece and a glass bowl on the lid. Sold each.",
    "Medium green Sprite can bong with a bent mouthpiece."
  ),
  bong(
    "medium",
    "10",
    "Medium Blue Pepsi Can Glass Bong",
    "medium-blue-pepsi-can-glass-bong",
    "bong-m-10-can-pepsi.webp",
    "Medium soda-can glass bong with a blue Pepsi label, a bent clear mouthpiece and a glass bowl on the lid. Sold each.",
    "Medium blue Pepsi can bong with a bent mouthpiece."
  ),
  bong(
    "medium",
    "11",
    "Medium Red Coca-Cola Can Glass Bong",
    "medium-red-coca-cola-can-glass-bong",
    "bong-m-11-can-coca-cola-red.webp",
    "Medium soda-can glass bong with a red Coca-Cola label, a bent clear mouthpiece and a glass bowl on the lid. Sold each.",
    "Medium red Coca-Cola can bong with a bent mouthpiece."
  ),
  bong(
    "medium",
    "12",
    "Medium Pink One-Eye Monster Glass Bong",
    "medium-pink-one-eye-monster-glass-bong",
    "bong-m-12-monster-pink-one-eye.webp",
    "Medium sculpted pink monster bong with one blue eye, white spots, an open red mouth with teeth, and a clear chamber in the mouth. Glass bowl on the side. Sold each.",
    "Medium pink one-eye monster bong with an open mouth.",
    { price: 16.99 }
  ),
  bong(
    "medium",
    "13",
    "Medium Yellow Teeth Monster Glass Bong",
    "medium-yellow-teeth-monster-glass-bong",
    "bong-m-13-monster-yellow-teeth.webp",
    "Medium sculpted yellow monster bong with tentacles, pink-rimmed eyes, and a wide pink mouth of white teeth around a clear chamber. Glass bowl included. Sold each.",
    "Medium yellow monster bong with tentacles and a toothy mouth.",
    { price: 16.99 }
  ),
  bong(
    "medium",
    "14",
    "Medium Peach Grin Face Glass Bong",
    "medium-peach-grin-face-glass-bong",
    "bong-m-14-face-peach-grin.webp",
    "Medium peach sculpted face bong with one eye, a small ear and a wide grin of white teeth. The bowl sits through the cheek. Sold each.",
    "Medium peach face bong with one eye and a wide grin.",
    { price: 16.99 }
  ),
  bong(
    "medium",
    "15",
    "Medium Blue Octopus Beaker Glass Bong",
    "medium-blue-octopus-beaker-glass-bong",
    "bong-m-15-octopus-blue-clear-tube.webp",
    "Medium clear beaker with a blue octopus wrapped around the tube. Yellow suckers, green eyes, a blue lip and a glass bowl. Sold each.",
    "Medium blue octopus beaker with yellow suckers."
  ),
  bong(
    "medium",
    "16",
    "Medium Rasta Skull Glass Bong",
    "medium-rasta-skull-glass-bong",
    "bong-m-16-skull-rasta-green.webp",
    "Medium skull bong in green, yellow and red glass, with painted leaves on the neck and a black metal bowl. Sold each.",
    "Medium green, yellow and red skull bong. Height 24 cm.",
    { heightCm: 24 }
  ),
  bong(
    "medium",
    "17",
    "Medium Purple and Blue Skull Glass Bong",
    "medium-purple-blue-skull-glass-bong",
    "bong-m-17-skull-purple-blue.webp",
    "Medium skull bong in purple and blue glass, with green leaves on the neck and a black metal bowl. Sold each.",
    "Medium purple and blue skull bong. Height 24 cm.",
    { heightCm: 24 }
  ),
  bong(
    "medium",
    "18",
    "Medium Yellow Gold-Ring Beaker Bong",
    "medium-yellow-gold-ring-beaker-bong",
    "bong-m-18-beaker-yellow-gold.webp",
    "Medium beaker with a yellow neck, gold rings and textured silver bands on the neck and base. Clear downstem and glass bowl. Sold each.",
    "Medium yellow beaker with gold rings. Height 20.5 cm.",
    { heightCm: 20.5 }
  ),
  bong(
    "medium",
    "19",
    "Medium Green Gold-Ring Beaker Bong",
    "medium-green-gold-ring-beaker-bong",
    "bong-m-19-beaker-green-gold.webp",
    "Medium beaker with a green neck and downstem, gold rings and textured silver bands on the neck and base. Clear glass bowl. Sold each.",
    "Medium green beaker with gold rings and a green downstem."
  ),
  bong(
    "medium",
    "20",
    "Medium Blue Gold-Ring Beaker Bong",
    "medium-blue-gold-ring-beaker-bong",
    "bong-m-20-beaker-blue-gold.webp",
    "Medium beaker with a blue neck, gold rings and textured silver bands on the neck and base. Clear downstem and glass bowl. Sold each.",
    "Medium blue beaker with gold rings."
  ),
  bong(
    "medium",
    "21",
    "Medium Navy Gold-Ring Beaker Bong",
    "medium-navy-gold-ring-beaker-bong",
    "bong-m-21-beaker-navy-gold.webp",
    "Medium beaker with a navy neck and downstem, gold rings and textured silver bands on the neck and base. Clear glass bowl. Sold each.",
    "Medium navy beaker with gold rings and a navy downstem."
  ),
  bong(
    "small",
    "22",
    "Small Swan Rig with Pipe",
    "small-swan-rig-with-pipe",
    "bong-s-22-swan-rig-with-pipe.webp",
    "Small clear swan rig with an amber head, a green and amber wing, and a separate clear mouthpiece pipe with a green tip. Sold each.",
    "Small swan rig with a green-tip mouthpiece pipe."
  ),
  bong(
    "small",
    "23",
    "Small Blue Coil Rig with Pipe",
    "small-blue-coil-rig-with-pipe",
    "bong-s-23-rig-blue-coil-with-pipe.webp",
    "Small clear rig with a blue glass coil and a green tree perc, a bent neck and a separate mouthpiece pipe with a blue tip. Sold each.",
    "Small blue coil rig with a blue-tip mouthpiece pipe."
  ),
  bong(
    "small",
    "24",
    "Small Pink Flower Rig with Pipe",
    "small-pink-flower-rig-with-pipe",
    "bong-s-24-rig-pink-flower-with-pipe.webp",
    "Small clear rig with a pink flower and a green leaf inside the chamber, a bent neck and a separate mouthpiece pipe with a pink tip. Sold each.",
    "Small pink flower rig with a pink-tip mouthpiece pipe."
  ),
  bong(
    "small",
    "25",
    "Small Green Spiral Rig with Pipe",
    "small-green-spiral-rig-with-pipe",
    "bong-s-25-rig-green-spiral-with-pipe.webp",
    "Small clear rig with a dark green spiral inside the chamber, a bent neck and a separate mouthpiece pipe with a green tip. Sold each.",
    "Small green spiral rig with a green-tip mouthpiece pipe."
  ),
  bong(
    "small",
    "26",
    "Small Orange and Yellow Rig with Pipe",
    "small-orange-yellow-rig-with-pipe",
    "bong-s-26-rig-orange-yellow-with-pipe.webp",
    "Small rig with a yellow-to-orange chamber, a horned figure inside, a bent neck and a separate mouthpiece pipe with an orange tip. Sold each.",
    "Small orange and yellow rig with an orange-tip mouthpiece pipe."
  ),
  bong(
    "small",
    "27",
    "Small Amber Coil Rig with Pipe",
    "small-amber-coil-rig-with-pipe",
    "bong-s-27-rig-amber-coil-with-pipe.webp",
    "Small clear rig with an amber glass coil and a green tree perc, a bent neck and a separate mouthpiece pipe with an amber tip. Sold each.",
    "Small amber coil rig with an amber-tip mouthpiece pipe."
  ),
  bong(
    "small",
    "28",
    "Small Drops and Moon Rig with Pipe",
    "small-drops-moon-rig-with-pipe",
    "bong-s-28-rig-drops-moon-with-pipe.webp",
    "Small clear rig with a green drop, an amber moon and a blue swirl inside the chamber, a bent neck and a separate mouthpiece pipe with a pink tip. Sold each.",
    "Small drops and moon rig with a pink-tip mouthpiece pipe."
  ),
  bong(
    "small",
    "29",
    "Small Blue Crescent Rig with Pipe",
    "small-blue-crescent-rig-with-pipe",
    "bong-s-29-rig-blue-crescent-with-pipe.webp",
    "Small clear rig with blue and white crescents inside the chamber, a bent neck and a separate mouthpiece pipe with a blue tip. Sold each.",
    "Small blue crescent rig with a blue-tip mouthpiece pipe."
  ),
];
