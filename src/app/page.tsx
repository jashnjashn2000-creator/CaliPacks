import type { Metadata } from "next";
import { preload } from "react-dom";
import { HeroBannerSlider } from "@/components/home/HeroBannerSlider";
import { CategoryHub } from "@/components/home/CategoryHub";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { CategorySection } from "@/components/products/ProductGrid";
import { CTASection } from "@/components/home/CTASection";
import { HomepageMap } from "@/components/home/HomepageMap";
import { ProductConveyor } from "@/components/home/ProductConveyor";
import { QuickAnswers } from "@/components/home/QuickAnswers";
import { StorefrontShowcase } from "@/components/home/StorefrontShowcase";
import { TrustBadges } from "@/components/layout/AnnouncementBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { CALI_PACK_COUNT, getHomepageSections } from "@/data/products";
import { pageUrl } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: pageUrl("/") },
  openGraph: { url: pageUrl("/") },
};

export default function HomePage() {
  preload("/brand-showcase-mobile.webp", {
    as: "image",
    type: "image/webp",
    fetchPriority: "high",
    media: "(max-width: 1023px)",
  });
  preload("/brand-showcase.webp", {
    as: "image",
    type: "image/webp",
    fetchPriority: "high",
    media: "(min-width: 1024px)",
  });
  const { latest, more, heroTiles, featured, shopStock, conveyor } = getHomepageSections();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Smoke Cali shop — Cali Packs and in-store stock",
          numberOfItems: latest.length + shopStock.length,
          itemListElement: [...shopStock, ...latest].slice(0, 24).map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: pageUrl(`/product/${product.slug}`),
            name: product.name,
          })),
        }}
      />
      <HeroBannerSlider products={heroTiles} />
      <ProductConveyor products={conveyor} />
      <TrustBadges />
      <CategoryHub />
      <CategorySection
        title="Shop-floor stock"
        subtitle="Named HD photos from the Manchester shop — grinders, bongs, hookahs, scales, and accessories at UK-competitive prices."
        products={shopStock.slice(0, 8)}
        viewAllHref="/shop"
        viewAllLabel="See all"
        eagerCount={0}
        showCart={false}
        className="py-14 md:py-20"
      />
      <CategorySection
        title="Latest Cali Packs"
        subtitle="HD studio photography. £0.22 each · minimum 25 pcs · 50+ for £0.20 each. Postage £2.99 up to 200 packs, £3.50 over 200 packs."
        products={latest}
        viewAllHref="/shop/cali-packs"
        eagerCount={0}
        showCart={false}
        tone="dark"
        className="py-14 md:py-20 bg-gradient-to-br from-ink via-graphite to-[#163832]"
      />
      <CategorySection
        title="More Designs"
        subtitle={`${CALI_PACK_COUNT} named Cali Packs in the shop — every image is a clear HD studio shot.`}
        products={more}
        viewAllHref="/shop/cali-packs"
        eagerCount={0}
        showCart={false}
        className="py-14 md:py-20"
      />
      <CategoryShowcase products={featured} />
      <StorefrontShowcase />
      <QuickAnswers />
      <CTASection />
      <HomepageMap />
    </>
  );
}
