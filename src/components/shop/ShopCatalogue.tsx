"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { WholesaleBanner } from "@/components/shop/WholesaleBanner";
import { ShopCategoriesNav } from "@/components/shop/ShopCategoriesNav";
import { LoadMoreGrid } from "@/components/shop/LoadMoreGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { products, searchProducts } from "@/data/products";
import { getCategoryBySlug } from "@/data/categories";
import { SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

interface ShopCatalogueProps {
  categorySlug?: string;
}

interface ShopViewProps {
  categorySlug?: string;
  query: string;
  isNew: boolean;
}

function ShopView({ categorySlug, query, isNew }: ShopViewProps) {
  const category = categorySlug ? getCategoryBySlug(categorySlug) : undefined;

  const scoped = useMemo(() => {
    if (categorySlug) return products.filter((p) => p.categorySlug === categorySlug);
    return products;
  }, [categorySlug]);

  const newCount = useMemo(
    () => scoped.filter((product) => product.isNew).length,
    [scoped]
  );

  const displayProducts = useMemo(() => {
    if (query) {
      const hits = searchProducts(query);
      return categorySlug ? hits.filter((p) => p.categorySlug === categorySlug) : hits;
    }
    if (isNew) return scoped.filter((p) => p.isNew);
    if (!categorySlug) {
      const stock = scoped.filter((p) => p.categorySlug !== "cali-packs");
      const packs = scoped.filter((p) => p.categorySlug === "cali-packs");
      return [...stock, ...packs];
    }
    return scoped;
  }, [query, isNew, scoped, categorySlug]);

  let title = "All";
  let accent = "Products";
  if (isNew) {
    title = "New";
    accent = "Arrivals";
  } else if (category) {
    const parts = category.name.split(" ");
    title = parts[0];
    accent = parts.slice(1).join(" ") || "Shop";
  }
  const description =
    query
      ? `Search results across named HD products.`
      : category?.description ??
        (isNew
          ? "Latest drops from the Manchester shop — Cali Packs at £0.22 (min 25, 50+ for £0.20) plus new shop-floor stock."
          : "Cali Packs at £0.22 each (min 25 pcs, 50+ for £0.20) plus grinders, glass, hookahs, scales, and accessories from the shop floor.");

  const heroImages = category
    ? [category.image, ...displayProducts.slice(0, 2).map((p) => p.image)]
    : isNew
      ? ["/shop/cartoon-travel-kit.webp", "/shop/gold-honeycomb-grinder.webp", "/shop/candy-stash-cans.webp"]
      : ["/products/pack-040.webp", "/shop/colour-novelty-hookah.webp", "/shop/gold-honeycomb-grinder.webp"];

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: category?.name ?? (isNew ? "New arrivals" : "Smoke Cali shop"),
          numberOfItems: displayProducts.length,
          itemListElement: displayProducts.slice(0, 24).map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${SITE_URL}/product/${product.slug}`,
            name: product.name,
          })),
        }}
      />
      <PageHero
        eyebrow={category ? "Category" : isNew ? "Fresh stock" : "Manchester shop"}
        title={title}
        accent={accent}
        description={description}
        images={heroImages}
        size={isNew ? "showcase" : "default"}
        ctaLabel={isNew ? "View all products" : undefined}
        ctaHref={isNew ? "/shop" : undefined}
      />

      <div className="container-site py-8 md:py-12">
        {categorySlug === "cali-packs" ? <WholesaleBanner /> : null}

        <ShopCategoriesNav activeSlug={categorySlug} isNew={isNew} />

        <div className="mb-8 overflow-hidden rounded-[1.6rem] border border-brand-200 bg-white p-4 shadow-[0_10px_30px_rgba(5,31,32,0.05)] sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-1 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-700">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                {query ? "Search" : category?.name ?? "All products"}
              </p>
              <h2 className="font-serif text-3xl font-normal tracking-tight text-ink md:text-4xl">
                {query
                  ? `Results for “${query}”`
                  : isNew
                    ? "New arrivals"
                    : category
                      ? category.name
                      : "The full collection"}
              </h2>
              <p className="mt-1 text-sm font-semibold text-black/50">
                {displayProducts.length} item{displayProducts.length !== 1 ? "s" : ""}
                {categorySlug === "cali-packs" ? " · £0.22 each · min 25 · 50+ for £0.20" : ""}
                {category?.tagline && categorySlug !== "cali-packs" ? ` · ${category.tagline}` : ""}
              </p>
            </div>

            {!query && !categorySlug ? (
              <div className="flex rounded-2xl border border-brand-200 bg-cream p-1">
                <Link
                  href="/shop/"
                  className={cn(
                    "rounded-xl px-4 py-2.5 text-sm font-black transition",
                    !isNew
                      ? "bg-ink text-white shadow-md"
                      : "text-ink/70 hover:bg-white hover:text-ink"
                  )}
                >
                  All {products.length}
                </Link>
                <Link
                  href="/shop/?filter=new"
                  className={cn(
                    "rounded-xl px-4 py-2.5 text-sm font-black transition",
                    isNew
                      ? "bg-ink text-gold shadow-md"
                      : "text-ink/70 hover:bg-white hover:text-ink"
                  )}
                >
                  New {newCount}
                </Link>
              </div>
            ) : query ? (
              <Link
                href="/shop/"
                className="inline-flex w-fit rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-graphite"
              >
                Clear search
              </Link>
            ) : null}
          </div>
        </div>

        {displayProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-300 py-16 text-center">
            <p className="mb-3 font-semibold text-graphite/60">No products found.</p>
            <Link href="/shop/" className="font-bold text-brand-700 hover:underline">
              Browse the shop
            </Link>
          </div>
        ) : (
          <LoadMoreGrid key={`${query}-${isNew}-${categorySlug ?? "all"}`} products={displayProducts} />
        )}
      </div>
    </div>
  );
}

function ShopCatalogueFromUrl({ categorySlug }: ShopCatalogueProps) {
  const params = useSearchParams();
  const query = params.get("q") || "";
  const isNew = !categorySlug && params.get("filter") === "new";
  return <ShopView categorySlug={categorySlug} query={query} isNew={isNew} />;
}

export function ShopCatalogue({ categorySlug }: ShopCatalogueProps) {
  return (
    <Suspense fallback={<ShopView categorySlug={categorySlug} query="" isNew={false} />}>
      <ShopCatalogueFromUrl categorySlug={categorySlug} />
    </Suspense>
  );
}
