import Link from "next/link";
import { footerLinks, footerNav } from "@/data/navigation";
import { Logo } from "@/components/layout/Logo";
import { contactInfo, socialLinks } from "@/data/social";
import { SecuredByViva } from "@/components/payments/VivaBadge";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        fill="#fff"
        d="M13.5 8.5V7.2c0-.5.3-.7.8-.7h1.2V4h-1.8c-2 0-2.7 1.2-2.7 2.9v1.6H9.5V11h1.5v7h2.5v-7h1.8l.3-2.5h-2.1z"
      />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path
        fill="#fff"
        d="M17.5 14.3c-.2-.1-1.3-.7-1.5-.7s-.4-.1-.5.1-.6.7-.7.9-.3.2-.5.1a6 6 0 01-1.8-1.1 6.6 6.6 0 01-1.2-1.5c-.1-.2 0-.4.1-.5l.4-.4.2-.4c.1-.1 0-.3 0-.4s-.5-1.3-.7-1.7-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3a2 2 0 00-.6 1.5 3.5 3.5 0 00.7 1.8 8 8 0 003.1 2.8c1.1.5 1.5.5 2 .5a2.3 2.3 0 001.4-.6 1.9 1.9 0 00.4-1.3c0-.1-.1-.2-.3-.3zM12 4.2a7.8 7.8 0 00-6.6 11.9L4.5 19.5l3.5-.9A7.8 7.8 0 1012 4.2zm0 14.2a6.4 6.4 0 01-3.3-.9l-.2-.1-2.1.5.5-2-.1-.2a6.4 6.4 0 115.2 2.7z"
      />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#010101" />
      <path
        fill="#25F4EE"
        d="M15.4 7.2a3.4 3.4 0 01-1.9-1.7h-1.5v8.2a1.8 1.8 0 11-1.3-1.7v-1.6a3.4 3.4 0 103.2 3.3V9.4a5 5 0 001.5.3V8.2a3.3 3.3 0 01-1.5-.3v-.7z"
      />
      <path
        fill="#FE2C55"
        d="M16.9 8.2v1.5a5 5 0 01-1.5-.3 3.4 3.4 0 01-1.9-1.7h1.5a3.3 3.3 0 001.9 1.5z"
      />
      <path
        fill="#fff"
        d="M14 7.2a3.4 3.4 0 01-1.9-1.7h-.2v8.3a1.8 1.8 0 11-1.3-1.7V10a3.4 3.4 0 103.4 3.4V7.2H14z"
      />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#FF0000" />
      <path fill="#fff" d="M10 8.8l5.2 3.2L10 15.2V8.8z" />
    </svg>
  );
}

const socialItems = [
  { ...socialLinks.facebook, icon: FacebookIcon },
  { ...socialLinks.whatsapp, icon: WhatsAppIcon },
  { ...socialLinks.tiktok, icon: TikTokIcon },
  { ...socialLinks.youtube, icon: YouTubeIcon },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white border-t border-gold/30">
      <div className="container-site py-14 relative z-10">
        <nav className="mb-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-b border-white/10 pb-8 sm:gap-x-9">
          {footerNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:text-gold sm:text-[13px]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <Link href="/" className="inline-block mb-5">
              <Logo size="md" variant="light" />
            </Link>
            <p className="mb-6 text-sm font-medium leading-relaxed text-white/60">
            Smoke Cali — Manchester&apos;s destination for wholesale Cali Packs.
            £0.22 each · min 25 pcs · 50+ for £0.20. Shop online or visit us in store.
            </p>
            <div className="flex gap-2.5">
              {socialItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-white/15 hover:ring-gold hover:scale-110 transition"
                >
                  <item.icon className="w-9 h-9" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-gold">
              Shop
            </h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-white/60 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-gold">
              Company
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-white/60 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-gold">
              Contact
            </h3>
            <a
              href={contactInfo.phoneHref}
              className="block text-sm font-semibold text-white hover:text-gold"
            >
              {contactInfo.phone}
            </a>
            <p className="mt-1 text-sm text-white/55">{contactInfo.email}</p>
            <p className="mt-3 text-sm font-medium leading-relaxed text-white/55">
              {contactInfo.address}
            </p>
          </div>
        </div>

        <nav
          aria-label="Legal"
          className="mb-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/10 pt-6 sm:justify-start"
        >
          {footerLinks.legal.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60 transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold/90">
              18+ only
            </p>
            <p className="mt-1.5 max-w-md text-xs font-medium leading-relaxed text-white/45">
              &copy; {new Date().getFullYear()} SMOKE CALI LTD (company no. 16543027). All rights reserved.
              Smoking accessories and related products are for adults aged 18 and over.
              By using this site you confirm you are of legal age.
            </p>
          </div>
          <SecuredByViva tone="dark" className="justify-center sm:justify-end" />
        </div>
      </div>
    </footer>
  );
}
