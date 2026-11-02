/**
 * Weight-based UK delivery, charged once per order.
 * Rates and product weights live in ONE place, shared with the checkout worker:
 *   cloudflare/checkout-worker/src/shipping-rates.js
 * The worker recalculates delivery server-side before charging through Viva.com.
 */
import type { CartItem } from "@/types";
import {
  DELIVERY_BANDS,
  DELIVERY_SERVICE,
  quoteDelivery,
} from "../../cloudflare/checkout-worker/src/shipping-rates.js";

export interface DeliveryBand {
  id: string;
  name: string;
  maxGrams: number;
  weightLabel: string;
  price: number;
}

export const deliveryBands: DeliveryBand[] = DELIVERY_BANDS;
export const deliveryService: string = DELIVERY_SERVICE;

/** Lowest delivery price, e.g. for "Delivery from £4.00". */
export const DELIVERY_FROM_GBP = Math.min(...DELIVERY_BANDS.map((b) => b.price));
export const DELIVERY_FROM_LABEL = `Delivery from £${DELIVERY_FROM_GBP.toFixed(2)}`;

export const DELIVERY_LABEL = "UK Delivery";
export const DELIVERY_NOTE = `${DELIVERY_SERVICE}. Charged once per order and calculated by the total weight of your basket.`;

export interface DeliveryQuote {
  grams: number;
  band: DeliveryBand | null;
  price: number;
}

export function quoteForCart(items: CartItem[]): DeliveryQuote {
  return quoteDelivery(
    items.map((i) => ({
      productId: i.product.id,
      categorySlug: i.product.categorySlug,
      quantity: i.quantity,
    }))
  ) as DeliveryQuote;
}

export function formatWeight(grams: number) {
  return grams >= 1000 ? `${(grams / 1000).toFixed(1)}kg` : `${grams}g`;
}
