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
 * Cali Packs and stash can packs of 10 are the exceptions. Their postage is
 * not the figure stored on the product; it depends on how many of that kind
 * are in the basket:
 *   Cali Packs: £2.99 up to and including 200 packs, £3.50 when over 200.
 *   Stash can packs of 10: £2.99 for 1 to 4 packs, £3.99 for 5 or more packs.
 * Those band rates are then compared with every other item's postage.
 *
 * Basket postage is the HIGHEST single postage, charged ONCE.
 * It is not summed across lines. Quantity does not multiply a non-pack postage.
 * If every item is free delivery, postage is £0.
 *
 * After a postage or price change: rebuild the website AND redeploy the worker
 * (cd cloudflare/checkout-worker && npx wrangler deploy). Do not deploy from CI
 * unless that is explicitly requested.
 */

/** Fallback postage for any product that does not set its own. £3.99. */
export const DEFAULT_POSTAGE_PENCE = 399;

/** Cali Pack postage bands, in pence. Up to and including this many packs is the lower rate. */
export const CALI_PACK_POSTAGE_MAX_QTY = 200;
export const CALI_PACK_POSTAGE_UP_TO_PENCE = 299;
export const CALI_PACK_POSTAGE_OVER_PENCE = 350;

/** Customer-facing Cali Pack postage line. */
export const CALI_PACK_POSTAGE_LABEL =
  "Postage £2.99 up to 200 packs, £3.50 over 200 packs";

/** Stash can pack-of-10 postage bands, in pence. Up to and including this many packs is the lower rate. */
export const STASH_CAN_POSTAGE_MAX_PACKS = 4;
export const STASH_CAN_POSTAGE_UP_TO_PENCE = 299;
export const STASH_CAN_POSTAGE_OVER_PENCE = 399;

/** Customer-facing stash can pack postage line. */
export const STASH_CAN_POSTAGE_LABEL =
  "Postage £2.99, or £3.99 for 5 or more packs";

export const DELIVERY_SERVICE = "Evri tracked delivery";

/** Shown beside the postage total. Postage is not calculated from weight. */
export const POSTAGE_RULE =
  "Cali Packs are postage £2.99 up to 200 packs in the order, and £3.50 over 200 packs. Stash can packs of 10 are postage £2.99, or £3.99 if you order 5 or more packs. Every other product shows its own UK postage, or free UK delivery. When you order several items you pay the highest postage once. If every item includes free delivery, postage is £0.";

/**
 * Postage in pence for one non-pack line. Missing or non-numeric values use the default.
 * 0 is free delivery and must be kept as 0.
 */
export function linePostagePence(postagePence) {
  if (postagePence == null || postagePence === "") return DEFAULT_POSTAGE_PENCE;
  const n = Number(postagePence);
  if (!Number.isFinite(n)) return DEFAULT_POSTAGE_PENCE;
  return Math.max(0, Math.round(n));
}

/** One Cali Pack postage for the whole basket, from the total number of packs. */
export function caliPackPostagePence(totalPacks) {
  const qty = Math.floor(Number(totalPacks) || 0);
  if (qty < 1) return 0;
  return qty <= CALI_PACK_POSTAGE_MAX_QTY
    ? CALI_PACK_POSTAGE_UP_TO_PENCE
    : CALI_PACK_POSTAGE_OVER_PENCE;
}

/** One stash can pack postage for the whole basket, from the total number of packs of 10. */
export function stashCanPostagePence(totalPacks) {
  const qty = Math.floor(Number(totalPacks) || 0);
  if (qty < 1) return 0;
  return qty <= STASH_CAN_POSTAGE_MAX_PACKS
    ? STASH_CAN_POSTAGE_UP_TO_PENCE
    : STASH_CAN_POSTAGE_OVER_PENCE;
}

/**
 * Basket postage in pence.
 * Lines with `caliPack: true` are counted together and charged the Cali Pack band,
 * not their stored postagePence. Lines with `stashCan: true` are counted together
 * and charged the stash can pack band. The result is the highest postage, once.
 * The existing Candy Stash Cans (sold each) are ordinary items, not stashCan packs.
 * @param {Array<{ postagePence?: number, quantity?: number, caliPack?: boolean, stashCan?: boolean }>|null|undefined} items
 * @returns {number}
 */
export function quotePostagePence(items) {
  let highest = 0;
  let seen = false;
  let packQty = 0;
  let canPackQty = 0;
  for (const item of items || []) {
    const qty = Math.floor(Number(item && item.quantity) || 0);
    if (qty < 1) continue;
    seen = true;
    if (item && item.caliPack) {
      packQty += qty;
      continue;
    }
    if (item && item.stashCan) {
      canPackQty += qty;
      continue;
    }
    const pence = linePostagePence(item.postagePence);
    if (pence > highest) highest = pence;
  }
  const packPostage = caliPackPostagePence(packQty);
  if (packPostage > highest) highest = packPostage;
  const canPostage = stashCanPostagePence(canPackQty);
  if (canPostage > highest) highest = canPostage;
  return seen ? highest : 0;
}
