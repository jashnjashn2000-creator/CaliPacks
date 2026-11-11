import Link from "next/link";
import { LOCAL_BUSINESS } from "@/lib/local-business";
import { contactInfo } from "@/data/social";
import { deliveryService } from "@/lib/shipping";
import { Contents, H2, LEGAL_EFFECTIVE_DATE, LegalBody } from "@/components/legal/LegalBits";

const sections = [
  ["about-us", "1. About us"],
  ["age", "2. Age restriction (18+)"],
  ["using-site", "3. Using this website"],
  ["orders", "4. Placing an order and forming a contract"],
  ["prices-payment", "5. Prices and payment"],
  ["delivery", "6. Delivery"],
  ["cancellation", "7. Your right to cancel (14 days)"],
  ["faulty", "8. Faulty or damaged goods"],
  ["custom-orders", "9. Custom and personalised orders"],
  ["liability", "10. Our liability"],
  ["privacy", "11. Privacy"],
  ["changes", "12. Changes to these terms"],
  ["law", "13. Governing law and disputes"],
  ["contact", "14. Contact us"],
] as const;

const link = "font-semibold text-brand-700 hover:underline";

export function TermsContent() {
  const mail = (
    <a href={`mailto:${contactInfo.email}`} className={link}>
      {contactInfo.email}
    </a>
  );
  return (
    <LegalBody>
      <p className="text-sm text-surface-800/60 !mt-0">Effective date: {LEGAL_EFFECTIVE_DATE}</p>
      <p>
        These terms and conditions apply to every order you place on smokecali.co.uk, by WhatsApp or by
        email. Please read them before you order. By placing an order you confirm that you have read and
        accepted them. Nothing in these terms affects your statutory rights as a consumer.
      </p>

      <Contents sections={sections} />

      <H2 id="about-us">1. About us</H2>
      <p>
        This website is operated by <strong>{LOCAL_BUSINESS.legalName}</strong> (&ldquo;Smoke Cali&rdquo;,
        &ldquo;we&rdquo;, &ldquo;us&rdquo;), a company registered in England &amp; Wales with company number{" "}
        <strong>{LOCAL_BUSINESS.companyNumber}</strong>. Our registered office and shop is at{" "}
        {contactInfo.address}. You can contact us by email on {mail} or by phone / WhatsApp on{" "}
        <a href={contactInfo.phoneHref} className={link}>{contactInfo.phone}</a>.
      </p>

      <H2 id="age">2. Age restriction (18+)</H2>
      <p>
        Our products are smoking accessories and related items and are sold <strong>only to people aged 18
        or over</strong>. By placing an order you confirm that you are at least 18 years old. We may ask
        for proof of age and may cancel and refund any order where we reasonably believe the purchaser is
        under 18. Goods will not be left with, or delivered to, anyone we believe to be under 18.
      </p>

      <H2 id="using-site">3. Using this website</H2>
      <p>
        You may use this website for lawful purposes only. All content, images, designs and trade marks on
        it belong to us or our licensors and may not be copied or reused without our written permission.
        We aim to keep the website accurate and available, but we do not promise that it will be free of
        errors or interruptions.
      </p>

      <H2 id="orders">4. Placing an order and forming a contract</H2>
      <ol>
        <li>Product pages describe our goods and minimum order quantities. Photographs are illustrative; colours and finishes may vary slightly.</li>
        <li>When you click &ldquo;Pay Now&rdquo; or send us an order by WhatsApp or email, you are making an offer to buy the goods. You can correct input errors before you pay.</li>
        <li>After your payment is confirmed we will email you an order confirmation. <strong>The contract between you and us is formed when we send that confirmation</strong> (or, for goods ordered by WhatsApp or email, when we confirm your order to you).</li>
        <li>All goods are subject to availability. If an item turns out to be unavailable, or we cannot accept your order for any other reason (for example a pricing error, or we cannot verify your age), we will tell you promptly and refund anything you have already paid.</li>
      </ol>

      <H2 id="prices-payment">5. Prices and payment</H2>
      <ul>
        <li>All prices are in pounds sterling (GBP) and are the prices you pay. Delivery is shown separately at checkout before you pay.</li>
        <li>We take care to price accurately. If we discover an obvious pricing error after your order, we will contact you and you may confirm the order at the correct price or cancel it for a full refund.</li>
        <li><strong>Card payments are processed securely by Viva.com.</strong> When you click &ldquo;Pay Now&rdquo; you are taken to Viva.com&rsquo;s secure payment page. We accept the payment methods shown at checkout (such as Visa, Mastercard, Apple Pay and Google Pay). Your card details are entered only on Viva.com&rsquo;s page and are never seen or stored by us.</li>
        <li>Payment is taken when you place your order. Refunds are made to the original payment method.</li>
      </ul>

      <H2 id="delivery">6. Delivery</H2>
      <p>
        We deliver to UK addresses only, by <strong>{deliveryService}</strong>. Each product shows its own
        UK postage, or free UK delivery. Cali Packs are postage £2.99 when the order contains up to and
        including 200 packs, and £3.50 when it contains more than 200 packs. That rate uses the total
        number of Cali Packs in the order. Stash can packs of 10 are postage £2.99, or £3.99 if the order
        contains 5 or more of those packs. When you order several items you pay the{" "}
        <strong>highest postage once</strong>. Postage is not added together. Ordering more of the same
        item does not increase its postage, except where a Cali Pack or stash can pack total moves the
        order into a higher postage band. If every item in the basket includes free delivery, postage is £0.
      </p>
      <p>
        In-stock orders are normally dispatched within 2–3 business days. Evri tracked delivery then
        usually takes 2–3 working days. These are estimates, not guaranteed delivery dates. Custom orders
        take 5–7 business days after design approval. Full details, including cut-off times, are on our{" "}
        <Link href="/shipping" className={link}>Delivery page</Link>. Risk in the goods passes to you when
        they are delivered to your address; ownership passes when we have received full payment.
      </p>
      <p>
        If your order has not arrived within 30 days of the date we confirmed it, please contact us and we
        will investigate with the courier and, where appropriate, resend or refund.
      </p>

      <H2 id="cancellation">7. Your right to cancel (14 days)</H2>
      <p>
        Under the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 you
        have the right to cancel your order <strong>within 14 days</strong>, without giving a reason. The
        14 days start on the day after you (or someone you nominate) receive the goods. If your order is
        delivered in several parts, the period starts the day after the last part arrives.
      </p>
      <p>
        This 14-day right applies to distance orders (this website, email or WhatsApp). It does not apply
        to goods you buy in person in the shop. Faulty goods bought in the shop are still covered by
        section 8.
      </p>
      <p><strong>Cancel before we dispatch</strong></p>
      <p>
        If you cancel before we dispatch, we refund the full amount you paid, including postage, and we
        do not send the parcel. Email {mail} or WhatsApp us on{" "}
        <a href={contactInfo.phoneHref} className={link}>{contactInfo.phone}</a> as soon as you can.
      </p>
      <p><strong>How to cancel</strong></p>
      <ul>
        <li>Email {mail}, WhatsApp us, or write to us at {contactInfo.address}, with a clear statement that you wish to cancel, your name, your order number and the goods concerned. You may use the model cancellation form below if you wish, but you do not have to. A clear written cancellation is enough. You do not have to wait for our reply for the cancellation to count.</li>
        <li>Email or WhatsApp us for the return address. Please send the goods back <strong>without undue delay and within 14 days</strong> of telling us you want to cancel.</li>
        <li>Return the goods unused, in the original packaging where you can. You may inspect them as you would in a shop. You are responsible for them until we receive them, so we recommend tracked post and keeping proof of postage.</li>
      </ul>
      <p><strong>Refunds</strong></p>
      <ul>
        <li>We will refund the price you paid for the goods and the standard delivery charge <strong>within 14 days</strong> of receiving the goods back (or of you providing proof that you have sent them back, if earlier).</li>
        <li>If you cancel before dispatch, the refund includes postage and the parcel is not sent.</li>
        <li>Refunds are made to the original payment method.</li>
        <li>If you change your mind after delivery, <strong>you pay the cost of returning the goods</strong>. We pay the return postage if the goods are faulty, damaged or not as described (see section 8).</li>
        <li>We may reduce the refund if the goods have lost value because you handled them more than was needed to inspect them, as you would in a shop.</li>
      </ul>
      <p><strong>Goods that cannot be cancelled for a change of mind</strong></p>
      <ul>
        <li>Sealed hygiene or personal items, once you have unsealed them after delivery. That includes used bongs, pipes, mouthpieces, opened papers or filters, and similar goods.</li>
        <li>Goods made to your specification or clearly personalised, including custom orders once production has started (see section 9).</li>
      </ul>
      <p>These limits do not affect your rights where goods are faulty, damaged or not as described.</p>
      <p>
        Our <Link href="/returns" className={link}>Returns &amp; Refunds</Link> page sets out the process in
        more detail.
      </p>
      <p><strong>Model cancellation form</strong> (complete and email only if you wish to cancel)</p>
      <p>
        To {LOCAL_BUSINESS.legalName}, {contactInfo.address}, {contactInfo.email}: I/We hereby give notice
        that I/We cancel my/our contract of sale of the following goods: [description of goods], ordered
        on [date], received on [date]. Name: [your name]. Address: [your address]. Order number: [order
        number]. Date: [date].
      </p>

      <H2 id="faulty">8. Faulty or damaged goods</H2>
      <p>
        We are legally required to supply goods that are of satisfactory quality, fit for purpose and as
        described. Under the Consumer Rights Act 2015, if goods are faulty, damaged on arrival or not as
        described you are entitled to a remedy. For the first 30 days after delivery you can reject
        faulty goods for a full refund. After 30 days you can ask for a repair or a replacement. If a
        repair or replacement is not possible, is not done within a reasonable time, or does not put the
        problem right, you can ask for a refund or a price reduction.
      </p>
      <ul>
        <li>Please email {mail} as soon as you can, with your order number and photographs of the problem.</li>
        <li>If goods are faulty, damaged or not as described, <strong>we will pay the reasonable cost of returning them</strong> (or collect them) and will refund, repair or replace as the law requires.</li>
        <li>Please tell us about damage in transit, or about the wrong item, within 48 hours of delivery and include photographs, so we can claim from the courier. This request does not affect your statutory rights.</li>
      </ul>
      <p>
        See <Link href="/returns" className={link}>Returns &amp; Refunds</Link> for how to report a fault.
      </p>

      <H2 id="custom-orders">9. Custom and personalised orders</H2>
      <p>
        Goods that are printed, made or personalised to your specification (for example custom-designed
        Cali Packs) cannot be cancelled for change of mind once production has started, because they are
        made to your requirements. Your statutory rights for faulty or not-as-described goods are
        unaffected. Please check artwork carefully before you approve it: we produce what you approve.
      </p>

      <H2 id="liability">10. Our liability</H2>
      <p>
        We are responsible for foreseeable loss and damage caused by our breach of these terms or our
        negligence. We are not responsible for loss that was not foreseeable, for business losses, or for
        delays caused by events outside our reasonable control (such as courier disruption, severe weather
        or industrial action). Nothing in these terms limits or excludes our liability for death or
        personal injury caused by our negligence, for fraud or fraudulent misrepresentation, or for
        anything else that cannot lawfully be limited, including your statutory rights as a consumer.
      </p>
      <p>
        Our products are intended for lawful use by adults only. You are responsible for using them safely
        and in line with the law and any instructions supplied.
      </p>

      <H2 id="privacy">11. Privacy</H2>
      <p>
        We use your personal data to take and deliver your order and to run our business, as explained in
        our <Link href="/privacy" className={link}>Privacy Policy</Link>.
      </p>

      <H2 id="changes">12. Changes to these terms</H2>
      <p>
        We may update these terms from time to time. The version in force when you place your order is the
        one that applies to that order. The effective date is shown at the top of this page.
      </p>

      <H2 id="law">13. Governing law and disputes</H2>
      <p>
        These terms and any contract between us are governed by the law of England and Wales, and the
        courts of England and Wales have non-exclusive jurisdiction. If you live in Scotland or Northern
        Ireland you may also bring proceedings in your local courts. If you have a complaint, please contact
        us first so we can try to put things right.
      </p>

      <H2 id="contact">14. Contact us</H2>
      <p>
        {LOCAL_BUSINESS.legalName}, registered in England &amp; Wales, company number{" "}
        {LOCAL_BUSINESS.companyNumber}.
        <br />
        {contactInfo.address}
        <br />
        Email: {mail}
        <br />
        Phone / WhatsApp:{" "}
        <a href={contactInfo.phoneHref} className={link}>{contactInfo.phone}</a>
      </p>
    </LegalBody>
  );
}
