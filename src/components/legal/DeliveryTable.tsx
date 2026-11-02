import { deliveryBands, deliveryService } from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";

/** Delivery rates table for the Shipping Policy page (rates from the shared config). */
export function DeliveryTable() {
  return (
    <section aria-labelledby="delivery-rates" className="mt-8 space-y-6 text-surface-800/80">
      <div>
        <h2 id="delivery-rates" className="text-xl font-semibold text-surface-900 mb-3">
          UK delivery rates
        </h2>
        <div className="overflow-x-auto rounded-xl border border-surface-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-50 text-surface-900">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Parcel</th>
                <th scope="col" className="px-4 py-3 font-semibold">Total order weight</th>
                <th scope="col" className="px-4 py-3 font-semibold">Service</th>
                <th scope="col" className="px-4 py-3 font-semibold">Estimated delivery</th>
                <th scope="col" className="px-4 py-3 font-semibold text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {deliveryBands.map((b) => (
                <tr key={b.id} className="border-t border-surface-200">
                  <td className="px-4 py-3 font-medium text-surface-900">{b.name}</td>
                  <td className="px-4 py-3">{b.weightLabel}</td>
                  <td className="px-4 py-3">{deliveryService}</td>
                  <td className="px-4 py-3">2–3 working days after dispatch</td>
                  <td className="px-4 py-3 text-right font-semibold text-surface-900">{formatPrice(b.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm">
          Delivery is charged <strong>once per order</strong>, not per item, and is calculated automatically
          at checkout from the total weight of your basket. Most Cali Pack orders fall in the Small parcel band.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-surface-900 mb-2">Dispatch</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>In-stock orders are dispatched within 2–3 business days (Monday to Friday, excluding UK bank holidays).</li>
          <li>Orders placed after 2pm, at weekends or on bank holidays are processed from the next business day.</li>
          <li>You&apos;ll receive a tracking link by email as soon as your order ships.</li>
          <li>Delivery times are estimates from Royal Mail and may be longer during busy periods.</li>
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
