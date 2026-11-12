/**
 * UK postage, charged once per order.
 * The rule lives in ONE place, shared with the checkout worker:
 *   cloudflare/checkout-worker/src/shipping-rates.js
 * The worker recalculates postage server-side before charging through Viva.com.
 * Amounts live on each product (`postage` in GBP). Omit it to use £3.99. 0 = free.
 * Cali Packs use a quantity band instead (£2.99 up to 200 packs, £3.50 over 200).
 * Stash can packs of 10 use a quantity band (£2.99, or £3.99 for 5 or more packs).
 */
import type { CartItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
  CALI_PACK_POSTAGE_LABEL,
  CALI_PACK_POSTAGE_UP_TO_PENCE,
  DEFAULT_POSTAGE_PENCE,
  DELIVERY_SERVICE,
  ICE_CUP_POSTAGE_LABEL,
  NEXT_DAY_NOTE,
  NEXT_DAY_POSTAGE_LABEL,
  POSTAGE_RULE,
  STASH_CAN_POSTAGE_LABEL,
  nextDayPostagePence,
  quotePostagePence,
} from "../../cloudflare/checkout-worker/src/shipping-rates.js";

export const deliveryService: string = DELIVERY_SERVICE;

export const caliPackPostageLabel: string = CALI_PACK_POSTAGE_LABEL;

export const stashCanPostageLabel: string = STASH_CAN_POSTAGE_LABEL;

export const iceCupPostageLabel: string = ICE_CUP_POSTAGE_LABEL;

export const nextDayPostageLabel: string = NEXT_DAY_POSTAGE_LABEL;

export const nextDayNote: string = NEXT_DAY_NOTE;

export type ShippingMethod = "standard" | "nextday";

/** Postage shown for a Cali Pack order of 200 packs or fewer. */
export const CALI_PACK_POSTAGE_UP_TO_GBP = CALI_PACK_POSTAGE_UP_TO_PENCE / 100;

/** Default postage when a product does not set its own. */
export const DEFAULT_POSTAGE_GBP = DEFAULT_POSTAGE_PENCE / 100;

export const DELIVERY_LABEL = "UK postage";

/** Customer-facing rule: highest postage once, free when every item is free. */
export const DELIVERY_NOTE = `${DELIVERY_SERVICE}. ${POSTAGE_RULE}`;

export interface DeliveryQuote {
  pricePence: number;
  price: number;
}

/** Postage in GBP for a product. Undefined uses the £3.99 default. 0 stays free. */
export function productPostageGbp(product: { postage?: number }): number {
  if (product.postage == null) return DEFAULT_POSTAGE_GBP;
  return Math.max(0, product.postage);
}

export function postageLabel(postageGbp: number): string {
  if (postageGbp <= 0) return "Free UK delivery";
  return `Postage ${formatPrice(postageGbp)}`;
}

function isCaliPackLine(product: { id?: string; categorySlug?: string }) {
  return product.categorySlug === "cali-packs" || String(product.id || "").startsWith("pack-");
}

function isStashCanPackLine(product: { id?: string; tags?: string[] }) {
  return String(product.id || "").startsWith("shop-can-") || (product.tags || []).includes("stash-can-pack");
}

function isIceCupLine(product: { id?: string; tags?: string[] }) {
  return String(product.id || "").startsWith("shop-cup-") || (product.tags || []).includes("ice-cup");
}

/** Next working day is only for a basket made entirely of bag packs. */
export function bagsOnlyBasket(items: CartItem[]): boolean {
  return items.length > 0 && items.every((item) => isCaliPackLine(item.product));
}

export function quoteForCart(items: CartItem[], method: ShippingMethod = "standard"): DeliveryQuote {
  if (method === "nextday") {
    if (!bagsOnlyBasket(items)) return { pricePence: 0, price: 0 };
    const packs = items.reduce((sum, item) => sum + item.quantity, 0);
    const pricePence = nextDayPostagePence(packs);
    return { pricePence, price: pricePence / 100 };
  }
  const pricePence = quotePostagePence(
    items.map((i) => ({
      quantity: i.quantity,
      caliPack: isCaliPackLine(i.product),
      stashCan: isStashCanPackLine(i.product),
      iceCup: isIceCupLine(i.product),
      postagePence: i.product.postage == null ? undefined : Math.round(i.product.postage * 100),
    }))
  );
  return { pricePence, price: pricePence / 100 };
}
