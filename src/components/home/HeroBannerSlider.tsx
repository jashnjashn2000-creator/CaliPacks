import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, Layers, MapPin, Tag, Truck } from "lucide-react";
import { Product } from "@/types";
import { RotatingPackTiles } from "@/components/home/RotatingPackTiles";

interface HeroBannerSliderProps {
  products: Product[];
}

const HIGHLIGHTS = [
  { icon: Tag, label: "£0.22 each" },
  { icon: Layers, label: "Min 25 pcs" },
  { icon: Truck, label: "Evri tracked delivery" },
  { icon: Clock, label: "2–3 days after dispatch" },
];

export function HeroBannerSlider({ products }: HeroBannerSliderProps) {
  return (
    <section className="relative w-full py-4 sm:py-6" aria-label="Smoke Cali featured packs">
      <div className="container-site">
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1.65fr_1fr]">
          <div className="relative isolate flex min-h-[520px] overflow-hidden rounded-[1.75rem] bg-ink text-white shadow-[0_30px_70px_rgba(5,31,32,0.28)] lg:min-h-[580px]">
            <picture className="absolute inset-0 -z-20">
              <source
                media="(max-width: 1023px)"
                srcSet="/brand-showcase-mobile.webp"
                type="image/webp"
              />
              {/* Static export has no image optimizer, so the mobile source is a real 800px file. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand-showcase.webp"
                alt="Smoke Cali studio product photography"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover object-[70%_center] saturate-[.78] brightness-[0.92] contrast-[1.05]"
              />
            </picture>
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/80 to-ink/25 lg:bg-gradient-to-r lg:from-ink lg:via-ink/85 lg:to-ink/20" />
            <div className="absolute -left-20 -top-20 -z-10 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />

            <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-ink/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-cream backdrop-blur-md sm:right-6 sm:top-6">
              111 designs in stock
            </span>

            <div className="mt-auto flex w-full flex-col px-6 pb-8 pt-24 sm:px-10 sm:pb-10 lg:my-auto lg:max-w-[34rem] lg:px-12 lg:py-14">
              <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-cream/90 sm:text-xs">
                <span className="h-2 w-2 rounded-full bg-gold" />
                Smoke Cali · Manchester
              </p>
              <h1 className="font-serif text-[2.6rem] font-normal leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.1rem]">
                111 Cali Packs.
                <span className="block text-gold">
                  Studio HD.
                </span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
                £0.22 each · minimum 25 pcs · 50+ for £0.20 each. Smell-proof 3.5g designs photographed for the web.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/shop/cali-packs"
                  className="group inline-flex items-center gap-3 rounded-full bg-gold py-1.5 pl-6 pr-1.5 text-sm font-bold text-ink shadow-[0_12px_30px_rgba(142,182,155,0.35)] transition hover:bg-brand-400 sm:text-base"
                >
                  Shop Cali Packs
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-ink transition group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
                <Link
                  href="/custom-orders"
                  className="inline-flex items-center rounded-full border border-white/40 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/10 sm:text-base"
                >
                  Get a Quote
                </Link>
              </div>

              <ul className="mt-9 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-white/15 pt-6 sm:flex sm:flex-wrap">
                {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-2 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 sm:text-xs"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-teal" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-1 lg:grid-rows-[1.1fr_1fr]">
            <Link
              href="/contact"
              className="group relative isolate flex min-h-[220px] overflow-hidden rounded-[1.75rem] bg-ink text-white shadow-[0_20px_50px_rgba(5,31,32,0.2)]"
            >
              <Image
                src="/cali-shop-hero.webp"
                alt="Smoke Cali shop front in Manchester at night"
                fill
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 460px"
                quality={75}
                className="-z-20 object-cover object-[60%_center] transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
              <div className="mt-auto flex w-full items-end justify-between gap-3 p-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal">Visit the shop</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold sm:text-base">
                    <MapPin className="h-4 w-4 text-gold" />
                    5 Sagar Street · M8 8EU
                  </p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur-sm transition group-hover:bg-gold">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>

            <RotatingPackTiles products={products} />
          </div>
        </div>
      </div>
    </section>
  );
}
