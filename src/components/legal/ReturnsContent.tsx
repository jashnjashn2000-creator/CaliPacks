import Link from "next/link";
import { LOCAL_BUSINESS } from "@/lib/local-business";
import { contactInfo } from "@/data/social";
import { Contents, H2, LEGAL_EFFECTIVE_DATE, LegalBody } from "@/components/legal/LegalBits";

const sections = [
  ["cancel", "1. Changed your mind? Cancel within 14 days"],
  ["before-dispatch", "2. Cancel before we dispatch"],
  ["faulty", "3. Faulty, damaged or incorrect goods"],
  ["how", "4. How to return something"],
  ["refunds", "5. Refunds"],
  ["exceptions", "6. Items that cannot be returned for a change of mind"],
  ["in-store", "7. Shop purchases"],
] as const;

const link = "font-semibold text-brand-700 hover:underline";

export function ReturnsContent() {
  const mail = (
    <a href={`mailto:${contactInfo.email}`} className={link}>
      {contactInfo.email}
    </a>
  );
  const whatsapp = (
    <a href={contactInfo.phoneHref} className={link}>
      {contactInfo.phone}
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
        For orders placed at a distance (on this website, by email or by WhatsApp) you can cancel within{" "}
        <strong>14 days</strong> without giving a reason, under the Consumer Contracts (Information,
        Cancellation and Additional Charges) Regulations 2013. The 14 days start on{" "}
        <strong>the day after</strong> you, or someone you nominate, receive the goods. If the order
        arrives in more than one delivery, they start the day after the last part arrives.
      </p>
      <p>
        Please return the goods unused, in the original packaging where you can. You may handle them as
        you would to look at them in a shop. If they have lost value because they were handled more than
        that, we may reduce the refund.
      </p>
      <ul>
        <li>Tell us within the 14 days by email on {mail} or WhatsApp on {whatsapp}, quoting your order number. A clear written cancellation is enough. You do not have to wait for our reply for the cancellation to count.</li>
        <li>Send the goods back within 14 days of telling us.</li>
        <li>
          <strong>You pay the return postage</strong> if you change your mind after delivery. Please use a
          tracked service. You are responsible for the goods until they reach us.
        </li>
        <li>
          <strong>We pay the return postage</strong> (or arrange collection) if the goods are faulty,
          damaged or not what you ordered.
        </li>
      </ul>

      <H2 id="before-dispatch">2. Cancel before we dispatch</H2>
      <p>
        If you cancel before we have dispatched the order, we refund you in full, including the postage
        you paid, and we do not send the parcel. Email {mail} or WhatsApp {whatsapp} as soon as you can,
        and quote your order number.
      </p>

      <H2 id="faulty">3. Faulty, damaged or incorrect goods</H2>
      <p>
        Goods must be of satisfactory quality, fit for purpose and as described. If they are faulty,
        damaged or not as described, the Consumer Rights Act 2015 applies, including where a change-of-mind
        return is not available.
      </p>
      <ul>
        <li>For the first 30 days after delivery you can reject faulty goods for a full refund.</li>
        <li>
          After 30 days you can ask for a repair or a replacement. If that is not possible, is not done
          within a reasonable time, or does not put the problem right, you can ask for a refund or a
          price reduction.
        </li>
        <li><strong>We pay the return postage</strong> (or arrange collection) for faulty, damaged or incorrect goods.</li>
        <li>
          Please tell us about damage in transit, or about the wrong item, within 48 hours of delivery and
          send photographs. That helps us claim from the courier. This is a request only and does not
          affect your statutory rights.
        </li>
      </ul>

      <H2 id="how">4. How to return something</H2>
      <ol>
        <li>
          Email {mail} or WhatsApp {whatsapp} with your name, order number and what you are returning. We
          will give you the return address. A clear written cancellation is enough to cancel the contract.
        </li>
        <li>Pack the goods securely, in the original packaging where you can, and keep your proof of postage. A tracked service is the safer choice.</li>
      </ol>

      <H2 id="refunds">5. Refunds</H2>
      <ul>
        <li>We refund you <strong>within 14 days</strong> of receiving the goods back, or of you providing proof of postage, if that is earlier.</li>
        <li>If you cancel for a change of mind after delivery, we refund the price of the goods and the standard delivery charge you paid. You pay the cost of sending the goods back.</li>
        <li>If you cancel before dispatch, the refund includes the postage you paid, and the parcel is not sent.</li>
        <li>Refunds go back to the payment method you used. Card payments are processed by Viva.com, so the money can take a few more days to show on your account.</li>
        <li>We may reduce a change-of-mind refund if the goods have lost value from handling beyond what was needed to inspect them, as you would in a shop.</li>
      </ul>

      <H2 id="exceptions">6. Items that cannot be returned for a change of mind</H2>
      <p>The 14-day change-of-mind right does not apply to:</p>
      <ul>
        <li>
          sealed hygiene or personal items once you have unsealed them after delivery — for example used
          bongs, pipes, mouthpieces, opened papers or filters, and similar goods; and
        </li>
        <li>goods made to your specification or clearly personalised, including custom orders once production has started.</li>
      </ul>
      <p>
        These limits never take away your rights if goods are faulty, damaged or not as described. The
        model cancellation form, and the full cancellation wording, are in section 7 of our{" "}
        <Link href="/terms#cancellation" className={link}>Terms &amp; Conditions</Link>.
      </p>

      <H2 id="in-store">7. Shop purchases</H2>
      <p>
        The 14-day cancellation right applies to distance orders. It does not cover goods you buy in
        person in the shop. If something you bought in the shop is faulty, damaged or not as described,
        the Consumer Rights Act 2015 still applies. Speak to us in store, or email {mail}.
      </p>
    </LegalBody>
  );
}
