/**
 * Basket prices after order deals. The maths lives in order-deals.js,
 * which the checkout worker uses as well, so the cart and the charge match.
 */
import type { CartItem } from "@/types";
import { isCaliPack } from "@/lib/product";
import { priceLinesPence } from "../../cloudflare/checkout-worker/src/order-deals.js";

export { CALI_PACK_DEAL_BULLET, ZIPPER_BOX_DEAL_BULLET } from "../../cloudflare/checkout-worker/src/order-deals.js";

export function isGripSealZipperBox(product: { id?: string; tags?: string[] }) {
  return String(product.id || "").startsWith("shop-zip-") || (product.tags || []).includes("grip-seal");
}

export interface PricedLine {
  id: string;
  quantity: number;
  pricePence: number;
  baseUnitPence: number;
  unitPence: number;
  linePence: number;
  dealSavingPence: number;
}

export interface PricedCart {
  lines: PricedLine[];
  subtotalPence: number;
  subtotalGbp: number;
  bagSavingGbp: number;
  zipperSavingGbp: number;
  bagsDeal: boolean;
  zipperDeal: boolean;
}

export function priceCartItems(items: CartItem[]): PricedCart {
  const result = priceLinesPence(
    items.map((item) => ({
      id: item.product.id,
      quantity: item.quantity,
      pricePence: Math.round(item.product.price * 100),
      bulkPricePence:
        item.product.bulkPrice == null ? undefined : Math.round(item.product.bulkPrice * 100),
      bulkMinQty: item.product.bulkMinQty,
      caliPack: isCaliPack(item.product),
      zipperBox: isGripSealZipperBox(item.product),
    }))
  );
  return {
    lines: result.lines.map((line) => ({
      id: String(line.id || ""),
      quantity: line.quantity,
      pricePence: line.pricePence,
      baseUnitPence: line.baseUnitPence,
      unitPence: line.unitPence,
      linePence: line.linePence,
      dealSavingPence: line.dealSavingPence,
    })),
    subtotalPence: result.subtotalPence,
    subtotalGbp: result.subtotalPence / 100,
    bagSavingGbp: result.bagSavingPence / 100,
    zipperSavingGbp: result.zipperSavingPence / 100,
    bagsDeal: result.bagsDeal,
    zipperDeal: result.zipperDeal,
  };
}

/** What the basket becomes if this product's quantity is added on top of the cart. */
export function projectAdd(items: CartItem[], product: CartItem["product"], addQty: number): CartItem[] {
  const qty = Math.max(0, Math.floor(addQty));
  const existing = items.find((item) => item.product.id === product.id);
  if (!existing) return [...items, { product, quantity: qty }];
  return items.map((item) =>
    item.product.id === product.id ? { ...item, quantity: item.quantity + qty } : item
  );
}
