import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types";
import { CALI_PACK_COUNT } from "@/data/products";

export function CategoryShowcase({ products }: { products: Product[] }) {
  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      <div className="container-site relative mb-7 sm:mb-9">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-graphite via-ink to-[#163832] px-6 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_50px_-20px_rgba(5,31,32,0.5)] sm:px-10 sm:py-10">
          <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-gold sm:text-xs">
                <span className="h-px w-8 bg-gold" />
                Featured Cali Packs
              </span>
              <h2 className="font-serif text-4xl font-normal leading-none tracking-tight text-white md:text-5xl">
                Designs that <span className="heading-accent">sell</span>
              </h2>
              <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-white/65 md:text-base">
                £0.22 each · minimum 25 pcs · 50+ for £0.20 each. Every pack is named and shot in HD.
              </p>
            </div>
            <Link
              href="/shop/cali-packs"
              className="btn-glow inline-flex w-fit items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink hover:bg-brand-400"
            >
              Shop all {CALI_PACK_COUNT} packs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="container-site relative grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="surface-card group relative overflow-hidden rounded-[1.4rem]"
          >
            <div className="relative aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 280px"
                quality={70}
                className="pack-fill"
              />
            </div>
            <div className="border-t border-black/5 px-3 py-3 sm:px-4">
              <h3 className="truncate font-display text-base font-bold leading-tight text-ink sm:text-lg">
                {product.name}
              </h3>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
                £0.22 · min 25 · 50+ £0.20
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
