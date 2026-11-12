import { NavItem } from "@/types";

export const mainNav: NavItem[] = [
  {
    label: "Shop",
    href: "/shop",
    children: [
      { label: "All Products", href: "/shop", description: "Cali Packs and shop stock" },
      { label: "Cali Packs", href: "/shop/cali-packs", description: "£0.22 each · postage £2.99 up to 200" },
      { label: "Stash Cans", href: "/shop/stash-cans", description: "Packs of 10 £7.50 · cups 85p" },
      { label: "Grinders", href: "/shop/grinders", description: "From £6.99" },
      { label: "Lighters", href: "/shop/lighters", description: "Clippers and boxes of 50" },
      { label: "Scales", href: "/shop/scales", description: "From £12.99" },
      { label: "Hookahs", href: "/shop/hookahs", description: "From £49.99" },
      { label: "Bongs", href: "/shop/bongs", description: "Large, medium and small" },
      { label: "Large Bongs", href: "/shop/large-bongs", description: "£24.99 · 35 cm · postage £3.99", indent: true },
      { label: "Medium Bongs", href: "/shop/medium-bongs", description: "From £14.99 · postage £3.50", indent: true },
      { label: "Small Bongs", href: "/shop/small-bongs", description: "£8.99 · postage £3.99", indent: true },
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
