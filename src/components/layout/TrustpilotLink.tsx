export const TRUSTPILOT_URL = "https://uk.trustpilot.com/review/smokecali.co.uk";

/** Text link only. No rating, no review count, no paid widget. */
export function TrustpilotLink({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const toneClass =
    tone === "dark"
      ? "text-white/85 hover:text-gold"
      : "text-ink hover:text-brand-700";
  return (
    <a
      href={TRUSTPILOT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-sm font-semibold ${toneClass}`}
    >
      <span aria-hidden="true" className="text-gold">
        ★
      </span>
      Review us on Trustpilot
    </a>
  );
}

/** Static Trustpilot badge for product pages, shown next to Add to basket. No third-party script. */
export function ProductTrustpilotBadge() {
  return (
    <a
      href={TRUSTPILOT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#00b67a]/35 bg-[#00b67a]/10 px-4 py-3 text-sm font-bold text-ink transition-colors hover:bg-[#00b67a]/20"
    >
      <span aria-hidden="true" className="text-base tracking-tight text-[#00b67a]">
        ★★★★★
      </span>
      Review us on Trustpilot
    </a>
  );
}
