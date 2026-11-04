import { NavItem } from "@/types";

export const mainNav: NavItem[] = [
  {
    label: "Shop",
    href: "/shop",
    children: [
      { label: "All Products", href: "/shop", description: "Cali Packs and shop stock" },
      { label: "Cali Packs", href: "/shop/cali-packs", description: "£0.22 each · min 25 · 50+ for £0.20" },
      { label: "Stash Cans", href: "/shop/stash-cans", description: "From £5.99" },
      { label: "Grinders", href: "/shop/grinders", description: "From £6.99" },
      { label: "Lighters", href: "/shop/lighters", description: "From £1.79" },
      { label: "Scales", href: "/shop/scales", description: "From £12.99" },
      { label: "Hookahs", href: "/shop/hookahs", description: "From £49.99" },
      { label: "Bongs", href: "/shop/bongs", description: "Large, medium and small" },
      { label: "Large Bongs", href: "/shop/large-bongs", description: "£24.99 · postage £3.99", indent: true },
      { label: "Medium Bongs", href: "/shop/medium-bongs", description: "£14.99 · postage £3.50", indent: true },
      { label: "Small Bongs", href: "/shop/small-bongs", description: "From £7.99", indent: true },
      { label: "Accessories", href: "/shop/accessories", description: "Sealers, bundles, kits" },
    ],
  },
  { label: "About Us", href: "/about" },
  { label: "New Arrivals", href: "/shop/?filter=new" },
  { label: "Contact Us", href: "/contact" },
];

export const footerNav = [
  { label: "Shop", href: "/shop" },
  { label: "About Us", href: "/about" },
  { label: "New Arrivals", href: "/shop/?filter=new" },
  { label: "Contact Us", href: "/contact" },
];

export const footerLinks = {
  shop: [
    { label: "All Products", href: "/shop" },
    { label: "Cali Packs", href: "/shop/cali-packs" },
    { label: "Grinders", href: "/shop/grinders" },
    { label: "Bongs", href: "/shop/bongs" },
    { label: "Hookahs", href: "/shop/hookahs" },
    { label: "New Arrivals", href: "/shop/?filter=new" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Custom Orders", href: "/custom-orders" },
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Delivery", href: "/shipping" },
    { label: "Returns & Refunds", href: "/returns" },
  ],
};
