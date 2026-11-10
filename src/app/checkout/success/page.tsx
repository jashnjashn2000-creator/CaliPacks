"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { checkoutVerifyUrl, LAST_ORDER_KEY } from "@/lib/payments";
import { contactInfo } from "@/data/social";
import { TrustpilotLink } from "@/components/layout/TrustpilotLink";

interface LastOrder {
  name?: string;
  email?: string;
  total?: number;
  reference?: string;
  orderCode?: string;
}

type Result =
  | { kind: "checking" }
  | { kind: "paid"; reference: string; total: number }
  | { kind: "pending"; reference: string }
  | { kind: "check"; reference: string }
  | { kind: "unconfirmed" };

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const [order, setOrder] = useState<LastOrder | null>(null);
  const [result, setResult] = useState<Result>({ kind: "checking" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Viva adds ?t=<transaction id>&s=<order code> when it sends the customer back.
    const transactionId = params.get("t") || "";
    const orderCode = params.get("s") || "";

    let last: LastOrder | null = null;
    try {
      const raw = sessionStorage.getItem(LAST_ORDER_KEY);
      if (raw) last = JSON.parse(raw) as LastOrder;
    } catch {
      // ignore
    }
    setOrder(last);

    // The page address alone proves nothing, so ask our server to check with Viva.
    const endpoint = transactionId ? checkoutVerifyUrl(transactionId, orderCode) : "";
    if (!endpoint) {
      setResult({ kind: "unconfirmed" });
      return;
    }

    let cancelled = false;
    fetch(endpoint)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const reference = String(data.reference || last?.reference || "");
        if (data.status === "success" && data.paymentStatus === "paid") {
          setResult({ kind: "paid", reference, total: Number(data.total) || last?.total || 0 });
          clearCart();
          try {
            sessionStorage.removeItem(LAST_ORDER_KEY);
          } catch {
            // ignore
          }
        } else if (data.status === "success" && data.paymentStatus === "pending") {
          setResult({ kind: "pending", reference });
        } else if (data.status === "success" && data.paymentStatus === "check") {
          setResult({ kind: "check", reference });
        } else {
          setResult({ kind: "unconfirmed" });
        }
      })
      .catch(() => {
        if (!cancelled) setResult({ kind: "unconfirmed" });
      });
    return () => {
      cancelled = true;
    };
  }, [clearCart]);

  const name = order?.name ? `, ${order.name}` : "";

  return (
    <div className="py-20">
      <div className="container-site max-w-lg text-center">
        {result.kind === "checking" && (
          <>
            <Loader2 className="mx-auto mb-6 h-10 w-10 animate-spin text-brand-700" />
            <h1 className="font-display text-2xl font-bold text-surface-950 mb-2">
              Confirming your payment…
            </h1>
            <p className="text-surface-800/60">Please wait a moment while we check with Viva.com.</p>
          </>
        )}

        {result.kind === "paid" && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-ink ring-1 ring-gold/50">
              <CheckCircle2 className="h-9 w-9 text-gold" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-700">
              Payment confirmed by Viva.com
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold text-surface-950 mb-3">Order received</h1>
            <p className="text-surface-800/60 mb-2">Thanks{name}! Your Smoke Cali order is paid.</p>
            <p className="text-sm text-surface-800/50 mb-6">
              {result.reference && (
                <>
                  Order reference <strong>{result.reference}</strong>.{" "}
                </>
              )}
              Total paid <strong>{formatPrice(result.total)}</strong>. Dispatch within 2–3 business days.
            </p>
          </>
        )}

        {result.kind === "pending" && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-ink ring-1 ring-gold/50">
              <Clock className="h-9 w-9 text-gold" />
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold text-surface-950 mb-3">
              Payment processing
            </h1>
            <p className="text-surface-800/60 mb-6">
              Your payment is still being confirmed by your bank or payment method. We will only
              dispatch once it is confirmed. Your basket has been kept in case you need to try again.
              {result.reference && (
                <>
                  {" "}
                  Reference <strong>{result.reference}</strong>.
                </>
              )}
            </p>
          </>
        )}

        {result.kind === "check" && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-ink ring-1 ring-gold/50">
              <AlertTriangle className="h-9 w-9 text-gold" />
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold text-surface-950 mb-3">
              We&apos;re checking your order
            </h1>
            <p className="text-surface-800/60 mb-6">
              Your payment went through but we want to double-check the order total. Please message us
              on WhatsApp on {contactInfo.phone}
              {result.reference ? ` quoting ${result.reference}` : ""} and we will sort it out.
            </p>
          </>
        )}

        {result.kind === "unconfirmed" && (
          <>
            <h1 className="mt-2 font-display text-3xl font-bold text-surface-950 mb-3">Checkout</h1>
            <p className="text-surface-800/60 mb-6">
              We couldn&apos;t confirm a payment from this page. If you have just paid, give it a moment
              and check your email for a Viva.com receipt. Your basket is still here if payment
              wasn&apos;t finished. Need help? WhatsApp us on {contactInfo.phone}.
            </p>
          </>
        )}

        {result.kind !== "checking" && (
          <div className="flex flex-col items-center gap-6">
            <Link
              href={result.kind === "paid" ? "/shop/" : "/checkout/"}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-ink text-white font-semibold rounded-xl hover:bg-graphite transition-colors"
            >
              {result.kind === "paid" ? "Continue shopping" : "Return to checkout"}
              <ArrowRight className="w-4 h-4" />
            </Link>
            {result.kind === "paid" && <TrustpilotLink tone="light" />}
          </div>
        )}
      </div>
    </div>
  );
}
