import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";

/**
 * Existing bundle listings to surface on the matching single-item page.
 * Prices are read from those listings. Nothing here is a new offer.
 */
export interface ShopOfferCallout {
  href: string;
  heading: string;
  detail: string;
}

const GRINDER_IDS = new Set([
  "shop-gold-grinder",
  "shop-teal-grinder",
  "shop-clover-grinders",
  "shop-charm-grinders",
]);

export function shopOfferCallout(productId: string): ShopOfferCallout | null {
  if (productId === "shop-vacuum-sealer") {
    const bundle = products.find((product) => product.id === "shop-bnd-vac-rolls");
    if (!bundle) return null;
    return {
      href: `/product/${bundle.slug}`,
      heading: `Add all 3 roll sizes for ${formatPrice(bundle.price)}`,
      detail: `${bundle.name}, free UK delivery. ${formatPrice(bundle.price)} is the price for this machine together with the 15 cm, 20 cm and 28 cm black rolls.`,
    };
  }

  if (GRINDER_IDS.has(productId)) {
    const bundle = products.find((product) => product.slug === "grinder-digital-scale-bundle");
    if (!bundle) return null;
    return {
      href: `/product/${bundle.slug}`,
      heading: `Add a digital scale for ${formatPrice(bundle.price)}`,
      detail: `${bundle.name}, free UK delivery. ${formatPrice(bundle.price)} is the price for this grinder together with either the On Balance MZ-100 or the My Weigh Triton T3.`,
    };
  }

  return null;
}
