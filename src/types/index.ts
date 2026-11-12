export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  tagline: string;
  image: string;
  productCount: number;
  /** Set on a subcategory. The parent page lists every child category's products. */
  parentSlug?: string;
}

/** A purchasable size or bundle. Each option is its own catalog id so the worker can price it. */
export interface ProductOption {
  id: string;
  /** Short picker label, e.g. "Small" or "All 3 sizes". */
  label: string;
  /** Full order-line title, e.g. "Black Vacuum Sealer Rolls — Small". */
  name: string;
  price: number;
  /** UK postage in GBP. 0 = free delivery. */
  postage: number;
  /**
   * What the same choice costs bought separately, including the postage
   * that basket would pay. Used to show "Save £X" on bundles.
   */
  originalPrice?: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  /** Cheaper unit price once quantity reaches bulkMinQty. Cali Packs: £0.20 from 50. */
  bulkPrice?: number;
  /** Quantity on this line at which bulkPrice replaces price. */
  bulkMinQty?: number;
  /**
   * UK postage in GBP, charged once per basket at the highest item rate.
   * Omit to use the £3.99 default. 0 = free UK delivery.
   */
  postage?: number;
  /** Size or bundle choices. When set, each option is what gets added to the cart. */
  options?: ProductOption[];
  /** Show the saving as "Save £X" against originalPrice, instead of a percent. */
  saveAsAmount?: boolean;
  categoryId: string;
  categorySlug: string;
  image: string;
  images: string[];
  tags: string[];
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  minOrder?: number;
  sku: string;
  /**
   * Hide this product from customers without deleting it.
   * Hidden products stay in this file and keep their photos.
   * To sell one again, delete this flag (or set it to false), rebuild the site,
   * and redeploy the checkout worker. See README, "Hiding a product".
   */
  hidden?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string; indent?: boolean }[];
}
