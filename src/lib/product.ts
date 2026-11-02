import { Product } from "@/types";

export function isCaliPack(product: Product) {
  return product.categorySlug === "cali-packs";
}

export function productUnit(product: Product) {
  return isCaliPack(product) ? "per pack" : "each";
}

const framedPackIds = new Set(["pack-001", "pack-080", "pack-109", "pack-110", "pack-111"]);

export function productImageClass(product: Product) {
  if (isCaliPack(product) && !framedPackIds.has(product.id)) return "pack-fill";
  return "product-fit";
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
