"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { bulkSavingGbp, lineTotalGbp, packOfferText, productImageClass, productUnit, unitPriceGbp } from "@/lib/product";
import { PayNowButton } from "@/components/payments/PayNowButton";
import { DELIVERY_LABEL, DELIVERY_NOTE, quoteForCart } from "@/lib/shipping";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart, ready } = useCart();

  if (!ready) {
    return (
      <div className="py-20 text-center container-site">
        <p className="text-sm font-semibold text-surface-800/50">Loading cart…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20">
        <div className="container-site text-center">
          <div className="w-16 h-16 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8 text-surface-800/40" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 mb-2">Your cart is empty</h1>
          <p className="text-surface-800/60 mb-8">
            Browse our products and add items to get started.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-white font-semibold rounded-xl hover:bg-graphite transition-colors"
          >
            Shop Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const delivery = quoteForCart(items);
  const shipping = delivery.price;
  const total = subtotal + shipping;

  return (
    <div className="py-8 md:py-12">
      <div className="container-site">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-surface-900 tracking-tight">
            Shopping Cart
          </h1>
          <button
            type="button"
            onClick={clearCart}
            className="text-sm text-surface-800/40 hover:text-red-600 transition-colors"
          >
            Clear cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-4 bg-white rounded-xl border border-surface-200"
              >
                <Link
                  href={`/product/${item.product.slug}`}
                  className="relative w-24 h-24 rounded-lg overflow-hidden bg-white flex-shrink-0 ring-1 ring-black/5"
                >
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    sizes="96px"
                    quality={75}
                    className={productImageClass(item.product)}
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="font-medium text-sm text-surface-900 hover:text-brand-700 line-clamp-2"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-surface-800/60 mt-1">
                    {formatPrice(unitPriceGbp(item.product, item.quantity))} {productUnit(item.product)}
                    {item.product.minOrder && item.product.minOrder > 1
                      ? ` · min ${item.product.minOrder} pcs`
                      : ""}
                  </p>
                  {packOfferText(item.product) ? (
                    <p className="text-xs font-bold text-ink mt-1">{packOfferText(item.product)}</p>
                  ) : null}
                  {bulkSavingGbp(item.product, item.quantity) > 0 ? (
                    <p className="text-xs font-bold text-brand-700 mt-0.5">
                      You save {formatPrice(bulkSavingGbp(item.product, item.quantity))}
                    </p>
                  ) : null}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-surface-200 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - 1 < (item.product.minOrder || 1)
                              ? item.product.minOrder || 1
                              : item.quantity - 1
                          )
                        }
                        className="p-2 hover:bg-surface-100 transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1.5 text-sm font-medium min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-2 hover:bg-surface-100 transition-colors"
                        aria-label="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-sm">
                        {formatPrice(lineTotalGbp(item.product, item.quantity))}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="p-1.5 text-surface-800/40 hover:text-red-600 transition-colors"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-surface-200 p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-surface-800/60">Subtotal</dt>
                  <dd className="font-medium">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-surface-800/60">{DELIVERY_LABEL}</dt>
                  <dd className="font-medium">{formatPrice(shipping)}</dd>
                </div>
              </dl>
              <p className="text-xs font-bold text-brand-700 bg-brand-50 rounded-lg p-2 mt-3">
                {DELIVERY_NOTE}
              </p>
              <div className="border-t border-surface-200 pt-3 flex justify-between text-sm">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">{formatPrice(total)}</span>
              </div>
              <PayNowButton href="/checkout" className="mt-6" />
              <Link
                href="/shop"
                className="block text-center text-sm text-brand-700 hover:underline mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
