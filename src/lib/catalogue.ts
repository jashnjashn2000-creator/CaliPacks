import { listingSlugs } from "@/data/categories";
import { products } from "@/data/products";
import type { Product } from "@/types";

/** Products on a category page. A parent category lists its subcategories, in that order. */
export function productsForCategory(slug: string): Product[] {
  const order = listingSlugs(slug);
  const slugs = new Set(order);
  const matched = products.filter((product) => slugs.has(product.categorySlug));
  if (order.length < 2) return matched;
  return matched
    .slice()
    .sort((a, b) => order.indexOf(a.categorySlug) - order.indexOf(b.categorySlug));
}
