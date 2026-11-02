import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { productImageClass, productUnit, savingPercent, thumbSrc } from "@/lib/product";
import { AddToCartMini } from "./AddToCartMini";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  showCart?: boolean;
}

export function ProductCard({
  product,
  priority = false,
  showCart = true,
}: ProductCardProps) {
  return (
    <article className="product-card surface-card is-interactive group relative rounded-2xl p-2.5 sm:p-3">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square rounded-xl overflow-hidden bg-white mb-2.5">
          <Image
            src={thumbSrc(product.image)}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px"
                        priority={priority}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className={productImageClass(product)}
          />
          {product.isNew && (
            <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ink ring-1 ring-ink/10 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              New
            </span>
          )}
        </div>
        <h3 className="font-bold text-sm sm:text-[15px] text-ink line-clamp-2 leading-snug min-h-[2.5rem] tracking-tight">
          {product.name}
        </h3>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1 tabular-nums">
          <span className="font-extrabold text-base sm:text-[17px] text-ink">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice ? (
            <span className="price-was text-[13px] font-semibold">
              {formatPrice(product.originalPrice)}
            </span>
          ) : null}
          <span className="text-[11px] font-bold text-black/45">{productUnit(product)}</span>
          {savingPercent(product) ? (
            <span className="save-tag ml-auto self-center">Save {savingPercent(product)}%</span>
          ) : null}
        </div>
        {product.minOrder && product.minOrder > 1 ? (
          <p className="mt-1 text-[11px] font-extrabold uppercase tracking-wide text-brand-700">
            Min. {product.minOrder} pcs
          </p>
        ) : null}
      </Link>
      {showCart ? <AddToCartMini product={product} /> : null}
    </article>
  );
}
