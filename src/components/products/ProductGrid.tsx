import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  eagerCount?: number;
  showCart?: boolean;
}

export function ProductGrid({
  products,
  eagerCount = 0,
  showCart = true,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-graphite/60">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={i < eagerCount}
          showCart={showCart}
        />
      ))}
    </div>
  );
}

interface CategorySectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref: string;
  className?: string;
  eagerCount?: number;
  showCart?: boolean;
  tone?: "light" | "dark";
  viewAllLabel?: string;
}

export function CategorySection({
  title,
  subtitle,
  products,
  viewAllHref,
  className,
  eagerCount = 0,
  showCart = true,
  tone = "light",
  viewAllLabel = "View All",
}: CategorySectionProps) {
  const dark = tone === "dark";
  return (
    <section className={className ?? "py-12 md:py-16"}>
      <div className="container-site">
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <div className="w-12 h-px bg-gold mb-4" />
            <h2
              className={`font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-normal tracking-tight ${dark ? "text-white" : "text-ink"}`}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                className={`mt-2 text-sm md:text-base max-w-xl leading-relaxed font-medium ${dark ? "text-white/70" : "text-graphite/65"}`}
              >
                {subtitle}
              </p>
            )}
          </div>
          <Link
            href={viewAllHref}
            className={`flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.14em] transition-colors group ${dark ? "text-gold hover:text-white" : "text-brand-700 hover:text-ink"}`}
          >
            {viewAllLabel}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <ProductGrid products={products} eagerCount={eagerCount} showCart={showCart} />
      </div>
    </section>
  );
}
