/**
 * SMOKE CALI — UK POSTAGE (single source of truth for the rule)
 * -------------------------------------------------------------
 * Used by BOTH the website (cart/checkout display, via src/lib/shipping.ts)
 * and the Cloudflare checkout worker (which charges the customer through Viva.com).
 *
 * Each product has its own postage in GBP (stored as postagePence on the worker
 * catalog, generated from src/data). Products with no postage set use
 * DEFAULT_POSTAGE_PENCE (£3.99). Postage of 0 means free UK delivery.
 *
 * Basket postage is the HIGHEST single item postage, charged ONCE.
 * It is not summed across lines and it is not multiplied by quantity.
 * If every item is free delivery, postage is £0.
 *
 * After a postage or price change: rebuild the website AND redeploy the worker
 * (cd cloudflare/checkout-worker && npx wrangler deploy). Do not deploy from CI
 * unless that is explicitly requested.
 */

/** Fallback postage for any product that does not set its own. £3.99. */
export const DEFAULT_POSTAGE_PENCE = 399;

export const DELIVERY_SERVICE = "Royal Mail Tracked 48";

/** Shown beside the postage total. Postage is not calculated from weight. */
export const POSTAGE_RULE =
  "Each product shows its own UK postage. When you order several items you pay the highest postage once. If every item includes free delivery, postage is £0.";

/**
 * Postage in pence for one line. Missing or non-numeric values use the default.
 * 0 is free delivery and must be kept as 0.
 */
export function linePostagePence(postagePence) {
  if (postagePence == null || postagePence === "") return DEFAULT_POSTAGE_PENCE;
  const n = Number(postagePence);
  if (!Number.isFinite(n)) return DEFAULT_POSTAGE_PENCE;
  return Math.max(0, Math.round(n));
}

/**
 * Basket postage in pence.
 * @param {Array<{ postagePence?: number, quantity?: number }>|null|undefined} items
 * @returns {number}
 */
export function quotePostagePence(items) {
  let highest = 0;
  let seen = false;
  for (const item of items || []) {
    const qty = Math.floor(Number(item && item.quantity) || 0);
    if (qty < 1) continue;
    seen = true;
    const pence = linePostagePence(item.postagePence);
    if (pence > highest) highest = pence;
  }
  return seen ? highest : 0;
}
