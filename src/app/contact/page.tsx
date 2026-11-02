"use client";

import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { contactInfo, socialLinks } from "@/data/social";
import { PageHero } from "@/components/layout/PageHero";

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
      <path fill="#fff" d="M15.4 7.2a3.4 3.4 0 01-1.9-1.7h-1.5v8.2a1.8 1.8 0 11-1.3-1.7v-1.6a3.4 3.4 0 103.2 3.3V9.4a5 5 0 001.5.3V8.2a3.3 3.3 0 01-1.5-.3v-.7z" />
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

const socialCards = [
  { ...socialLinks.facebook, icon: FacebookIcon },
  { ...socialLinks.whatsapp, icon: WhatsAppIcon },
  { ...socialLinks.tiktok, icon: TikTokIcon },
  { ...socialLinks.youtube, icon: YouTubeIcon },
];

export default function ContactPage() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const phone = String(form.get("phone") || "");
    const subject = String(form.get("subject") || "Smoke Cali enquiry");
    const message = String(form.get("message") || "");
    const body = [`Name: ${name}`, `Email: ${email}`, phone ? `Phone: ${phone}` : "", "", message]
      .filter(Boolean)
      .join("\n");
    window.location.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <>
      <PageHero
        eyebrow="We are here to help"
        title="Contact"
        accent="Smoke Cali"
        description="Questions about stock, wholesale, delivery or an order? Call, message or visit our Manchester shop."
        images={[
          "/cali-smoke-storefront.webp",
          "/products/pack-045.webp",
          "/products/pack-088.webp",
        ]}
      />
      <div className="py-10 md:py-14">
        <div className="container-site">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-ink tracking-tight mb-3">
            How can we help?
          </h2>
          <p className="text-graphite/65 font-medium text-sm md:text-base">
            Stock, wholesale or order questions? Call or message — Mon–Fri.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12 items-stretch">
          <aside className="relative overflow-hidden rounded-[1.75rem] bg-ink p-5 shadow-[0_22px_60px_rgba(5,31,32,0.2)] sm:p-7">
            <div className="relative mb-6">
              <span className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.26em] text-gold">
                <span className="h-px w-8 bg-gold" />
                Contact information
              </span>
              <h2 className="mt-4 font-serif text-4xl font-normal text-white sm:text-5xl">
                Let&apos;s talk
              </h2>
              <p className="mt-2 max-w-md text-sm font-medium leading-relaxed text-white/65">
                Call, email or visit us during opening hours. Our Manchester
                team is ready to help with products, stock and orders.
              </p>
            </div>

            <div className="relative space-y-3">
            {[
              {
                icon: Phone,
                label: "Phone",
                value: contactInfo.phone,
                href: contactInfo.phoneHref,
              },
              {
                icon: Mail,
                label: "Email",
                value: contactInfo.email,
                href: `mailto:${contactInfo.email}`,
              },
              {
                icon: MapPin,
                label: "Address",
                value: contactInfo.address,
                href: contactInfo.mapLink,
              },
              { icon: Clock, label: "Hours", value: "Mon–Fri, 9am–5pm GMT", href: undefined },
            ].map((item) => (
              <div
                key={item.label}
                className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-graphite p-4 transition hover:-translate-y-0.5 hover:border-gold/40"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-ink text-gold ring-1 ring-gold/30">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="mt-1 block break-words text-sm font-extrabold leading-relaxed text-white transition hover:text-gold sm:text-base"
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm font-extrabold leading-relaxed text-white sm:text-base">
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            ))}

            <div className="relative mt-5 flex items-center gap-2.5 border-t border-white/15 pt-5">
              <span className="mr-1 text-xs font-black uppercase tracking-wider text-white/60">
                Follow
              </span>
              {socialCards.map((card) => (
                <a
                  key={card.label}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={card.label}
                  title={card.handle}
                  className="h-9 w-9 overflow-hidden rounded-full ring-1 ring-white/15 transition hover:scale-110 hover:ring-gold"
                >
                  <card.icon className="h-9 w-9" />
                </a>
              ))}
            </div>
            </div>
          </aside>

          <form
            className="relative bg-white rounded-2xl border border-brand-200 p-5 md:p-7 space-y-3.5 overflow-hidden shadow-[0_18px_50px_rgba(5,31,32,0.06)]"
            onSubmit={handleSubmit}
          >
            <h2 className="font-serif text-2xl font-normal relative text-ink">Send a message</h2>
            <div className="grid sm:grid-cols-2 gap-3 relative">
              <div>
                <label htmlFor="name" className="block text-xs font-bold mb-1 text-surface-800/70">
                  Name
                </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs font-bold mb-1 text-surface-800/70">
                  Email
                </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none text-sm"
                />
              </div>
            </div>
            <div className="relative">
              <label htmlFor="phone" className="block text-xs font-bold mb-1 text-surface-800/70">
                Phone
              </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder={contactInfo.phone}
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none text-sm"
              />
            </div>
            <div className="relative">
              <label htmlFor="subject" className="block text-xs font-bold mb-1 text-surface-800/70">
                Subject
              </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none text-sm"
              />
            </div>
            <div className="relative">
              <label htmlFor="message" className="block text-xs font-bold mb-1 text-surface-800/70">
                Message
              </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none text-sm resize-none"
              />
            </div>
            <button
              type="submit"
              className="relative w-full py-3 bg-ink text-white font-semibold rounded-xl hover:bg-gold hover:text-ink transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
        </div>
      </div>
    </>
  );
}
