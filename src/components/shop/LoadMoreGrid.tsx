"use client";

import { useEffect, useMemo, useState } from "react";
import { Product } from "@/types";
import { ProductGrid } from "@/components/products/ProductGrid";

const PAGE_SIZE = 24;

export function LoadMoreGrid({ products }: { products: Product[] }) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [products]);

  const visibleCount = Math.min(products.length, page * PAGE_SIZE);
  const visible = useMemo(
    () => products.slice(0, visibleCount),
    [products, visibleCount]
  );
  const hasMore = visibleCount < products.length;

  return (
    <>
      <ProductGrid products={visible} eagerCount={page === 1 ? 2 : 0} />
      {hasMore && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white transition hover:bg-graphite"
          >
            Load more
          </button>
          <p className="mt-2 text-xs font-semibold text-black/45">
            {products.length - visibleCount} more items
          </p>
        </div>
      )}
    </>
  );
}
