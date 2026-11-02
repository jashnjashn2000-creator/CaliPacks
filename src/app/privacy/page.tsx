import type { Metadata } from "next";
import Link from "next/link";
import { pageUrl } from "@/lib/site";
import { LOCAL_BUSINESS } from "@/lib/local-business";
import { contactInfo } from "@/data/social";
import { SellerDetails } from "@/components/legal/SellerDetails";

const EFFECTIVE_DATE = "2 November 2026";
const DESCRIPTION =
  "How SMOKE CALI LTD collects, uses and protects your personal data when you shop online, order on WhatsApp, contact us or visit smokecali.co.uk — UK GDPR, DPA 2018 and PECR.";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: DESCRIPTION,
  alternates: { canonical: pageUrl("/privacy") },
  openGraph: {
    url: pageUrl("/privacy"),
    title: "Privacy Policy | Smoke Cali",
    description: DESCRIPTION,
  },
};

const placeholder = (v: string, label: string) =>
  v || `[TODO: ${label}]`;

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mt-10 mb-3 text-xl font-bold text-surface-900 scroll-mt-24">
      {children}
    </h2>
  );
}

const sections = [
  ["who-we-are", "1. Who we are"],
  ["data-we-collect", "2. Personal data we collect"],
  ["purposes", "3. How we use your data and our lawful bases"],
  ["recipients", "4. Who we share your data with"],
  ["transfers", "5. International transfers"],
  ["retention", "6. How long we keep your data"],
  ["rights", "7. Your rights"],
  ["cookies", "8. Cookies and similar technologies"],
  ["marketing", "9. Marketing"],
  ["age", "10. Age restriction and children"],
  ["security", "11. Security"],
  ["complaints", "12. Complaints"],
  ["changes", "13. Changes to this policy"],
] as const;

export default function PrivacyPage() {
  const mail = (
    <a href={`mailto:${contactInfo.email}`} className="font-semibold text-brand-700 hover:underline">
      {contactInfo.email}
    </a>
  );
  return (
    <div className="py-12 md:py-16">
      <article className="container-site max-w-3xl text-surface-800/80 leading-relaxed [&_li]:mt-1.5 [&_ul]:list-disc [&_ul]:pl-6 [&_p]:mt-3">
        <h1 className="text-3xl font-bold text-surface-900 tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-surface-800/60">Effective date: {EFFECTIVE_DATE}</p>
        <p>
          This policy explains how {LOCAL_BUSINESS.legalName} (&ldquo;Smoke Cali&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo;) collects and uses personal data when you use smokecali.co.uk, buy from us, order
          on WhatsApp, email us or visit our shop. It is written to meet the UK General Data Protection
          Regulation (UK GDPR), the Data Protection Act 2018 and the Privacy and Electronic Communications
          Regulations 2003 (PECR).
        </p>

        <nav aria-label="Contents" className="mt-6 rounded-xl border border-surface-200 bg-white p-5 text-sm">
          <p className="!mt-0 font-semibold text-surface-900">Contents</p>
          <ul className="!list-none !pl-0">
            {sections.map(([id, label]) => (
              <li key={id}><a href={`#${id}`} className="hover:underline">{label}</a></li>
            ))}
          </ul>
        </nav>

        <H2 id="who-we-are">1. Who we are</H2>
        <p>
          The data controller is <strong>{LOCAL_BUSINESS.legalName}</strong>, a company registered in
          England and Wales (Company No. {placeholder(LOCAL_BUSINESS.companyNumber, "Companies House number")}),
          trading as Smoke Cali, of {contactInfo.address}.
          {LOCAL_BUSINESS.icoRegistrationNumber
            ? ` Our ICO registration number is ${LOCAL_BUSINESS.icoRegistrationNumber}.`
            : null}
        </p>
        <p>
          For any privacy question or to exercise your rights, contact our director, {LOCAL_BUSINESS.founder},
          at {mail}, by phone or WhatsApp on{" "}
          <a href={contactInfo.phoneHref} className="hover:underline">{contactInfo.phone}</a>, or by post to
          the address above. We are not required to appoint a Data Protection Officer.
        </p>

        <H2 id="data-we-collect">2. Personal data we collect</H2>
        <p><strong>When you check out online:</strong></p>
        <ul>
          <li>Identity and contact details: full name, email address and phone number.</li>
          <li>Delivery details: address, town/city and postcode, and any order notes you add.</li>
          <li>Order details: the products, quantities and totals in your order.</li>
          <li>
            Payment and billing details: you enter your card details directly on the secure payment page of our
            payment provider, Viva.com. We do not see or store your card number, expiry date or security
            code; Viva.com confirms to us whether your payment succeeded, the amount, and a payment
            reference.
          </li>
        </ul>
        <p><strong>When you order or message us on WhatsApp:</strong> your name, phone number, WhatsApp profile and the contents of your messages (for example the items you want and your delivery address).</p>
        <p>
          <strong>When you use our contact or custom-order forms or email us:</strong> these forms do not send
          data to our servers — they open your own email app with a pre-filled message to us. We receive what
          you choose to send, such as your name, email, phone number, message and any artwork files.
        </p>
        <p>
          <strong>When you browse the website:</strong> our hosting and checkout providers automatically
          process technical data such as your IP address, browser type and the pages requested, to deliver and
          secure the site. We do not use analytics, advertising or tracking tools.
        </p>
        <p>
          <strong>Accounts:</strong> we do not offer customer accounts. You check out as a guest, so we hold no
          passwords.
        </p>

        <H2 id="purposes">3. How we use your data and our lawful bases</H2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm border border-surface-200">
            <thead className="bg-surface-50 text-left text-surface-900">
              <tr><th className="p-3 border-b">Purpose</th><th className="p-3 border-b">Lawful basis (UK GDPR Art. 6)</th></tr>
            </thead>
            <tbody className="[&_td]:p-3 [&_td]:border-b [&_td]:align-top">
              <tr><td>Processing payment, fulfilling and delivering your order, sending receipts and order updates</td><td>Contract</td></tr>
              <tr><td>Answering your enquiries, WhatsApp orders and custom-order requests</td><td>Contract (steps before entering a contract) or legitimate interests in responding to you</td></tr>
              <tr><td>Keeping sales, tax and accounting records</td><td>Legal obligation</td></tr>
              <tr><td>Confirming customers are 18 or over</td><td>Legal obligation and legitimate interests in selling age-restricted goods responsibly</td></tr>
              <tr><td>Preventing fraud, securing the website and checkout, and handling disputes or chargebacks</td><td>Legitimate interests</td></tr>
              <tr><td>Remembering your basket and age confirmation in your browser</td><td>Legitimate interests (strictly necessary storage — see section 8)</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          You must give us your name, contact details and delivery address for us to fulfil an order. We do not
          make decisions about you based solely on automated processing, and we do not profile you.
        </p>

        <H2 id="recipients">4. Who we share your data with</H2>
        <p>We never sell your personal data. We share it only with these service providers, who act on our instructions, and as required by law:</p>
        <ul>
          <li><strong>Viva.com</strong> (our payment service provider): processes your card payment, carries out fraud prevention and security checks, and confirms payment to us. Viva.com receives your name, email address, order amount and payment details, and is an independent controller for the data it uses to run the payment and meet its own legal duties, under its own privacy policy.</li>
          <li><strong>Cloudflare, Inc.</strong>: runs the secure checkout service that creates your payment with Viva.com and notifies us of paid orders.</li>
          <li><strong>Resend</strong> (email delivery) and <strong>Zapier</strong> (workflow automation): where enabled, used to send us notifications of new paid orders, including your name, contact details, address and order.</li>
          <li><strong>Google</strong> (Gmail): our business email account, where your emails and order notifications are stored.</li>
          <li><strong>WhatsApp / Meta</strong>: if you choose to contact or order via WhatsApp.</li>
          <li><strong>GitHub, Inc.</strong>: hosts the website and processes technical request data such as IP addresses.</li>
          <li><strong>Couriers</strong>: your name, address and phone number, to deliver your parcel.</li>
          <li>Our accountants, professional advisers, HMRC, the police or other authorities where required by law or to protect our rights.</li>
        </ul>

        <H2 id="transfers">5. International transfers</H2>
        <p>
          Several of our providers (Cloudflare, Resend, Zapier, Google, Meta and GitHub) are based in, or
          may process data in, the United States or other countries outside the UK. Viva.com is based in the
          European Economic Area, which the UK recognises as providing adequate data protection, and may use
          service providers in other countries under its own safeguards. Where this happens, we rely
          on UK adequacy regulations (including the UK–US &ldquo;data bridge&rdquo; for certified companies) or
          the ICO&rsquo;s International Data Transfer Agreement / UK Addendum to the EU Standard Contractual
          Clauses included in the providers&rsquo; data processing terms. Contact us for more information.
        </p>

        <H2 id="retention">6. How long we keep your data</H2>
        <ul>
          <li>Order, payment and invoice records: 6 years from the end of the financial year of the order, to meet UK tax and company law.</li>
          <li>Enquiries, emails and WhatsApp chats not leading to an order: up to 2 years, then deleted.</li>
          <li>Browser storage (basket, age confirmation): stays on your device until you clear it; we cannot access it.</li>
          <li>Hosting and security logs: kept by our providers for their standard, short periods.</li>
        </ul>

        <H2 id="rights">7. Your rights</H2>
        <p>Under UK data protection law you have the right to:</p>
        <ul>
          <li><strong>Access</strong>: get a copy of the personal data we hold about you.</li>
          <li><strong>Rectification</strong>: have inaccurate or incomplete data corrected.</li>
          <li><strong>Erasure</strong>: have your data deleted where there is no good reason for us to keep it (we must keep some order records by law).</li>
          <li><strong>Restriction</strong>: ask us to limit how we use your data, for example while a correction is checked.</li>
          <li><strong>Portability</strong>: receive data you gave us under contract in a structured, machine-readable format, or have it sent to another organisation.</li>
          <li><strong>Objection</strong>: object to processing based on our legitimate interests, and to direct marketing at any time.</li>
          <li><strong>Withdraw consent</strong>: where we rely on consent, at any time, without affecting earlier processing.</li>
        </ul>
        <p>
          To exercise any right, email {mail}. We will respond within one month (extendable by two months for
          complex requests). It is normally free. We may need to confirm your identity first.
        </p>

        <H2 id="cookies">8. Cookies and similar technologies</H2>
        <p>
          We do not use analytics, advertising or tracking cookies. We use your browser&rsquo;s storage only for
          things that are strictly necessary for the service you request, which PECR allows without consent:
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm border border-surface-200">
            <thead className="bg-surface-50 text-left text-surface-900">
              <tr><th className="p-3 border-b">Name</th><th className="p-3 border-b">Type</th><th className="p-3 border-b">Purpose</th><th className="p-3 border-b">Duration</th></tr>
            </thead>
            <tbody className="[&_td]:p-3 [&_td]:border-b [&_td]:align-top">
              <tr><td>smokecali-age-verified</td><td>Local storage</td><td>Remembers you confirmed you are 18+</td><td>Until cleared</td></tr>
              <tr><td>calipacks-cart-v2</td><td>Local storage</td><td>Keeps the items in your basket</td><td>Until cleared</td></tr>
              <tr><td>calipacks-last-order</td><td>Session storage</td><td>Shows your name, email and total on the order confirmation page</td><td>Until you close the tab</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          When you pay, the Viva.com payment page sets its own cookies for security and fraud prevention under
          Viva.com&rsquo;s cookie policy. Links to WhatsApp, Google Maps, Facebook, Instagram, TikTok and YouTube
          take you to third-party sites with their own privacy and cookie policies. You can clear site storage
          at any time in your browser settings.
        </p>

        <H2 id="marketing">9. Marketing</H2>
        <p>
          We do not send marketing emails or messages. If we start, we will only do so in line with PECR — with
          your consent, or to existing customers about similar products with a simple way to opt out in every
          message — and we will update this policy first.
        </p>

        <H2 id="age">10. Age restriction and children</H2>
        <p>
          Our website and products are for adults aged 18 or over only. We do not knowingly collect data from
          anyone under 18. If you believe a child has given us personal data, contact us and we will delete it.
        </p>

        <H2 id="security">11. Security</H2>
        <p>
          The website and checkout use HTTPS encryption. Card payments are handled by Viva.com, a regulated payment provider that must
          meet card industry security standards (PCI DSS), so card details never reach us. We restrict access to order records and our email
          account. No online system is completely secure; if a breach occurs that is likely
          to put you at risk, we will tell you and the ICO as the law requires.
        </p>

        <H2 id="complaints">12. Complaints</H2>
        <p>
          Please contact us first at {mail} so we can try to put things right. You also have the right to
          complain to the Information Commissioner&rsquo;s Office (ICO), the UK data protection regulator:{" "}
          <a href="https://ico.org.uk/make-a-complaint/" className="font-semibold text-brand-700 hover:underline" rel="noopener">ico.org.uk</a>,
          helpline 0303 123 1113, or Information Commissioner&rsquo;s Office, Wycliffe House, Water Lane,
          Wilmslow, Cheshire, SK9 5AF.
        </p>

        <H2 id="changes">13. Changes to this policy</H2>
        <p>
          We may update this policy when our services or the law change. The latest version is always on this
          page with its effective date. Significant changes will be highlighted on the website. See also our{" "}
          <Link href="/terms" className="font-semibold text-brand-700 hover:underline">Terms &amp; Conditions</Link>.
        </p>

        <SellerDetails />
      </article>
    </div>
  );
}
