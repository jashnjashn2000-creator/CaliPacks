"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
  bulkSavingGbp,
  bundleSavingLabel,
  flattenOption,
  isCaliPack,
  lineTotalGbp,
  packOfferText,
  productImageClass,
  productUnit,
  savingAmountGbp,
  savingPercent,
  unitPriceGbp,
} from "@/lib/product";
import { DELIVERY_NOTE, caliPackPostageLabel, postageLabel, productPostageGbp } from "@/lib/shipping";
import { useCart } from "@/context/CartContext";

interface ProductPurchaseProps {
  product: Product;
}

/** Price, postage, size/bundle picker and add to cart. Postage follows the selected option. */
export function ProductPurchase({ product }: ProductPurchaseProps) {
  const options = product.options ?? [];
  const [optionId, setOptionId] = useState(options[0]?.id ?? product.id);
  const selected = options.find((o) => o.id === optionId) ?? options[0];
  const selling = selected ? flattenOption(product, selected) : product;
  const postage = productPostageGbp(selling);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-3 tabular-nums">
        <span className="text-2xl font-extrabold text-ink">{formatPrice(selling.price)}</span>
        {selling.originalPrice ? (
          <span className="price-was text-lg font-semibold">{formatPrice(selling.originalPrice)}</span>
        ) : null}
        <span className="text-sm text-brand-700 font-bold">{productUnit(selling)}</span>
        {bundleSavingLabel(selling) ? (
          <span className="save-tag">{bundleSavingLabel(selling)}</span>
        ) : savingPercent(selling) ? (
          <span className="save-tag">Save {savingPercent(selling)}%</span>
        ) : null}
      </div>
      <p className="mb-2 text-sm font-bold text-brand-800">
        {isCaliPack(product) ? caliPackPostageLabel : postageLabel(postage)}
      </p>
      <p className="mb-2 text-xs font-semibold text-surface-800/50">SKU {selling.sku}</p>
      {packOfferText(selling) ? (
        <p className="mb-4 text-sm font-bold text-ink">{packOfferText(selling)}</p>
      ) : null}
      <p className="mb-6 text-xs font-semibold leading-relaxed text-graphite/70">{DELIVERY_NOTE}</p>

      {options.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold text-ink">Choose an option</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {options.map((option) => {
              const active = option.id === selling.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setOptionId(option.id)}
                  aria-pressed={active}
                  className={`rounded-xl border px-3 py-3 text-left transition-colors ${
                    active ? "border-ink bg-brand-50" : "border-surface-200 bg-white hover:border-ink/30"
                  }`}
                >
                  <span className="block text-sm font-bold text-ink">{option.label}</span>
                  <span className="mt-0.5 block text-sm font-semibold tabular-nums text-ink">
                    {formatPrice(option.price)}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-bold text-brand-800">
                    {postageLabel(option.postage)}
                  </span>
                  {savingAmountGbp(option.price, option.originalPrice) > 0 ? (
                    <span className="mt-0.5 block text-[11px] font-bold text-brand-800">
                      Save {formatPrice(savingAmountGbp(option.price, option.originalPrice))}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <AddToCartButton product={selling} />
    </div>
  );
}

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const min = product.minOrder || 1;
  const [quantity, setQuantity] = useState(min);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const total = lineTotalGbp(product, quantity);
  const saving = bulkSavingGbp(product, quantity);
  const unit = unitPriceGbp(product, quantity);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center border border-surface-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(min, quantity - 1))}
            className="p-3 hover:bg-surface-100 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 py-3 font-medium text-sm min-w-[4rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-3 hover:bg-surface-100 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-surface-800/60">
          {min > 1 ? (
            <span className="mr-3 font-bold text-brand-700">Min. {min} pcs</span>
          ) : null}
          {formatPrice(unit)} each · Total:{" "}
          <span className="font-semibold text-surface-900">{formatPrice(total)}</span>
          {saving > 0 ? (
            <span className="ml-2 font-bold text-brand-700">You save {formatPrice(saving)}</span>
          ) : null}
        </p>
      </div>

      <button
        onClick={handleAdd}
        disabled={!product.inStock}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-ink text-white font-semibold rounded-xl hover:bg-gold hover:text-ink disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {added ? (
          <>
            <Check className="w-5 h-5" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);
  const images = Array.from(
    new Set(
      (product.images.length > 0 ? product.images : [product.image]).filter(Boolean)
    )
  );

  return (
    <div className="space-y-4">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-white ring-1 ring-black/5 shadow-[0_10px_30px_rgba(5,31,32,0.06)]">
        <Image
          src={images[activeImage]}
          alt={product.name}
          fill
          sizes="(max-width: 1024px) 100vw, 480px"
          className={productImageClass(product)}
          priority
          quality={88}
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`relative w-20 h-20 rounded-lg overflow-hidden bg-white border-2 transition-colors ${
                i === activeImage ? "border-gold" : "border-black/5"
              }`}
            >
              <Image src={img} alt="" fill sizes="80px" quality={70} loading="lazy" className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
