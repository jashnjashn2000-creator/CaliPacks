import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { productImageClass, savingPercent, thumbSrc } from "@/lib/product";

/** Roughly 55px a second, whatever the number of products. */
const SECONDS_PER_ITEM = 3.2;

function BeltItem({ product, hidden }: { product: Product; hidden?: boolean }) {
  const saving = savingPercent(product);
  return (
    <li className="shrink-0">
      <Link
        href={`/product/${product.slug}`}
        tabIndex={hidden ? -1 : undefined}
        className="conveyor-item block w-[150px] sm:w-[172px] rounded-xl bg-white p-2.5"
      >
        <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
          <Image
            src={thumbSrc(product.image)}
            alt={hidden ? "" : product.name}
            fill
            sizes="172px"
            loading="lazy"
            decoding="async"
            className={productImageClass(product)}
          />
          {saving ? (
            <span className="absolute right-1.5 top-1.5 rounded-md bg-ink/90 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-cream tabular-nums">
              −{saving}%
            </span>
          ) : null}
        </div>
        <p className="mt-2 truncate px-0.5 text-[12.5px] font-semibold tracking-tight text-ink">
          {product.name}
        </p>
        <p className="flex items-baseline gap-1.5 px-0.5 tabular-nums">
          <span className="text-[14px] font-extrabold text-ink">{formatPrice(product.price)}</span>
          {product.originalPrice ? (
            <span className="price-was text-[11.5px] font-semibold">
              {formatPrice(product.originalPrice)}
            </span>
          ) : null}
        </p>
      </Link>
    </li>
  );
}

export function ProductConveyor({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  const duration = { "--conveyor-duration": `${products.length * SECONDS_PER_ITEM}s` } as CSSProperties;

  return (
    <section aria-label="Products on the shop floor" className="conveyor">
      <div className="conveyor-rail" aria-hidden="true" />
      <div className="conveyor-viewport">
        <div className="conveyor-track" style={duration}>
          <ul className="conveyor-lane">
            {products.map((product) => (
              <BeltItem key={product.id} product={product} />
            ))}
          </ul>
          <ul className="conveyor-lane" aria-hidden="true">
            {products.map((product) => (
              <BeltItem key={product.id} product={product} hidden />
            ))}
          </ul>
        </div>
      </div>
      <div className="conveyor-rail" aria-hidden="true" />
    </section>
  );
}
