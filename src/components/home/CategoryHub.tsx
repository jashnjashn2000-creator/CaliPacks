import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/categories";

export function CategoryHub() {
  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      <div className="container-site relative">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.26em] text-brand-700">
              <span className="h-px w-8 bg-gold" />
              Shop by category
            </p>
            <h2 className="font-serif text-3xl font-normal tracking-tight text-ink md:text-[2.75rem]">
              Cali Packs & shop stock
            </h2>
            <p className="mt-2 max-w-xl text-sm font-medium text-graphite/65 md:text-base">
              Named HD products from the Manchester floor — packs, grinders, glass, hookahs, and more.
            </p>
          </div>
          <Link
            href="/shop"
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_24px_-12px_rgba(5,31,32,0.6)] transition hover:-translate-y-px hover:bg-graphite"
          >
            Browse all
            <ArrowRight className="h-4 w-4 text-gold transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop/${category.slug}`}
              className="surface-card group relative overflow-hidden rounded-[1.4rem]"
            >
              <div className="relative aspect-[4/3] bg-white">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 280px"
                  quality={72}
                  className={category.slug === "cali-packs" ? "pack-fill" : "product-fit"}
                />
              </div>
              <div className="flex items-end justify-between gap-2 border-t border-black/5 px-3 py-3 sm:px-4">
                <div className="min-w-0">
                  <h3 className="font-display text-base font-bold leading-tight text-ink sm:text-lg">
                    {category.name}
                  </h3>
                  <p className="mt-0.5 truncate text-[10px] font-bold uppercase tracking-[0.14em] text-brand-700">
                    {category.tagline}
                  </p>
                </div>
                <p className="shrink-0 text-[11px] font-semibold tabular-nums text-graphite/55">
                  {category.productCount} item{category.productCount === 1 ? "" : "s"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
