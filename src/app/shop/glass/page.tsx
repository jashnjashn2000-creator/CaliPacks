import type { Metadata } from "next";
import { ShopLegacyRedirect } from "@/components/shop/ShopLegacyRedirect";
import { pageUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Bongs",
  description: "The Glass category has moved to Bongs.",
  robots: { index: false, follow: true },
  alternates: { canonical: pageUrl("/shop/bongs") },
};

/** Old /shop/glass/ URL. Static export has no server redirect, so this page sends people to Bongs. */
export default function GlassCategoryRedirect() {
  return (
    <ShopLegacyRedirect
      href="/shop/bongs/"
      message="Glass has moved to Bongs. Taking you there…"
    />
  );
}
