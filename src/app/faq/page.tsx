import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";
import { pageUrl } from "@/lib/site";
import { faqs } from "@/data/faqs";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Smoke Cali FAQ: Cali Packs £0.22 each (min 25 pcs, 50+ for £0.20), UK postage shown on each product, 2–3 day dispatch, returns, custom orders, and Manchester shop address and opening hours.",
  alternates: { canonical: pageUrl("/faq") },
  openGraph: {
    url: pageUrl("/faq"),
    title: "Smoke Cali FAQ | Cali Packs, delivery & Manchester shop",
    description:
      "Answers on prices, minimum order, UK delivery, returns, custom orders and visiting the Smoke Cali shop in Manchester.",
  },
};



export default function FAQPage() {
  return (
    <div className="py-12 md:py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.a,
            },
          })),
        }}
      />
      <div className="container-site max-w-3xl">
        <h1 className="text-3xl font-bold text-surface-900 tracking-tight mb-4">
          Frequently Asked Questions
        </h1>
        <p className="mb-8 text-surface-800/70 leading-relaxed">
          Quick answers about ordering Cali Packs online, UK delivery, returns and
          visiting our Manchester shop. Can&apos;t find your answer?{" "}
          <Link href="/contact" className="font-semibold text-brand-700 underline-offset-2 hover:underline">
            Contact us
          </Link>{" "}
          or read our{" "}
          <Link href="/shipping" className="font-semibold text-brand-700 underline-offset-2 hover:underline">
            shipping
          </Link>{" "}
          and{" "}
          <Link href="/returns" className="font-semibold text-brand-700 underline-offset-2 hover:underline">
            returns
          </Link>{" "}
          policies.
        </p>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group bg-white rounded-xl border border-surface-200 overflow-hidden"
            >
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-medium text-surface-900 hover:bg-surface-50 transition-colors">
                <h2 className="text-base font-medium">{faq.q}</h2>
                <span className="text-surface-800/40 group-open:rotate-45 transition-transform text-xl ml-4">+</span>
              </summary>
              <div className="px-6 pb-4 text-sm text-surface-800/70 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
