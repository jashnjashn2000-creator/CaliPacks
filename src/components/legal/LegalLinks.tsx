import Link from "next/link";

/** Small "By paying you agree…" line with the key policies, shown beside the Pay button. */
export function CheckoutLegalLinks() {
  const cls = "font-semibold underline underline-offset-2 hover:text-brand-700";
  return (
    <p className="text-center text-xs leading-relaxed text-surface-800/55">
      By placing your order you agree to our{" "}
      <Link href="/terms" className={cls}>Terms &amp; Conditions</Link>. See also our{" "}
      <Link href="/privacy" className={cls}>Privacy Policy</Link>,{" "}
      <Link href="/shipping" className={cls}>Delivery</Link> and{" "}
      <Link href="/returns" className={cls}>Returns &amp; Refunds</Link> information, including your
      14-day right to cancel.
    </p>
  );
}
