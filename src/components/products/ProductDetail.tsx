"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
  bundleSavingLabel,
  flattenOption,
  isCaliPack,
  isIceCup,
  isStashCanPack,
  packOfferText,
  productImageClass,
  productUnit,
  savingAmountGbp,
  savingPercent,
} from "@/lib/product";
import { DELIVERY_NOTE, caliPackPostageLabel, iceCupPostageLabel, nextDayDeliveryFromLine, nextDayPostageTiers, postageLabel, productPostageGbp, standardBagPostageTiers, standardDeliveryFromLine, stashCanPostageLabel } from "@/lib/shipping";
import { CALI_PACK_DEAL_BULLET, ZIPPER_BOX_DEAL_BULLET, isGripSealZipperBox, priceCartItems, projectAdd } from "@/lib/pricing";
import { useCart } from "@/context/CartContext";
import { ProductTrustpilotBadge } from "@/components/layout/TrustpilotLink";

interface ProductPurchaseProps {
  product: Product;
  optionId?: string;
  onOptionId?: (id: string) => void;
}

/** Price, postage, size/bundle picker and add to cart. Postage follows the selected option. */
export function ProductPurchase({ product, optionId, onOptionId }: ProductPurchaseProps) {
  const options = product.options ?? [];
  const [localOptionId, setLocalOptionId] = useState(options[0]?.id ?? product.id);
  const currentOptionId = optionId ?? localOptionId;
  const selectOption = (id: string) => {
    setLocalOptionId(id);
    onOptionId?.(id);
  };
  const selected = options.find((o) => o.id === currentOptionId) ?? options[0];
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
        {isCaliPack(product)
          ? caliPackPostageLabel
          : isStashCanPack(product)
            ? stashCanPostageLabel
            : isIceCup(product)
              ? iceCupPostageLabel
              : postageLabel(postage)}
      </p>
      <p className="mb-2 text-xs font-semibold text-surface-800/50">SKU {selling.sku}</p>
      {packOfferText(selling) ? (
        <p className="mb-2 text-sm font-bold text-ink">{packOfferText(selling)}</p>
      ) : null}
      <OrderDealBullets product={selling} />
      <p className="mb-6 text-xs font-semibold leading-relaxed text-graphite/70">{DELIVERY_NOTE}</p>

      {options.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold text-ink">
            {(product.tags || []).includes("colour-options") ? "Choose a colour" : "Choose an option"}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {options.map((option) => {
              const active = option.id === selling.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => selectOption(option.id)}
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
  const { addItem, items } = useCart();
  const min = product.minOrder || 1;
  const [quantity, setQuantity] = useState(min);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const projected = priceCartItems(projectAdd(items, product, quantity));
  const charged = projected.lines.find((line) => line.id === product.id);
  const listPence = Math.round(product.price * 100);
  const unitPence = charged?.unitPence ?? listPence;
  const basePence = charged?.baseUnitPence ?? unitPence;
  const unit = unitPence / 100;
  const total = (unitPence * quantity) / 100;
  const dealSaving = Math.max(0, basePence - unitPence) * quantity / 100;
  const bulkSaving = Math.max(0, listPence - basePence) * quantity / 100;
  const saving = dealSaving > 0 ? dealSaving : bulkSaving;

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
          {isStashCanPack(product) || isIceCup(product) ? (
            <span className="mr-3 font-bold text-brand-700">Minimum 10 cans (1 pack)</span>
          ) : min > 1 ? (
            <span className="mr-3 font-bold text-brand-700">Min. {min} pcs</span>
          ) : null}
          {formatPrice(unit)} {productUnit(product)} · Total:{" "}
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
      {isCaliPack(product) ? <BagDeliveryDetails /> : null}
      <ProductTrustpilotBadge />
    </div>
  );
}

function OrderDealBullets({ product }: { product: Product }) {
  const bullets = [
    isCaliPack(product) ? CALI_PACK_DEAL_BULLET : "",
    isGripSealZipperBox(product) ? ZIPPER_BOX_DEAL_BULLET : "",
  ].filter(Boolean);
  if (!bullets.length) return null;
  return (
    <ul className="mb-4 list-disc space-y-1 pl-5 text-sm font-semibold text-ink">
      {bullets.map((bullet) => (
        <li key={bullet}>{bullet}</li>
      ))}
    </ul>
  );
}

/** Two short delivery lines, plus the tier list, under Add to basket on bag pages. */
function BagDeliveryDetails() {
  return (
    <div className="text-sm font-semibold text-ink">
      <p>{standardDeliveryFromLine}</p>
      <p>{nextDayDeliveryFromLine}</p>
      <details className="mt-1">
        <summary className="cursor-pointer text-xs font-bold text-brand-800">See delivery prices</summary>
        <p className="mt-2 text-xs font-bold text-ink">Standard</p>
        <ul className="mt-1 list-disc space-y-0.5 pl-5 text-xs font-medium text-ink/80">
          {standardBagPostageTiers.map((tier) => (
            <li key={tier.label}>{tier.label}: {tier.price}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs font-bold text-ink">Next day</p>
        <ul className="mt-1 list-disc space-y-0.5 pl-5 text-xs font-medium text-ink/80">
          {nextDayPostageTiers.map((tier) => (
            <li key={tier.label}>{tier.label}: {tier.price}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}

interface ProductColumnsProps {
  product: Product;
  children: ReactNode;
}

/** Gallery follows the chosen colour or size. The title stays the product name. */
export function ProductColumns({ product, children }: ProductColumnsProps) {
  const options = product.options ?? [];
  const [optionId, setOptionId] = useState(options[0]?.id ?? product.id);
  const selected = options.find((option) => option.id === optionId) ?? options[0];
  const galleryImages = selected?.images?.length
    ? selected.images
    : product.images.length
      ? product.images
      : [product.image];
  const galleryProduct: Product = {
    ...product,
    image: galleryImages[0] || product.image,
    images: galleryImages,
  };

  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
      <ProductGallery key={galleryImages.join("|")} product={galleryProduct} />
      <div>
        {product.isNew && (
          <span className="inline-block px-2.5 py-1 bg-ink text-brand-300 text-[10px] font-bold uppercase tracking-[0.18em] rounded-full mb-3">
            New Arrival
          </span>
        )}
        <h1 className="font-serif text-3xl md:text-[2.6rem] font-normal leading-tight tracking-tight mb-4 text-ink">
          {product.name}
        </h1>
        <ProductPurchase product={product} optionId={optionId} onOptionId={setOptionId} />
        {children}
      </div>
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
