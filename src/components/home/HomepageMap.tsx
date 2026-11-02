import { MapPin } from "lucide-react";
import { contactInfo } from "@/data/social";

export function HomepageMap() {
  return (
    <section className="py-12 md:py-16">
      <div className="container-site">
        <div className="text-center mb-8">
          <p className="mb-3 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.26em] text-brand-700">
            <MapPin className="w-3.5 h-3.5 text-gold" />
            Visit Us
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-ink tracking-tight">
            Find us in Manchester
          </h2>
          <p className="text-sm md:text-base text-graphite/65 font-medium mt-2 max-w-lg mx-auto">
            Visit Smoke Cali at 5 Sagar Street, M8 8EU — tap to open directions.
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_50px_-20px_rgba(5,31,32,0.5)]">
          <div className="bg-ink border-b border-white/10 px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-base sm:text-lg font-bold text-white">
                {contactInfo.address}
              </p>
              <a
                href={contactInfo.phoneHref}
                className="text-sm font-semibold text-gold hover:text-brand-300"
              >
                {contactInfo.phone}
              </a>
            </div>
            <a
              href={contactInfo.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold text-ink text-xs font-bold uppercase tracking-[0.14em] hover:bg-brand-400"
            >
              <MapPin className="w-3.5 h-3.5" />
              Open in Google Maps
            </a>
          </div>
          <a
            href={contactInfo.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[168px] sm:min-h-[200px] flex-col items-center justify-center gap-2 bg-gradient-to-b from-graphite to-ink px-6 py-8 text-center"
          >
            <MapPin className="h-8 w-8 text-gold" />
            <p className="text-sm font-bold text-white">5 Sagar Street · M8 8EU</p>
            <p className="text-xs font-medium text-white/55">
              Opens Google Maps — no map widgets are loaded on this page.
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}
