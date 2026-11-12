import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { LOCAL_BUSINESS } from "@/lib/local-business";
import { contactInfo } from "@/data/social";
import { SITE_URL, pageUrl } from "@/lib/site";
import { CALI_PACK_COUNT } from "@/data/products";

const highlights = [
  `${CALI_PACK_COUNT} HD Cali Pack designs, each named and photographed`,
  "£0.22 each · minimum 25 pcs · 50+ for £0.20 each",
  "Online cart and WhatsApp ordering",
  "Dispatched in 2–3 business days · Evri tracked delivery · Cali Packs postage £2.99 up to 200",
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          url: pageUrl("/about"),
          name: "About Smoke Cali",
          about: { "@id": `${SITE_URL}/#organization` },
          mainEntity: { "@id": `${SITE_URL}/#local` },
        }}
      />
      <PageHero
        eyebrow="Real Manchester stock"
        title="About"
        accent="Smoke Cali"
        description={`A real Manchester shop supplying ${CALI_PACK_COUNT} HD Cali Packs. £0.22 each, minimum 25 pcs, or £0.20 each from 50 — shop online or visit us on Sagar Street.`}
        images={[
          "/cali-shop-hero.webp",
          "/products/pack-030.webp",
          "/products/pack-060.webp",
        ]}
        ctaLabel="Shop the catalogue"
        ctaHref="/shop"
      />

      <section className="py-10 sm:py-14">
        <div className="container-site">
          <div className="mx-auto grid max-w-5xl gap-8 rounded-3xl border border-brand-200 bg-white p-6 shadow-[0_18px_50px_rgba(5,31,32,0.06)] sm:p-9 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="font-serif text-2xl leading-snug text-ink sm:text-[1.75rem]">
                Smoke Cali supplies UK shops and buyers with Cali Packs selected
                from our real Manchester shelves — £0.22 each, 25 pcs minimum, or £0.20 each from 50.
              </p>
              <p className="mt-4 font-medium leading-relaxed text-graphite/65">
                Browse online, add products to your cart, or contact us through
                WhatsApp for stock and wholesale questions.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-graphite"
              >
                Talk to our team
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <ul className="grid gap-3">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-2xl bg-cream p-4 font-semibold text-ink"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="pb-14 sm:pb-20" aria-labelledby="company-facts">
        <div className="container-site">
          <div className="mx-auto max-w-5xl rounded-3xl border border-brand-200 bg-white p-6 sm:p-9">
            <h2 id="company-facts" className="font-serif text-2xl text-ink sm:text-3xl">
              Smoke Cali at a glance
            </h2>
            <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
              <div><dt className="font-semibold text-ink">Registered company</dt><dd className="text-graphite/70">{LOCAL_BUSINESS.legalName}{LOCAL_BUSINESS.companyNumber ? ` (Company No. ${LOCAL_BUSINESS.companyNumber})` : ""}</dd></div>
              <div><dt className="font-semibold text-ink">Director</dt><dd className="text-graphite/70">{LOCAL_BUSINESS.founder}</dd></div>
              <div><dt className="font-semibold text-ink">Shop address</dt><dd className="text-graphite/70">{contactInfo.address}</dd></div>
              <div><dt className="font-semibold text-ink">Opening hours</dt><dd className="text-graphite/70">Monday–Sunday, 9:30am–7:30pm</dd></div>
              <div><dt className="font-semibold text-ink">Phone &amp; WhatsApp</dt><dd className="text-graphite/70"><a href={contactInfo.phoneHref} className="hover:underline">{contactInfo.phone}</a></dd></div>
              <div><dt className="font-semibold text-ink">Email</dt><dd className="text-graphite/70"><a href={`mailto:${contactInfo.email}`} className="hover:underline">{contactInfo.email}</a></dd></div>
              <div><dt className="font-semibold text-ink">Online store</dt><dd className="text-graphite/70">Evri tracked delivery, usually 2–3 working days after dispatch. Cali Packs are postage £2.99 up to 200 packs and £3.50 over 200. Other products show their own postage. Ordering several items, you pay the highest postage once. Dispatched in 2–3 business days</dd></div>
              <div><dt className="font-semibold text-ink">Age policy</dt><dd className="text-graphite/70">Customers must be 18 or over</dd></div>
            </dl>
            <p className="mt-6 text-sm text-graphite/60">
              See our <Link href="/faq" className="font-semibold text-brand-700 hover:underline">FAQ</Link>,{" "}
              <Link href="/shipping" className="font-semibold text-brand-700 hover:underline">shipping</Link> and{" "}
              <Link href="/returns" className="font-semibold text-brand-700 hover:underline">returns</Link> policies.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
