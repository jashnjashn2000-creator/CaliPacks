import { products } from "@/data/products";
import { flattenOption } from "@/lib/product";
import type { Product } from "@/types";

/**
 * Current sellable for a cart/catalog id, including size and bundle options.
 * Prices and postage come from product data, not from a stored cart snapshot.
 */
export function resolveSellable(productId: string): Product | undefined {
  for (const product of products) {
    const option = product.options?.find((o) => o.id === productId);
    if (option) return flattenOption(product, option);
    if (product.id === productId) return product;
  }
  return undefined;
}
