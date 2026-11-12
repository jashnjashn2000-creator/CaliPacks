import type { Metadata } from "next";
import { ShopCatalogue } from "@/components/shop/ShopCatalogue";
import { pageUrl } from "@/lib/site";
import { CALI_PACK_COUNT } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop Cali Packs at £0.22 each (min 25 pcs, 50+ for £0.20) plus grinders, bongs, hookahs, scales, cans and accessories from Smoke Cali Manchester. HD photos, UK delivery in 2–3 days.",
  alternates: { canonical: pageUrl("/shop") },
  openGraph: {
    url: pageUrl("/shop"),
    title: "Shop Cali Packs & store stock | Smoke Cali",
    description:
      `${CALI_PACK_COUNT} HD Cali Packs plus named shop-floor stock. Competitive UK prices. Manchester wholesale.`,
    images: [{ url: "/hero-cali-packs.webp", alt: "Smoke Cali shop catalogue" }],
  },
};

export default function ShopPage() {
  return <ShopCatalogue />;
}
