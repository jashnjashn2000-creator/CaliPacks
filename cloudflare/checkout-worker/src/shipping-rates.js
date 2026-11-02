/**
 * SMOKE CALI — DELIVERY RATES & PRODUCT WEIGHTS (single source of truth)
 * ---------------------------------------------------------------------
 * Used by BOTH the website (cart/checkout display, via src/lib/shipping.ts)
 * and the Cloudflare checkout worker (which charges the customer through Viva.com).
 * The worker recalculates everything itself from product IDs, so the browser
 * can never choose its own delivery price.
 *
 * Delivery is charged ONCE PER ORDER, based on the total weight of the basket.
 * After editing this file: rebuild the website AND redeploy the worker
 * (cd cloudflare/checkout-worker && npx wrangler deploy).
 *
 * Royal Mail Tracked 48 online prices used as the cost basis (royalmail.com,
 * from 5 Oct 2026): Small parcel ≤2kg £3.75 · Medium ≤10kg £7.55 · Medium ≤20kg £12.25.
 */

/** Delivery bands. maxGrams = upper limit (inclusive). Prices in GBP. */
export const DELIVERY_BANDS = [
  { id: "small", name: "Small parcel", maxGrams: 2000, weightLabel: "Up to 2kg", price: 4.0 },
  { id: "medium", name: "Medium parcel", maxGrams: 10000, weightLabel: "2kg – 10kg", price: 8.99 },
  { id: "heavy", name: "Heavy parcel", maxGrams: Infinity, weightLabel: "Over 10kg", price: 14.99 },
];

export const DELIVERY_SERVICE = "Royal Mail Tracked 48";

/** Packaging allowance added once per order (box, mailer, padding), in grams. */
export const PACKAGING_GRAMS = 150;

/**
 * Estimated weight PER UNIT in grams, by category. ESTIMATES — weigh real
 * stock and adjust. Used when a product has no specific override below.
 */
export const CATEGORY_WEIGHTS_GRAMS = {
  "cali-packs": 5, // empty 3.5g mylar Cali Pack (50 packs ≈ 250g)
  "stash-cans": 150,
  grinders: 150, // metal/zinc grinder in box
  lighters: 25,
  scales: 250, // pocket/digital scale in box
  hookahs: 2500, // boxed hookah incl. base, stem, bowl, hose
  glass: 400, // bubblers / pipes, incl. protective wrap
  accessories: 300,
};

/** Fallback for any product not matched (deliberately on the heavy side). */
export const DEFAULT_ITEM_GRAMS = 500;

/** Per-product overrides (grams per unit) where the category estimate is off. */
export const PRODUCT_WEIGHTS_GRAMS = {
  "shop-vacuum-sealer": 1200,
  "shop-vacuum-rolls": 500,
  "shop-travel-kit": 600,
  "shop-character-ashtray": 500,
  "shop-gummy-beaker": 900,
  "shop-mini-bubblers": 250,
  "shop-triton-t3": 200,
  "shop-mz100": 150,
  "shop-colour-hookah": 3000,
  "shop-chrome-hookah": 3000,
  "shop-glass-hookah": 2500,
};

/** Category for shop-floor products (worker only receives product IDs). */
export const PRODUCT_CATEGORY = {
  "shop-stash-cans": "stash-cans",
  "shop-vacuum-rolls": "accessories",
  "shop-vacuum-sealer": "accessories",
  "shop-travel-kit": "accessories",
  "shop-character-ashtray": "accessories",
  "shop-gold-grinder": "grinders",
  "shop-teal-grinder": "grinders",
  "shop-clover-grinders": "grinders",
  "shop-charm-grinders": "grinders",
  "shop-graphic-lighters": "lighters",
  "shop-clipper-lighters": "lighters",
  "shop-mz100": "scales",
  "shop-triton-t3": "scales",
  "shop-colour-hookah": "hookahs",
  "shop-glass-hookah": "hookahs",
  "shop-chrome-hookah": "hookahs",
  "shop-mini-bubblers": "glass",
  "shop-spiral-bubblers": "glass",
  "shop-swan-pipe": "glass",
  "shop-gummy-beaker": "glass",
};

/** Grams per unit for a product ID (optionally with a known category). */
export function itemWeightGrams(productId, categorySlug) {
  const id = String(productId || "");
  if (PRODUCT_WEIGHTS_GRAMS[id] != null) return PRODUCT_WEIGHTS_GRAMS[id];
  const cat = id.startsWith("pack-") ? "cali-packs" : PRODUCT_CATEGORY[id] || categorySlug;
  if (cat && CATEGORY_WEIGHTS_GRAMS[cat] != null) return CATEGORY_WEIGHTS_GRAMS[cat];
  return DEFAULT_ITEM_GRAMS;
}

/** Total parcel weight in grams for [{ productId, quantity, categorySlug? }]. */
export function basketWeightGrams(items) {
  let grams = 0;
  let count = 0;
  for (const item of items || []) {
    const qty = Math.max(0, Math.floor(Number(item.quantity) || 0));
    if (!qty) continue;
    count += qty;
    grams += qty * itemWeightGrams(item.productId, item.categorySlug);
  }
  return count ? grams + PACKAGING_GRAMS : 0;
}

/** Delivery band for a parcel weight in grams. */
export function bandForWeight(grams) {
  return DELIVERY_BANDS.find((b) => grams <= b.maxGrams) || DELIVERY_BANDS[DELIVERY_BANDS.length - 1];
}

/** One-stop quote: { grams, band, price }. Empty basket → price 0. */
export function quoteDelivery(items) {
  const grams = basketWeightGrams(items);
  if (!grams) return { grams: 0, band: null, price: 0 };
  const band = bandForWeight(grams);
  return { grams, band, price: band.price };
}
