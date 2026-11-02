import Link from "next/link";
import { LOCAL_BUSINESS } from "@/lib/local-business";
import { contactInfo } from "@/data/social";

export function SellerDetails() {
  return (
    <section className="mt-10 border-t border-surface-200 pt-6 text-sm text-surface-800/70" aria-labelledby="seller-details">
      <h2 id="seller-details" className="mb-2 font-semibold text-surface-900">Seller details</h2>
      <p>
        {LOCAL_BUSINESS.legalName}
        {LOCAL_BUSINESS.companyNumber ? `, registered in England & Wales, Company No. ${LOCAL_BUSINESS.companyNumber}` : ""}
        {" · "}{contactInfo.address}{" · "}
        <a href={`mailto:${contactInfo.email}`} className="hover:underline">{contactInfo.email}</a>{" · "}
        <a href={contactInfo.phoneHref} className="hover:underline">{contactInfo.phone}</a>
      </p>
      <p className="mt-2">Products are sold only to customers aged 18 or over.</p>
      <p className="mt-4">
        Questions? See our <Link href="/faq" className="font-semibold text-brand-700 hover:underline">FAQ</Link> or{" "}
        <Link href="/contact" className="font-semibold text-brand-700 hover:underline">contact us</Link>.
      </p>
    </section>
  );
}
