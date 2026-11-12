import { Product, ProductOption } from "@/types";
import { caliPackPostageLabel, iceCupPostageLabel, postageLabel, productPostageGbp, stashCanPostageLabel } from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";

export function isCaliPack(product: Product) {
  return product.categorySlug === "cali-packs";
}

/** Pack-of-10 flavour stash cans. */
export function isStashCanPack(product: { id?: string; tags?: string[] }) {
  return String(product.id || "").startsWith("shop-can-") || (product.tags || []).includes("stash-can-pack");
}

/** Ice cream cup cans, sold each with a minimum of 20 per design. */
export function isIceCup(product: { id?: string; tags?: string[] }) {
  return String(product.id || "").startsWith("shop-cup-") || (product.tags || []).includes("ice-cup");
}

function toPence(gbp: number) {
  return Math.round(gbp * 100);
}

/** Unit price in pence. The bulk price applies only to this line's quantity. */
export function unitPricePence(
  product: { price: number; bulkPrice?: number; bulkMinQty?: number },
  quantity: number
) {
  const qty = Math.max(0, Math.floor(quantity));
  if (product.bulkPrice != null && product.bulkMinQty != null && qty >= product.bulkMinQty) {
    return toPence(product.bulkPrice);
  }
  return toPence(product.price);
}

export function unitPriceGbp(
  product: { price: number; bulkPrice?: number; bulkMinQty?: number },
  quantity: number
) {
  return unitPricePence(product, quantity) / 100;
}

export function lineTotalPence(
  product: { price: number; bulkPrice?: number; bulkMinQty?: number },
  quantity: number
) {
  const qty = Math.max(0, Math.floor(quantity));
  return unitPricePence(product, qty) * qty;
}

export function lineTotalGbp(
  product: { price: number; bulkPrice?: number; bulkMinQty?: number },
  quantity: number
) {
  return lineTotalPence(product, quantity) / 100;
}

/** Saving against the standard unit price, in GBP. 0 until the bulk quantity is reached. */
export function bulkSavingGbp(
  product: { price: number; bulkPrice?: number; bulkMinQty?: number },
  quantity: number
) {
  const qty = Math.max(0, Math.floor(quantity));
  if (product.bulkPrice == null || product.bulkMinQty == null || qty < product.bulkMinQty) return 0;
  return (toPence(product.price) * qty - lineTotalPence(product, qty)) / 100;
}

/** "£0.22 each · Buy 50+ for £0.20 each", or null when the product has no quantity offer. */
export function packOfferText(product: { price: number; bulkPrice?: number; bulkMinQty?: number }) {
  if (product.bulkPrice == null || product.bulkMinQty == null) return null;
  return `${formatPrice(product.price)} each · Buy ${product.bulkMinQty}+ for ${formatPrice(product.bulkPrice)} each`;
}

export function productUnit(product: Product) {
  if (isCaliPack(product) || isStashCanPack(product)) return "per pack";
  return "each";
}

const framedPackIds = new Set(["pack-001", "pack-080", "pack-109", "pack-110", "pack-111"]);

export function productImageClass(product: Product) {
  if (isCaliPack(product) && !framedPackIds.has(product.id)) return "pack-fill";
  return "product-fit";
}

/** Lowest price, and whether the card should say "From". */
export function displayPrice(product: Product): { amount: number; from: boolean } {
  if (!product.options?.length) return { amount: product.price, from: false };
  const amounts = product.options.map((o) => o.price);
  const amount = Math.min(...amounts);
  const highest = Math.max(...amounts);
  return { amount, from: highest - amount > 0.001 };
}

/** Pounds saved against the crossed-out separate-purchase price, or 0. */
export function savingAmountGbp(price: number, originalPrice?: number) {
  if (originalPrice == null || originalPrice <= price) return 0;
  return Math.round((originalPrice - price) * 100) / 100;
}

/**
 * "Save £7.96" or "Save from £2.98" for bundles that compare against
 * buying the same items separately (prices plus the highest postage once).
 */
export function bundleSavingLabel(product: Product): string | null {
  if (!product.saveAsAmount) return null;
  if (product.options?.length) {
    const saves = product.options
      .map((option) => savingAmountGbp(option.price, option.originalPrice))
      .filter((amount) => amount > 0);
    if (!saves.length) return null;
    const lowest = Math.min(...saves);
    const highest = Math.max(...saves);
    if (Math.round(lowest * 100) === Math.round(highest * 100)) return `Save ${formatPrice(lowest)}`;
    return `Save from ${formatPrice(lowest)}`;
  }
  const save = savingAmountGbp(product.price, product.originalPrice);
  return save > 0 ? `Save ${formatPrice(save)}` : null;
}

/**
 * Postage line for a product card. Mixed options (some free) name the free choice
 * so the card does not hide free delivery behind a single paid rate.
 */
export function displayPostageLabel(product: Product): string {
  if (isCaliPack(product)) return caliPackPostageLabel;
  if (isStashCanPack(product)) return stashCanPostageLabel;
  if (isIceCup(product)) return iceCupPostageLabel;
  const options = product.options;
  if (!options?.length) return postageLabel(productPostageGbp(product));
  const paid = [...new Set(options.filter((o) => o.postage > 0).map((o) => o.postage))];
  const free = options.filter((o) => o.postage <= 0);
  if (free.length && paid.length === 1) {
    const freeLabels = free.map((o) => o.label).join(", ");
    return `${postageLabel(paid[0])} · ${freeLabels}: Free UK delivery`;
  }
  if (free.length && paid.length === 0) return "Free UK delivery";
  if (!free.length && paid.length === 1) return postageLabel(paid[0]);
  const lowest = Math.min(...options.map((o) => o.postage));
  return lowest <= 0 ? "Free UK delivery on some options" : `Postage from ${formatPrice(lowest)}`;
}

/** Cart line for one size/bundle. Drops the options list so the line is a single SKU. */
export function flattenOption(product: Product, option: ProductOption): Product {
  return {
    ...product,
    id: option.id,
    name: option.name,
    price: option.price,
    postage: option.postage,
    sku: option.sku,
    originalPrice: option.originalPrice,
    options: undefined,
  };
}

/** Whole-number % saved against the crossed-out price, or 0 when there is no saving. */
export function savingPercent(product: Product) {
  const was = product.originalPrice ?? 0;
  if (was <= product.price) return 0;
  return Math.round(((was - product.price) / was) * 100);
}

/** Small copies made by scripts/make-thumbs.mjs for tiles and the conveyor strip. */
export function thumbSrc(src: string) {
  return src.replace(/^\/(products|shop)\/([^/]+\.webp)$/, "/$1/thumbs/$2");
}
