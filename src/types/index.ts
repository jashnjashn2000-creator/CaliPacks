export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  tagline: string;
  image: string;
  productCount: number;
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
  /**
   * UK postage in GBP, charged once per basket at the highest item rate.
   * Omit to use the £3.99 default. 0 = free UK delivery.
   */
  postage?: number;
  /** Size or bundle choices. When set, each option is what gets added to the cart. */
  options?: ProductOption[];
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
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}
