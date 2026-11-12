import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, ShoppingBag } from "lucide-react";
import { contactInfo } from "@/data/social";
import { CALI_PACK_COUNT } from "@/data/products";

export function StorefrontShowcase() {
  return (
    <section className="relative overflow-hidden bg-ink py-14 md:py-20">
      <div className="container-site relative">
        <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-gold/30 storefront-glow">
          <Image
            src="/brand-showcase.webp"
            alt="Smoke Cali holographic Cali Packs online collection"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            quality={70}
            loading="lazy"
            className="object-cover saturate-[.78] brightness-[0.9] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/50" />

          <div className="relative z-10 flex min-h-[520px] max-w-xl flex-col justify-center p-7 sm:p-10 md:p-14">
            <div className="mb-6 flex w-fit items-center gap-3 text-xs font-bold uppercase tracking-[0.26em] text-gold">
              <ShoppingBag className="h-4 w-4" />
              Shop Smoke Cali Online
            </div>
            <h2 className="font-serif text-4xl font-normal leading-tight text-white sm:text-5xl">
              {CALI_PACK_COUNT} Cali Packs. <span className="heading-accent">One click.</span>
            </h2>
            <p className="mt-4 max-w-md text-base font-medium leading-relaxed text-white/70 sm:text-lg">
              Browse HD product photos, pick your packs, and order online —
              £0.22 each, minimum 25 pcs, or £0.20 each from 50, plus grinders, bongs, hookahs,
              and more.
            </p>

            <div className="mt-7 flex items-start gap-3 border-l border-gold/60 pl-4">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                  Visit us
                </p>
                <p className="mt-1 font-semibold text-white">{contactInfo.address}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-ink transition hover:bg-brand-400"
              >
                Shop Cali Packs
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={contactInfo.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-cream/40 px-6 py-3 font-semibold text-cream transition hover:border-gold hover:text-gold"
              >
                Get Directions
                <MapPin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
