/**
 * SMOKE CALI — ORDER DEALS (single source of truth)
 * -------------------------------------------------
 * Used by the checkout worker (server-side price) and the website
 * (cart, checkout, and the price shown on the product).
 * Amounts are whole pence. A deal never raises a price.
 *
 * Cali Packs: when the order has MORE than 120 bags, counted the same
 * way postage counts packs, every bag is £0.18. A bag already at or
 * below £0.18 stays at that lower price. The £0.22 / £0.20 line prices
 * still apply when the order has 120 bags or fewer.
 *
 * Grip seal zipper boxes: 5% off each box when the order has 3 or more
 * boxes. Sizes and colours can be mixed. Puff bags are not included.
 * 5% is rounded to the nearest penny, and the result is never above
 * the box price.
 */

/** Deal starts above this many bags. 121 bags qualifies. 120 does not. */
export const CALI_PACK_DEAL_OVER = 120;
export const CALI_PACK_DEAL_PENCE = 18;
export const CALI_PACK_DEAL_BULLET = "Order 121+ bags: just £0.18 each";

export const ZIPPER_BOX_DEAL_MIN = 3;
export const ZIPPER_BOX_DEAL_PERCENT = 5;
export const ZIPPER_BOX_DEAL_BULLET = "3 or more boxes: 5% off each box";

export function caliPackDealApplies(totalBags) {
  return Math.floor(Number(totalBags) || 0) > CALI_PACK_DEAL_OVER;
}

export function zipperBoxDealApplies(totalBoxes) {
  return Math.floor(Number(totalBoxes) || 0) >= ZIPPER_BOX_DEAL_MIN;
}

/** Percent off, nearest penny, never above the starting price. */
export function percentOffPence(unitPence, percent) {
  const unit = Math.max(0, Math.round(Number(unitPence) || 0));
  const pct = Number(percent);
  if (!Number.isFinite(pct) || pct <= 0) return unit;
  const discounted = Math.round((unit * (100 - pct)) / 100);
  return Math.min(unit, Math.max(0, discounted));
}

/**
 * Prices every line after order deals.
 * `pricePence` is the catalogue unit. `bulkPricePence` replaces it when
 * this line's own quantity reaches `bulkMinQty` (the existing 50+ bag price).
 * Order deals are applied after that, and only ever reduce the unit.
 *
 * @param {Array<{ id?: string, quantity?: number, pricePence: number, bulkPricePence?: number, bulkMinQty?: number, caliPack?: boolean, zipperBox?: boolean }>|null|undefined} lines
 */
export function priceLinesPence(lines) {
  const prepared = [];
  for (const line of lines || []) {
    const quantity = Math.floor(Number(line && line.quantity) || 0);
    if (quantity < 1) continue;
    const pricePence = Math.max(0, Math.round(Number(line.pricePence) || 0));
    let baseUnitPence = pricePence;
    if (
      line.bulkPricePence != null &&
      line.bulkMinQty != null &&
      quantity >= Math.floor(Number(line.bulkMinQty) || 0)
    ) {
      baseUnitPence = Math.max(0, Math.round(Number(line.bulkPricePence) || 0));
    }
    prepared.push({
      id: line.id,
      quantity,
      pricePence,
      baseUnitPence,
      caliPack: line.caliPack === true,
      zipperBox: line.zipperBox === true,
    });
  }

  const totalBags = prepared.reduce((sum, line) => sum + (line.caliPack ? line.quantity : 0), 0);
  const totalZipperBoxes = prepared.reduce((sum, line) => sum + (line.zipperBox ? line.quantity : 0), 0);
  const bagsDeal = caliPackDealApplies(totalBags);
  const zipperDeal = zipperBoxDealApplies(totalZipperBoxes);

  let subtotalPence = 0;
  let bagSavingPence = 0;
  let zipperSavingPence = 0;
  const priced = prepared.map((line) => {
    let unitPence = line.baseUnitPence;
    if (line.caliPack && bagsDeal) unitPence = Math.min(unitPence, CALI_PACK_DEAL_PENCE);
    if (line.zipperBox && zipperDeal) unitPence = percentOffPence(unitPence, ZIPPER_BOX_DEAL_PERCENT);
    const linePence = unitPence * line.quantity;
    const dealSavingPence = Math.max(0, line.baseUnitPence * line.quantity - linePence);
    if (line.caliPack) bagSavingPence += dealSavingPence;
    if (line.zipperBox) zipperSavingPence += dealSavingPence;
    subtotalPence += linePence;
    return {
      id: line.id,
      quantity: line.quantity,
      pricePence: line.pricePence,
      baseUnitPence: line.baseUnitPence,
      unitPence,
      linePence,
      dealSavingPence,
      caliPack: line.caliPack,
      zipperBox: line.zipperBox,
    };
  });

  return {
    lines: priced,
    subtotalPence,
    bagSavingPence,
    zipperSavingPence,
    totalBags,
    totalZipperBoxes,
    bagsDeal,
    zipperDeal,
  };
}
