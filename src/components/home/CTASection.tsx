import Link from "next/link";
import { ArrowRight, CreditCard, PackageCheck, ShoppingBag } from "lucide-react";

export function CTASection() {
  const steps = [
    {
      icon: ShoppingBag,
      title: "Select Product",
      description: "Pick a Cali Pack — £0.22 each, min 25 pcs. 50+ for £0.20.",
    },
    {
      icon: CreditCard,
      title: "Pay Online",
      description: "Checkout online or order via WhatsApp in one tap.",
    },
    {
      icon: PackageCheck,
      title: "Get Delivery",
      description: "UK delivery in 2–3 business days.",
    },
  ];

  return (
    <section className="py-14 md:py-20">
      <div className="container-site">
        <div className="surface-card rounded-3xl p-7 md:p-10 lg:p-12 relative overflow-hidden">
          <div className="relative text-center max-w-2xl mx-auto mb-10">
            <span className="mb-4 inline-flex items-center gap-3 text-brand-700 text-xs font-bold uppercase tracking-[0.26em]">
              <span className="h-px w-8 bg-gold" />
              Why Smoke Cali
              <span className="h-px w-8 bg-gold" />
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-ink mb-2">
              UK&apos;s Best Sellers of Cali Packs
            </h2>
            <p className="text-graphite/65 font-medium text-sm md:text-base">
              Real stock. Bold designs. Fast UK delivery.
            </p>
          </div>

          <div className="relative grid md:grid-cols-3 gap-4 mb-10">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="relative p-6 rounded-2xl bg-gradient-to-b from-surface-100 to-white border border-ink/[0.06] overflow-hidden"
              >
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                <div className="icon-tile w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                  <step.icon className="w-5 h-5 text-gold" />
                </div>
                <p className="text-[10px] text-brand-700 font-bold uppercase tracking-[0.22em] mb-1">
                  Step {i + 1}
                </p>
                <p className="font-bold text-base text-ink mb-1">{step.title}</p>
                <p className="text-sm font-medium text-graphite/65 leading-snug">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="relative flex flex-wrap justify-center gap-3">
            <Link
              href="/shop"
              className="btn-glow inline-flex items-center gap-2 px-6 py-3 bg-gold text-ink font-bold rounded-full hover:bg-brand-400"
            >
              Start Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/checkout"
              className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-white font-semibold rounded-full hover:bg-graphite transition-colors"
            >
              Pay Now
            </Link>
            <Link
              href="/custom-orders"
              className="btn-shine-white inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-full text-ink"
            >
              Get a Quote
            </Link>
            <Link
              href="/custom-orders"
              className="inline-flex items-center gap-2 px-6 py-3 bg-graphite text-white font-semibold rounded-full hover:bg-ink transition-colors"
            >
              Custom Order
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
