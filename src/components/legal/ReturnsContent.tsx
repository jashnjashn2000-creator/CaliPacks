import Link from "next/link";
import { LOCAL_BUSINESS } from "@/lib/local-business";
import { contactInfo } from "@/data/social";
import { Contents, H2, LEGAL_EFFECTIVE_DATE, LegalBody } from "@/components/legal/LegalBits";

const sections = [
  ["cancel", "1. Changed your mind? Cancel within 14 days"],
  ["faulty", "2. Faulty, damaged or incorrect goods"],
  ["how", "3. How to return something"],
  ["refunds", "4. Refunds"],
  ["exceptions", "5. Items that cannot be returned"],
] as const;

const link = "font-semibold text-brand-700 hover:underline";

export function ReturnsContent() {
  const mail = (
    <a href={`mailto:${contactInfo.email}`} className={link}>
      {contactInfo.email}
    </a>
  );
  return (
    <LegalBody>
      <p className="text-sm text-surface-800/60 !mt-0">Effective date: {LEGAL_EFFECTIVE_DATE}</p>
      <p>
        This page explains how to cancel an order or return goods to {LOCAL_BUSINESS.legalName}. It forms
        part of our <Link href="/terms" className={link}>Terms &amp; Conditions</Link> and does not affect
        your statutory rights.
      </p>

      <Contents sections={sections} />

      <H2 id="cancel">1. Changed your mind? Cancel within 14 days</H2>
      <p>
        You have the right to cancel your order within <strong>14 days of receiving it</strong>, without
        giving a reason (Consumer Contracts Regulations 2013). Goods must be <strong>unopened, unused and
        in the condition you received them</strong>.
      </p>
      <ul>
        <li>Email {mail} within the 14 days, saying you want to cancel and quoting your order number.</li>
        <li>Send the goods back within 14 days of telling us.</li>
        <li><strong>You pay the return postage</strong> for change-of-mind returns. We recommend a tracked service, as you are responsible for the goods until they reach us.</li>
      </ul>

      <H2 id="faulty">2. Faulty, damaged or incorrect goods</H2>
      <p>
        If something arrives faulty, damaged or not as described, your rights under the Consumer Rights Act
        2015 apply. Email {mail} with your order number and photographs of the problem as soon as you can.
        You can reject faulty goods for a full refund within 30 days of delivery; after that we will offer a
        repair or replacement and, where the law requires, a refund or price reduction.
      </p>
      <ul>
        <li><strong>We pay the return postage</strong> (or arrange collection) for faulty, damaged or incorrect goods.</li>
        <li>Please check your parcel when it arrives and tell us promptly about any transit damage.</li>
      </ul>

      <H2 id="how">3. How to return something</H2>
      <ol>
        <li>Email {mail} (or message us on WhatsApp on{" "}
          <a href={contactInfo.phoneHref} className={link}>{contactInfo.phone}</a>) with your name, order number and the reason for the return.</li>
        <li>We will reply with a return reference and the address to send the goods to. Please do not post anything back before you have heard from us.</li>
        <li>Pack the goods securely in their original packaging if possible, and keep your proof of postage.</li>
      </ol>

      <H2 id="refunds">4. Refunds</H2>
      <ul>
        <li>We will refund you <strong>within 14 days</strong> of receiving the goods back (or of you providing proof of postage, if earlier).</li>
        <li>For a change-of-mind cancellation we refund the price of the goods and the standard delivery charge you paid.</li>
        <li>Refunds go back to the payment method you used (card payments are processed by Viva.com), so it can take a few more days to appear in your account.</li>
        <li>We may reduce a change-of-mind refund if the goods have lost value because they were handled more than was needed to inspect them.</li>
      </ul>

      <H2 id="exceptions">5. Items that cannot be returned</H2>
      <p>The 14-day change-of-mind right does not apply to:</p>
      <ul>
        <li>sealed items which are unsuitable for return for health-protection or hygiene reasons, once you have unsealed them after delivery; and</li>
        <li>goods made to your specification or clearly personalised, including custom-printed orders once production has started.</li>
      </ul>
      <p>
        These exceptions never affect your rights if goods are faulty, damaged or not as described. Full
        cancellation details, including a model cancellation form, are in section 7 of our{" "}
        <Link href="/terms#cancellation" className={link}>Terms &amp; Conditions</Link>. Questions? Email{" "}
        {mail}.
      </p>
    </LegalBody>
  );
}
