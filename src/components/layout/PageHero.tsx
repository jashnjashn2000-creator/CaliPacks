import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { thumbSrc } from "@/lib/product";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  images: string[];
  ctaLabel?: string;
  ctaHref?: string;
  size?: "default" | "showcase";
}

function isProductShot(src: string) {
  return src.includes("/products/") || src.includes("/shop/");
}

/**
 * Page hero with properly framed images:
 * - Product shots: white frame + object-contain (full product visible)
 * - Showcase: zoomed so the product fills the tile
 * - Scene photos: object-cover
 */
export function PageHero({
  eyebrow,
  title,
  accent,
  description,
  images,
  ctaLabel,
  ctaHref,
  size = "default",
}: PageHeroProps) {
  const showcase = images.filter(Boolean).slice(0, 3);
  const large = size === "showcase";

  return (
    <section className="py-4 sm:py-7">
      <div className="container-site">
        <div
          className={cn(
            "grid overflow-hidden rounded-[1.75rem] bg-ink shadow-[0_22px_60px_rgba(5,31,32,0.18)]",
            large
              ? "lg:min-h-[520px] lg:grid-cols-[0.72fr_1.28fr]"
              : "lg:min-h-[340px] lg:grid-cols-[0.95fr_1.05fr]"
          )}
        >
          <div className="flex flex-col justify-center px-6 py-9 sm:px-9 lg:px-12">
            <div className="mb-5 flex w-fit items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.26em] text-gold sm:text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              {eyebrow}
            </div>
            <h1 className="font-serif text-4xl font-normal leading-tight text-white sm:text-5xl lg:text-[3.4rem]">
              {title} <span className="heading-accent">{accent}</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm font-medium leading-relaxed text-white/70 sm:text-base">
              {description}
            </p>
            {ctaLabel && ctaHref && (
              <Link
                href={ctaHref}
                className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:bg-brand-400"
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          <div
            className={cn(
              "grid grid-cols-2 grid-rows-2 gap-2 bg-cream p-2.5 sm:gap-3 sm:p-3",
              large ? "h-80 sm:h-[28rem] lg:h-auto lg:min-h-[520px]" : "h-56 sm:h-72 lg:h-auto lg:min-h-[340px]"
            )}
          >
            {showcase.map((src, index) => {
              const product = isProductShot(src);
              const shot = product ? thumbSrc(src) : src;
              const isMain = index === 0;
              return (
                <div
                  key={`${src}-${index}`}
                  className={`relative overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 ${
                    isMain ? "row-span-2" : ""
                  }`}
                >
                  <Image
                    src={shot}
                    alt=""
                    fill
                    priority={isMain}
                    fetchPriority={isMain ? "high" : "auto"}
                    loading={isMain ? "eager" : "lazy"}
                    sizes={
                      isMain
                        ? large
                          ? "(max-width: 1024px) 70vw, 42vw"
                          : "(max-width: 1024px) 50vw, 28vw"
                        : large
                          ? "(max-width: 1024px) 40vw, 22vw"
                          : "(max-width: 1024px) 25vw, 16vw"
                    }
                    quality={82}
                    className={
                      product
                        ? large
                          ? isMain
                            ? "hero-zoom-lg"
                            : "hero-zoom"
                          : src.includes("/shop/") || /pack-080|pack-109|pack-110|pack-111/.test(src)
                            ? "product-fit"
                            : "pack-fill"
                        : "object-cover object-center"
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
