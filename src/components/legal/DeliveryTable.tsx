import { deliveryService, DELIVERY_NOTE } from "@/lib/shipping";

/** How UK postage is worked out. Amounts are shown on each product, not by weight. */
export function DeliveryTable() {
  return (
    <section aria-labelledby="delivery-rates" className="mt-8 space-y-6 text-surface-800/80">
      <div>
        <h2 id="delivery-rates" className="text-xl font-semibold text-surface-900 mb-3">
          UK postage
        </h2>
        <p className="text-sm mb-4">
          {DELIVERY_NOTE}
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-50 text-surface-900">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Your basket</th>
                <th scope="col" className="px-4 py-3 font-semibold">Service</th>
                <th scope="col" className="px-4 py-3 font-semibold">Estimated delivery</th>
                <th scope="col" className="px-4 py-3 font-semibold text-right">Postage you pay</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-surface-200">
                <td className="px-4 py-3 font-medium text-surface-900">Cali Packs, up to 200 packs in the order</td>
                <td className="px-4 py-3">{deliveryService}</td>
                <td className="px-4 py-3">Usually 2–3 working days after dispatch</td>
                <td className="px-4 py-3 text-right font-semibold text-surface-900">£2.99</td>
              </tr>
              <tr className="border-t border-surface-200">
                <td className="px-4 py-3 font-medium text-surface-900">Cali Packs, over 200 packs in the order</td>
                <td className="px-4 py-3">{deliveryService}</td>
                <td className="px-4 py-3">Usually 2–3 working days after dispatch</td>
                <td className="px-4 py-3 text-right font-semibold text-surface-900">£3.50</td>
              </tr>
              <tr className="border-t border-surface-200">
                <td className="px-4 py-3 font-medium text-surface-900">Stash can packs of 10, 1 to 4 packs in the order</td>
                <td className="px-4 py-3">{deliveryService}</td>
                <td className="px-4 py-3">Usually 2–3 working days after dispatch</td>
                <td className="px-4 py-3 text-right font-semibold text-surface-900">£2.99</td>
              </tr>
              <tr className="border-t border-surface-200">
                <td className="px-4 py-3 font-medium text-surface-900">Ice cream cup cans, up to 40 cups in the order</td>
                <td className="px-4 py-3">{deliveryService}</td>
                <td className="px-4 py-3">Usually 2–3 working days after dispatch</td>
                <td className="px-4 py-3 text-right font-semibold text-surface-900">£2.99</td>
              </tr>
              <tr className="border-t border-surface-200">
                <td className="px-4 py-3 font-medium text-surface-900">Ice cream cup cans, above 40 cups in the order</td>
                <td className="px-4 py-3">{deliveryService}</td>
                <td className="px-4 py-3">Usually 2–3 working days after dispatch</td>
                <td className="px-4 py-3 text-right font-semibold text-surface-900">£3.50</td>
              </tr>
              <tr className="border-t border-surface-200">
                <td className="px-4 py-3 font-medium text-surface-900">Stash can packs of 10, 5 or more packs in the order</td>
                <td className="px-4 py-3">{deliveryService}</td>
                <td className="px-4 py-3">Usually 2–3 working days after dispatch</td>
                <td className="px-4 py-3 text-right font-semibold text-surface-900">£3.99</td>
              </tr>
              <tr className="border-t border-surface-200">
                <td className="px-4 py-3 font-medium text-surface-900">One other product</td>
                <td className="px-4 py-3">{deliveryService}</td>
                <td className="px-4 py-3">Usually 2–3 working days after dispatch</td>
                <td className="px-4 py-3 text-right font-semibold text-surface-900">The postage shown on that product</td>
              </tr>
              <tr className="border-t border-surface-200">
                <td className="px-4 py-3 font-medium text-surface-900">Several products</td>
                <td className="px-4 py-3">{deliveryService}</td>
                <td className="px-4 py-3">Usually 2–3 working days after dispatch</td>
                <td className="px-4 py-3 text-right font-semibold text-surface-900">The highest postage, charged once</td>
              </tr>
              <tr className="border-t border-surface-200">
                <td className="px-4 py-3 font-medium text-surface-900">Every item includes free delivery</td>
                <td className="px-4 py-3">{deliveryService}</td>
                <td className="px-4 py-3">Usually 2–3 working days after dispatch</td>
                <td className="px-4 py-3 text-right font-semibold text-surface-900">£0.00</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm">
          Postage is <strong>not</strong> added up across items. Buying more of the same non-pack item does not
          increase its postage. Cali Pack postage depends on the total number of packs in the order: £2.99 up
          to and including 200 packs, £3.50 over 200 packs. Stash can packs of 10 are postage £2.99, or £3.99
          if you order 5 or more packs. You still pay only the highest postage once.
          Each other product page shows either a postage price or &ldquo;Free UK delivery&rdquo;.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-surface-900 mb-2">Next working day (usually)</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Bag orders only.</li>
          <li>£4.99 for 1–4 packs.</li>
          <li>£5.99 for 5 or more packs.</li>
          <li>Order by 10am, Monday to Friday.</li>
          <li>Not available if the basket includes other products.</li>
          <li>Not a guaranteed service.</li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-surface-900 mb-2">Dispatch</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>In-stock orders are dispatched within 2–3 business days (Monday to Friday, excluding UK bank holidays).</li>
          <li>Orders placed after 2pm, at weekends or on bank holidays are processed from the next business day.</li>
          <li>You&apos;ll receive a tracking link by email as soon as your order ships.</li>
          <li>Delivery times are estimates from Evri and may be longer during busy periods.</li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-surface-900 mb-2">Good to know</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>We currently deliver to UK addresses only.</li>
          <li>Custom printed orders are produced in 5–7 business days after design approval, then dispatched as above.</li>
          <li>All products are for customers aged 18 and over.</li>
        </ul>
      </div>
    </section>
  );
}
