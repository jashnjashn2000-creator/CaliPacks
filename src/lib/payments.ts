import { SITE_URL } from "@/lib/site";

const fromEnv = (process.env.NEXT_PUBLIC_CHECKOUT_API_URL || "").replace(/\/$/, "");

/**
 * Cloudflare Worker that creates Viva.com Smart Checkout payment orders and verifies payments.
 * No secret keys or prices are decided in the browser.
 */
export const CHECKOUT_API_URL =
  fromEnv || (process.env.NODE_ENV === "development" ? "http://127.0.0.1:8787" : "");

export const vivaCheckoutReady = Boolean(CHECKOUT_API_URL);

export function checkoutCreateUrl() {
  if (!CHECKOUT_API_URL) return "";
  return `${CHECKOUT_API_URL}/api/checkout/create`;
}

/** Asks the worker to confirm a payment with Viva (transaction ID `t` from Viva's redirect). */
export function checkoutVerifyUrl(transactionId: string, orderCode: string) {
  if (!CHECKOUT_API_URL) return "";
  const params = new URLSearchParams({ t: transactionId });
  if (orderCode) params.set("s", orderCode);
  return `${CHECKOUT_API_URL}/api/checkout/verify?${params.toString()}`;
}

/** Where Viva sends customers after paying. Set the same URLs on the Viva payment source. */
export const paymentSuccessPath = `${SITE_URL}/checkout/success/`;
export const paymentFailurePath = `${SITE_URL}/checkout/failed/`;

/** Browser storage key for the last order summary (name, email, total, reference). */
export const LAST_ORDER_KEY = "calipacks-last-order";
