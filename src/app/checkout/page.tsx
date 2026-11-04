"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, CreditCard, ArrowLeft, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { lineTotalGbp, productImageClass } from "@/lib/product";
import { whatsappOrderNumber } from "@/data/social";
import { checkoutCreateUrl, LAST_ORDER_KEY } from "@/lib/payments";
import { VivaPayOverlay } from "@/components/payments/VivaPayOverlay";
import { SecuredByViva } from "@/components/payments/VivaBadge";
import { CheckoutLegalLinks } from "@/components/legal/LegalLinks";
import { DELIVERY_LABEL, DELIVERY_NOTE, quoteForCart } from "@/lib/shipping";

type OverlayStatus = "preparing" | "redirecting" | "error";

export default function CheckoutPage() {
  const { items, subtotal, ready } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayStatus, setOverlayStatus] = useState<OverlayStatus>("preparing");
  const [overlayMessage, setOverlayMessage] = useState("");
  const [cancelNote, setCancelNote] = useState(false);

  const delivery = quoteForCart(items);
  const shipping = delivery.price;
  const total = subtotal + shipping;

  const whatsappHref = useMemo(() => {
    const lines = items.map(
      (i) => `• ${i.product.name} × ${i.quantity} = ${formatPrice(lineTotalGbp(i.product, i.quantity))}`
    );
    const text = [
      "Hi Smoke Cali — I'd like to place an order:",
      "",
      ...lines,
      "",
      `Subtotal: ${formatPrice(subtotal)}`,
      `${DELIVERY_LABEL}: ${formatPrice(shipping)}`,
      `Total: ${formatPrice(total)}`,
    ].join("\n");
    return `https://wa.me/${whatsappOrderNumber}?text=${encodeURIComponent(text)}`;
  }, [items, subtotal, shipping, total]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "cancel") setCancelNote(true);

    // If the customer presses Back from Viva.com, the browser may restore this page with the
    // "redirecting" overlay still showing. Reset it so they can try again.
    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted) {
        setOverlayOpen(false);
        setSubmitting(false);
      }
    }
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  if (!ready) {
    return (
      <div className="py-20 text-center container-site">
        <p className="text-sm font-semibold text-surface-800/50">Loading checkout…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center container-site">
        <h1 className="font-display text-3xl font-bold text-surface-950 mb-3">Checkout</h1>
        <p className="text-surface-800/60 mb-8 max-w-md mx-auto">
          Add products to your cart first. Then enter your details here and you will be taken to
          Viva.com&apos;s secure payment page to pay by card.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-white font-semibold rounded-xl hover:bg-graphite"
        >
          Shop now
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const customer = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      address: String(form.get("address") || ""),
      city: String(form.get("city") || ""),
      postcode: String(form.get("postcode") || ""),
      notes: String(form.get("notes") || ""),
    };

    const endpoint = checkoutCreateUrl();
    if (!endpoint) {
      setOverlayOpen(true);
      setOverlayStatus("error");
      setOverlayMessage(
        "Card checkout is being connected. Please order on WhatsApp for now, or try again soon."
      );
      return;
    }

    setSubmitting(true);
    setOverlayOpen(true);
    setOverlayStatus("preparing");
    setOverlayMessage("");
    setCancelNote(false);

    const payload = {
      customerEmail: customer.email,
      notes: customer.notes,
      shippingAddress: {
        name: customer.name,
        phone: customer.phone,
        line1: customer.address,
        city: customer.city,
        postcode: customer.postcode,
      },
      // Only product IDs and quantities are sent. Prices and delivery are worked out
      // again on the server, so the total can never be chosen from the browser.
      items: items.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
      })),
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.status !== "success" || !data.url) {
        throw new Error(data.message || "Card checkout is unavailable right now.");
      }

      sessionStorage.setItem(
        LAST_ORDER_KEY,
        JSON.stringify({
          name: customer.name,
          email: customer.email,
          total: typeof data.total === "number" ? data.total : total,
          reference: data.reference || "",
          orderCode: data.orderCode || "",
        })
      );

      // Viva recommends a normal full-page redirect (not a pop-up or iframe).
      setOverlayStatus("redirecting");
      window.location.assign(data.url);
    } catch (err) {
      const networkFail = err instanceof TypeError;
      setOverlayStatus("error");
      setOverlayMessage(
        networkFail
          ? "Payment server is not running. In a second terminal run npm run checkout, then add the Viva demo credentials to cloudflare/checkout-worker/.dev.vars (see VIVA-SETUP.md)"
          : err instanceof Error
            ? err.message
            : "Could not start card checkout."
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="py-10 md:py-14">
      <VivaPayOverlay
        open={overlayOpen}
        status={overlayStatus}
        message={overlayMessage}
        onClose={() => {
          setOverlayOpen(false);
          setSubmitting(false);
        }}
      />
      <div className="container-site max-w-5xl">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm text-surface-800/60 hover:text-brand-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to cart
        </Link>

        <h1 className="font-display text-3xl font-bold text-surface-950 mb-2">Secure checkout</h1>
        <p className="mb-4 text-sm font-semibold text-surface-800/55">
          Enter your delivery details, then Pay Now takes you to Viva.com’s secure card payment page.
        </p>
        <p className="mb-8 rounded-xl border border-ink/10 bg-brand-50 px-4 py-3 text-sm font-semibold text-ink">
          18+ only — by placing an order you confirm you are aged 18 or over.
        </p>

        {cancelNote && (
          <p className="mb-6 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-800">
            Payment was cancelled. Your cart is still here whenever you&apos;re ready.
          </p>
        )}

        <div className="grid lg:grid-cols-5 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-surface-200 p-6 space-y-4 relative overflow-hidden">
              <h2 className="font-semibold text-lg relative">Delivery details</h2>
              <div className="grid sm:grid-cols-2 gap-4 relative">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                    className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1.5">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium mb-1.5">
                    Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    required
                    autoComplete="street-address"
                    className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-1.5">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    required
                    autoComplete="address-level2"
                    className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="postcode" className="block text-sm font-medium mb-1.5">
                    Postcode
                  </label>
                  <input
                    id="postcode"
                    name="postcode"
                    required
                    autoComplete="postal-code"
                    className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="notes" className="block text-sm font-medium mb-1.5">
                    Order notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gold text-ink font-bold shadow-[0_10px_26px_rgba(142,182,155,0.3)] hover:bg-brand-400 transition disabled:opacity-70"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CreditCard className="w-5 h-5" />
              )}
              {submitting ? "Opening checkout…" : "Pay Now · 18+"}
            </button>
            <p className="text-center text-xs font-semibold text-surface-800/45">
              For customers aged 18 and over. Card details are entered only on the payment page —
              never on this website. Postage is the highest item postage, charged once, and is shown above.
            </p>
            <CheckoutLegalLinks />
            <SecuredByViva tone="light" className="justify-center" />

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#1ebe57] transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Order via WhatsApp
            </a>
          </form>

          <aside className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-surface-200 p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Order summary</h2>
              <ul className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <li key={item.product.id} className="flex gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white shrink-0 ring-1 ring-black/5">
                      <Image
                        src={item.product.image}
                        alt=""
                        fill
                        sizes="56px"
                        quality={75}
                        className={productImageClass(item.product)}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium line-clamp-2">{item.product.name}</p>
                      <p className="text-xs text-surface-800/50">
                        × {item.quantity} · {formatPrice(lineTotalGbp(item.product, item.quantity))}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="space-y-2 text-sm border-t border-surface-200 pt-4">
                <div className="flex justify-between">
                  <dt className="text-surface-800/60">Subtotal</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-surface-800/60">{DELIVERY_LABEL}</dt>
                  <dd>{formatPrice(shipping)}</dd>
                </div>
                <div className="flex justify-between font-bold text-base pt-2">
                  <dt>Total</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
              </dl>
              <p className="text-xs font-bold text-brand-700 mt-3 rounded-lg bg-brand-50 px-3 py-2">
                {DELIVERY_NOTE}
              </p>
              <p className="text-xs text-surface-800/45 mt-4">
                Dispatched within 2–3 business days, then 2–3 working days with Royal Mail Tracked 48.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
