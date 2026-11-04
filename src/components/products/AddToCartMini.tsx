"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Check } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

export function AddToCartMini({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const qty = product.minOrder || 1;

  if (product.options?.length) {
    return (
      <Link
        href={`/product/${product.slug}`}
        className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-semibold text-sm text-white bg-ink hover:bg-gold hover:text-ink transition-colors"
      >
        Choose size
      </Link>
    );
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-semibold text-sm text-white bg-ink hover:bg-gold hover:text-ink transition-colors active:scale-[0.98]"
    >
      {added ? (
        <>
          <Check className="w-4 h-4" />
          Added
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4" />
          Add {qty > 1 ? `${qty} pcs` : "to Cart"}
        </>
      )}
    </button>
  );
}
