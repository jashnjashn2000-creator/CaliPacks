import { socialLinks } from "@/data/social";

/** Shown among the Cali Packs so customers can ask about designs that are not listed. */
export function MoreDesignsNotice() {
  return (
    <aside className="rounded-2xl border border-brand-200 bg-white px-4 py-4 shadow-[0_8px_24px_rgba(5,31,32,0.05)] sm:px-5">
      <p className="font-serif text-xl font-normal tracking-tight text-ink">Can&apos;t see your design?</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-medium text-ink/80">
        <li>We have lots more designs in our shop</li>
        <li>WhatsApp us on {socialLinks.whatsapp.handle}</li>
        <li>If we have it in stock, we&apos;ll get it for you</li>
      </ul>
      <a
        href={socialLinks.whatsapp.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-graphite"
      >
        WhatsApp us
      </a>
    </aside>
  );
}
