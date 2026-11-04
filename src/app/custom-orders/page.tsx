"use client";

import { ShoppingBag, CreditCard, Truck } from "lucide-react";
import { contactInfo } from "@/data/social";

const steps = [
  {
    icon: ShoppingBag,
    title: "Place Your Order",
    desc: "Tell us which Cali Packs you need — £0.22 each, 25 pcs minimum, or £0.20 each from 50 of the same design.",
  },
  {
    icon: CreditCard,
    title: "Make Payment",
    desc: "Pay online securely or confirm payment details after we quote your order.",
  },
  {
    icon: Truck,
    title: "Get Delivery",
    desc: "We pack and ship across the UK — most orders arrive within 2–3 business days.",
  },
];

export default function CustomOrdersPage() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const type = String(form.get("type") || "");
    const qty = String(form.get("qty") || "");
    const details = String(form.get("details") || "");
    const body = [
      "Custom order request",
      `Name: ${name}`,
      `Email: ${email}`,
      `Product type: ${type}`,
      qty ? `Quantity: ${qty}` : "",
      "",
      details,
    ]
      .filter(Boolean)
      .join("\n");
    window.location.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent("Custom order request")}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="py-12 md:py-16">
      <div className="container-site max-w-3xl">
        <div className="text-center mb-12">
          <p className="mb-3 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.26em] text-brand-700">
            <span className="h-px w-8 bg-gold" />
            Wholesale & bulk
            <span className="h-px w-8 bg-gold" />
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal text-ink tracking-tight mb-4">
            Custom Orders
          </h1>
          <p className="text-surface-800/60 max-w-lg mx-auto">
            Need a bulk refill or a special mix? Order → pay → delivery. Simple.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mb-12">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative text-center p-6 rounded-2xl bg-white border border-surface-200 overflow-hidden shadow-sm"
            >
              <div className="absolute top-0 left-6 right-6 h-px bg-gold" />
              <div className="w-12 h-12 rounded-xl bg-ink flex items-center justify-center mx-auto mb-4 relative">
                <step.icon className="w-6 h-6 text-gold" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-700 mb-1">
                Step {i + 1}
              </p>
              <h3 className="font-semibold text-sm mb-1 relative">{step.title}</h3>
              <p className="text-xs text-surface-800/60 relative">{step.desc}</p>
            </div>
          ))}
        </div>

        <form
          className="relative bg-white rounded-2xl border border-surface-200 p-6 md:p-8 space-y-4 overflow-hidden shadow-[0_18px_50px_rgba(5,31,32,0.06)]"
          onSubmit={handleSubmit}
        >
          <h2 className="font-serif text-2xl font-normal text-ink relative">Request a custom order</h2>

          <div className="grid sm:grid-cols-2 gap-4 relative">
            <div>
              <label htmlFor="co-name" className="block text-sm font-medium mb-1.5">
                Full Name
              </label>
              <input
                id="co-name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none text-sm"
              />
            </div>
            <div>
              <label htmlFor="co-email" className="block text-sm font-medium mb-1.5">
                Email
              </label>
              <input
                id="co-email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none text-sm"
              />
            </div>
          </div>
          <div className="relative">
            <label htmlFor="co-type" className="block text-sm font-medium mb-1.5">
              Product type
            </label>
            <select
              id="co-type"
              name="type"
              className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none text-sm bg-white"
            >
              <option>Cali Packs</option>
              <option>Can & Jar Packs</option>
              <option>Glassware</option>
              <option>Digital Scales</option>
              <option>Cases & Accessories</option>
              <option>Mixed shop refill</option>
            </select>
          </div>
          <div className="relative">
            <label htmlFor="co-qty" className="block text-sm font-medium mb-1.5">
              Estimated quantity
            </label>
            <input
              id="co-qty"
              name="qty"
              type="text"
              placeholder="e.g. 500 packs"
              className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none text-sm"
            />
          </div>
          <div className="relative">
            <label htmlFor="co-details" className="block text-sm font-medium mb-1.5">
              Order details
            </label>
            <textarea
              id="co-details"
              name="details"
              rows={5}
              required
              placeholder="List designs, SKUs, or describe what you need..."
              className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none text-sm resize-none"
            />
          </div>
          <button
            type="submit"
            className="relative w-full py-3.5 bg-ink text-white font-semibold rounded-xl hover:bg-gold hover:text-ink transition-colors"
          >
            Submit Custom Order Request
          </button>
        </form>
      </div>
    </div>
  );
}
