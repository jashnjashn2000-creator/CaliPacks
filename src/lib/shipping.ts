/**
 * Per-product UK postage, charged once per order.
 * The rule lives in ONE place, shared with the checkout worker:
 *   cloudflare/checkout-worker/src/shipping-rates.js
 * The worker recalculates postage server-side before charging through Viva.com.
 * Amounts live on each product (`postage` in GBP). Omit it to use £3.99. 0 = free.
 */
import type { CartItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
  DEFAULT_POSTAGE_PENCE,
  DELIVERY_SERVICE,
  POSTAGE_RULE,
  quotePostagePence,
} from "../../cloudflare/checkout-worker/src/shipping-rates.js";

export const deliveryService: string = DELIVERY_SERVICE;

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

export function quoteForCart(items: CartItem[]): DeliveryQuote {
  const pricePence = quotePostagePence(
    items.map((i) => ({
      quantity: i.quantity,
      postagePence: i.product.postage == null ? undefined : Math.round(i.product.postage * 100),
    }))
  );
  return { pricePence, price: pricePence / 100 };
}
