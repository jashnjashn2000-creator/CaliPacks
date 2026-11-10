const TRUSTPILOT_URL = "https://uk.trustpilot.com/review/smokecali.co.uk";

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
